const puppeteer = require('puppeteer')
const { BANDORI, DURATION } = require('../constants/constants')
require('dotenv').config()
const { saveImage, _base } = require('./base')

const imgDic = './image'

const crawl = async () => {
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
            await page.goto(process.env.URI_BANDORI)

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
            const randomClickTransparentImg = delay.getRandomInt(1, links.length)
            console.log(`Transparent image ${randomClickTransparentImg} clicked 👆 \n`)
            const link = links[randomClickTransparentImg - 1]
            await link.click()

            const popUpImage = await page.waitForSelector(BANDORI.TRANSPARENT.POPUP_IMG.replace('{0}', randomClickTransparentImg))
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

module.exports = crawl