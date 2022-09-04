const Command = require("#Structures/Command.ts"),
    CommandCategories = require("#Utils/CommandCategories.ts"),
    Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    Footer = require("#Utils/Footer.ts"),
    path = require('path'),
    fs = require('fs');

const name = "logs";
const description = "Allows you to see the 25 moost recent logs of the bot. (Trusted users only)";

module.exports = new Command({
    name,
    description,
    type: CommandCategories.Misc,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),

    async run(interaction, args, run) {

        if (JSON.parse(process.env.TRUSTED_USERS).includes(interaction.user.id)/* && process.env.NODE_ENV === "production"*/) {
            if (!fs.existsSync(path.join(__dirname, "../Logging", "logs.txt"))) {
                return interaction.reply(`\`There are no logs to view.\``);
            }
            const logs = fs.readFileSync(path.join(__dirname, "../Logging", "logs.txt"), "utf8").split("\n").reverse().slice(0, 25).reverse().join("\n");
            return interaction.reply({
                embeds: [{
                    title: `Here are the 25 most recent logs.`,
                    description: `\`\`\`js\n${logs}\`\`\``,
                    color: 0x00ff00,
                    footer: Footer(),
                }]
            });
        }
    }
});