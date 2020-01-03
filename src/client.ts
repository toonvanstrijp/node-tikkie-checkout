import { TikkieCheckoutConfig } from './config';
import { CreatedOrder } from './models/createdOrder';
import { Order } from './models/order';
import { CreateOrder } from './models/createOrder';

export interface TikkieCheckoutClientOptions {
  apiKey: string;
  merchantToken: string;
  useSandbox?: boolean;
}

const defaultTikkieCheckoutClientOptions: Partial<TikkieCheckoutClientOptions> = {
  useSandbox: false,
};

export class TikkieCheckoutClient {
  config: TikkieCheckoutConfig;

  /**
   * Initialize TikkieCheckoutClient.
   *
   * @param {TikkieCheckoutConfig} config Configuration object.
   */
  constructor(config: TikkieCheckoutClientOptions) {
    const { apiKey, merchantToken, useSandbox } = {
      ...defaultTikkieCheckoutClientOptions,
      ...config,
    };
    this.config = new TikkieCheckoutConfig(apiKey, merchantToken, useSandbox);
  }

  createOrder(data: CreateOrder) {
    return this.config.postRequest<CreatedOrder>(
      '/v1/tikkie/fastcheckout/orders',
      data,
    );
  }
  getOrder(orderToken: string) {
    return this.config.getRequest<Order>(
      `/v1/tikkie/fastcheckout/orders/${orderToken}`,
    );
  }
}
