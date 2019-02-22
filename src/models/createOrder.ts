export interface CreateOrder {
  referenceId: string;
  shippingCostsInCents: number;
  discountInCents?: number;
  currency: 'EUR';
  expiration: number;
  redirectUrl: string;
  notificationUrl?: string;

  items: Array<{
      itemName: string;
      priceInCents: number;
      quantity: number;
    }>;
}
