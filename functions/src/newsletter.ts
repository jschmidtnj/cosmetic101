exports.handler = async () => {
  return {
    body: JSON.stringify({
      message: `hello world!`,
    }),
    statusCode: 500,
  };
};
