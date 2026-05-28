import {Page } from "@playwright/test"
import { finalpageLocators} from "../locator/FinalPageLocators"

export class FinalPage
{
    constructor (private page : Page) {}

    async getFinalPageElements()
    {
        return{

            pageInfo : this.page.locator(finalpageLocators.pageInfo),
            successMsg : this.page.locator(finalpageLocators.successMsg),
            backHomeBtn : this.page.locator(finalpageLocators.backHomeBtn)

        }
    }

    async getSuccessMsgText()
    {
        const text = this.page.locator(finalpageLocators.successMsg).innerText();
        return (await text).trim();
    }

    async clickOnBackHomeBtn()
    {
        await this.page.locator(finalpageLocators.backHomeBtn).click()
    }
}
