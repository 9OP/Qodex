/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';

import { API } from '../../utils/API';
import event from '../../utils/eventEmitter';
import * as DTO from '../../types';
import QodexItem from './qodex-item';

interface State{
  qodexes: DTO.Qodex[];
}

interface Props{}

export default class QodexList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {} as State;
  }

  componentDidMount(): void {
    event.subscribe('POST_QODEX', () => this.fetch());
    event.subscribe('POST_QUESTION', () => this.fetch());
    this.fetch();
  }

  componentWillUnmount(): void {
    event.unsubscribe('POST_QODEX');
  }

  async fetch(): Promise<void> {
    await API.get('/qodexes').then((res: any) => {
      this.setState({ qodexes: res.data.qodexes });
    });
  }

  render(): JSX.Element {
    const { qodexes } = this.state;

    return (
      <div>
        { qodexes ? (
          <div className="col col-md-8 mx-auto">
            { qodexes.map((qodex: DTO.Qodex) => (
              <QodexItem key={qodex.id} qodex={qodex} />
            )) }
          </div>
        ) : null}
      </div>
    );
  }
}
