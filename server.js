const bandori = require('./src/bandori')
const lovelive = require('./src/lovelive')

const arr = ['bandori', 'lovelive']
const main = async () => {
    let success = false
    while (!success) {
        //What to choose this time?
        console.log('What to choose this time ❓❓❓ 🤔🤔🤔')
        console.log('------------------------------------------------')
        const random = Math.floor(Math.random() * 0)
        arr.splice(random, 1)
        console.log(`Remaining: ${JSON.stringify(arr)} \n`)
        switch (random) {
            case 0:
                console.log('Oh, bandori has been chosen!')
                success = await bandori()
                if (!success) console.log('Oh, bandori has been failed!')
                break
            case 1:
                console.log('Oh, lovelive has been chosen!')
                success = await lovelive()
                if (!success) console.log('Oh, lovelive has been failed!')
                break
            default:
                console.log('No, let check the code!! ⚠️⚠️⚠️')
                success = true
                break
        }
    }
}

main()