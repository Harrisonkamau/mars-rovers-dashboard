const createApp = require('./createApp');

const PORT = process.env.PORT || 4000;

/**
 * Creates an app and starts the server on the available port
 * @returns {void} void
 */
async function main() {
  try {
    // this is for local testing, to be removed in prod
    const corsOptions = {
      origin: `http://localhost:${PORT}`,
    };

    const app = await createApp(corsOptions);

    app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
  } catch (error) {
    console.log('An error occurred while starting app', error);
    process.exit(1);
  }
}

module.exports = main();
