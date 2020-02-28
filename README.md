# Node.js Tikkie Checkout API

**Easily create payment requests through [Tikkie](https://tikkie.me/)**

Unofficial JavaScript implementation of the [Tikkie Fast Checkout API](https://developer.abnamro.com/content/tikkie-fast-checkout).

## Installation
```bash
npm install tikkie-checkout
```

## Usage
```typescript
import {TikkieCheckoutClient} from 'tikkie-checkout';

const tikkie = new TikkieCheckoutClient({
  apiKey: TIKKIE_KEY,
  merchantToken: TIKKIE_MERCHANT_TOKEN,
  useSandbox: true,
});

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
```

## Inspiration
- [node-tikkie by Daniel Huisman](https://github.com/DanielHuisman/node-tikkie)
