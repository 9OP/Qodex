/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { API } from '../../../utils/API';
import event from '../../../utils/eventEmitter';
import * as DTO from '../../../types';

interface State {
    qodexes: DTO.Qodex[];
    qodex_id: string;
}

interface Props{
    handler: (qodex_id: string) => void;
}

export default class QodexDropDown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {} as State;
  }

  async componentDidMount(): Promise<void> {
    event.subscribe('POST_QODEX', () => this.fetch());
    this.fetch();
  }

  handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    e.preventDefault();
    const { handler } = this.props;
    const qodex_id = e.target.value;
    this.setState({ qodex_id });
    handler(qodex_id);
  };

  async fetch(): Promise<void> {
    await API.get('/qodexes').then((res: any) => {
      this.setState({ qodexes: res.data.qodexes });
    });
  }

  render(): JSX.Element {
    const { qodex_id } = this.state;
    const { qodexes } = this.state;

    return (

      <div className="input-group input-group-sm">
        {qodexes
          ? (
            <select className="custom-select" id="qodex-selector" name="qodex" value={qodex_id} onChange={this.handleChange}>
              <option> ... </option>
              {qodexes.map((qodex: DTO.Qodex) => (
                <option value={qodex.id} key={qodex.id}>
                  {' '}
                  {qodex.name}
                  {' '}
                </option>
              ))}
            </select>
          )
          : null}

      </div>
    );
  }
}
