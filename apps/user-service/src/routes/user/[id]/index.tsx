import { component$, useSignal } from '@builder.io/qwik';
import {
  Form,
  routeAction$,
  routeLoader$,
  useLocation,
} from '@builder.io/qwik-city';
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@qwik-ui/headless';
import * as jose from 'jose';
import lodash from 'lodash';
import { DateTime } from 'luxon';

import { prisma } from '../../../clients/prisma';
import { createJwt } from '../../../controllers/jwt';
import { Button } from '../../../integrations/react/button';

export const useUser = routeLoader$(async ({ params }) => {
  const { id } = params;

  const user = await prisma.user.findUnique({
    select: { email: true, token: true },
    where: { id },
  });

  return {
    ...user,
    decoded: lodash.isNil(user?.token) ? null : jose.decodeJwt(user.token),
  };
});

export const useRefreshToken = routeAction$(async (_, { params, fail }) => {
  const { id } = params;

  const user = await prisma.user.findUnique({
    select: { email: true, password: true },
    where: { id },
  });

  if (lodash.isNil(user)) {
    return fail(404, {
      error: 'User not found',
    });
  }

  const token = await createJwt(user.email);

  await prisma.user.update({
    data: { token },
    select: { id: true },
    where: { id },
  });

  return jose.decodeJwt(token ?? '');
});

export default component$(() => {
  const location = useLocation();
  const data = useUser();
  const refreshToken = useRefreshToken();

  const showModal = useSignal(false);

  return (
    <div>
      <h1 class="my-4 text-xl">Hello, {data.value?.email}</h1>
      <p class="font-bold">Your API token:</p>
      <p class="break-words bg-black px-1 py-2 text-white">
        {data.value?.token}
      </p>
      {!lodash.isNil(data.value.decoded?.iat) && (
        <p>
          <span class="font-bold">Issued At:</span>{' '}
          {DateTime.fromSeconds(data.value.decoded?.iat).toLocaleString({
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      )}
      {!lodash.isNil(data.value.decoded?.exp) && (
        <p>
          <span class="font-bold">Expires</span>:{' '}
          {DateTime.fromSeconds(data.value.decoded?.exp).toLocaleString({
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
      )}

      <Button
        className="mt-4"
        color="primary"
        disabled={location.isNavigating}
        onPress$={() => {
          showModal.value = true;
        }}
      >
        Refresh Token
      </Button>
      <Modal bind:show={showModal} class="p-4">
        <ModalHeader>
          <h2 class="text-lg font-bold">Are you sure?</h2>
        </ModalHeader>
        <ModalContent>
          <p class="my-4">
            Changing your API token will log you out of all services.
          </p>
        </ModalContent>
        <ModalFooter class="my-4 flex gap-4">
          <Button
            color="primary"
            disabled={location.isNavigating}
            onPress$={() => {
              showModal.value = false;
            }}
          >
            Cancel
          </Button>
          <Form action={refreshToken}>
            <Button
              color="danger"
              isLoading={location.isNavigating}
              type="submit"
              onPress$={() => {
                showModal.value = false;
              }}
            >
              Refresh Token
            </Button>
          </Form>
        </ModalFooter>
      </Modal>
    </div>
  );
});
