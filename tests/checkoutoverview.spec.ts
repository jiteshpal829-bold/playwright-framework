import { test, expect } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../utils/envConfig';
import { ProductPage } from '../pages/ProductPage';
import { LoginPage } from '../pages/LoginPage';
import { LoginLocators } from '../locator/Loginlocators';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/Checkoutpage';
import {checkoutData } from  '../test-data/checkoutData'
import { productsToCart } from '../test-data/products';
import { CheckoutOverPage} from '../pages/checkoutOverviewPage'

test.describe("Checkout Overview Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage : CartPage
    let checkoutPage : CheckoutPage
    let checkoutOverview : CheckoutOverPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page)
        checkoutPage = new CheckoutPage(page)
        checkoutOverview = new CheckoutOverPage(page)


        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD)
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        await productPage.getSpecificProductDetails(productsToCart);
        await productPage.clickonCartLink();
        await cartPage.clickCheckoutButton();
        await checkoutPage.fillCheckoutDetail(checkoutData.firstName,checkoutData.lastName,checkoutData.postalcode);
        await checkoutPage.clickcontinueButton();

    })
    
    test("Validate checkout overview page UI and URL" , async({page})=>{
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html");
        const elements = await checkoutOverview.getcheckoutOverviewElement();
        await expect (elements.pageInfo).toBeVisible();
        await expect (elements.cancelButton).toBeVisible();
        await expect (elements.finishButton).toBeVisible();
    })

    test("Validate cance button functionality" , async({page})=>
        {
            await checkoutOverview.clickCancel();
            await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

    })

    test("Validate Item Total calculation" , async({page})=>
        {

        const overviewProducts = await checkoutOverview.getOverviewProducts();
        const calculatedTotal = overviewProducts.reduce((sum, { price }) => sum + parseFloat(price.replace("$", "")), 0);
        const UITtemTotal = await checkoutOverview.getItemTotal();
        expect (calculatedTotal).toBe(UITtemTotal)
    })

    test.only("Validate Final Total (Item Total + Tax)", async({page})=>
        {
         const itemTotal = await checkoutOverview.getItemTotal();
         const tax = await checkoutOverview.getTax();
         const finalTotal = await checkoutOverview.getTotal();
         const expectedFinalTotal = itemTotal + tax;
         expect(finalTotal).toBe(expectedFinalTotal)
    })
})