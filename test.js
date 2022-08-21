const _file = require('./helper/file-helper')

const readFile = async () => {
    let readmeText = await _file.read('./', 'README.md')

    const tempJson = await _file.readAsJson('./temp', 'temp.json')
    let oldFileName = tempJson.fileName
    console.log(oldFileName)

    if (readmeText.includes(oldFileName)) {
        console.log('found')

        //new fileName
        tempJson.fileName = Date.now().toString() + '.png'
        readmeText = readmeText.replace(oldFileName, tempJson.fileName)

        await _file.writeTo('./', 'README.md', readmeText)

        console.log(tempJson)
        await _file.writeTo('./temp', 'temp.json', JSON.stringify(tempJson))
    }
}

readFile()
