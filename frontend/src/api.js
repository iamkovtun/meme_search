const getApiUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      // Replace this with your production API URL
      return 'https://your-production-api-url.com';
    } else {
      return 'http://localhost:3001';
    }
  };
  

  export { getApiUrl };