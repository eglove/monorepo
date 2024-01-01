import { component$ } from '@builder.io/qwik';
import { Form, Link, routeAction$, z, zod$ } from '@builder.io/qwik-city';
import lodash from 'lodash';

import { prisma } from '../../clients/prisma';
import { createJwt } from '../../controllers/jwt';
import { Button } from '../../integrations/react/button';
import { Input } from '../../integrations/react/input';
import { hashString } from '../../util/hash-string';

export const useSignIn = routeAction$(
  async ({ email, password }, { fail, redirect }) => {
    const foundUser = await prisma.user.findUnique({
      select: { email: true, id: true, password: true },
      where: { email },
    });

    if (lodash.isNil(foundUser)) {
      return fail(404, {
        fieldErrors: {
          email: ['User not found'],
          password: undefined,
        },
      });
    }

    const hashed = await hashString(password);
    const isPasswordValid = hashed === foundUser.password;

    if (!isPasswordValid) {
      return fail(404, {
        fieldErrors: {
          email: ['Invalid email or password'],
          password: undefined,
        },
      });
    }

    const token = await createJwt(foundUser.email);

    await prisma.user.update({
      data: { token },
      select: { id: true },
      where: { id: foundUser.id },
    });

    throw redirect(302, `/user/${foundUser.id}`);
  },
  zod$({ email: z.string().email(), password: z.string() }),
);

export default component$(() => {
  const signIn = useSignIn();

  return (
    <>
      <h1 class="mb-4 text-2xl font-bold">Sign In</h1>
      <Form action={signIn} class="grid max-w-sm gap-4">
        <Input
          autoComplete="email"
          errorMessage={signIn.value?.fieldErrors.email}
          inputMode="email"
          label="Email"
          name="email"
          type="email"
        />
        <Input
          autoComplete="current-password"
          errorMessage={signIn.value?.fieldErrors.password}
          label="Password"
          name="password"
          type="password"
        />
        <Button color="primary" type="submit">
          Sign In
        </Button>
        <Link class="text-blue-500 underline" href="/">
          Don&apos;t have an account? Sign Up
        </Link>
      </Form>
    </>
  );
});
