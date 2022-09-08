import * as Discord from "discord.js";
import { SlashCommandBuilder, GatewayIntentBits } from "discord.js";
import fs = require("fs");
import { Command } from "./Command";
import { Collection } from "discord.js";
import { Event } from './Event';
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export class Client extends Discord.Client {
    commands: any;
    prefix: string;
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

        this.commands = new Discord.Collection();

        this.prefix = process.env.PREFIX || "as!";
    }
    start(token?) {
        console.log(`Starting Yuuko in ${process.env.NODE_ENV} enviroment.`);
        const slashCommands = [];
        fs.readdirSync("./src/Commands/")
            .filter((file) => file.endsWith(".ts"))
            .forEach((file) => {
                const command: Command = require(`#Commands/${file}`);
                console.log(`Command ${command.name} loaded`);
                this.commands.set(command.name, command);

                if (command.slash) {
                    slashCommands.push(command.slash);
                }
            });

        //^ Register Slash Commands
        (async () => {
            const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

            const clientId: string = process.env.CLIENT_ID.toString() || '881173250091126845';
            const guildId: string = process.env.GUILD_ID.toString() || '843208877326860299';

            try {
                console.log(`Started refreshing ${slashCommands.length} slash (/) commands.`);

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: slashCommands },
                );

                if (process.env.NODE_ENV == "production") {
                    await rest.put(
                        Routes.applicationCommands(clientId),
                        { body: slashCommands },
                    );
                }

                console.log(`Refreshed ${slashCommands.length} slash (/) commands.`);
            } catch (error) {
                console.error(error);
            }

            fs.readdirSync("./src/Events")
                .filter((file) => file.endsWith(".js"))
                .forEach((file) => {
                    const event = require(`../Events/${file}`);
                    console.log(`Event ${event.event} loaded`);
                    this.on(event.event, event.run.bind(null, this));
                });

            this.login(process.env.TOKEN);
        })();
    }
}
