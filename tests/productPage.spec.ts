import { test, expect } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../utils/envConfig';
import { ProductPage } from '../pages/ProductPage';
import { LoginPage } from '../pages/LoginPage';
import { LoginLocators } from '../locator/Loginlocators';
import { productPageLocator } from '../locator/ProductPageLocators';
import { productsToCart } from '../test-data/products';

test.describe("Product Page Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);


        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD)
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

    })

    test("Validate Logout Functionality", async ({ page }) => {
        await productPage.logout();
        await expect(page.locator(LoginLocators.loginButton)).toBeVisible();
    })

    test("Validate About page and navigate back", async ({ page }) => {
        await productPage.openAboutPage();
        //await expect (page.getByRole('button',{name:'Book a Demo',exact: true})).toBeVisible();
        //await expect (page.locator(productPageLocator.bookdemobutton)).toBeVisible();
        await expect(page.locator(productPageLocator.tryitfreebutton)).toBeVisible();
        await page.goBack();
        await expect(page.locator(productPageLocator.settingIcon)).toBeVisible()
    })

    test("Validate Product Page", async ({ page }) => {
        await productPage.validateAllProductsDisplayed();
        await productPage.addFirstProductToCart();
        await productPage.addAllProductsToCart();
    })

    test("Validate adding some or specific products to cart", async ({ page }) => {
        await productPage.addSpecificProductsToCart(productsToCart);
    })

    test('Filter By Name A to Z', async () => {

        await productPage.filterByNameAtoZ();
        const names = await productPage.getProductName();
        const sorted = [...names].sort(); /// ... is called spread operator
        expect(names).toEqual(sorted);

    })

    test ('Filter By Name Z to A', async () => {
        await productPage.filterByNameZtoA();
        const names = await productPage.getProductName();
        const sorted = [...names].sort().reverse(); /// ... is called spread operator
        expect(names).toEqual(sorted);
    })

    test('Filter By Price Low to High', async () => 
        {
        await productPage.filterByLowToHigh();
        const prices = await productPage.getProductPrices()
        const sortedPrice = [...prices].sort((a,b) => a-b)
        expect(prices).toEqual(sortedPrice)

    })

    test.only('Filter By Price High to Low', async () => {
        
        await productPage.filterByHighToLow();
        const prices = await productPage.getProductPrices()
        const sortedPrice = [...prices].sort((a,b) => b-a)
        expect(prices).toEqual(sortedPrice)
    })

})