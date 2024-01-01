/** @jsxImportSource react */
import { Html, Text } from '@react-email/components';
import { render } from '@react-email/render';

function SignUpEmail() {
  return (
    <Html>
      <Text>Congrats! You signed up!</Text>
    </Html>
  );
}

export const signUpEmailHtml = render(<SignUpEmail />);
export const signUpEmailText = render(<SignUpEmail />, { plainText: true });
