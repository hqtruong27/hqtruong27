const puppeteer = require('puppeteer')
var path = require("path")
const fileHelper = require('./helper/file-helper')
require('dotenv').config()

const crawl = async () => {

    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ['--no-sandbox']
    })

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
    await page.click(`#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div.has-text-centered > a:nth-child(1)`)
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


    //remove file in folder if exist
    fileHelper.hasAnyFile('./img').then(hasFile => {
        if (hasFile) {
            fileHelper.removeAllFile('./img')
            console.log('remove all file in folder')
        }
    }).catch(err => {
        console.log(err)
    })

    let fileName = path.basename(img)
    fileName = Date.now().toString().concat('_', fileName)

    const urlImage = process.env.URI_BANDORI_IMAGE.concat(img)
    //save file to folder img use fs
    fileHelper.downloadFile(urlImage, './img', fileName)

    await browser.close()
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