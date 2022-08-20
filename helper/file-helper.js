
const fs = require('fs')
const path = require('path')
const axios = require('axios')

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////All the function at here are being auto generate by github copilot///////////////
///////////////////////////////////////////////////////////////////////////////////////////////
//check has any file in directory
const fileHelper = {
    hasAnyFile: (dir) => {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(files.length > 0)
                }
            })
        })
    },

    //remove all file in directory
    removeAllFile: (dir) => {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    reject(err)
                } else {
                    files.forEach(file => {
                        fs.unlink(path.join(dir, file), err => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve()
                            }
                        })
                    })
                }
            })
        })
    },

    //down load file from url
    downloadFile: (url, dir, fileName) => {
        return new Promise(async (resolve, reject) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
                console.log('created folder')
            }

            const file = fs.createWriteStream(`${dir}/${fileName}`)
            const request = await axios({
                url: url,
                method: 'GET',
                responseType: 'stream'
            })
            request.data.pipe(file)
            file.on('finish', () => {
                file.close(resolve)
            }).on('error', (err) => {
                fs.unlink(file.path, () => {
                    reject(err)
                })
            })
        })
    }
}

module.exports = fileHelper