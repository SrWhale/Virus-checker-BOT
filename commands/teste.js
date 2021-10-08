const { get } = require("axios");

const VirusTotal = new (require('../VirusTotal.js'));

module.exports = async (client, message, args) => {
    const url = message.attachments.first()
        ? {
            type: 'file',
            url: message.attachments.first().url
        }
        : {
            type: 'website',
            url: args[0]
        };

    if (url.type === 'website') {

        const checkURL = await get(url.url).then(res => res.status === 200).catch(console.log);

        if (!checkURL) return message.reply({
            content: 'Este website está offline, não posso checkar se há algo malicioso nele.'
        });

        const msg = await message.reply({
            content: 'Analisando website...',
            fetchReply: true
        });

        const result = await VirusTotal.checkWebsite(url.url);

        setTimeout(async () => {
            const virusResult = await VirusTotal.checkResult(url.url, 'url');

            msg.edit({
                content: `Foram encontradas \`${virusResult.positives}\` coisas suspeitas neste site.` + `\n\nVeja abaixo o resultado completo da análise: ${virusResult.permalink}`
            });

            client.database.ref(`AntiVírus/${url.url}`).set(virusResult.scans);
        }, 10000)
    };

    if (url.type === 'file') {
        const name = message.attachments.first().name;

        const buffer = await VirusTotal.downloadFile(message.attachments.first().url);

        const msg = await message.reply({
            content: 'Analisando arquivo...',
            fetchReply: true
        });

        const result = await VirusTotal.checkFile(name, buffer);

        setTimeout(async () => {
            const virusResult = await VirusTotal.checkResult(result.resource, 'file');

            msg.edit({
                content: `Foram encontradas \`${virusResult.positives}\` coisas suspeitas neste arquivo.` + `\n\nVeja abaixo o resultado completo da análise: ${virusResult.permalink}`
            });

            client.database.ref(`AntiVírus/${result.resource}`).set(virusResult.scans);
        }, 10000)
    }
}