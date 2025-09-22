/**
 * List of demo merchants and their URLs for testing.
 * Each merchant can have multiple product or collection pages.
 * Used by Playwright fixtures to navigate and test merchant integrations.
 */

export enum OrgShortName {
  FakeStore = 'fake-store',
  SauceDemo = 'sauce-demo',
  OpenCartDemo = 'opencart-demo',
  EcomDemo1 = 'ecom-demo-1',
  EcomDemo2 = 'ecom-demo-2',
}

export interface MerchantUrl {
  merchant: OrgShortName;
  url: string;
}

export const merchantsList: MerchantUrl[] = [
  // FakeStore Demo
  { merchant: OrgShortName.FakeStore, url: 'https://fakestoreapi.com/products/1' },
  { merchant: OrgShortName.FakeStore, url: 'https://fakestoreapi.com/products/2' },

  // SauceDemo
  { merchant: OrgShortName.SauceDemo, url: 'https://www.saucedemo.com/inventory.html' },

  // OpenCart Demo
  { merchant: OrgShortName.OpenCartDemo, url: 'https://demo.opencart.com/index.php?route=product/product&product_id=43' },
  { merchant: OrgShortName.OpenCartDemo, url: 'https://demo.opencart.com/index.php?route=product/category&path=20' },

  // Generic e-commerce demo 1
  { merchant: OrgShortName.EcomDemo1, url: 'https://www.demoblaze.com/prod.html?idp_=1' },
  { merchant: OrgShortName.EcomDemo1, url: 'https://www.demoblaze.com/prod.html?idp_=2' },

  // Generic e-commerce demo 2
  { merchant: OrgShortName.EcomDemo2, url: 'https://automationteststore.com/index.php?rt=product/product&product_id=68' },
  { merchant: OrgShortName.EcomDemo2, url: 'https://automationteststore.com/index.php?rt=product/product&product_id=70' },
];
