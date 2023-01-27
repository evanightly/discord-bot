const dotenv = require('dotenv')
const express = require('express')

const app = express()


dotenv.config()

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(`${process.env['TOKEN']}`);

app.get('/', (_, res) => {
    res.send('Running')
})

app.listen(8899, () => {
    console.log('Bot running')
})