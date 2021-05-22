/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { API } from '../../utils/API';
// import * as DTO from '../../types';
// import QuestionItem from '../questions/question-item-short';
import logo from '../../images/logo.png';

export default function Home(): JSX.Element {
  // const [toSearch, setToSearch] = React.useState(false);
  // const [search, setSearch] = React.useState(String);
  // const [topQuestions, setTopQuestions] = React.useState([] as DTO.Question[]);
  // const sortFunction = (a: DTO.Question, b: DTO.Question): number => (b.score - a.score);

  // // On componentDidMount do API calls
  // React.useEffect(() => {
  //   API.get('/questions').then((res: any) => {
  //     const { questions } = res.data;
  //     questions.sort(sortFunction);
  //     setTopQuestions(questions.slice(0, 5));
  //   });
  // }, []);

  // const handleSubmit = (evt: React.KeyboardEvent): void => {
  //   if (evt.keyCode === 13) { // on enter Enter
  //     setToSearch(true);
  //   }
  // };

  // if (toSearch) {
  //   // Redirect to /questions?search={search}, on search get query and run
  //   // API.get('/questions', {query: {search: search}})
  //   return <Redirect to={`/questions?search=${search}`} />;
  // }

  return (
    <div className="col col-lg-6 mx-auto">
      <div className="text-center" style={{ paddingTop: '3em', paddingBottom: '3em' }}>
        <img src={logo} style={{ paddingBottom: '1.5em' }} alt="qodex" height="100" />
        <p className="lead font-italic">The place to share knowledge with your team</p>
        <hr className="my-4" />
        <p className="text-muted">Qodex is an opensource questions/answer platform that increase your team productivity 🚀</p>
        <div className="row">
          <div className="col">
            <Link to="/questions">
              <button className="btn btn-outline-primary btn-lg w-100">Browse questions</button>
            </Link>
          </div>
          <div className="col">
            <button
              className="btn btn-outline-primary btn-lg w-100"
              data-toggle="modal"
              data-target="#AskModal"
            >
              Ask question
            </button>
          </div>
        </div>

      </div>

      {/* <div className="mt-5">

        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-header bg-dark text-white text-center mb-3">
            <h5>Top #5 questions</h5>
          </div>
          <div className="card-body">
            <div className="card-text">
              {topQuestions.map((question: DTO.Question) => (
                <div key={question.id}>
                  <div style={{ fontSize: '1.2em' }}>
                    <QuestionItem question={question} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
