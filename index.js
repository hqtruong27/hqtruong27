const puppeteer = require('puppeteer')
const fileHelper = require('./helper/file-helper')
require('dotenv').config()
const imgDic = './image'

const crawl = async () => {
    let duration = 0
    let recursive = true
    while (recursive) {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--no-sandbox']
        })

        try {
            const page = await browser.newPage()

            await page.goto(process.env.URI_BANDORI)

            await page.click('.modal-card-foot')
            await delay(1000)
            await page.click('.fas.fa-grip-horizontal')
            await delay(1000)

            // //
            // await page.click('.fas.fa-filter')
            // await page.click('#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(2) > div.m-b-l > div:nth-child(3) > div.field-body > div > div > div > a.button.is-rounded.button-all.is-focused')
            // await delay(200)
            // await page.click('#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(2) > div.m-b-l > div:nth-child(3) > div.field-body > div > div > div > a:nth-child(4) > span > img')

            // let isShowMore = true
            // while (isShowMore) {
            //     var showMore = await page.evaluate(() => document.querySelector('#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div.has-text-centered > a.button.is-fullwidth > span:nth-child(2)'))
            //     if (showMore) {
            //         await autoScroll(page)
            //     } else {
            //         isShowMore = false
            //     }
            // }

            const data = await page.$$('#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div.has-text-centered > a')
            await page.click(`#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div.has-text-centered > a:nth-child(2)`)
            await delay(1000)

            // Transparent
            await autoScroll(page)
            await delay(1000)
            await page.click('#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(16) > div.tab-container.m-b-l > div > ul > li:nth-child(2)')
            await delay(1000)
            await page.click('div.has-text-centered > div:nth-child(1) > a > div.image')
            await delay(1000)
            const img = await page.evaluate(() => document.querySelector('#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(16) > div.has-text-centered > div:nth-child(1) > div > div.modal-card > div.modal-card-body.has-text-centered > div.image.is-inline-block')
                .getElementsByTagName('img')[0].getAttribute('src'))


            //remove all file in folder
            if (await fileHelper.hasAnyFile(imgDic)) {
                fileHelper.removeAllFile('./image').then(() => {
                    console.log('remove all file success!!! \n')
                })
            }

            //let fileName = path.basename(img)
            const fileName = 'cover_photo.png'

            const urlImage = process.env.URI_BANDORI_IMAGE.concat(img)
            //save file to folder img use fs
            await fileHelper.downloadFile(urlImage, imgDic, fileName)

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

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

const delay = async (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
}

async function autoScroll(page) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
}