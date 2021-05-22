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
import QuestionItem from '../questions/question-item-short';

interface State {
  followed_questions: DTO.Question[];
  my_questions: DTO.Question[];
}

interface Props {
}

export default class QuestionsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      followed_questions: [],
      my_questions: [],
    } as State;
  }

  componentDidMount(): void {
    event.subscribe('POST_QUESTION', () => this.fetch());
    this.fetch();
  }

  componentWillUnmount(): void {
    event.unsubscribe('POST_QUESTION');
  }

  async fetch(): Promise<void> {
    await API.get('/user/favorites').then((res: { data: { questions: DTO.Question[] } }) => this.setState({ followed_questions: res.data.questions }));
    await API.get('/user/questions').then((res: { data: { questions: DTO.Question[] } }) => this.setState({ my_questions: res.data.questions }));
  }

  render(): JSX.Element {
    const { followed_questions, my_questions } = this.state;

    return (
      <div>
        <div className="col col-md-8 mx-auto">

          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-header bg-info text-white mb-3">
              <h3><span className="badge badge-info">Starred questions</span></h3>
            </div>
            <div className="card-body">
              { followed_questions ? (
                <div>
                  { followed_questions.map((question: DTO.Question) => (
                    <div key={question.id}>
                      <QuestionItem question={question} />
                    </div>
                  )) }
                </div>
              ) : null}
            </div>
          </div>

          <div className="card" style={{ marginTop: '1rem' }}>
            <div className="card-header bg-info text-white mb-3">
              <h3><span className="badge badge-info">My questions</span></h3>
            </div>
            <div className="card-body">
              { my_questions ? (
                <div>
                  { my_questions.map((question: DTO.Question) => (
                    <div key={question.id}>
                      <QuestionItem question={question} />
                    </div>
                  )) }
                </div>
              ) : null}
            </div>
          </div>

        </div>
      </div>
    );
  }
}
