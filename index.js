const puppeteer = require('puppeteer');
const network = require('./network');

puppeteer.launch({
    defaultViewport: {
        width: 960,
        height: 480
    },
    headless: false,
    devtools: true,
}).then(async browser => {
    let time = 0;
    for (let i = 0; i < 10; i++) {
        const page = await browser.newPage();
        // Connect to Chrome DevTools
        const client = await page.target().createCDPSession();
        // Set throttling property
        await client.send('Network.emulateNetworkConditions', network['WiFi']);
        // await client.send('Network.setCacheDisabled', { cacheDisabled: false });
        await page.setCacheEnabled(false);
        await page.goto('https://www.baidu.com', { waitUntil: 'load' });
        // 截图
        await page.screenshot({ path: `./screenshot/${i}.png` });
        // const html = await page.evaluate(() => window.document.body.innerHTML);
        // console.log(html);
        // 获取性能时间
        const performance = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance)));
        const useTime = performance.timing.navigationStart - performance.timing.loadEventEnd;
        console.log("当前页面加载时间：%d ms", useTime);
        time += useTime;
        await page.close();
    }
    console.log("平均值：%d ms", time / 10);
    await browser.close();
});