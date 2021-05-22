import * as React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import * as DTO from '../../types';

export default function QuestionItem(props: {question: DTO.Question}): JSX.Element {
  const { question } = props;

  return (
    <div>
      <div style={{ fontSize: '1.4em' }}>

        <span className="badge badge-primary">{`# ${question.score}`}</span>
        {' '}
        <Link to={`/questions/${question.id}`}>
          {question.title}
        </Link>
        {' '}
        {question.selected_answer_id ? (<FontAwesomeIcon icon={faCheck} color="#0275d8" />) : null}

        <div className="float-right">
          <Link to={`/qodexes/${question.qodex.id}`}>
            <div className="badge badge-dark">
              {question.qodex.name}
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
