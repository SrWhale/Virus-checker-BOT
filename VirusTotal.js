const virusTotalAPI = process.env.VIRUS_API;

const { get } = require('axios');

const { post } = require('needle')

module.exports = class virusTotal {
    constructor(client) {
        this.client = client;

        this.default_data = {
            compressed: true, 
            follow_max: 5, 
            rejectUnauthorized: true, 
            multipart: true,
            timeout: 2 * 60 * 1000,
            user_agent: 'virustotal-api'
        }
    }

    async checkFile(fileName, fileBuffer) {

        return new Promise(res => {
            post('https://www.virustotal.com/vtapi/v2/file/scan', {
                apikey: virusTotalAPI,
                file: {
                    filename: fileName,
                    buffer: fileBuffer
                }
            }, this.default_data, (err, result, body) => {
                return res(body);
            })
        })
    }

    async checkWebsite(url) {
        return new Promise(res => {
            post('https://www.virustotal.com/vtapi/v2/url/report', {
                apikey: virusTotalAPI,
                url
            }, this.default_data, (err, result, body) => {
                return res(body);
            })
        })
    }

    async checkResult(resource, type) {
        return new Promise(res => {
            console.log(`https://www.virustotal.com/vtapi/v2/${type}/report`)
            console.log(resource)
            post(`https://www.virustotal.com/vtapi/v2/${type}/report`, {
                apikey: virusTotalAPI,
                resource
            }, this.default_data, (err, result, body) => {

                return res(body);
            })
        })
    }

    async downloadFile(url) {
        return await get(url, {
            responseType: 'arraybuffer'
        }).then(res => res.data)
    }
}
