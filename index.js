const { Client } = require('discord.js');

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS',
        'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS',
        'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'],
    restTimeOffset: 0
});

const firebase = require('firebase');

firebase.initializeApp({
    apiKey: process.env.FIREBASE_API,
    authDomain: process.env.FIREBASE_DOMAIN,
    databaseURL: process.env.FIREBASE_URL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGE,
    messagingSenderId: process.env.FIREBASE_SENDER,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASURE
});

client.database = firebase.database();


client.login(process.env.TOKEN);

client.on('ready', async () => console.log('BOT ONLINE'));

client.on('messageCreate', async (message) => {
    if (message.channel.type == 'dm') return;
    if (message.author.bot) return;

    if (!message.content.startsWith('%')) return;

    const args = message.content.split(/\s+/g);

    const command = args.shift().replace('%', '').toLowerCase();

    try {
        const cmd = require(`./commands/${command}.js`);

        if (cmd) cmd(client, message, args);

    } catch (err) {
        console.log(err)
        return message.reply({
            content: 'Comand não encontrado.'
        })
    }
})