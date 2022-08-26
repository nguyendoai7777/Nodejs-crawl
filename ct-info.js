const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
   try {
       const browser = await puppeteer.launch();
       const page = await browser.newPage();
       await page.goto('https://countrycode.org');
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
               countryName: l.querySelector('td a').textContent,
               countryCode: l.querySelector('td span').textContent,
               isoCode: l.querySelectorAll('td')[2].textContent.split('/')[0],
           }));

       })
       console.log(tb)
      try {
          fs.writeFileSync('app/countries-info.json', JSON.stringify(tb))
      } catch (e) {
           console.error('opps, something went wrong: EX ', e)
      }

       await browser.close();
   } catch (e) {
       console.error('crash app!! - ', e);
       process.exit(1);
   }
})();