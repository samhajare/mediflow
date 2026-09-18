import {
  createPublicKey,
  createVerify,
  KeyObject,
  type JsonWebKey as NodeJsonWebKey,
} from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { VerifiedCognitoIdentity } from './auth.types';

interface Jwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
  alg?: string;
  use?: string;
}
interface Jwks {
  keys: Jwk[];
}

@Injectable()
export class CognitoJwtVerifier {
  private cachedJwks?: { expiresAt: number; keys: Jwk[] };

  async verify(token: string): Promise<VerifiedCognitoIdentity> {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid Cognito token');
    const header = this.decodeJson<{ alg?: string; kid?: string }>(parts[0]);
    const claims = this.decodeJson<Record<string, unknown>>(parts[1]);
    if (header.alg !== 'RS256' || !header.kid)
      throw new Error('Invalid Cognito token algorithm');
    const region = process.env.COGNITO_REGION;
    const poolId = process.env.COGNITO_USER_POOL_ID;
    if (!region || !poolId) throw new Error('Cognito configuration is missing');
    const issuer = `https://cognito-idp.${region}.amazonaws.com/${poolId}`;
    if (claims.iss !== issuer || typeof claims.sub !== 'string' || !claims.sub)
      throw new Error('Invalid Cognito token issuer or subject');
    if (
      typeof claims.exp !== 'number' ||
      claims.exp <= Math.floor(Date.now() / 1000)
    )
      throw new Error('Expired Cognito token');
    const key = (await this.jwks(region, poolId)).find(
      (candidate) => candidate.kid === header.kid,
    );
    if (!key) throw new Error('Cognito signing key not found');
    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${parts[0]}.${parts[1]}`);
    verifier.end();
    if (!verifier.verify(this.jwkToPem(key), this.base64UrlToBuffer(parts[2])))
      throw new Error('Invalid Cognito token signature');
    return { sub: claims.sub, claims };
  }

  private async jwks(region: string, poolId: string): Promise<Jwk[]> {
    if (this.cachedJwks && this.cachedJwks.expiresAt > Date.now())
      return this.cachedJwks.keys;
    const response = await fetch(
      `https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`,
    );
    if (!response.ok) throw new Error('Unable to load Cognito signing keys');
    const body = (await response.json()) as Jwks;
    this.cachedJwks = {
      keys: body.keys,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    return body.keys;
  }

  private decodeJson<T>(value: string): T {
    return JSON.parse(this.base64UrlToBuffer(value).toString('utf8')) as T;
  }

  private base64UrlToBuffer(value: string): Buffer {
    return Buffer.from(
      value
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(Math.ceil(value.length / 4) * 4, '='),
      'base64',
    );
  }

  private jwkToPem(key: Jwk): KeyObject {
    return createPublicKey({
      key: key as unknown as NodeJsonWebKey,
      format: 'jwk',
    });
  }
}
