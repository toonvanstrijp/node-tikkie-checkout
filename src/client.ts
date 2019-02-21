
import {TikkieCheckoutConfig} from './config';

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
    authenticate = async (): Promise<void> => {
        try {
            await this.config.getAccessToken();
        } catch (err) {
            throw err;
        }
    }

    createOrder = (data: object) => this.config.postRequest('/v1/tikkie/fastcheckout/orders', data);
    getOrder = (orderToken: string) => this.config.getRequest(`/v1/tikkie/fastcheckout/orders/${orderToken}`);
}
