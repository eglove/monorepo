import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

import {
  signUpEmailHtml,
  signUpEmailText,
} from '../components/email/sign-up-email';

const charSet = 'utf8';

export async function sendSignUpEmail(sendTo: string[]) {
  const sesClient = new SESClient({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
      secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
    },
    region: process.env.AWS_REGION ?? '',
  });

  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: sendTo,
    },
    Message: {
      Body: {
        Html: {
          Charset: charSet,
          Data: signUpEmailHtml,
        },
        Text: {
          Charset: charSet,
          Data: signUpEmailText,
        },
      },
      Subject: {
        Charset: charSet,
        Data: 'Signed Up!',
      },
    },
    Source: 'hello@ses.ethang.email',
  });

  return sesClient.send(command);
}
