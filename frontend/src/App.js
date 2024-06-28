import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ProjectTable from './components/Projects/ProjectTable';
import AddProject from './components/Projects/AddProject';
import EditProject from './components/Projects/EditProject';
import TeamTable from './components/TeamMembers/TeamTable';
import AddTeamMember from './components/TeamMembers/AddTeamMember';
import EditTeamMember from './components/TeamMembers/EditTeamMember';
import './App.css'; // Importando o arquivo CSS para estilização

const AddProjectButton = () => {
  return (
    <Link to="/add-project">
      <button className="add-project-button">Add Project</button>
    </Link>
  );
};

const AddMemberButton = () => {
  return (
    <Link to="/add-team-member">
      <button className="add-member-button">Add New Member</button>
    </Link>
  );
};

const App = () => {
  return (
    <Router>
      <div className="container">
        <Switch>
          <Route exact path="/">
            <div className="section">
              <ProjectTable />
              <AddProjectButton />
            </div>
            <div className="section">
              <TeamTable />
              <AddMemberButton />
            </div>
          </Route>
          <Route path="/add-project" component={AddProject} />
          <Route path="/edit-project/:id" component={EditProject} />
          <Route path="/add-team-member" component={AddTeamMember} />
          <Route path="/edit-team-member/:id" component={EditTeamMember} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
