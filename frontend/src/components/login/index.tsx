import React from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { authenticated } from '../../utils/API';
import event from '../../utils/eventEmitter';
import logo from '../../images/logo.png';
import Signin from './login-signin';
import Signup from './login-signup';

interface State {
  showSignin: boolean;
  loading: boolean;
}

interface Props {
  handler: () => void;
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showSignin: true,
      loading: true,
    };
  }

  async componentDidMount(): Promise<void> {
    event.subscribe('CHECK_AUTH', () => this.checkAuth());
    await this.checkAuth();
  }

  componentWillUnmount(): void {
    event.unsubscribe('CHECK_AUTH');
  }

  checkAuth = async (): Promise<void> => {
    const { handler } = this.props;
    const { isAuthenticated } = await authenticated();
    if (isAuthenticated) {
      handler();
    } else {
      this.setState({ loading: false });
    }
  };

  switchForm = (): void => {
    const { showSignin } = this.state;
    this.setState({ showSignin: !showSignin });
  };

  render(): JSX.Element {
    const { showSignin } = this.state;
    const { loading } = this.state;

    if (loading) {
      return (
        <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      );
    }

    return (
      <div className="d-flex justify-content-center">
        <div className="col col-md-5 col-lg-3 col-sm-6 mt-5">
          <img src={logo} className="img-fluid" alt="Qodex" />
          <div className="card mt-5">
            <article className="card-body w-100">
              {showSignin ? (
                <Signin handler={this.switchForm} />
              ) : (
                <Signup handler={this.switchForm} />
              )}
            </article>
          </div>
        </div>
      </div>
    );
  }
}

export default function LoginWrapper(props: {handler: () => void}): JSX.Element {
  const { handler } = props;

  return (
    <Switch>
      <Route exact path="/login" render={(): JSX.Element => <Login handler={handler} />} />
      <Redirect from="*" to="/login" />
    </Switch>
  );
}
