const createApp = require('./createApp');

const PORT = process.env.PORT || 4000;

/**
 * Creates an app and starts the server on the available port
 * @returns {void} void
 */
async function main() {
  try {
    const app = await createApp();

    app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
  } catch (error) {
    console.log('An error occurred while starting app', error);
    process.exit(1);
  }
}

module.exports = main();
