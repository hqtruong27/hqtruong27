const puppeteer = require('puppeteer')
const _file = require('../helper/file-helper')
const { LOVELIVE } = require('../constants/constants')
require('dotenv').config()

const imgDic = './image'
const defaultFileName = 'cover_photo.png'

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
            console.log('START: crawling...\n')
            await page.goto(process.env.URI_LOVE_LIVE)

            const divImage = await page.waitForSelector(LOVELIVE.DIV_IMAGE)
            let img = await divImage.evaluate(x => x.style.backgroundImage.slice(4, -1).replace(/"/g, ""))
            console.log('Found image 🖋️: -> ' + img.split('/').pop())

            const oldFileName = (await _file.readAsJson('./temp', 'temp.json')).fileName || defaultFileName
            const tempPath = imgDic + '/' + oldFileName
            if (_file.exists(tempPath)) {
                _file.remove(imgDic, oldFileName)
                console.log('Remove old file image success!! ✅' + '\n')
            }

            const fileName = Date.now().toString() + '_' + defaultFileName
            await _file.download('https:' + img, imgDic, fileName)
            console.log('Download file image success!! ✅ -> ' + img + '\n')

            //Why? This to clear the cache image on github
            await replaceTextREADME(oldFileName, fileName)

            await browser.close()
            recursive = false
            console.log('END: Crawl image success ✅✅....\n')
        } catch (error) {
            await browser.close()
            duration += 1
            console.log('❌ ' + (error.message || error) + '\n')
            console.log(`Retry ${duration} times.... ⚠️`)
            recursive = true
        }
    }

    return !recursive
}

const replaceTextREADME = async (oldText, newText) => {
    console.log('------------------------------------------------')
    await Promise.all([
        _file.replaceText('./', 'README.md', oldText, newText),
        _file.replaceText('./temp', 'temp.json', oldText, newText)
    ])

    console.log('Change text success!! ✅✅ ' + oldText + ' -> ' + newText)
    console.log('------------------------------------------------')
}


module.exports = crawl