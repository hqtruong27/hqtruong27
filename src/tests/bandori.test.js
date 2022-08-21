const bandori = require('../bandori')

test('bandori', async () => {
    (await expect(async () => await bandori())).toBeTruthy()
})
