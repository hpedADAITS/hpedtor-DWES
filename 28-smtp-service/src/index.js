const { logger } = require("./utils");
const app = require("./app");
const config = require("./config");
const { sendEmail } = require("./services/mailService");

const { port } = config;

app.listen(port, async (err) => {
  if (err) {
    logger.error(err);
    return;
  }
  logger.info(`App listening on port ${port}!`);

  try {
    await sendEmail(
      'test@example.com',
      'App Started',
      'The SMTP service has been launched successfully.',
      '<h1>App Started</h1><p>The SMTP service has been launched successfully.</p>'
    );
    logger.info('Test email sent on app startup');
  } catch (error) {
    logger.error('Failed to send test email on startup: ' + error.message);
  }
});
