/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import * as React from 'react';

import { API } from '../../utils/API';
import eventEmitter from '../../utils/eventEmitter';
import Editor from '../editor';

function PostResponse(props: {success: boolean; message: string}): JSX.Element {
  const { success } = props;
  const { message } = props;
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

interface Props {
  id: string;
}

interface State {
  answerString: string;
  post: {success: boolean; message: string};
}

export default class AnswerForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = { answerString: '', post: { success: false, message: '' } } as State;
  }

  handleChange = (answer: string): void => {
    this.setState({ answerString: answer });
  }

  handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    await this.post();
    eventEmitter.dispatch('POST_ANSWER');
  };

  async post(): Promise<void> {
    const { answerString } = this.state;
    const { id } = this.props; // question _id
    await API.post(`/questions/${id}`, { answer: { answer: answerString } })
      .then((res: any) => this.setState({ post: { success: true, message: res.statusText } }))
      .catch((err: any) => this.setState({ post: { success: false, message: err.response.statusText } }));
  }

  render(): JSX.Element {
    const { post } = this.state;
    const { success, message } = post;

    return (
      <div className="col col-lg-8 mx-auto">
        {message
          ? (
            <PostResponse success={success} message={message} />
          ) : (
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <Editor handler={this.handleChange} />
              </div>
              <input
                className="btn btn-outline-primary btn-sm w-100"
                type="submit"
                value="Post your answer"
              />
            </form>
          )}

      </div>

    );
  }
}
