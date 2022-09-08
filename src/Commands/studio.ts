const Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    Command = require("#Structures/Command.ts"),
    EmbedError = require("#Utils/EmbedError.ts"),
    Footer = require("#Utils/Footer.ts"),
    CommandCategories = require("#Utils/CommandCategories.ts"),
    GraphQLRequest = require("#Utils/GraphQLRequest.ts"),
    GraphQLQueries = require("#Utils/GraphQLQueries.ts");

const name = "studio";
const usage = "studio <?>";
const description = "Searches for an studio and displays a list of their anime";

export default new Command({
    name,
    usage,
    description,
    type: CommandCategories.Anilist,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The query to search for')
                .setRequired(true)),

    async run(interaction, args, run) {
        let vars: { [key: string]: any; } = { query: interaction.options.getString('query') };

        GraphQLRequest(GraphQLQueries.Studio, vars)
            .then((response, headers) => {
                let data = response.Studio;
                console.log(data);
                if (data) {
                    let animes: string | Array<string> = [];
                    for (let anime of data.media.nodes) {
                        animes = animes.concat(`[${anime.title.romaji || anime.title.english}]` + `(https://anilist.co/anime/${anime.id})`);
                    }
                    animes = animes.toString().replace(/:/g, "\n");

                    const studioEmbed = new EmbedBuilder()
                        // .setThumbnail(data.image.large)
                        .setTitle(`${data.name} | ${data.favourites} favourites`)
                        .setDescription(`\n${animes}`)
                        .setURL(data.siteUrl)
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));

                    //data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
                    interaction.reply({ embeds: [studioEmbed] });
                } else {
                    return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.log(error);
                interaction.reply({ embeds: [EmbedError(error, vars)] });
            });
    },
});
