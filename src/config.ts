import * as querystring from 'query-string';
import fetch, { Response } from 'node-fetch';

import { TikkieErrorCollection } from './error';

const PRODUCTION_API_URL = 'https://api.abnamro.com';
const SANDBOX_API_URL = 'https://api-sandbox.abnamro.com';

export class TikkieCheckoutConfig {
  apiKey: string;
  merchantToken: string;
  useSandbox: boolean;
  apiUrl: string;
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
  }

  createHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    headers['User-Agent'] = 'node-tikkie-checkout/1.0';
    headers['API-Key'] = this.apiKey;
    headers['X-Merchant-Token'] = this.merchantToken;
    return headers;
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
