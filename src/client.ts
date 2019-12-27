import { TikkieCheckoutConfig } from './config';
import { CreatedOrder } from './models/createdOrder';
import { Order } from './models/order';
import { CreateOrder } from './models/createOrder';

export class TikkieCheckoutClient {
  config: TikkieCheckoutConfig;

  /**
   * Initialize TikkieCheckoutClient.
   *
   * @param {TikkieCheckoutConfig} config Configuration object.
   */
  constructor(config: TikkieCheckoutConfig) {
    this.config = config;
  }

  /**
   * Manually authenticate with the Tikkie API.
   * TikkieCheckoutClient will automatically connect before making the first request.
   */
  async authenticate(): Promise<void> {
    try {
      await this.config.getAccessToken();
    } catch (err) {
      throw err;
    }
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
