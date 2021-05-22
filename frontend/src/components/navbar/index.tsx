/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable max-len */
import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle, faList, faLayerGroup, faComment, faStar,
} from '@fortawesome/free-solid-svg-icons';

import logo from '../../images/logo_white.png';
import { API } from '../../utils/API';
import event from '../../utils/eventEmitter';
import AskForm from './ask-form';

function Signout(): JSX.Element {
  const logout = async (): Promise<void> => {
    await API.post('/login/signout');
    window.location.reload(false);
  };

  return (
    <a
      className="dropdown-item logout"
      onClick={logout}
    >Signout
    </a>
  );
}

function SearchBar(): JSX.Element {
  const [toSearch, setToSearch] = React.useState(false);
  const [search, setSearch] = React.useState(String);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    event.dispatch('SEARCH', search);
    if (search) {
      setToSearch(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    if (searchTerm === '') {
      setToSearch(true);
      event.dispatch('SEARCH', searchTerm);
    } else {
      setToSearch(false);
    }
  };

  return (
    <div>
      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          className="col-8 form-control mr-2 mr-sm-2 searchbar"
          value={search}
          onChange={handleChange}
          type="search"
          placeholder="Search ..."
          aria-label="Search"
        />
        <button
          className="col-2 col-md-3 btn btn-outline-light my-2 my-sm-2"
          type="submit"
        >Search
        </button>
      </form>

      {toSearch ? <Redirect to={`/questions?search=${search}`} /> : null}
    </div>
  );
}

export default function NavBar(): JSX.Element {
  const [username, setUsername] = React.useState(String);

  React.useEffect(() => {
    API.get('/user').then((res: any) => {
      setUsername(res.data.user.name);
    });
  }, []);

  return (
    <header>
      <nav className="navbar fixed-top navbar-icon-top navbar-expand-md navbar-dark bg-dark">
        <div className="navbar-brand col-1" style={{ marginRight: '50px' }}>
          <Link to="/">
            <img src={logo} alt="Qodex" height="30" />
          </Link>
        </div>
        <button
          className="navbar-toggler toggler-button"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <FontAwesomeIcon
                  className="fa icon"
                  icon={faUserCircle}
                  color="#fff"
                  size="2x"
                />
                {username}
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">Account</a>
                <div className="dropdown-divider" />
                <Signout />
              </div>
            </li>

            <li className="nav-item active">
              <a
                className="nav-link icon"
                data-toggle="modal"
                data-target="#AskModal"
              >
                <FontAwesomeIcon
                  className="fa icon"
                  icon={faComment}
                  color="#fff"
                  size="2x"
                />
                Ask
              </a>
            </li>

            <li className="nav-item active">
              <Link to="/favorites" className="nav-link">
                <FontAwesomeIcon
                  className="fa icon"
                  icon={faStar}
                  color="#fff"
                  size="2x"
                />
                Favorites
              </Link>
            </li>

            <li className="nav-item active">
              <Link to="/questions" className="nav-link">
                <FontAwesomeIcon
                  className="fa icon"
                  icon={faList}
                  color="#fff"
                  size="2x"
                />
                Questions
              </Link>
            </li>

            <li className="nav-item active">
              <Link to="/qodexes" className="nav-link">
                <FontAwesomeIcon
                  className="fa icon"
                  icon={faLayerGroup}
                  color="#fff"
                  size="2x"
                />
                Qodexes
              </Link>
            </li>
          </ul>

          <SearchBar />

        </div>
      </nav>

      <div className="modal fade" id="AskModal" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title font-weight-bold">Ask your team</h5>
              <button
                type="button"
                className="close text-white"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <AskForm />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
