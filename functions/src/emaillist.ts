import sendgridClient from '@sendgrid/client';
import { APIGatewayEvent, Context, Handler } from 'aws-lambda';
import axios from 'axios';

interface IEmailListResponse {
  statusCode: number;
  body: string;
  headers: object;
}

interface IEmailInput {
  email: string;
  token: string;
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const handleResponse = (
  message: string,
  status: number
): IEmailListResponse => {
  const res: IEmailListResponse = {
    body: JSON.stringify({
      message,
    }),
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST',
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS
        : '*',
    },
    statusCode: status,
  };
  return res;
};

const handler: Handler = async (event: APIGatewayEvent, _: Context) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleResponse('', 200);
  }
  if (!process.env.RECAPTCHA_SECRET) {
    return handleResponse('No recaptcha secret found', 405);
  }
  if (!process.env.SENDGRID_KEY) {
    return handleResponse('No sendgrid key found', 405);
  }
  if (!process.env.SENDGRID_LIST_ID) {
    return handleResponse('No sendgrid list id found', 405);
  }
  if (event.httpMethod !== 'POST') {
    return handleResponse('Method Not Allowed', 405);
  }
  if (!event.body) {
    return handleResponse('no message body found', 500);
  }
  let data: IEmailInput;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    const errObj: Error = err;
    return handleResponse(`problem with parsing body: ${errObj.message}`, 500);
  }
  if (!data.email) {
    return handleResponse('no email found', 500);
  }
  if (!data.token) {
    return handleResponse('no recaptcha token found', 500);
  }
  if (!emailRegex.test(data.email)) {
    return handleResponse('invalid email provided', 500);
  }
  return axios
    .post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        response: data.token,
        secret: process.env.RECAPTCHA_SECRET,
      },
    })
    .then(recaptchaRes => {
      if (recaptchaRes.data.success) {
        sendgridClient.setApiKey(process.env.SENDGRID_KEY as string);
        return sendgridClient
          .request({
            body: {
              contacts: [
                {
                  email: data.email,
                },
              ],
              list_ids: [process.env.SENDGRID_LIST_ID as string],
            },
            method: 'PUT',
            url: '/v3/marketing/contacts',
          })
          .then(() => {
            return handleResponse(
              `successfully added ${data.email} to email list`,
              200
            );
          })
          .catch(err => {
            // console.log(err.response.body.errors);
            const errObj: Error = err;
            return handleResponse(
              `error adding contact: ${errObj.message}`,
              500
            );
          });
      } else if (recaptchaRes.data['error-codes']) {
        return handleResponse(
          `error with recaptcha: ${recaptchaRes.data['error-codes'].join(
            ', '
          )}`,
          500
        );
      } else {
        return handleResponse('error with recaptcha', 500);
      }
    })
    .catch(err => {
      const errObj: Error = err;
      return handleResponse(`problem with recaptcha: ${errObj.message}`, 500);
    });
};

export { handler };
