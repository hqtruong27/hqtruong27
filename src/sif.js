const puppeteer = require('puppeteer')
const _file = require('../helper/file-helper')
const { LOVELIVE, KIRARA, DURATION } = require('../constants/constants')
const { default: axios } = require('axios')
const { saveImage } = require('./base')
require('dotenv').config()
const pathImage = './image'

const schoolido = async () => {
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
            console.log('START: crawling...\n')
            await page.goto(process.env.URI_LOVE_LIVE)

            const divImage = await page.waitForSelector(LOVELIVE.DIV_IMAGE)
            let img = await divImage.evaluate(x => x.style.backgroundImage.slice(4, -1).replace(/"/g, ""))
            console.log('Found image 🖋️: -> ' + img.split('/').pop())

            await saveImage('https:' + img, './image')

            console.log('END: Crawl image success ✅✅....\n')
            recursive = false
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

const kirara = async () => {
    let duration = 1
    let recursive = true
    while (recursive && duration <= DURATION) {
        try {
            const res = await axios.get(KIRARA.DICTIONARY_URI)
            if (res.status != 200) {
                console.log('❌ fetch failed response status:' + response.status)
                return false
            }

            const { data: { dictionary } } = res
            const dictionaries = []
            for (const key in dictionary) {
                if (Object.hasOwnProperty.call(dictionary, key)) {
                    const { target, value } = dictionary[key]
                    dictionaries.push({
                        key: key,
                        target: target,
                        value: value
                    })
                }
            }

            const members = dictionaries.filter(x => x.target === 'member')
            const rarities = dictionaries.filter(x => x.target === 'rarity')
            // const membersGroup = dictionaries.filter(x => x.target === 'member_group')

            const response = await axios.post(
                KIRARA.URL_SEARCH,
                {
                    "rarity": rarities.filter(x => x.key !== 'ur').map(x => x.value),// include only UR
                    'member': members[Math.floor(Math.random() * members.length)].value
                })

            if (response.status != 200) {
                console.log('❌ fetch failed response status:' + response.status)
                return false
            }

            const { data: { result } } = response
            const id_card = result[Math.floor(Math.random() * result.length)]
            if (id_card != null) {
                const img_transparent = KIRARA.TRANSPARENT_IMG_CARD.replace('{0}', id_card)
                const img_transparent_idz = KIRARA.TRANSPARENT_IMG_CARD_IDZ.replace('{0}', id_card)

                console.log({ img_transparent, img_transparent_idz })
                let images = (await Promise.all(
                    [
                        _file.isImage(img_transparent),
                        _file.isImage(img_transparent_idz)
                    ])
                ).filter(x => x != null)

                const rndImage = images[
                    Math.floor(
                        Math.random() * images.length
                    )
                ]

                console.log('Found image 🖋️: -> ' + rndImage)

                await saveImage(rndImage, pathImage)
                console.log('END: Get image success ✅✅....\n')
                return true
            }
        } catch (error) {
            console.log('❌ ' + (error.message || error) + '\n')
            console.log(`Retry ${duration} times.... ⚠️`)
            duration += 1
            recursive = true
        }
    }

    return false
}

module.exports = { schoolido, kirara }