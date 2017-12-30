/***************************************************************************************************************
 * Script Name: jasmine.spec.ts
 * created on: 2017-12-29
 * created by: Dan Stach
 *
 * Description: this script is designed to check GitHub functionality. The checks include
 *   page title, and blog page search functionality
 *
 * suggested improvments:
 *   better waits for screen to load
 *   more screen validation (text and links)
 *
 * ChangeLog:
 * <yyyy-mm-dd> <Name> <summary of change>
 * -----------------------------------------------------
 * 2017-12-29  DanS  Inital template for web tests
 **************************************************************************************************************/

import * as puppeteer from "puppeteer";



/***************************************************************************************************************
 *                              Global Variables
 **************************************************************************************************************/
const blogSearchPhrase = '"2015 the United States Federal"';


/***************************************************************************************************************
 *                              Global Variables
 **************************************************************************************************************/
describe("GitHub Web Example", function() {
    beforeEach(async function(this: {browser: puppeteer.Browser}) {
        this.browser = await puppeteer.launch({
            headless: false, // false means browser is visable, true means browser is hidden and runs faster
            slowMo: 250, // slows actions down so we can view it (.25 sec wait per action)
        });
    });
    /**********************************************************************************************************
     *          Test 1: github homepage has a title containing 'GitHub'
     *********************************************************************************************************/
    it("github homepage has a title containing 'GitHub'", async function(this: {browser: puppeteer.Browser}) {
        // go to url
        const browser = this.browser;
        const page = await browser.newPage();
        await page.goto("https://github.com/");  
        
        // gather title text and verify text
        const title = await page.title(); // get the title and save it to a variable 
        expect(title).toContain("GitHub"); // verify it contains the correct text
    }, 15000); // 15sec testcase time out


    /**********************************************************************************************************
     *          Test 2: verify search functionality Github Blog
     *********************************************************************************************************/
    it("verify search functionality Github Blog", async function(this: {browser: puppeteer.Browser}) {
        // go to url
        const browser = this.browser;
        const page = await browser.newPage();
        await page.goto("https://github.com/");

        // example of console log message
        // console.log("01_Homepage");

        // gather title text and verify text
        const titleHome = await page.title();
        expect(titleHome).toContain("GitHub");

        // 1st example to wait for page to load: by using genaric selector of the "blog link"
        await page.waitForSelector(
            "body > div.footer.container-lg.p-responsive.mt-6 > div > div:nth-child(5) > ul > li:nth-child(2) > a",
            { visible: true }
        );

        // 2nd Example to wait for page to load: by using href value in selector to identify the "blog link"
        await page.waitForSelector(
            "div.footer.container-lg.p-responsive.mt-6 a[href*='https://github.com/blog']", 
            { visible: true }
        );

        // click the blog link in the footer
        const linkBlog = await page.$("div.footer.container-lg.p-responsive.mt-6 a[href*='https://github.com/blog']");
        if (linkBlog) {
            await linkBlog.click(); // click the link
            await page.waitFor(1000); // hardcoded wait
        } else {
            fail("Could not find blog link");
        }
        
        // gather title text and verify text
        const titleBlog = await page.title();
        expect(titleBlog).toContain("The GitHub Blog · GitHub");
        const pageTextBlog = await page.$eval(
            "a[class ='blog-title']",
            (el: any): string => el.innerText);
        // console.log("02_BlogTitle = " + pageTextBlog );
        expect(pageTextBlog).toContain("The GitHub Blog");


        // enter some text in the search field and press enter
        await page.type(
            "#blog-search",
            blogSearchPhrase, { delay: 10 }
        );  // note blogSearchPhrase variable is defined at the top of the page
        await page.type("#blog-search", String.fromCharCode(13));  // press enter

        // verify the date of blog that was returned
        const pageSearchTxt = await page.$eval(
            "#blog-main ul[class='blog-post-meta']",
            (el: any): string => el.innerText);
        // console.log("03_BlogSearchDate = " + pageSearchTxt );
        expect(pageSearchTxt).toContain("July 12, 2017");

    }, 30000); // 30sec testcase time out

});
