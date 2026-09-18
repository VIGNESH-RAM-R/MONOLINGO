const app = require('./app.json');

module.exports = ({ config }) => ({
  ...app.expo,
  ...config,
  extra: {
    ...app.expo.extra,
    ...config.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
});
