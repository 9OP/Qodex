/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import CreateQodex from './create-qodex';
import QodexesList from './qodex-list';
import Qodex from './qodex';

export default function Main(): React.ReactElement {
  return (
    <Switch>
      <Route exact path="/qodexes">
        <CreateQodex />
        <QodexesList />
      </Route>
      <Route path="/qodexes/:id">
        <Qodex />
      </Route>
      <Redirect from="*" to="/" />
    </Switch>
  );
}
