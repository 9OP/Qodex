/* eslint-disable react/no-danger */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Link } from 'react-router-dom';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faStar } from '@fortawesome/free-solid-svg-icons';

import { API } from '../../utils/API';
import event from '../../utils/eventEmitter';
import fmtDate from '../../utils/dates';
import Tags from './tags';
import * as DTO from '../../types';

interface Props{
  favorite_questions_id: string[];
  question: DTO.Question;
  show_question: boolean;
}

export default function QuestionItem(props: Props): JSX.Element {
  const { question, show_question } = props;
  const { favorite_questions_id } = props;

  return (
    <div className={`card ${show_question ? null : 'question'}`}>
      <div className="card-header">

        <FontAwesomeIcon
          icon={faPlus}
          color="#444"
          onClick={async (): Promise<void> => {
            await API.patch(`/questions/${question.id}`, { vote: 'upvote' });
            event.dispatch('POST_QUESTION'); // fetch new data
          }}
          className="cairet plus"
        />
        <span className="spacer" />
        {question.score >= 0
          ? (
            <span className="score badge badge-primary">
              {question.score}
            </span>
          )
          : (
            <span className="score badge badge-danger">
              {question.score}
            </span>
          )}
        <span className="spacer" />
        <FontAwesomeIcon
          icon={faMinus}
          color="#444"
          onClick={async (): Promise<void> => {
            await API.patch(`/questions/${question.id}`, { vote: 'downvote' });
            event.dispatch('POST_QUESTION'); // fetch new data
          }}
          className="cairet minus"
        />
        <span className="spacer" />
        <span className="spacer" />
        <FontAwesomeIcon
          icon={faStar}
          color={favorite_questions_id.includes(question.id) ? '#cbce09' : '#444'}
          onClick={async (): Promise<void> => {
            await API.put(`/questions/${question.id}/${favorite_questions_id.includes(question.id) ? 'unfollow' : 'follow'}`);
            event.dispatch('POST_QUESTION'); // fetch new data
          }}
          className="cairet favorite"
        />
        <Link to={`/qodexes/${question.qodex.id}`}>
          <div className="thread-link float-right qodex-badge">
            <span className="badge badge-dark">
              {' '}
              {question.qodex.name}
              {' '}
            </span>
          </div>
        </Link>
      </div>

      {show_question ? (
        <div className="card-body">
          <h2 className="card-title title">{question.title}</h2>
          <div className="card-subtitle mb-2 text-muted"><Tags tags={question.tags} /></div>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: question.question }} />
        </div>
      ) : (
        <Link to={`/questions/${question.id}`}>
          <div className="card-body">
            <h2 className="card-title title">{question.title}</h2>
            <div className="card-subtitle mb-2 text-muted"><Tags tags={question.tags} /></div>
          </div>
        </Link>
      )}

      <div className="card-footer">
        <small className="text-primary float-left">
          {question.answers_count}
          {' '}
          Answers
          {' '}
          {question.selected_answer_id ? '(Accepted by author)' : ''}
        </small>
        <small className="text-muted float-right">
          Asked
          {' '}
          {fmtDate(question.date)}
          {' '}
          by
          {' '}
          <a className="thread-link" href="## ">{question.author.name}</a>
        </small>
      </div>
    </div>
  );
}
