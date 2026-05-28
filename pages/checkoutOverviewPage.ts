import { Page } from "@playwright/test";
import { checkoutOverviewLocators } from "../locator/checkoutOverviewLocators"

export class CheckoutOverPage
{
    constructor (private page : Page){}

    async getcheckoutOverviewElement()
   {
     return {
               pageInfo : this.page.locator(checkoutOverviewLocators.pageInfo),
               cancelButton : this.page.locator(checkoutOverviewLocators.cancelButton),
               finishButton : this.page.locator(checkoutOverviewLocators.finishButton)

     }

   }
      async getOverviewProducts()
      {
        const allname = await this.page.locator(checkoutOverviewLocators.productNames).allTextContents();
                    const alldescription = await this.page.locator(checkoutOverviewLocators.productDescription).allTextContents();
                    const allPrices = await this.page.locator(checkoutOverviewLocators.productPrices).allTextContents();
            
                    const allCartProducts = allname.map((_, i) =>
                    ({
                        name: allname[i]?.trim(),
                        description: alldescription[i]?.trim(),
                        price: allPrices[i]?.trim()
            
                    }))
                    return allCartProducts;
      }

      async getItemTotal()
      {
        const text = await this.page.locator(checkoutOverviewLocators.itemTotal).textContent();
        return parseFloat(text!.replace("Item total: $", "").trim());
        
      }

      async getTax()
      {
        const text = await this.page.locator(checkoutOverviewLocators.tax).textContent();
        return parseFloat(text!.replace("Item total: $", "").trim());
      }

      async getTotal()
      {
        const text = await this.page.locator(checkoutOverviewLocators.total).textContent();
        return parseFloat(text!.replace("Item total: $", "").trim());
      }

      async clickCancel()
      {
        await this.page.locator(checkoutOverviewLocators.cancelButton).click();
      }

      async clickOnFinish()
      {
        await this.page.locator(checkoutOverviewLocators.finishButton).click();
      }

}