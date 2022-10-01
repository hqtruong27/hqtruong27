const bandori = require('./src/bandori')
const { kirara } = require('./src/sif')

const arr = ['bandori' /*,'kirara', 'schoolido'-->*/] // run only bandori
const main = async () => {
    let success = false
    while (!success) {
        console.log('What to choose this time ❓❓❓ 🤔🤔🤔')
        console.log('------------------------------------------------\n')
        const random = Math.floor(Math.random() * arr.length)
        arr.splice(random, 1)
        console.log(`Remaining: ${JSON.stringify(arr)} \n`)
        switch (random) {
            case 0:
                console.log('Oh, bandori has been chosen!')
                success = await bandori()
                if (!success) console.log('❌ Oh, bandori has been failed!\n')
                break
            case 1:
                console.log('Oh, love live from [kirara] has been chosen!\n')
                success = await kirara()
                if (!success) console.log('❌ Oh, [kirara] has been failed! \n')
                break
            case 2:
                console.log('Oh, lovelive from [schoolido] has been chosen!\n')
                success = await schoolido()
                if (!success) console.log(' ❌ Oh, [lovelive] has been failed!\n')
                break
            default:
                console.log('No, let check the code!! ⚠️⚠️⚠️')
                success = true
                break
        }
    }
}

main()