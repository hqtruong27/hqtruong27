const axios = require('axios')
const _file = require('../helper/file-helper')
const { QUOTES } = require('../constants/constants')

const quotable = async () => {
    const quotes = await axios.get(QUOTES.QUOTABLE_URL + '/random')
    if (quotes.status !== 200) {
        console.log('❌ Oh, [quotable] has been failed! -> ' + quotes.status)
        return false
    }

    const { data:
        {
            content,
            author
        }
    } = quotes

    const result = {
        content,
        author
    }

    console.log('Get quotes success!! ✅✅ ' + JSON.stringify(result))
    await saveQuotesToREADME(result)
    return true
}
quotable()

const saveQuotesToREADME = async (quotes) => {
    const oldQuotes = (await _file.readAsJson('./temp', 'quotes.temp.json'))
    console.log('------------------------------------------------')

    quotes.author = `${quotes.author} ㅤㅤㅤㅤㅤ` //Avoid duplicate text
    quotes.content = quotes.content
    const { content, author } = oldQuotes

    await _file.replaceText('./', 'README.md', author, quotes.author)
    await Promise.all([
        _file.replaceText('./', 'README.md', content, quotes.content),
        _file.writeTo('./temp', 'quotes.temp.json', JSON.stringify(quotes))
    ])

    console.log('Change quotes success!! ✅✅ ' + JSON.stringify(oldQuotes) +
        ' -> ' + JSON.stringify(quotes))
    console.log('------------------------------------------------')
}