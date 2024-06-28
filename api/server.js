const express = require('express');
const cors = require('cors');
const db = require('./db/db');

const app = express();

// Middleware para permitir CORS
app.use(cors());

// Middleware para tratar corpos de requisição em JSON
app.use(express.json());

// Endpoints para projetos
app.get('/projects', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/projects/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/projects', async (req, res) => {
  const { name, startDate, endDate, originalEstimate, remainingWork, allocatedMembers } = req.body;
  
  try {
    // Verificar se há membros no banco de dados
    const memberCountResult = await db.query('SELECT COUNT(*) FROM team_members');
    const memberCount = parseInt(memberCountResult.rows[0].count, 10);

    if (memberCount === 0) {
      return res.status(400).json({ error: 'No team members found. Please add team members before creating a project.' });
    }

    // Prosseguir com a criação do projeto
    const result = await db.query(
      'INSERT INTO projects (name, start_date, end_date, original_estimate, remaining_work) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, startDate, endDate, originalEstimate, remainingWork]
    );
    const projectId = result.rows[0].id;
    
    if (allocatedMembers && allocatedMembers.length > 0) {
      for (const member of allocatedMembers) {
        await db.query(
          'INSERT INTO allocations (project_id, member_id, allocated_hours) VALUES ($1, $2, $3)',
          [projectId, member.memberId, member.allocatedHours]
        );
      }
    }
    res.status(201).json({ id: projectId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para atualizar projeto
app.put('/projects/:id', async (req, res) => {
  const projectId = req.params.id;
  const { name, start_date, end_date, original_estimate, remaining_work } = req.body;

  try {
    // Verificar se o projeto existe
    const checkProject = await db.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (checkProject.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Atualizar o projeto no banco de dados
    const result = await db.query(
      'UPDATE projects SET name = $1, start_date = $2, end_date = $3, original_estimate = $4, remaining_work = $5 WHERE id = $6 RETURNING *',
      [name, start_date, end_date, original_estimate, remaining_work, projectId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint para eliminar projetos
app.delete('/projects/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    // Verificar se há alocações para este projeto
    const allocationCheck = await db.query('SELECT COUNT(*) FROM allocations WHERE project_id = $1', [projectId]);
    const allocationCount = parseInt(allocationCheck.rows[0].count, 10);

    if (allocationCount > 0) {
      return res.status(400).json({ error: 'Cannot delete project because it has allocations.' });
    }

    // Se não houver alocações, proceder com a exclusão do projeto
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [projectId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoints para membros da equipe
app.get('/team_members', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM team_members');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/team_members/:id', async (req, res) => {
  const memberId = req.params.id;

  try {
    const result = await db.query('SELECT * FROM team_members WHERE id = $1', [memberId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/team_members', async (req, res) => {
  const { name, role, vacation_days } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO team_members (name, role, vacation_days) VALUES ($1, $2, $3) RETURNING id',
      [name, role, vacation_days]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/team_members/:id', async (req, res) => {
  const memberId = req.params.id;
  const { name, role, vacation_days } = req.body;

  try {
    // Verifica se o membro da equipe existe
    const checkMember = await db.query('SELECT * FROM team_members WHERE id = $1', [memberId]);
    if (checkMember.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Atualiza o membro da equipe
    const result = await db.query(
      'UPDATE team_members SET name = $1, role = $2, vacation_days = $3 WHERE id = $4 RETURNING *',
      [name, role, vacation_days, memberId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating team member:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/team_members/:id', async (req, res) => {
  const memberId = req.params.id;

  try {
    // Verificar se há alocações para este membro
    const allocationCheck = await db.query('SELECT COUNT(*) FROM allocations WHERE member_id = $1', [memberId]);
    const allocationCount = parseInt(allocationCheck.rows[0].count, 10);

    if (allocationCount > 0) {
      return res.status(400).json({ error: 'Cannot delete team member because they are associated with projects.' });
    }

    // Se não houver alocações, proceder com a exclusão do membro
    const result = await db.query('DELETE FROM team_members WHERE id = $1 RETURNING *', [memberId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully' });
  } catch (err) {
    console.error('Error deleting team member:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(3001, () => {
  console.log('Server running on port 3001');
});
