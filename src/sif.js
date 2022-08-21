const puppeteer = require('puppeteer')
const _file = require('../helper/file-helper')
const { LOVELIVE, KIRARA } = require('../constants/constants')
const { default: axios } = require('axios')
require('dotenv').config()

const imgDic = './image'
const defaultFileName = 'cover_photo.png'

const schoolido = async () => {
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
            console.log('Download file image success!! ✅' + '\n')

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

const kirara = async () => {
    const duration = 0
    let recursive = true
    while (recursive && duration <= 5) {
        try {
            const res = await axios.get(KIRARA.DICTIONARY_URI)
            if (res.status === 200) {
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

                const response = await axios.post(KIRARA.URL_SEARCH,
                    {
                        "rarity": rarities.filter(x => x.key !== 'ur').map(x => x.value),// include only UR
                        'member': members[Math.floor(Math.random() * members.length)].value
                    })

                if (response.status === 200) {
                    const { data: { result } } = response
                    const id_card = result[Math.floor(Math.random() * result.length)]
                    if (id_card != null) {
                        const img_transparent = KIRARA.TRANSPARENT_IMG_CARD.replace('{0}', id_card)
                        const img_transparent_idz = KIRARA.TRANSPARENT_IMG_CARD_IDZ.replace('{0}', id_card)

                        console.log({ img_transparent, img_transparent_idz })
                        let images = (await Promise.all(
                            [
                                isImage(img_transparent),
                                isImage(img_transparent_idz)
                            ])
                        ).filter(x => x != null)

                        const rndImage = images[
                            Math.floor(
                                Math.random() * images.length
                            )
                        ]

                        console.log('Found image 🖋️: -> ' + rndImage)
                    }
                }

                recursive = false
            }

            recursive = true
        } catch (error) {
            console.log('❌ ' + (error.message || error) + '\n')
            console.log(`Retry ${duration} times.... ⚠️`)
            recursive = true
        }
    }

    return !recursive
}

kirara()

const isImage = async (url) => {
    try {
        const response = await axios.get(url)
        if (response.status === 200) {
            if (((response.headers['content-type']).match(/(image)+\//g)).length != 0) {
                return url
            }
        }

        return null
    } catch (error) {
        return null
    }
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
module.exports = { schoolido, kirara }