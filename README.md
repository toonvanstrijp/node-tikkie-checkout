# Node.js Tikkie Checkout API

**Easily create payment requests through [Tikkie](https://tikkie.me/)**

Unofficial JavaScript implementation of the [Tikkie Fast Checkout API](https://developer.abnamro.com/content/tikkie-fast-checkout).

## Installation
```bash
npm install tikkie-checkout
```

## Usage
```javascript
import {TikkieCheckoutClient, TikkieCheckoutConfig} from 'tikkie-checkout';

(async () => {
    const config = new TikkieCheckoutConfig('apiKey', 'merchantToken');
    config.loadPrivateKey('path_to_key', 'RS256');

    const tikkie = new TikkieCheckoutClient(config);

    try {
      
        const createOrderRequest = await tikkie.createOrder({
        referenceId: "some reference", 
        shippingCostsInCents: 690,
        discountInCents: 500,
        currency: "EUR",
        expiration: 1800,
        redirectUrl: "https://www.yourdomain.nl/finishorder/1234",
        notificationUrl: "https://www.yourdomain.nl/1234",
        items: [
          {
            itemName: "Mobile Phone",
            priceInCents: 50000,
            quantity: 1
          }]
        });
        console.log(createOrderRequest);

        const getOrderRequest = await tikkie.getOrder(createOrderRequest.orderToken);
        console.log(getOrderRequest);
    } catch (err) {
        console.error(err);
    }
})();
```

## Inspiration
- [node-tikkie by Daniel Huisman](https://github.com/DanielHuisman/node-tikkie)
