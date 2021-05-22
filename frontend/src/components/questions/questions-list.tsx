/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';

import { API } from '../../utils/API';
import event from '../../utils/eventEmitter';
import * as DTO from '../../types';
import QuestionItem from './question-item-long';

interface State {
  questions: DTO.Question[];
  favorite_questions: string[];
  search: string;
}

interface Props {
}

export default class QuestionsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      questions: [],
      favorite_questions: [],
      search: '',
    } as State;
  }

  componentDidMount(): void {
    event.subscribe('POST_QUESTION', () => this.fetch());
    event.subscribe('SEARCH', (search?: string) => this.fetch(search));
    this.fetch();
  }

  componentWillUnmount(): void {
    event.unsubscribe('POST_QUESTION');
    event.unsubscribe('SEARCH');
  }

  async getSearch(): Promise<void> {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const search = params.get('search') || '';
    this.setState({ search });
  }

  async fetch(search_string?: string): Promise<void> {
    if (search_string !== undefined) {
      await this.setState({ search: search_string });
    } else {
      await this.getSearch();
    }
    const { search } = this.state;

    const params = search ? { search } : {};
    await API.get('/questions', { params }).then((res: any) => {
      this.setState({ questions: res.data.questions });
    });
    await API.get('/user').then((res: any) => {
      this.setState({ favorite_questions: res.data.user.favorite_questions });
    });
  }

  render(): JSX.Element {
    const {
      questions, favorite_questions, search,
    } = this.state;

    return (
      <div className="col col-md-8 mx-auto">
        {/* <div>
          <form>
            <div className="form-group">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={search}
                  onChange={(e): void => this.setState({ search: e.target.value })}
                  onKeyDown={this.handleSubmit}
                />
              </div>
            </div>
          </form>
        </div> */}
        <div>
          {questions ? (
            <div>
              {search ? (<h5><span className="badge badge-info">Search: {search}</span></h5>) : null }
              <span className="text text-muted">Results: {questions.length}</span>
              { questions.map((question) => (
                <QuestionItem favorite_questions_id={favorite_questions} question={question} show_question={false} key={question.id} />
              )) }
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
