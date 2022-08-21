const { kirara, schoolido } = require('../sif')

test('schoolido', async () => {
    (await expect(async () => await schoolido())).toBeTruthy()
})

test('kirara', async () => {
    (await expect(async () => await kirara())).toBeTruthy()
})