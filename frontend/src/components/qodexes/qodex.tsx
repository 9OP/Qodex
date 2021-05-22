/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../utils/API';
import event from '../../utils/eventEmitter';
import * as DTO from '../../types';
import QuestionItem from '../questions/question-item-long';

interface State {
  qodex: DTO.Qodex;
  questions: DTO.Question[];
  favorite_questions: string[];
}

interface Props {
  qodex_id: string;
}

class QuestionsList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      qodex: {} as DTO.Qodex,
      questions: [],
      favorite_questions: [],
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
    const { qodex_id } = this.props;
    await API.get(`/qodexes/${qodex_id}`).then((res: any) => {
      this.setState({ questions: res.data.questions });
      this.setState({ qodex: res.data.qodex });
    });
    await API.get('/user').then((res: any) => {
      this.setState({ favorite_questions: res.data.user.favorite_questions });
    });
  }

  render(): JSX.Element {
    const { questions } = this.state;
    const { qodex } = this.state;
    const { favorite_questions } = this.state;

    return (
      <div>
        { qodex ? (
          <div>
            <h2><span className="badge badge-info"> Qodex: {qodex.name} </span></h2>
            <span className="text text-muted">Questions: {qodex.questions_count}</span>
          </div>
        ) : null}
        { questions ? (
          <div>
            { questions.map((question) => (
              <QuestionItem favorite_questions_id={favorite_questions} question={question} show_question={false} key={question.id} />
            )) }
          </div>
        ) : null}
      </div>
    );
  }
}

export default function Wrapper(): JSX.Element {
  const { id } = useParams();

  return (
    <div className="col col-md-8 mx-auto">
      <QuestionsList qodex_id={id!} />
    </div>
  );
}
