import { Handler } from 'aws-lambda';

interface IHelloResponse {
  statusCode: number;
  body: string;
  headers: any;
}

const handler: Handler = async () => {
  const res: IHelloResponse = {
    body: JSON.stringify({
      message: 'hello world!',
    }),
    headers: {
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS
        : '*',
    },
    statusCode: 200,
  };
  return res;
};

export { handler };
