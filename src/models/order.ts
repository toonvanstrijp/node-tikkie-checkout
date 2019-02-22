export interface Order {
  orderToken: string;
  referenceId: string;
  shippingCostsInCents: number;
  discountInCents?: number;
  currency: string;
  items: Array<{
    itemName: string;
    priceInCents: number;
    quantity: number;
  }>;

  status: 'NEW' | 'PAID' | 'CANCELLED' | 'EXPIRED' | 'ERROR';

  payer: {
    companyName?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    shippingAddress: {
      street: string;
      houseNumber: string;
      addition?: string;
      postalCode: string;
      city: string;
      country: string;
    };
  };
}
