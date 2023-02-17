const dotenv = require('dotenv')
const express = require('express')
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const deployCommand = require('./func/deployCommand');

const app = express()

dotenv.config()

const { TOKEN } = process.env
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

client.once(Events.ClientReady, botClient => {
    console.log(`Ready! Logged in as ${botClient.user.tag}`);
});

client.login(TOKEN)

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        return console.error(`No command matching ${interaction.commandName} was found.`);
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('warn', console.log)

app.get('/', (_, res) => {
    // Log in to Discord with your client's token
    client.login(TOKEN);
    res.send('Running')
})

app.get('/deployCommand', (_, res) => {
    deployCommand().then(() => {
        console.log('Command deployed')
        res.send('Command deployed')
    }).catch(e => console.log(e))
})

app.listen(8899, () => {
    console.log('Bot running')
})