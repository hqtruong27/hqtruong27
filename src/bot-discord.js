const axios = require('axios'),
    { QUOTES } = require('../constants/constants'),
    { Routes, REST, Client, GatewayIntentBits } = require('discord.js'),
    client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent
        ]
    })

require('dotenv').config()
require('./../helper/discord-helper')

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'quotes',
        description: 'Replied a quotes from api',
    },
    {
        name: 'quotes-anime',
        description: 'Replied a quotes from api',
    },
    {
        name: 'q-a',
        description: 'Replied a quotes from api',
    },
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN_DISCORD);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.')

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
})()

client.once('ready', async () => {
    console.log('Ready! 🌸🌸🌸')
    await SendRandomQuotes()
    client.destroy()
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const { commandName } = interaction
    switch (commandName) {
        case 'ping':
            await interaction.channel.reply('Pong!')
            break
        case 'quotes':
            //await interaction.reply('Replied a quotes from api')
            break
        case 'q-a':
            await buildQuotesAnime(interaction.channel)
            break
        case 'quotes-anime':
            await buildQuotesAnime(interaction.channel)
            break
        default:
            break
    }
})

client.on('messageCreate', async (message) => {
    let { content, command = content.substring(1) } = message
    if (!content.startsWith('!')) return

    switch (command) {
        case 'quotes':
            const { content, author } = await getRandomQuotes()
            if (content && author) {
                message.channel.send(content.textItalic() + ' - ' + author.textBold().textItalic())
            }
            break
        case 'quotes-anime':
            await buildQuotesAnime(message.channel)
            break
        case 'q-a':
            await buildQuotesAnime(message.channel)
            break
        default:
            break
    }
})

client.login(process.env.TOKEN_DISCORD)

const SendRandomQuotes = async () => {
    const arr = ['quotes', 'quotes-anime']
    let success = false
    while (!success) {
        const random = Math.floor(Math.random() * arr.length)
        const randomText = arr[random]
        console.log(random)
        arr.splice(random, 1)
        console.log(`Remaining: ${JSON.stringify(arr)} \n`)
        const channel = client.channels.cache.find(x => x.name === 'chung')
        if (channel) {
            switch (randomText) {
                case 'quotes':
                    success = await buildQuotes(channel)
                    break
                case 'quotes-anime':
                    success = await buildQuotesAnime(channel)
                default:
                    success = true
                    break
            }
        }
    }
}

const getRandomQuotes = async () => {
    try {
        const response = await axios.get(QUOTES.QUOTABLE_URL + '/random')
        if (response.status !== 200) {
            console.log('❌ [quotable] has been failed! -> ' + response.status)
            return { quotes: undefined, author: undefined }
        }

        const { data } = response
        return data

    } catch (error) {
        console.error(error)
        return { quotes: undefined, author: undefined }
    }
}

const getRandomAnimeQuotes = async () => {
    try {
        const response = await axios.get(QUOTES.ANIME_CHAN_URL + '/random')
        if (response.status !== 200) {
            console.log('❌ [anime quotes] has been failed! -> ' + response.status)
            return null
        }

        const { data } = response
        return data
    } catch (error) {
        console.error(error)
        return null
    }
}

const buildQuotesAnime = async (channel) => {
    const { quote, anime, character } = await getRandomAnimeQuotes()
    if (quote && (anime || character)) {
        channel.send(quote.textItalic() + ' - ' + character.textBold().textItalic()
            + '\n\n --' + anime.textItalic())
        return true
    }

    return false
}

const buildQuotes = async (channel) => {
    const { content, author } = await getRandomQuotes()
    if (!content || !author) return false

    channel.send(content.textItalic() + ' - ' + author.textBold().textItalic())
    return true
}