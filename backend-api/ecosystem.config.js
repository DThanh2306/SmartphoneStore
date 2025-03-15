module.exports = {
    apps: [
      {
        name: 'Backend',
        script: './server.js', // File entry point của backend
        env: {
          NODE_ENV: 'production',
          PORT: 3000,
        },
      },
    ],
  };
  