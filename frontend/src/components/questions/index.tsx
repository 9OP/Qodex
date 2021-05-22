import * as React from 'react';
import {
  Switch, Route, Redirect,
} from 'react-router-dom';

import QuestionsList from './questions-list';
import QuestionThread from './question-thread';

export default function Main(): React.ReactElement {
  return (
    <Switch>
      <Route exact path="/questions">
        <QuestionsList />
      </Route>
      <Route path="/questions/:id">
        <QuestionThread />
      </Route>
      <Redirect from="*" to="/" />
    </Switch>
  );
}
