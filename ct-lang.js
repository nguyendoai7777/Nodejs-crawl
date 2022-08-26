const fs = require('fs');
const puppeteer = require('puppeteer');


(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.ibm.com/docs/en/informix-servers/14.10?topic=uif-language-country-region-codes-used-by-is0-639');
        await page.waitForSelector('table');
        /*const tbElm = await page.evaluate(() => {
            const tb2 = document.querySelectorAll('table')[1]
            return Array.from(tb2.querySelectorAll('tbody tr'))
        })
        console.log(tbElm)*/
        // const tb = page.$$('.container h1.text-center').textContent;
        const tb = await page.evaluate(() => {
            let t = document.querySelectorAll('table')[1].querySelectorAll('tbody tr');
            t = [...t];
            return t.map(l => ({
                countryName: l.querySelectorAll('td')[0].textContent,
                langCode: l.querySelectorAll('td')[1].textContent,
            }));

        })
        console.log(tb)
        try {
            fs.writeFileSync('app/countries-lang.json', JSON.stringify(tb))
        } catch (e) {
            console.error('opps, something went wrong: EX ', e)
        }

        await browser.close();
    } catch (e) {
        console.error('crash app!! - ', e);
        process.exit(1);
    }
})();