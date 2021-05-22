/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import Editor from '../../editor';
import { API } from '../../../utils/API';
import eventEmitter from '../../../utils/eventEmitter';
import TagBar from './tag-bar';
import QodexDropDown from './qodex-dropdown';

interface Inputs {
  title: string;
  question: string;
  qodex: string;
  tags: string[];
}

interface State {
  fields: Inputs;
  errors: Inputs;
  posted: {success: boolean; message: string};
}

function AskResponse(props: {message: string; success: boolean}): JSX.Element {
  const { message, success } = props;
  return (
    <div>
      {success
        ? (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )
        : (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}
    </div>
  );
}

export default class FormManager extends React.Component<{}, State> {
  public defaultState = {
    fields: {} as Inputs,
    errors: {} as Inputs,
    posted: { success: false, message: '' },
  } as State;

  constructor(props: {}) {
    super(props);

    this.updateTags = this.updateTags.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleQodexChange = this.handleQodexChange.bind(this);
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = { ...this.defaultState };
  }

  updateTags = (tags: string[]): void => {
    const { fields } = this.state;
    fields.tags = [...tags];
    this.setState({ fields });
  }

  handleQodexChange = (qodex_id: string): void => {
    const { fields } = this.state;
    fields.qodex = qodex_id;
    this.setState({ fields });
  }

  handleQuestionChange = (question: string): void => {
    const { fields } = this.state;
    fields.question = question;
    this.setState({ fields });
  }

  handleValidation = (): boolean => {
    const { fields } = this.state;
    const errors = {} as Inputs;
    let formIsValid = true;

    // Title
    if (!fields.title) {
      formIsValid = false;
      errors.title = 'Cannot be empty';
    }

    // Question
    if (!fields.question) {
      formIsValid = false;
      errors.question = 'Cannot be empty';
    }

    // Qodex
    if (!fields.qodex) {
      formIsValid = false;
      errors.qodex = 'Cannot be empty';
    }

    this.setState({ errors });
    return formIsValid;
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    event.preventDefault();
    const fields = {
      ...this.state.fields,
      [event.target.name]: event.target.value,
    };
    this.setState({ fields });
  };

  handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const formIsValid = this.handleValidation();
    if (formIsValid) {
      await this.post();
      eventEmitter.dispatch('POST_QUESTION');
    }
  };

  async post(): Promise<void> {
    const { fields } = this.state;
    const {
      title, question, tags, qodex,
    } = fields;
    await API.post('/questions', {
      question: {
        title, question, tags, qodex: { id: qodex },
      },
    })
      .then((res: any) => this.setState({ posted: { success: true, message: res.statusText } }))
      .catch((err: any) => this.setState({ posted: { success: false, message: err.response.statusText } }));
  }

  render(): JSX.Element {
    const { fields } = this.state;
    const { errors } = this.state;
    const { posted } = this.state;

    const { success, message } = posted;
    const { title } = fields;

    const errorTitle = errors.title;
    const errorQuestion = errors.question;
    const errorQodex = errors.qodex;

    return (
      <div>
        {message
          ? (<AskResponse message={message} success={success} />)
          : (
            <div className="question-panel row">
              <div className="col-12">
                <div className="response-message" />
                <form className="question-form" onSubmit={this.handleSubmit}>

                  <div className="form-row">

                    <div className="form-group col-md-8">
                      <label htmlFor="titleinput">
                        <small className="form-text text-muted">
                          Title
                        </small>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm title-input"
                        name="title"
                        onChange={this.handleChange}
                        value={title}
                      />
                      <div className="invalid-feedback" style={{ display: 'block' }}>
                        {errorTitle}
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <label htmlFor="qodexdropdown">
                        <small className="form-text text-muted">
                          Qodex
                        </small>
                      </label>
                      <QodexDropDown handler={this.handleQodexChange} />
                      <div className="invalid-feedback" style={{ display: 'block' }}>
                        {errorQodex}
                      </div>
                    </div>

                  </div>

                  <div className="form-row">
                    <div className="form-group col-12">
                      <label htmlFor="tagbar">
                        <small className="form-text text-muted">
                          Tags
                        </small>
                      </label>
                      <TagBar updateTags={this.updateTags} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-12">
                      <label htmlFor="questiontextarea">
                        <small className="form-text text-muted">
                          Question
                        </small>
                      </label>
                      <Editor handler={this.handleQuestionChange} />
                      <div className="invalid-feedback" style={{ display: 'block' }}>
                        {errorQuestion}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-outline-primary btn-sm post-btn w-100">Ask question</button>

                </form>
              </div>
            </div>
          )}
      </div>
    );
  }
}
