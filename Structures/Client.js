const Discord = require("discord.js");
const fs = require("fs");
const path = require('path');
const Command = require("./Command.js");
const Event = require("./Event.js");
const { SlashCommandBuilder, GatewayIntentBits } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
class Client extends Discord.Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
            ],
            allowedMentions: { repliedUser: false }
        });

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
        this.components = new Discord.Collection();

        this.prefix = process.env.PREFIX || "as!";
    }
    start(token) {
        console.log(`Starting Yuuko in ${process.env.NODE_ENV} enviroment.`);
        const slashCommands = [];
        fs.readdirSync("./Commands")
            .filter((file) => file.endsWith(".js"))
            .forEach((file) => {
                /**
                 * @type {Command}
                 * Legacy commands with prefix
                 */
                const command = require(`#Commands/${file}`);
                console.log(`Command ${command.name} loaded`);
                this.commands.set(command.name, command);

                if (command.slash) {
                    slashCommands.push(command.slash);
                }
            });

        fs.readdirSync("./Components")
            .filter((file) => file.endsWith(".js"))
            .forEach((file) => {
                const comp = require(`#Components/${file}`);
                console.log(`Component ${comp.name} loaded`);
                this.components.set(comp.name, comp);
            });

        //^ Register Slash Commands
        (async () => {
            const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

            const clientId = process.env.CLIENT_ID || "867010131745177621";
            const guildId = process.env.GUILD_ID || "843208877326860299";

            try {
                console.log(`Started refreshing ${slashCommands.length} slash (/) commands.`);

                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });

                if (process.env.NODE_ENV == "production") {
                    await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
                }

                console.log(`Refreshed ${slashCommands.length} slash (/) commands.`);
            } catch (error) {
                console.error(error);
            }

            fs.readdirSync("./Events")
                .filter((file) => file.endsWith(".js"))
                .forEach((file) => {
                    /**
                     * @type {Event}
                     */
                    const event = require(`../Events/${file}`);
                    console.log(`Event ${event.event} loaded`);
                    this.on(event.event, event.run.bind(null, this));
                });

            if (!fs.existsSync(path.join(__dirname, "../Logging"))) {
                fs.mkdirSync(path.join(__dirname, "../Logging"));
            }
            process.env.UPTIME = Date.now();
            this.login(process.env.TOKEN);
        })();
    }
}

module.exports = Client;
