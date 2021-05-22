import app from './app';
import config from './config';

// start app
app.listen(config.app.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server start on port: ${config.app.PORT}`);
});
