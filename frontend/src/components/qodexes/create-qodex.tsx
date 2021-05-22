/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { API } from '../../utils/API';
import event from '../../utils/eventEmitter';

function ApiResponse(props: {message: string; success: boolean}): JSX.Element {
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

interface Inputs {
    name: string;
    description: string;
}

interface State{
    fields: Inputs;
    errors: Inputs;
    posted: {success: boolean; message: string};
}

interface Props{}

class CreateForm extends React.Component<Props, State> {
    public defaultState = {
      fields: {} as Inputs,
      errors: {} as Inputs,
      posted: { success: false, message: '' },
    } as State;

    constructor(props: Props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);
      this.handleValidation = this.handleValidation.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = { ...this.defaultState };
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      e.preventDefault();
      const { fields } = this.state;
      const newFields = {
        ...fields,
        [e.target.name]: e.target.value,
      };
      this.setState({ fields: newFields });
    };

    handleValidation = (): boolean => {
      const { fields } = this.state;
      const errors = {} as Inputs;
      let formIsValid = true;

      // Name
      if (!fields.name) {
        formIsValid = false;
        errors.name = 'Cannot be empty';
      }

      // Description
      if (!fields.description) {
        formIsValid = false;
        errors.description = 'Cannot be empty';
      }

      this.setState({ errors });
      return formIsValid;
    };

    handleSubmit = async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      const formIsValid = this.handleValidation();
      if (formIsValid) {
        await this.post();
        event.dispatch('POST_QODEX');
      }
    };

    async post(): Promise<void> {
      const { fields } = this.state;
      const { name, description } = fields;
      await API.post('/qodexes', {
        qodex: { name, description },
      })
        .then((res: any) => this.setState({
          posted: {
            success: true,
            message: res.statusText,
          },
        }))
        .catch((err: any) => this.setState({
          posted: {
            success: false,
            message: err.response.statusText,
          },
        }));
    //   this.setState({ ...this.defaultState });
    }

    render(): JSX.Element {
      const { fields, errors, posted } = this.state;
      const { message, success } = posted;
      const { name, description } = fields;
      const errorName = errors.name;
      const errorDescription = errors.description;

      return (
        <div>
          {message
            ? (<ApiResponse message={message} success={success} />)
            : (
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    className="form-control form-control-sm"
                    name="name"
                    onChange={this.handleChange}
                    value={name}
                  />
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errorName}
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control form-control-sm"
                    name="description"
                    onChange={this.handleChange}
                    value={description}
                  />
                  <div className="invalid-feedback" style={{ display: 'block' }}>
                    {errorDescription}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">{`Create qodex ${name || ''}`}</button>
              </form>
            )}
        </div>
      );
    }
}

export default function CreateQodex(): JSX.Element {
  return (
    <div className="col col-md-8 mx-auto">
      <p>
        <button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseCreateQodex">
          <FontAwesomeIcon
            className="fa"
            icon={faPlus}
            color="#fff"
            size="1x"
          />
          {' '}
          Create
        </button>
      </p>
      <div className="collapse" id="collapseCreateQodex">
        <div className="card card-body">
          <CreateForm />
        </div>
      </div>
    </div>
  );
}
