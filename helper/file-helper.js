
const fs = require('fs')
const path = require('path')
const axios = require('axios')

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////All the function at here are being auto generate by github copilot///////////////
///////////////////////////////////////////////////////////////////////////////////////////////
//check has any file in directory
const file = {
    exists: (path) => {
        return fs.existsSync(path)
    },

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
                    files?.filter(name => name != '.gitkeep').forEach(file => {
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
    download: (url, dir, fileName) => {
        //create folder if not exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }

        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                responseType: 'stream'
            }).then((response) => {
                response.data.pipe(fs.createWriteStream(path.join(dir, fileName)))
                let error = null
                response.data.on('error', err => {
                    error = err
                    reject(error)
                })
                response.data.on('end', () => {
                    if (!error) {
                        resolve(true)
                    }
                })
            })
        })
    },
    //remove file in directory
    remove: (dir, fileName) => {
        return new Promise((resolve, reject) => {
            fs.unlink(path.join(dir, fileName), err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    },
    writeTo: (dir, fileName, data) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(dir, fileName), data, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    },
    //read file
    read: (dir, fileName) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(dir, fileName), 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },
    //read file and parse to json
    readAsJson: (dir, fileName) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(dir, fileName), 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(data))
                }
            })
        })
    },
    //replace text in file
    replaceText: (dir, fileName, text, newText) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(dir, fileName), 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    if (data.includes(text)) {
                        fs.writeFile(path.join(dir, fileName), data.replace(text, newText), (err) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve()
                            }
                        })
                    } else {
                        resolve()
                    }
                }
            })
        })
    },
    isImage: async (url) => {
        try {
            const response = await axios.get(url)
            if (response.status === 200) {
                if (((response.headers['content-type']).match(/(image)+\//g)).length != 0) {
                    return url
                }
            }

            return null
        } catch {
            return null
        }
    }
}

module.exports = file