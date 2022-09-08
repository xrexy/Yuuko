const Command = require("#Structures/Command.ts"),
    CommandCategories = require("#Utils/CommandCategories.ts"),
    { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const name = "stats";
const description = "Shows you the statistics of the server & bot.";

export default new Command({
    name,
    description,
    type: CommandCategories.Misc,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),

    async run(interaction, args, client) {
        const embed = new EmbedBuilder()
            .setTitle("Here are the stats!")
            .setColor("Blurple")
            .addFields(
                { name: "Server Stats", value: `${interaction.guild.memberCount.toString()} members` },
                { name: "Bot Stats", value: `${client.guilds.cache.size.toString()} servers \n ${getMemberCount(client).toString()} members` },
            )
        interaction.reply({ embeds: [embed] });

        function getMemberCount(client) {
            let memberCount = 0;
            client.guilds.cache.forEach(guild => {
                memberCount = memberCount + guild.memberCount;
            });
            return memberCount;
        }
    },
});
