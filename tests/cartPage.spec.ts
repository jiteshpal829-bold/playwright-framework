import { test, expect } from '@playwright/test';
import { BASE_URL, USERNAME, PASSWORD } from '../utils/envConfig';
import { ProductPage } from '../pages/ProductPage';
import { LoginPage } from '../pages/LoginPage';
import { LoginLocators } from '../locator/Loginlocators';
import { productPageLocator } from '../locator/ProductPageLocators';
import { productsToCart } from '../test-data/products';
import { CartPage } from '../pages/CartPage';


test.describe("Cart Page Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage : CartPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page)


        await page.goto(BASE_URL);
        await loginPage.login(USERNAME, PASSWORD)
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

    })

    test ("Validate cart page URL and UI Elements " ,async({page})=>
        {
         await productPage.addFirstProductToCart();
         await productPage.clickonCartLink();
         await expect(page).toHaveURL("https://www.saucedemo.com/cart.html")
         const ui = cartPage.getCartPageElements()
         await expect ((await ui).cartTitle).toBeVisible();
         expect((await ui).shoppingCart).toBeVisible();
         expect ((await ui).checkOut).toBeVisible();

    })

    test("Validate Continue Shopping Functionality", async ({page})=>{
        await productPage.addFirstProductToCart();
        await productPage.clickonCartLink();
        await cartPage.clickOnContinueShopping();
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
    })

    test("Validate First Product in cart Page" , async({page})=>
        {
            const firstProduct = await productPage.getFirstProductDetails();
            await productPage.addFirstProductToCart();
            await productPage.clickonCartLink();
            const cartProducts = await cartPage.getCartProducts();
            expect(cartProducts[0]).toEqual(firstProduct);
    })

    test("Validate All Products added to the Cart Page" , async({page})=>
        {
          const allProductDetails = await productPage.getAllProductDetails();
          await productPage.addAllProductsToCart();
          await productPage.clickonCartLink();
          const cartProducts = await cartPage.getCartProducts();
          expect (cartProducts).toEqual(allProductDetails);
    })
    
    test("Validate Specific Products added to the cart Page" , async({page})=>
        {
            
        const getSpecificProductDetails = await productPage.getSpecificProductDetails(productsToCart);
        await productPage.addSpecificProductsToCart(productsToCart);
        await productPage.clickonCartLink();    
        
        const cartProducts = await cartPage.getCartProducts();
        console.log("Cart Products =", cartProducts);

        expect(cartProducts).toEqual(getSpecificProductDetails);
    })
    
    test("Validate Remove Product Functionality" , async({page})=>
        {
            await productPage.addAllProductsToCart();   
          await productPage.clickonCartLink();

          const initialProduct  = await cartPage.getCartProducts();
          expect (initialProduct.length).toBeGreaterThan(0);
          await cartPage.removeFirstProduct();

          const updatedCartProducts = await cartPage.getCartProducts();
          expect(updatedCartProducts.length).toBe(initialProduct.length-1);

        })

    })