const puppeteer = require('puppeteer')
const fileHelper = require('./helper/file-helper')
const { BANDORI } = require('./constants/constants')
require('dotenv').config()
const imgDic = './image'

const crawl = async () => {
    let duration = 0
    let recursive = true
    while (recursive && duration <= 5) {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--no-sandbox']
        })

        try {
            const page = await browser.newPage()
            console.log('Start crawling.....\n')
            await page.goto(process.env.URI_BANDORI)

            const firstPopup = await page.waitForSelector(BANDORI.FIST_POPUP)
            await firstPopup.evaluate(x => x.click())
            //close first popup
            //await firstPopup.click() -> Node is either not clickable or not an HTMLElement

            const viewType = await page.waitForSelector(BANDORI.VIEW_TYPE)
            await viewType.evaluate(x => x.click())

            console.log('Change type view success.....\n')

            const filter = await page.waitForSelector(BANDORI.FILTER)
            await filter.evaluate(x => x.click())

            const _1star = await page.waitForSelector(BANDORI.FILTER_STAR.replace('{0}', 1))
            await _1star.evaluate(x => x.click())
            console.log('Un filter card 1 star success .....\n')

            const _2star = await page.waitForSelector(BANDORI.FILTER_STAR.replace('{0}', 2))
            await _2star.evaluate(x => x.click())
            console.log('Un filter card 2 star success .....\n')

            const _3star = await page.waitForSelector(BANDORI.FILTER_STAR.replace('{0}', 3))
            await _3star.evaluate(x => x.click())
            console.log('Un filter card 3 star success .....\n')

            await delay(100)
            await page.waitForSelector(BANDORI.SHOW_MORE_CARD)
            let duration = 1
            let isShowMore = true
            while (isShowMore && duration <= 50) {
                var showMore = await page.$(BANDORI.SHOW_MORE_CARD)
                if (showMore) {
                    duration += 1
                    console.log(`Show: ${duration} times`)
                    await autoScroll(page)
                } else {
                    console.log('\nEnd....\n')
                    isShowMore = false
                }
            }

            const cards = await page.$$(BANDORI.BLOCK_CARD)
            const totalCards = cards.length
            console.log(`Total cards: ${totalCards} \n`)

            const chooseRandomCard = getRandomInt(1, totalCards)
            const card = cards[chooseRandomCard - 1]
            await card.click()
            console.log(`card number: ${chooseRandomCard} clicked \n`)
            await delay(1500) //wait for load page

            // Transparent
            const tab_transparent = await page.waitForSelector(BANDORI.TRANSPARENT.TAB)
            await autoScroll(page)
            await tab_transparent.evaluate(x => x.click())
            let tab_transparent_clicked = false
            while (!tab_transparent_clicked) {
                tab_transparent_clicked = await tab_transparent.evaluate(el => el.textContent == 'Transparent')
                console.log('Transparent tab clicked yet?:->', tab_transparent_clicked)
            }

            await delay(500) //wait load block transparent
            var links = await page.$$(BANDORI.TRANSPARENT.BLOCK_IMG)
            const randomClickTransparentImg = getRandomInt(1, links.length)
            console.log(`Transparent image ${randomClickTransparentImg} clicked \n`)
            const link = links[randomClickTransparentImg - 1]
            await link.click()

            const popUpImage = await page.waitForSelector(BANDORI.TRANSPARENT.POPUP_IMG.replace('{0}', randomClickTransparentImg))
            const img = await popUpImage.evaluate((e) => e.querySelector('img').src)

            console.log('img:->', img + '\n')
            const fileName = 'cover_photo.png'
            const filePath = imgDic + '/' + fileName

            if (fileHelper.exists(filePath)) {
                fileHelper.removeFile(imgDic, fileName)
                console.log('remove file success!!' + '\n')
            }

            //save file to directory
            await fileHelper.downloadFile(img, imgDic, fileName)

            await browser.close()

            recursive = false
            console.log("Crawl success!!!")
        } catch (error) {
            await browser.close()
            duration += 1
            console.log(error.message || error + '\n')
            console.log(`Retry ${duration} times....`)
            recursive = true
        }
    }
}

crawl()
//get random number with seed
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const delay = async (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}

async function autoScroll(page) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
}