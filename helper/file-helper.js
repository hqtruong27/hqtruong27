const fs = require('fs')
const path = require('path')

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
    }
}

module.exports = fileHelper