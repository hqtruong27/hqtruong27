const bandori = require('./src/bandori')
const { schoolido, kirara } = require('./src/sif')

const arr = ['bandori', 'kirara', 'schoolido']
const main = async () => {
    let success = false
    while (!success) {
        //What to choose this time?
        console.log('What to choose this time ❓❓❓ 🤔🤔🤔')
        console.log('------------------------------------------------')
        const random = Math.floor(Math.random() * arr.length)
        arr.splice(random, 1)
        console.log(`Remaining: ${JSON.stringify(arr)} \n`)
        switch (random) {
            case 0:
                console.log('Oh, bandori has been chosen!')
                success = await bandori()
                if (!success) console.log('Oh, bandori has been failed!')
                break
            case 1:
                console.log('Oh, love live from [kirara] has been chosen!')
                success = await kirara()
                if (!success) console.log('Oh, [kirara] has been failed!')
                break
            case 2:
                console.log('Oh, lovelive from [schoolido] has been chosen!')
                success = await schoolido()
                if (!success) console.log('Oh, [lovelive] has been failed!')
                break
            default:
                console.log('No, let check the code!! ⚠️⚠️⚠️')
                success = true
                break
        }
    }
}

main()