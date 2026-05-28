import { test, expect } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../../utils/envConfig';
import { ProductPage } from '../../pages/ProductPage';
import { LoginPage } from '../../pages/LoginPage';
import { LoginLocators } from '../../locator/Loginlocators';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/Checkoutpage';
import {checkoutData } from  '../../test-data/checkoutData'
import { productsToCart } from '../../test-data/products';
import { CheckoutOverPage} from '../../pages/checkoutOverviewPage'
import { FinalPage } from '../../pages/FinalPage';

test.describe("Checkout Overview Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage : CartPage
    let checkoutPage : CheckoutPage
    let checkoutOverview : CheckoutOverPage
    let finalPage : FinalPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page)
        checkoutPage = new CheckoutPage(page)
        checkoutOverview = new CheckoutOverPage(page)
        finalPage = new FinalPage(page);

        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD)
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        await productPage.getSpecificProductDetails(productsToCart);
        await productPage.clickonCartLink();
        await cartPage.clickCheckoutButton();
        await checkoutPage.fillCheckoutDetail(checkoutData.firstName,checkoutData.lastName,checkoutData.postalcode);
        await checkoutPage.clickcontinueButton();
        await checkoutOverview.clickOnFinish();

    })
    
    test("Validate checkout overview page UI and URL" , async({page})=>
        {
          await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html")
          const element = await finalPage.getFinalPageElements();
          await expect(element.backHomeBtn).toBeVisible()
          await expect(element.successMsg).toBeVisible();
          await expect(element.pageInfo).toBeVisible();
        })

        test("Validate the Success Message" , async ({page})=>
            {
              const message = await finalPage.getSuccessMsgText();
              expect(message).toBe("Thank you for your order!");
        })
        test ("Validate BackHomeButton",async({page})=>
            {
                await finalPage.clickOnBackHomeBtn();
                await expect (page).toHaveURL("https://www.saucedemo.com/inventory.html");

        })

})