const puppeteer = require('puppeteer')
const { BANDORI, DURATION } = require('../constants/constants')
require('dotenv').config()
const { saveImage, _base } = require('./base')

const imgDic = './image'

const crawl_full = async () => {
    let duration = 1
    let recursive = true
    while (recursive && duration <= DURATION) {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--no-sandbox']
        })

        try {
            const page = await browser.newPage()
            console.log('START:.....\n')
            await page.goto(BANDORI.URL)

            const firstPopup = await page.waitForSelector(BANDORI.FIST_POPUP)
            await firstPopup.evaluate(x => x.click())
            //close first popup
            //await firstPopup.click() -> Node is either not clickable or not an HTMLElement

            const viewType = await page.waitForSelector(BANDORI.VIEW_TYPE)
            await viewType.evaluate(x => x.click())

            console.log('Change type view success ✅.....\n')

            const filter = await page.waitForSelector(BANDORI.FILTER)
            await filter.evaluate(x => x.click())

            for (let i = 1; i <= 3; i++) {
                const _star = await page.waitForSelector(BANDORI.FILTER_STAR.replace('{0}', 1))
                await _star.evaluate(x => x.click())
                console.log(`Remove filter card ${i} star success ✅.....\n`)
            }

            await _base.delay(100)
            await page.waitForSelector(BANDORI.SHOW_MORE_CARD)
            let duration = 0
            let isShowMore = true
            console.log('\nCrawling card 🕖🕗🕘...\n')
            while (isShowMore) {
                var showMore = await page.$(BANDORI.SHOW_MORE_CARD)
                if (showMore) {
                    duration += 1
                    await _base.autoScroll(page)
                } else {
                    console.log('\nEnd crawl card ✅....\n')
                    isShowMore = false
                }
            }

            const cards = await page.$$(BANDORI.BLOCK_CARD)
            const totalCards = cards.length
            console.log(`\nTotal cards: ${totalCards} \n`)

            const chooseRandomCard = _base.getRandomInt(1, totalCards)
            const card = cards[chooseRandomCard - 1]
            await card.click()

            console.log('----------------------------------------------------')
            console.log(`Card number ${chooseRandomCard} has been selected 👆`)
            console.log('----------------------------------------------------\n')
            await page.waitForNavigation({ timeout: 10000 })
            await page.waitForSelector(BANDORI.TRANSPARENT.TAB, { timeout: 10000 })
            // Transparent
            await _base.autoScroll(page)
            let tab_transparent = await page.$(BANDORI.TRANSPARENT.TAB)
            await tab_transparent.click()

            await _base.delay(500) //wait load block transparent
            var links = await page.$$(BANDORI.TRANSPARENT.BLOCK_IMG)
            const randomClickTransparentImg = _base.getRandomInt(1, links.length)
            console.log(`Transparent image ${randomClickTransparentImg} clicked 👆 \n`)
            const link = links[randomClickTransparentImg - 1]
            await link.click()

            const popUpImage = await page.waitForSelector(
                BANDORI.TRANSPARENT.POPUP_IMG.replace('{0}', randomClickTransparentImg),
                {
                    waitUntil: 'networkidle0'
                }
            ); // Wait for network to be idle

            const img = await popUpImage.evaluate((e) => e.querySelector('img').src)
            const alt = await popUpImage.evaluate((e) => e.querySelector('img').alt)

            console.log('------------------------------------------------')
            console.log(`Who 🤔❓: -> ${alt} \n`)
            console.log('------------------------------------------------')

            await saveImage(img, imgDic)

            console.log('END: Crawl image success ✅✅....\n')
            await browser.close()
            return true
        } catch (error) {
            await browser.close()
            console.log('❌ ' + (error.message || error) + '\n')
            console.log(`Retry ${duration} times.... ⚠️`)
            duration += 1
            recursive = true
        }

    }

    return false
}

const crawl = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox']
    })

    let duration = 1
    let recursive = true
    while (recursive) {
        try {

            const page = await browser.newPage()
            console.log('START:.....\n')
            await page.goto(BANDORI.URL)

            const firstPopup = await page.waitForSelector(BANDORI.FIST_POPUP)
            await firstPopup.evaluate(x => x.click())

            const viewType = await page.waitForSelector(BANDORI.VIEW_TYPE)
            await viewType.evaluate(x => x.click())

            const filter = await page.waitForSelector(BANDORI.FILTER)
            await filter.evaluate(x => x.click())

            const rfs = await page.waitForSelector(BANDORI.REMOVE_ALL_FILTER_STAR)
            await rfs.evaluate(x => x.click())

            const filter4Star = await page.waitForSelector(BANDORI.FILTER_4_STAR)
            await filter4Star.evaluate(x => x.click())

            await page.waitForSelector(BANDORI.SHOW_MORE_CARD)

            await _base.scrollToBottom(page, 3)

            const cards = (await page.$$(BANDORI.BLOCK_CARD)).slice(0, 21)
            const totalCards = cards.length
            console.log(`\nTotal cards: ${totalCards} \n`)

            const chooseRandomCard = _base.getRandomInt(1, totalCards)
            const card = cards[chooseRandomCard - 1]
            await card.click()

            console.log('----------------------------------------------------')
            console.log(`Card number ${chooseRandomCard} has been selected 👆`)
            console.log('----------------------------------------------------\n')

            await page.waitForNavigation({ waitUntil: 'networkidle2' })
            const transparentTab = await page.waitForSelector(BANDORI.TRANSPARENT.TAB, { timeout: 1000 * 6 })
            await transparentTab.evaluate(x => x.click())

            await _base.delay(500) //wait load block transparent
            var links = await page.$$(BANDORI.TRANSPARENT.BLOCK_IMG)
            const randomClickTransparentImg = _base.getRandomInt(1, links.length)
            console.log(`Transparent image ${randomClickTransparentImg} clicked 👆 \n`)
            const link = links[randomClickTransparentImg - 1]
            await link.click()

            const popUpImage = await page.waitForSelector(
                BANDORI.TRANSPARENT.POPUP_IMG.replace('{0}', randomClickTransparentImg),
                {
                    waitUntil: 'networkidle0'
                }
            ); // Wait for network to be idle

            await page.waitForFunction(
                (selector) => {
                    const img = document.querySelector(selector + " img");
                    return img && !img.src.includes("data:image/gif;base64");
                },
                {}, // Empty options object
                BANDORI.TRANSPARENT.POPUP_IMG.replace("{0}", randomClickTransparentImg)
            );

            const img = await popUpImage.evaluate((e) => e.querySelector('img').src)
            const alt = await popUpImage.evaluate((e) => e.querySelector('img').alt)

            console.log('------------------------------------------------')
            console.log(`Who 🤔❓: -> ${alt} \n`)
            console.log(`image: -> ${img} \n`)
            console.log('------------------------------------------------')

            await saveImage(img, imgDic)

            console.log('END: Crawl image success ✅✅....\n')
            recursive = false
            await browser.close()
        } catch (error) {
            await browser.close()
            console.log('❌ ' + (error.message || error) + '\n')
            console.log(`Retry ${duration} times.... ⚠️`)
            duration += 1
            recursive = duration <= DURATION
        }
    }

    return !recursive
}

const crawlImage = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox']
    });

    let duration = 1;
    let recursive = true;

    while (recursive) {
        try {
            const page = await browser.newPage();
            console.log('START:.....\n');

            await page.goto(process.env.URI_BANDORI);

            await page.click(BANDORI.FIST_POPUP);
            await page.click(BANDORI.VIEW_TYPE);
            await page.click(BANDORI.FILTER);
            await page.click(BANDORI.REMOVE_ALL_FILTER_STAR);
            await page.waitForSelector(BANDORI.FILTER_4_STAR); // Wait for the "4-star" filter to be available
            await page.click(BANDORI.FILTER_4_STAR);

            await page.waitForSelector(BANDORI.SHOW_MORE_CARD);
            await _base.scrollToBottom(page, 3);

            const cards = await page.$$(BANDORI.BLOCK_CARD);
            const totalCards = Math.min(cards.length, 21);
            console.log(`\nTotal cards: ${totalCards} \n`);

            const chooseRandomCard = _base.getRandomInt(1, totalCards);
            const card = cards[chooseRandomCard - 1];
            await card.click();

            console.log('----------------------------------------------------');
            console.log(`Card number ${chooseRandomCard} has been selected 👆`);
            console.log('----------------------------------------------------\n');

            await page.waitForNavigation({ waitUntil: 'networkidle2' });

            // Switch to the transparent tab
            const transparentTab = await page.waitForSelector(BANDORI.TRANSPARENT.TAB, { timeout: 2000 });
            await transparentTab.click();

            await _base.delay(500); // Wait for the transparent block to load

            const links = await page.$$(BANDORI.TRANSPARENT.BLOCK_IMG);
            const randomClickTransparentImg = _base.getRandomInt(1, links.length);
            console.log(`Transparent image ${randomClickTransparentImg} clicked 👆 \n`);

            const link = links[randomClickTransparentImg - 1];
            await link.click();

            const popUpImage = await page.waitForSelector(
                BANDORI.TRANSPARENT.POPUP_IMG.replace('{0}', randomClickTransparentImg),
                {
                    waitUntil: 'networkidle0'
                }
            ); // Wait for network to be idle
            const img = await popUpImage.evaluate((e) => e.querySelector('img').src);
            const alt = await popUpImage.evaluate((e) => e.querySelector('img').alt);

            console.log('------------------------------------------------');
            console.log(`Who 🤔❓: -> ${alt} \n`);
            console.log('------------------------------------------------');

            await saveImage(img, imgDic);

            console.log('END: Crawl image success ✅✅....\n');
            recursive = false;
            await browser.close();
        } catch (error) {
            await browser.close();
            console.log('❌ ' + (error.message || error) + '\n');
            console.log(`Retry ${duration} times.... ⚠️`);
            duration += 1;
            recursive = duration <= DURATION;
        }
    }

    return !recursive;
};

module.exports = crawl
