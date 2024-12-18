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

const getDummyJson = async () => {
    try {
        const response = await axios.get(QUOTES.DUMMY_JSON_URL);
        if (response.status !== 200) {
            console.log('❌ Oh, [quotable] has been failed! -> ' + response.status)
            return false
        }

        const { quote, author } = response.data; // The API returns an object with the quote

        // You can either return the whole object or just the quote and author
        // return quote; // Returns the entire object { id, quote, author }

        const result = {
            content: quote,
            author: author
        };

        console.log('Get quotes success!! ✅✅ ' + JSON.stringify(result))
        await saveQuotesToREADME(result)

        return true
    } catch (error) {
        console.error("Error fetching quote:", error);
        return null; // Or handle the error in another way, e.g., return a default quote
    }
}

getDummyJson()

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