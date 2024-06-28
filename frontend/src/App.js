import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ProjectTable from './components/Projects/ProjectTable';
import AddProject from './components/Projects/AddProject';
import EditProject from './components/Projects/EditProject';
import TeamTable from './components/TeamMembers/TeamTable';
import AddTeamMember from './components/TeamMembers/AddTeamMember';
import EditTeamMember from './components/TeamMembers/EditTeamMember';

const AddProjectButton = () => {
  return (
    <Link to="/add-project">
      <button>Add Project</button>
    </Link>
  );
};

const AddMemberButton = () => {
  return (
    <Link to="/add-team-member">
      <button>Add New Member</button>
    </Link>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <ProjectTable />
            <AddProjectButton />
            <TeamTable />
            <AddMemberButton />
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
