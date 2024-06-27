const express = require('express');
const db = require('./db/db');
const app = express();

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

// Endpoint para retornar um projeto específico
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
  const { name, role, vacationDays } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO team_members (name, role, vacation_days) VALUES ($1, $2, $3) RETURNING id',
      [name, role, vacationDays]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
