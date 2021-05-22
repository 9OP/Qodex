/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function Footer(): JSX.Element {
  return (
    <footer className="footer">
      <div className="container text-center">
        <a href="https://github.com/9OP/qodex-web">
          <span className="text-muted">
            <FontAwesomeIcon icon={faGithub} size="2x" style={{ verticalAlign: 'middle' }} />
          </span>
        </a>
        <span className="spacer" />
        <span className="text-muted">
          {' '}
          Developped with
          {' '}
          <FontAwesomeIcon icon={faHeart} />
          {' '}
          @
          {' '}
        </span>
        <a href="http://www.eurecom.fr/en">EURECOM</a>
      </div>
    </footer>
  );
}
