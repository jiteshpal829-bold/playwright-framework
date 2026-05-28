import { Page } from '@playwright/test'
import { cartPageLocator } from '../locator/cartPageLocators';

export class CartPage {

    constructor(private page: Page){}

    async clickOnContinueShopping() {
        await this.page.locator(cartPageLocator.continueShoppingButton).click();
    }

    async getCartPageElements() {
        return {
            cartTitle: this.page.locator(cartPageLocator.cartTitle),
            shoppingCart: this.page.locator(cartPageLocator.continueShoppingButton),
            checkOut: this.page.locator(cartPageLocator.checkoutButton)
        }

    }

      async getCartProducts() {
            const allname = await this.page.locator(cartPageLocator.productNames).allTextContents();
            const alldescription = await this.page.locator(cartPageLocator.productDescription).allTextContents();
            const allPrices = await this.page.locator(cartPageLocator.productPrices).allTextContents();
    
            const allCartProducts = allname.map((_, i) =>
            ({
                name: allname[i]?.trim(),
                description: alldescription[i]?.trim(),
                price: allPrices[i]?.trim()
    
            }))
            return allCartProducts;
        }
           async removeFirstProduct()
           {
             await this.page.locator(cartPageLocator.removeButton).first().click();
           }

           async clickCheckoutButton()
           {
               await this.page.locator(cartPageLocator.checkoutButton).click();
           }
}