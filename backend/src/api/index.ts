import login from './routes/login-routes';
import questions from './routes/questions-routes';
import qodexes from './routes/qodex-routes';
import user from './routes/user-routes';
import stats from './routes/stats-routes';

export default {
  router: [
    // Add all feature.router
    login.router,
    questions.router,
    qodexes.router,
    user.router,
    stats.router,
  ],
};
