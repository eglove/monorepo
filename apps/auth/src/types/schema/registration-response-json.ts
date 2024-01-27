import { z } from 'zod';

const base64URLStringSchema = z.string();

const authenticatorAttachmentSchema = z.union([
  z.literal('cross-platform'),
  z.literal('platform'),
]);

export const publicKeyCredentialTypeSchema = z.literal('public-key');

const authenticatorTransportFutureSchema = z.union([
  z.literal('ble'),
  z.literal('cable'),
  z.literal('hybrid'),
  z.literal('internal'),
  z.literal('nfc'),
  z.literal('smart-card'),
  z.literal('usb'),
]);

const cOSEAlgorithmIdentifierSchema = z.number();

const credentialPropertiesOutputSchema = z.object({
  rk: z.boolean().optional(),
});

const authenticatorAttestationResponseJSONSchema = z.object({
  attestationObject: base64URLStringSchema,
  authenticatorData: base64URLStringSchema.optional(),
  clientDataJSON: base64URLStringSchema,
  publicKey: base64URLStringSchema.optional(),
  publicKeyAlgorithm: cOSEAlgorithmIdentifierSchema.optional(),
  transports: z.array(authenticatorTransportFutureSchema).optional(),
});

const authenticationExtensionsClientOutputsSchema = z.object({
  appid: z.boolean().optional(),
  credProps: credentialPropertiesOutputSchema.optional(),
  hmacCreateSecret: z.boolean().optional(),
});

export const registrationResponseJSONSchema = z.object({
  authenticatorAttachment: authenticatorAttachmentSchema.optional(),
  clientExtensionResults: authenticationExtensionsClientOutputsSchema,
  id: base64URLStringSchema,
  rawId: base64URLStringSchema,
  response: authenticatorAttestationResponseJSONSchema,
  type: publicKeyCredentialTypeSchema,
});
