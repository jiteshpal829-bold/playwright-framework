import { Page } from '@playwright/test'
import { productPageLocator } from "../locator/ProductPageLocators.js";

export class ProductPage {
    constructor(private page: Page) { }

    async logout() {
        await this.page.click(productPageLocator.settingIcon);
        await this.page.click(productPageLocator.logoutlink);
    }

    async openAboutPage() {
        await this.page.click(productPageLocator.settingIcon);
        await this.page.click(productPageLocator.aboutlink)
    }

    async validateAllProductsDisplayed() {
        const names = await this.page.locator(productPageLocator.productNames).allTextContents();
        const descriptions = await this.page.locator(productPageLocator.productDescription).allTextContents();
        const price = await this.page.locator(productPageLocator.productPrices).allTextContents();
        const buttonCount = await this.page.locator(productPageLocator.addToCartButton).count();

        console.log("Names Count:", names.length);
        console.log("Description Count:", descriptions.length);
        console.log("Price Count:", price.length);
        console.log("Button Count:", buttonCount);

        if (names.length === 0)
            throw new Error("No products found")

        if (names.length !== descriptions.length || names.length !== price.length || names.length !== buttonCount)
            throw new Error("Mismatch between the product Details")

    }

    async addFirstProductToCart() {
        await this.page.locator(productPageLocator.addToCartButton).first().click();
    }

    async addAllProductsToCart() {
        const button = this.page.locator(productPageLocator.addToCartButton)
        const count = await button.count();

        for (let i = 0; i < count; i++) {
            await button.nth(i).click();
            await this.page.waitForTimeout(3000)
        }
    }

    // async addSpecificProductsToCart(product: string[])  //String of an array 

    // {
    //     const addProducts = this.page.locator(productPageLocator.productNames);
    //     const count = await addProducts.count();
    //     var productName = '';
    //     for (let i = 0; i < count; i++) // if title is matching with product then it will click on Add To Cart Button 
    //     {
    //         const name = await addProducts.nth(i).textContent();

    //         if (name && productName.includes(name.trim())) {
    //             await this.page.locator(productPageLocator.addToCartButton).nth(i).click();
    //             await this.page.waitForTimeout(3000);
    //         }
    //     }
    // }

    async addSpecificProductsToCart(products: string[]) {
    const addProducts = this.page.locator(productPageLocator.productNames);
    const count = await addProducts.count();

    for (let i = 0; i < count; i++) {
        const name = await addProducts.nth(i).textContent();

        if (name && products.includes(name.trim())) {
            await this.page.locator(productPageLocator.addToCartButton).nth(i).click();
        }
    }
}
    //Need to create 4 different methods
    async filterByNameAtoZ() {
        await this.page.selectOption(productPageLocator.filterDropDown, "az")
    }

    async filterByNameZtoA() {
        await this.page.selectOption(productPageLocator.filterDropDown, "za")
        await this.page.waitForTimeout(3000);
    }

    async filterByLowToHigh() {
        await this.page.selectOption(productPageLocator.filterDropDown, "lohi")
        await this.page.waitForTimeout(3000);
    }

    async filterByHighToLow() {
        await this.page.selectOption(productPageLocator.filterDropDown, "hilo")
        await this.page.waitForTimeout(3000);
    }

    async getProductName() {
        return await this.page.locator(productPageLocator.productNames).allTextContents();

    }

    async getProductPrices() {
        const prices = await this.page.locator(productPageLocator.productPrices).allTextContents();
        return prices.map(price => parseFloat(price.replace('$', "")))
    }

    async clickonCartLink() {
        await this.page.locator(productPageLocator.cartlink).click();
    }

    async getFirstProductDetails() {
        const name = await this.page.locator(productPageLocator.productNames).first().textContent();
        const description = await this.page.locator(productPageLocator.productDescription).first().textContent();
        const price = await this.page.locator(productPageLocator.productPrices).first().textContent();

        return {
            name: name?.trim(),
            description: description?.trim(),
            price: price?.trim()
        }
    }

    async getAllProductDetails() {
        const allname = await this.page.locator(productPageLocator.productNames).allTextContents();
        const alldescription = await this.page.locator(productPageLocator.productDescription).allTextContents();
        const allPrices = await this.page.locator(productPageLocator.productPrices).allTextContents();

        const allProducts = allname.map((_, i) =>
        ({
            name: allname[i]?.trim(),
            description: alldescription[i]?.trim(),
            price: allPrices[i]?.trim()

        }))
        return allProducts;

        //array of object [{name,description,price} , {} , {}]
    }

    async getSpecificProductDetails(productName: string[]) {
        const allname = await this.page.locator(productPageLocator.productNames).allTextContents();
        const alldescription = await this.page.locator(productPageLocator.productDescription).allTextContents();
        const allPrices = await this.page.locator(productPageLocator.productPrices).allTextContents();

        const allProducts = allname.map((_, i) =>
        ({
            // name: allname[i].trim(),
            // description: alldescription[i].trim(),
            // price: allPrices[i].trim()
            name: allname[i]?.trim() ?? "",
            description: alldescription[i]?.trim() ?? "",
            price: allPrices[i]?.trim() ?? ""

        }))
        return allProducts.filter(p => productName.includes(p.name));



    }
}