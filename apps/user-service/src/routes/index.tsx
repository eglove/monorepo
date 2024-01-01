import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Form, Link, routeAction$, z, zod$ } from '@builder.io/qwik-city';

import { prisma } from '../clients/prisma';
import { createJwt, rotateJwks } from '../controllers/jwt';
import { Button } from '../integrations/react/button';
import { Input } from '../integrations/react/input';
import { hashString } from '../util/hash-string';

export const head: DocumentHead = {
  meta: [
    {
      content: 'EthanG User Service',
      name: 'description',
    },
  ],
  title: 'EthanG | User Service',
};

export const useSignUp = routeAction$(
  async ({ email, password }, { fail, redirect }) => {
    // await sendSignUpEmail([String(email)]);

    const hashedPassword = await hashString(password);

    let createdUser = null;
    try {
      createdUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          token: await createJwt(email),
        } as {
          email: string;
          id: string;
          password: string;
          token: string;
          updatedAt: string;
        },
        select: { id: true },
      });

      await rotateJwks();
    } catch {
      return fail(409, {
        fieldErrors: {
          confirmPassword: undefined,
          email: ['Email already taken'],
          password: undefined,
        },
      });
    }

    throw redirect(302, `/user/${createdUser.id}`);
  },
  zod$(
    z
      .object({
        confirmPassword: z.string(),
        email: z.string().email(),
        password: z
          .string()
          .min(8, 'Password must be at least 8 characters long.'),
      })
      .refine(
        data => {
          return data.password === data.confirmPassword;
        },
        { message: "Passwords don't match", path: ['confirmPassword'] },
      ),
  ),
);

export default component$(() => {
  const action = useSignUp();

  return (
    <>
      <h1 class="mb-4 text-2xl font-bold">Sign Up</h1>
      <Form action={action} class="grid max-w-sm gap-4">
        <Input
          autoComplete="email"
          errorMessage={action.value?.fieldErrors?.email}
          inputMode="email"
          label="Email"
          name="email"
          type="email"
        />
        <Input
          autoComplete="new-password"
          errorMessage={action.value?.fieldErrors?.password}
          label="Password"
          name="password"
          type="password"
        />
        <Input
          autoComplete="new-password"
          errorMessage={action.value?.fieldErrors?.confirmPassword}
          label="Confirm Password"
          name="confirmPassword"
          type="password"
        />
        <Button color="primary" type="submit">
          Sign Up
        </Button>
        <div class="mt-4">
          <Link class="text-blue-500 underline" href="/sign-in">
            Already have an account? Sign In
          </Link>
        </div>
      </Form>
    </>
  );
});
