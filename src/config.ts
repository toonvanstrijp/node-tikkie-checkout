import * as fs from 'fs';
import { URLSearchParams, format } from 'url';
import querystring from 'querystring';

import jwt from 'jsonwebtoken';

import { AccessToken } from './accessToken';
import { TikkieErrorCollection } from './error';

const PRODUCTION_API_URL = 'https://api.abnamro.com';
const PRODUCTION_TOKEN_AUDIENCE = 'https://auth.abnamro.com/oauth/token';
const SANDBOX_API_URL = 'https://api-sandbox.abnamro.com';
const SANDBOX_TOKEN_AUDIENCE = 'https://auth-sandbox.abnamro.com/oauth/token';

export class TikkieCheckoutConfig {
  accessToken: AccessToken;
  apiKey: string;
  merchantToken: string;
  useSandbox: boolean;
  apiUrl: string;
  tokenAudience: string;
  privateKey: string;
  algorithm: string;

  constructor(
    apiKey: string,
    merchantToken: string,
    useSandbox: boolean = false,
  ) {
    this.apiKey = apiKey;
    this.merchantToken = merchantToken;
    this.useSandbox = useSandbox;
    this.apiUrl = useSandbox ? SANDBOX_API_URL : PRODUCTION_API_URL;
    this.tokenAudience = useSandbox
      ? SANDBOX_TOKEN_AUDIENCE
      : PRODUCTION_TOKEN_AUDIENCE;
  }

  loadPrivateKey(path: string, algorithm: string = 'RS256') {
    this.loadPrivateKeyFromString(fs.readFileSync(path, 'utf8'), algorithm);
  }

  loadPrivateKeyFromString(privateKey: string, algorithm: string = 'RS256') {
    this.privateKey = privateKey;
    this.algorithm = algorithm;
  }

  createHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    headers['User-Agent'] = 'node-tikkie-checkout/1.0';
    headers['API-Key'] = this.apiKey;
    headers['X-Merchant-Token'] = this.merchantToken;
    return headers;
  }

  getJsonWebToken(): string {
    return jwt.sign({}, this.privateKey, {
      algorithm: this.algorithm,
      expiresIn: '3m',
      notBefore: '-1m',
      issuer: 'node-tikkie-checkout',
      subject: this.apiKey,
      audience: this.tokenAudience,
    });
  }

  async getAccessToken(): Promise<string> {
    if (!this.accessToken || this.accessToken.hasExpired()) {
      try {
        const body = new URLSearchParams();
        body.append(
          'client_assertion_type',
          'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        );
        body.append('client_assertion', this.getJsonWebToken());
        body.append('grant_type', 'client_credentials');
        body.append('scope', 'tikkie');

        const headers: Record<string, string> = this.createHeaders();
        headers['Content-Type'] = 'application/x-www-form-urlencoded';

        const response: Response = await fetch(
          `${this.apiUrl}/v1/oauth/token`,
          {
            method: 'POST',
            headers,
            body,
          },
        );

        const result = await response.json();

        if (response.status >= 200 && response.status <= 399) {
          this.accessToken = new AccessToken(result);
        } else {
          throw new TikkieErrorCollection(result.errors);
        }
      } catch (err) {
        throw err;
      }
    }
    return this.accessToken.token;
  }

  async request<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    options: {
      query: { [key: string]: string } | null;
      data: object | null;
    } = { query: null, data: null },
  ): Promise<T> {
    try {
      const headers: Record<string, string> = this.createHeaders();

      // Authorization only needed for production
      if (!this.useSandbox) {
        let token: string;
        try {
          token = await this.getAccessToken();
        } catch (err) {
          throw err;
        }

        headers.Authorization = `Bearer ${token}`;
      }

      if (method === 'POST' && options.data) {
        headers['Content-Type'] = 'application/json';
      }

      let queryString = '';
      if (method === 'GET' && options.query) {
        queryString = querystring.stringify(options.query);
      }

      const response: Response = await fetch(
        `${this.apiUrl}${endpoint}${queryString}`,
        {
          method,
          headers,
          body:
            method === 'POST' && options.data
              ? JSON.stringify(options.data)
              : undefined,
        },
      );
      const result = await response.json();

      if (response.status >= 200 && response.status <= 399) {
        return result;
      } else {
        throw new TikkieErrorCollection(result.errors);
      }
    } catch (err) {
      throw err;
    }
  }

  getRequest<T>(
    endpoint: string,
    query: { [key: string]: string } = {},
  ): Promise<T> {
    return this.request('GET', endpoint, { query, data: null });
  }
  postRequest<T>(endpoint: string, data: object = {}): Promise<T> {
    return this.request<T>('POST', endpoint, { data, query: null });
  }
}
