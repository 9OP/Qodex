/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-danger */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import { useParams } from 'react-router-dom';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faCheck } from '@fortawesome/free-solid-svg-icons';

import { API } from '../../utils/API';
import eventEmitter from '../../utils/eventEmitter';
import fmtDate from '../../utils/dates';
import * as DTO from '../../types';
import QuestionItem from './question-item-long';
import AnswerForm from './answer-form';

interface Props {
  id: string; // question _id
}

interface State {
  question: DTO.Question;
  favorite_questions: string[];
  answers: DTO.Answer[];
  isAuthor: boolean;
}

class QuestionThread extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleVote = this.handleVote.bind(this);

    this.state = {} as State;
  }

  componentDidMount(): void {
    eventEmitter.subscribe('POST_ANSWER', () => this.fetch());
    eventEmitter.subscribe('POST_QUESTION', () => this.fetch());
    this.fetch();
  }

  componentWillUnmount(): void {
    eventEmitter.unsubscribe('POST_ANSWER');
    eventEmitter.unsubscribe('POST_QUESTION');
  }

  handleVote = async (answer_id: string, vote: string): Promise<void> => {
    const { id } = this.props;
    await API.patch(`/questions/${id}/${answer_id}`, { vote });
    this.fetch();
  }

  handleSelect = async (answer_id: string): Promise<void> => {
    const { id } = this.props;
    await API.patch(`/questions/${id}`, { patch: { selected_answer_id: answer_id } });
    this.fetch();
  }

  async fetch(): Promise<void> {
    const { id } = this.props;
    let author = '';
    await API.get(`/questions/${id}`)
      .then((res: any) => {
        const { question, answers } = res.data;
        this.setState({ question });
        this.setState({ answers });
        author = question.author.id;
      });
    await API.get('/user').then((res: any) => {
      const { user } = res.data;
      this.setState({ favorite_questions: user.favorite_questions });
      this.setState({ isAuthor: user.id === author });
    });
    await this.sortAnswers();
  }

  async sortAnswers(): Promise<void> {
    const { answers, question } = this.state;
    const { selected_answer_id } = question;
    const sortScore = (a: DTO.Answer, b: DTO.Answer) => {
      if (b.id === selected_answer_id) return 1;
      if (a.id === selected_answer_id) return -1;
      return b.score - a.score;
    };
    const sortedAnswers = answers.sort(sortScore);
    this.setState({ answers: sortedAnswers });
  }

  render(): JSX.Element {
    const {
      question, answers, isAuthor, favorite_questions,
    } = this.state;
    const { id } = this.props;

    return (
      <div>
        { question && favorite_questions ? (
          <div className="col col-md-8 mx-auto">

            {/* Question card */}
            <QuestionItem question={question} favorite_questions_id={favorite_questions} show_question />

            <div className="card" style={{ marginTop: '1rem' }}>
              <div className="card-header bg-dark text-white">
                <p className="float-right" style={{ marginBottom: '0' }}><b>Answers</b></p>
              </div>
              <div className="card-body">

                { answers ? (
                  <div className="col answer-thread">
                    {/* Answer card */}
                    { answers.map((answer) => {
                      const selected = question.selected_answer_id === answer.id;
                      return (
                        <div className={`card answer  ${selected ? 'border-primary' : ''}`} key={answer.id}>
                          <div className="card-body">
                            <div className="card-text" dangerouslySetInnerHTML={{ __html: answer.answer }} />
                          </div>
                          <div className="card-footer">

                            <FontAwesomeIcon
                              icon={faPlus}
                              color="#444"
                              onClick={(): Promise<void> => this.handleVote(answer.id, 'upvote')}
                              className="cairet plus"
                            />
                            <span className="spacer" />
                            {answer.score >= 0
                              ? (<span className="score badge badge-primary"> {answer.score} </span>)
                              : (<span className="score badge badge-danger"> {answer.score} </span>)}
                            <span className="spacer" />
                            <FontAwesomeIcon
                              icon={faMinus}
                              color="#444"
                              onClick={(): Promise<void> => this.handleVote(answer.id, 'downvote')}
                              className="cairet minus"
                            />
                            <span className="spacer" />
                            <FontAwesomeIcon
                              icon={faCheck}
                              color={selected ? '#0275d8' : '#444'}
                              onClick={isAuthor ? (): Promise<void> => this.handleSelect(answer.id) : () => (null)}
                              className={`cairet  ${isAuthor ? 'select' : 'disabled'}`}
                            />
                            <span className="spacer" />
                            <small className="text-primary">
                              {selected ? 'Accepted by the author' : ''}
                            </small>

                            <small className="text-muted float-right">
                              Answered {fmtDate(answer.date)} by <a className="thread-link" href="## ">{answer.author.name}</a>
                            </small>
                          </div>
                        </div>
                      );
                    }) }
                  </div>
                ) : null}
              </div>
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
              <div className="card-header bg-dark text-white">
                <p className="float-right" style={{ marginBottom: '0' }}><b>Post your answer</b></p>
              </div>
              <div className="card-body">
                <AnswerForm id={id} />
              </div>
            </div>

          </div>
        ) : null }
      </div>
    );
  }
}

// Wrap React component into stateless component, because useParams did not work in React.Component
export default function Wrapper(): JSX.Element {
  const { id } = useParams();

  return (
    <QuestionThread id={id!} /> // type forced! anti pattern...
  );
}
