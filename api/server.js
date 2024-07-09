const express = require('express');
const cors = require('cors');
const db = require('./db/db');

const app = express();

// Middleware para permitir CORS
app.use(cors());

// Middleware para tratar corpos de requisição em JSON
app.use(express.json());

app.get('/projects', async (req, res) => {
  try {
    const projects = await db.query(`
      SELECT 
        p.*, 
        json_agg(json_build_object('id', tm.id, 'name', tm.name, 'role', tm.role, 'vacation_days', tm.vacation_days, 'allocations', a.allocated_hours)) AS allocated_members
      FROM 
        projects p
        LEFT JOIN allocations a ON p.id = a.project_id
        LEFT JOIN team_members tm ON a.member_id = tm.id
      GROUP BY p.id;
    `);
    res.json(projects.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/projects/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    const projectResult = await db.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const allocationsResult = await db.query(`
      SELECT 
        tm.id, tm.name, tm.role, tm.vacation_days, a.allocated_hours 
      FROM 
        allocations a
        JOIN team_members tm ON a.member_id = tm.id
      WHERE 
        a.project_id = $1
    `, [projectId]);

    const project = projectResult.rows[0];
    project.allocated_members = allocationsResult.rows;

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/projects', async (req, res) => {
  const { name, start_date, end_date, original_estimate, remaining_work, allocated_members } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO projects (name, start_date, end_date, original_estimate, remaining_work) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, start_date, end_date, original_estimate, remaining_work]
    );

    if (allocated_members && allocated_members.length > 0) {
      for (const member of allocated_members) {
        if (member.allocations && member.allocations.length > 0) {
          for (const allocation of member.allocations) {
            await db.query(
              'INSERT INTO allocations (project_id, member_id, allocated_hours) VALUES ($1, $2, $3)',
              [result.rows[0].id, member.member_id, allocation.allocated_hours]
            );
          }
        }
      }
    }

    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project. Please try again later.' });
  }
});

// Endpoint para atualizar projeto
app.put('/projects/:id', async (req, res) => {
  const { name, start_date, end_date, original_estimate, remaining_work, allocated_members } = req.body;
  const projectId = req.params.id;

  try {
    // Atualizar projeto
    await db.query(
      'UPDATE projects SET name = $1, start_date = $2, end_date = $3, original_estimate = $4, remaining_work = $5 WHERE id = $6',
      [name, start_date, end_date, original_estimate, remaining_work, projectId]
    );

    // Limpar alocações existentes
    await db.query('DELETE FROM allocations WHERE project_id = $1', [projectId]);

    // Adicionar novas alocações se houver membros alocados
    if (allocated_members && allocated_members.length > 0) {
      for (const member of allocated_members) {
        await db.query(
          'INSERT INTO allocations (project_id, member_id, allocated_hours) VALUES ($1, $2, $3)',
          [projectId, member.member_id, member.allocated_hours]
        );
      }
    }

    res.status(200).json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error(err);
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

// Endpoint para buscar alocações por projeto
app.get('/projects/:projectId/allocations', async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const allocations = await db.query(`
      SELECT 
        tm.id, tm.name, tm.role, tm.vacation_days, a.allocated_hours 
      FROM 
        allocations a
        JOIN team_members tm ON a.member_id = tm.id
      WHERE 
        a.project_id = $1
    `, [projectId]);

    res.json(allocations.rows);
  } catch (err) {
    console.error('Error fetching allocations:', err);
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
    // Converta os dias de férias para um formato que possa ser armazenado no banco de dados
    const vacationDaysFormatted = vacation_days.map(day => new Date(day));

    const result = await pool.query(
      'INSERT INTO team_members (name, role, vacation_days) VALUES ($1, $2, $3) RETURNING id',
      [name, role, vacationDaysFormatted]
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
