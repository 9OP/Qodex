/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-useless-escape */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { API } from '../../utils/API';

interface Props {
  handler: () => void;
}

interface Inputs {
  name: string;
  email: string;
  password: string;
  confirmed: string;
}

interface State {
  fields: Inputs;
  errors: Inputs;
  registration: {success: boolean; message: string};
}

function SignupResponse(props: {success: boolean; message: string}): JSX.Element {
  const { success } = props;
  const { message } = props;
  return (
    <div>
      {message
        ? (
          <div>
            {success
              ? (
                <div className="alert alert-success" role="alert">
                  {`${message}, you can now sign in!`}
                </div>
              )
              : (
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              )}
          </div>
        )
        : null}
    </div>
  );
}

export default class Signup extends React.Component<Props, State> {
  public defaultState = {
    fields: { name: '', email: '', password: '', confirmed: '' },
    errors: { name: '', email: '', password: '', confirmed: '' },
    registration: { success: false, message: '' },
  } as State;

  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = { ...this.defaultState } as State;
  }

  handleValidation = (): boolean => {
    const { fields } = this.state;
    const errors = {} as Inputs;
    let formIsValid = true;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Name
    if (!fields.name) {
      formIsValid = false;
      errors.name = 'Cannot be empty';
    }

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
    } else if (fields.password.length < 5) {
      formIsValid = false;
      errors.password = 'Password length must be 5 at least';
    }

    // Confirmed
    if (!fields.confirmed) {
      formIsValid = false;
      errors.confirmed = 'Cannot be empty';
    } else if (fields.confirmed !== fields.password) {
      formIsValid = false;
      errors.confirmed = 'Confirmed password must match';
    }

    this.setState({ errors });
    return formIsValid;
  };

  handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const formIsValid = this.handleValidation();
    if (formIsValid) {
      const { name } = this.state.fields;
      const { email } = this.state.fields;
      const { password } = this.state.fields;
      await API.post('/login/signup', { user: { name, email, password } })
        .then((res: any) => this.setState({ registration: { success: true, message: res.statusText } }))
        .catch((err: any) => this.setState({ registration: { success: false, message: err.response.statusText } }));
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const fields = {
      ...this.state.fields,
      [event.target.name]: event.target.value,
    };
    this.setState({ fields });
  };

  render(): JSX.Element {
    const { handler } = this.props;
    const { fields } = this.state;
    const { errors } = this.state;
    const { success } = this.state.registration;
    const { message } = this.state.registration;

    const { name } = fields;
    const { email } = fields;
    const { password } = fields;
    const { confirmed } = fields;

    const errorName = errors.name;
    const errorEmail = errors.email;
    const errorPassword = errors.password;
    const errorConfirmed = errors.confirmed;

    return (
      <div>
        <SignupResponse success={success} message={message} />
        <button type="button" className="float-right btn btn-outline-primary" onClick={handler}>
          Sign in
        </button>
        <h4 className="card-title mb-4 mt-1">Sign up</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              className="form-control"
              placeholder="Name"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <div className="invalid-feedback" style={{ display: 'block' }}>
              {errorName}
            </div>
          </div>
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
            <label>Confirm password</label>
            <input
              className="form-control"
              placeholder="******"
              type="password"
              name="confirmed"
              value={confirmed}
              onChange={this.handleChange}
            />
            <div className="invalid-feedback" style={{ display: 'block' }}>
              {errorConfirmed}
            </div>
          </div>
          <div className="form-group">
            <input
              className="btn btn-primary btn-block"
              type="submit"
              value="Sign up"
            />
          </div>
        </form>
      </div>
    );
  }
}
