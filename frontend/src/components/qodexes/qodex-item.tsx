import React from 'react';
import { Link } from 'react-router-dom';
import * as DTO from '../../types';

interface Props{
    qodex: DTO.Qodex;
}

export default function QodexItem(props: Props): JSX.Element {
  const { qodex } = props;

  return (
    <Link to={`/qodexes/${qodex.id}`}>
      <div className="card question">
        <div className="card-body">
          <h2 className="card-title title">{qodex.name}</h2>
          <div className="card-subtitle mb-2 text-muted">
            <h6>
              {qodex.questions_count}
              {' '}
              Questions
            </h6>
            <hr />
            <h5><span className="badge badge-info"> Description: </span></h5>
            {qodex.description}
          </div>
        </div>
      </div>
    </Link>
  );
}
