module.exports = {
    apps: [
      {
        name: 'backend',
        cwd: './backend',
        script: 'npm',
        args: 'start',
        env: {
          PORT: 3000
        }
      },
      {
        name: 'frontend',
        cwd: './frontend',
        script: 'npm',
        args: 'start',
        env: {
          PORT: 3001
        }
      },
      {
        name: 'ai-app',
        cwd: './ai-app',
        script: 'python',
        args: 'api.py',
        env: {
          PORT: 8000
        }
      }
    ]
  };