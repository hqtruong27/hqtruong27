const _file = require('../helper/file-helper')
const defaultFileName = 'cover_photo.png'

const saveImage = async (url, path) => {
    const oldFileName = (await _file.readAsJson('./temp', 'temp.json')).fileName || defaultFileName
    if (_file.exists(path + '/' + oldFileName)) {
        _file.remove(path, oldFileName)
        console.log('Remove old file image success!! ✅' + '\n')
    }

    const fileName = Date.now().toString() + '_' + defaultFileName
    await _file.downloadAndSaveImage(url, path, fileName)
    console.log('Download file image success!! ✅' + '\n')

    //Why? This to clear the cache image on github
    await BASE.replaceTextREADME(oldFileName, fileName)
}

const BASE = {
    replaceTextREADME: async (oldText, newText) => {
        console.log('------------------------------------------------')

        await Promise.all([
            _file.replaceText('./', 'README.md', oldText, newText),
            _file.replaceText('./temp', 'temp.json', oldText, newText)
        ])

        console.log('Change text success!! ✅✅ ' + oldText + ' -> ' + newText)
        console.log('------------------------------------------------')
    },

    //get random number with seed
    getRandomInt: (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    },

    delay: async (time) => {
        return new Promise((resolve) => setTimeout(resolve, time))
    },

    autoScroll: async (page) => {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    },
    scrollToBottom: async (page, duration) => {
        let d = 0
        while (await page.evaluate(() => document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight)) {
            await page.evaluate(() => { document.scrollingElement.scrollTo(0, document.body.scrollHeight) })
            await BASE.delay(50)
            if (duration) {
                d++
                if (d >= duration) break
            }
        }
    }
}

module.exports = { saveImage, _base: BASE }