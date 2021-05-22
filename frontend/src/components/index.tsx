import * as React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Core from './core';
import Login from './login';

function App(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const authenticate = (): void => setIsAuthenticated(!isAuthenticated);

  return (
    <Router>
      <Switch>
        {isAuthenticated ? (
          <Route exact to="/" component={Core} />
        ) : (
          <Route exact to="/login" render={(): JSX.Element => <Login handler={authenticate} />} />
        )}
        <Redirect from="*" to={`${isAuthenticated ? '/' : '/login'}`} />
      </Switch>
    </Router>
  );
}

export default App;
