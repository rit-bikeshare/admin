import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact={true} path="/" component={() => 'Home'} />
      <Route path="/login" component={() => 'Login'} />
      <Route path="/bikes" component={() => 'Bikes'} />
      <Route path="/bike-racks" component={() => 'Bike Racks'} />
      <Route path="/users" component={() => 'Users'} />
      <Route path="/maintenance" component={() => 'Maintenance'} />
      <Route path="/settings" component={() => 'Settings'} />

      <Route component={() => 'No matching route'} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
