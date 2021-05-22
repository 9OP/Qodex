import * as React from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Navbar from './navbar';
import Questions from './questions';
import Favorites from './favorites';
import Qodexes from './qodexes';
import Home from './home';
import Footer from './footer';

export default function Core(): JSX.Element {
  return (
    <div>
      <Navbar />
      <main role="main" className="pt-5 mt-5">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/questions" component={Questions} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/qodexes" component={Qodexes} />
          <Redirect from="*" to="/" />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}
