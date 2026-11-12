import { createHash, verify, type KeyObject } from "node:crypto";

const INPUT =
  /^sig-pp=(\("@method" "@authority" "@path" "signature-date" "content-digest" "content-type"\);alg="ecdsa-p256-sha256";keyid="([\w:.-]+)";created=(\d{10});expires=(\d{10}))$/;
const SIGNATURE = /^sig-pp=:([A-Za-z0-9+/]+={0,2}):$/;
const DIGEST = /^sha-(256|512)=:[A-Za-z0-9+/]+={0,2}:$/;

interface SignedCallback {
  readonly raw: Buffer;
  readonly headers: Readonly<Record<string, string | string[] | undefined>>;
  readonly now: number;
  readonly authority: string;
  readonly path: string;
  readonly keyId: string;
  readonly publicKey: KeyObject;
}

function header(input: SignedCallback, name: string): string {
  const value = input.headers[name];
  return typeof value === "string" && !/[\r\n]/.test(value) ? value.trim() : "";
}

function validDigest(input: SignedCallback, digest: string): boolean {
  const bits = DIGEST.exec(digest)?.[1];
  if (bits === undefined) return false;
  return (
    digest ===
    "sha-" +
      bits +
      "=:" +
      createHash("sha" + bits)
        .update(input.raw)
        .digest("base64") +
      ":"
  );
}

function signatureBase(input: SignedCallback, params: string): Buffer {
  return Buffer.from(
    [
      '"@method": POST',
      '"@authority": ' + input.authority,
      '"@path": ' + input.path,
      '"signature-date": ' + header(input, "signature-date"),
      '"content-digest": ' + header(input, "content-digest"),
      '"content-type": ' + header(input, "content-type"),
      '"@signature-params": ' + params,
    ].join("\n"),
  );
}

function validWindow(input: SignedCallback, created: number, expires: number): boolean {
  const date = Date.parse(header(input, "signature-date"));
  return (
    Number.isFinite(date) &&
    created <= input.now + 10 &&
    expires > input.now &&
    expires > created &&
    expires - created <= 300
  );
}

/**
 * Verifies the documented PawaPay P-256 callback profile against a pinned key.
 * @param input Raw request bytes and expected signature context.
 * @returns Whether the callback is authenticated.
 */
export function verifyCallbackSignature(input: SignedCallback): boolean {
  const match = INPUT.exec(header(input, "signature-input"));
  const signature = SIGNATURE.exec(header(input, "signature"))?.[1];
  if (!match?.[1] || !signature) return false;
  if (!signatureContextMatches(input, match)) return false;
  return verify(
    "sha256",
    signatureBase(input, match[1]),
    input.publicKey,
    Buffer.from(signature, "base64"),
  );
}

function signatureContextMatches(input: SignedCallback, match: RegExpExecArray): boolean {
  return (
    match[2] === input.keyId &&
    validWindow(input, Number(match[3]), Number(match[4])) &&
    validDigest(input, header(input, "content-digest")) &&
    input.publicKey.asymmetricKeyDetails?.namedCurve === "prime256v1"
  );
}
