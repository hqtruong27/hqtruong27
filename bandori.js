const puppeteer = require('puppeteer')
const _file = require('./helper/file-helper')
const { BANDORI } = require('./constants/constants')
require('dotenv').config()
const imgDic = './image'
const defaultFileName = 'cover_photo.png'

const crawl = async () => {
    let duration = 0
    let recursive = true
    while (recursive && duration <= 10) {
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

            for (let i = 1; i <= 3; i++) {
                const _star = await page.waitForSelector(BANDORI.FILTER_STAR.replace('{0}', 1))
                await _star.evaluate(x => x.click())
                console.log(`Un filter card ${i} star success .....\n`)
            }

            await delay(100)
            await page.waitForSelector(BANDORI.SHOW_MORE_CARD)
            let duration = 0
            let isShowMore = true
            while (isShowMore) {
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
            console.log(`\nTotal cards: ${totalCards} \n`)

            const chooseRandomCard = getRandomInt(1, totalCards)
            const card = cards[chooseRandomCard - 1]
            await card.click()
            console.log(`card number: ${chooseRandomCard} clicked \n`)
            await page.waitForNavigation({ timeout: 10000 })
            await page.waitForSelector(BANDORI.TRANSPARENT.TAB, { timeout: 10000 })
            // Transparent
            await autoScroll(page)
            let tab_transparent = await page.$(BANDORI.TRANSPARENT.TAB)
            await tab_transparent.click()

            await delay(500) //wait load block transparent
            var links = await page.$$(BANDORI.TRANSPARENT.BLOCK_IMG)
            const randomClickTransparentImg = getRandomInt(1, links.length)
            console.log(`Transparent image ${randomClickTransparentImg} clicked \n`)
            const link = links[randomClickTransparentImg - 1]
            await link.click()

            const popUpImage = await page.waitForSelector(BANDORI.TRANSPARENT.POPUP_IMG.replace('{0}', randomClickTransparentImg))
            const img = await popUpImage.evaluate((e) => e.querySelector('img').src)
            const alt = await popUpImage.evaluate((e) => e.querySelector('img').alt)

            console.log('------------------------------------------------')
            console.log(`Who?: -> ${alt} \n`)
            console.log('------------------------------------------------')
            //console.log('img:->', img + '\n')

            const oldFileName = (await _file.readAsJson('./temp', 'temp.json')).fileName || defaultFileName
            const tempPath = `${imgDic}/${oldFileName}`
            console.log({ tempPath })
            if (_file.exists(tempPath)) {
                _file.remove(imgDic, oldFileName)
                console.log('remove file success!!' + '\n')
            }

            const fileName = Date.now().toString() + '_' + defaultFileName
            //save file to directory
            await _file.download(img, imgDic, fileName)

            //Why? This to clear the cache image on github
            await replaceTextREADME(oldFileName, fileName)

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

const replaceTextREADME = async (oldText, newText) => {
    let readmeText = await _file.read('./', 'README.md')

    let tempJson = {}
    if (readmeText.includes(oldText)) {
        console.log('------------------------------------------------')
        console.log('Found old text in file README...\n')

        readmeText = readmeText.replace(oldText, newText)

        await _file.writeTo('./', 'README.md', readmeText)

        //new fileName
        tempJson.fileName = newText
        await _file.writeTo('./temp', 'temp.json', JSON.stringify(tempJson))
        console.log('Change text success!! ✅✅ ' + JSON.stringify(tempJson))
        console.log('------------------------------------------------')
    }
}