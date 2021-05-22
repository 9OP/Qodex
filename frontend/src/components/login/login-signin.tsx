/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-escape */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { API } from '../../utils/API';
import event from '../../utils/eventEmitter';

interface Props {
  handler: () => void;
}

interface Inputs {
  email: string;
  password: string;
}

interface State {
  fields: Inputs;
  errors: Inputs;
  message: string;
}

function SigninResponse(props: {message: string}): JSX.Element {
  const { message } = props;
  return (
    <div>
      {message
        ? (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        ) : null}
    </div>
  );
}

export default class Signin extends React.Component<Props, State> {
  public defaultState = {
    fields: { email: '', password: '' },
    errors: { email: '', password: '' },
    message: '',
  } as State;

  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = { ...this.defaultState };
  }

  handleValidation = (): boolean => {
    const { fields } = this.state;
    const errors = {} as Inputs;
    let formIsValid = true;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Email
    if (!fields.email) {
      formIsValid = false;
      errors.email = 'Cannot be empty';
    } else if (!re.test(fields.email.toLowerCase())) {
      formIsValid = false;
      errors.email = 'Email is not valid';
    }

    // Password
    if (!fields.password) {
      formIsValid = false;
      errors.password = 'Cannot be empty';
    }

    this.setState({ errors });
    return formIsValid;
  };

  handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const formIsValid = this.handleValidation();
    if (formIsValid) {
      const { email } = this.state.fields;
      const { password } = this.state.fields;
      await API.post('/login/signin', { user: { email, password } })
        .catch((err: any) => this.setState({ message: err.response.statusText }));
      event.dispatch('CHECK_AUTH');
      this.setState({ fields: { ...this.state.fields, password: '' } });
    }
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const fields = {
      ...this.state.fields,
      [e.target.name]: e.target.value,
    };
    this.setState({ fields });
  };

  render(): JSX.Element {
    const { handler } = this.props;
    const { fields } = this.state;
    const { errors } = this.state;
    const { message } = this.state;

    const { email } = fields;
    const { password } = fields;
    const errorEmail = errors.email;
    const errorPassword = errors.password;

    return (
      <div>
        <SigninResponse message={message} />
        <button type="button" className="float-right btn btn-outline-primary" onClick={handler}>
          Sign up
        </button>
        <h4 className="card-title mb-4 mt-1">Sign in</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Your email</label>
            <input
              className="form-control"
              placeholder="Email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            <div className="invalid-feedback" style={{ display: 'block' }}>
              {errorEmail}
            </div>
          </div>
          <div className="form-group">
            <div className="float-right disabled">
              Forgot?
            </div>
            <label>Your password</label>
            <input
              className="form-control"
              placeholder="******"
              type="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            <div className="invalid-feedback" style={{ display: 'block' }}>
              {errorPassword}
            </div>
          </div>
          <div className="form-group">
            <input
              className="btn btn-primary btn-block"
              type="submit"
              value="Sign in"
            />
          </div>
        </form>
      </div>
    );
  }
}
