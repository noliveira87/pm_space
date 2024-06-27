import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProjectTable from './components/ProjectTable';
import AddTeamMember from './components/AddTeamMember';

const App = () => (
  <div>
    <Switch>
      <Route exact path="/" component={ProjectTable} />
      <Route path="/add-team-member" component={AddTeamMember} />
    </Switch>
  </div>
);

export default App;
