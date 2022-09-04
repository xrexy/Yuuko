const Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    Command = require("#Structures/Command.ts"),
    EmbedError = require("#Utils/EmbedError.ts"),
    Footer = require("#Utils/Footer.ts"),
    BuildPagination = require("#Utils/BuildPagination.ts"),
    CommandCategories = require("#Utils/CommandCategories.ts"),
    GraphQLRequest = require("#Utils/GraphQLRequest.ts"),
    GraphQLQueries = require("#Utils/GraphQLQueries.ts");

const name = "manga";
const usage = "manga <title>";
const description = "Gets an manga from anilist based on a search result.";

module.exports = new Command({
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

    async run(interaction, args, run, hook = false, hookdata = null) {
        let manga = interaction.options.getString('query');
        let vars = {};
        //^ Hook data is passed in if this command is called from another command
        if (!hook) {
            if (manga.length < 3) {
                return interaction.reply({ embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null, false)] });
            }
            vars.query = manga;
        } else if (hook && hookdata?.title) vars.query = hookdata.title;
        else if (hook && hookdata?.id) vars.query = hookdata.id;
        else return interaction.reply({ embeds: [EmbedError(`MangaCmd was hooked, yet there was no title or ID provided in hookdata.`, null, false)] });

        if (hookdata && hookdata.id) {
            GraphQLQueries.Anime = GraphQLQueries.Anime.replace("$query: String", "$query: Int");
            GraphQLQueries.Anime = GraphQLQueries.Anime.replace("search:", "id:");
        }
        //^ Make the HTTP Api request
        GraphQLRequest(GraphQLQueries.Manga, vars)
            .then((response, headers) => {
                let data = response.Media;
                if (data) {
                    //^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
                    const descLength = 350;
                    let description =
                        data?.description
                            ?.replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ")
                            .replace(/\n\n/g, "\n") || "No description available.";
                    const firstPage = new EmbedBuilder()
                        .setImage(data.bannerImage)
                        .setThumbnail(data.coverImage.large)
                        .setTitle(data.title.english || data.title.romaji || data.title.native)
                        .addFields(
                            {
                                name: "Chapters",
                                value: data?.chapters?.toString() || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Format",
                                value: data.format || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Mean Score",
                                value: data?.meanScore?.toString() == "undefined" ? data?.meanScore?.toString() : "Unknown",
                                inline: true,
                            },
                            {
                                name: "Start Date",
                                value: data.startDate.day ? `${data.startDate.day}-${data.startDate.month}-${data.startDate.year}` : "Unknown",
                                inline: true,
                            },
                            {
                                name: "End Date",
                                value: data.endDate.day ? `${data.endDate.day}-${data.endDate.month}-${data.endDate.year}` : "Unknown",
                                inline: true,
                            },
                            {
                                name: '\u200B',
                                value: '\u200B',
                                inline: true,
                            },
                            {
                                name: "Genres",
                                value: "``" + `${data.genres.join(", ") || "N/A"}` + "``",
                                inline: true,
                            }
                        )
                        .setDescription(description.length > descLength ? description.substring(0, descLength) + "..." || "No description available." : description || "No description available.")
                        .setURL("https://anilist.co/anime/" + data.id)
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));

                    const secondPage = new EmbedBuilder()
                        .setAuthor({ name: `${data.title.english} | Additional info` })
                        .setThumbnail(data.coverImage.large)
                        .addFields(
                            {
                                name: "Source",
                                value: data.source || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Episode Duration",
                                value: data?.duration?.toString() || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Media ID",
                                value: data?.id?.toString() || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Synonyms",
                                value: "``" + `${data.synonyms.join(", ") || "N/A"}` + "``",
                                inline: false,
                            }
                        )
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));

                    if (hookdata?.image) {
                        firstPage.setImage(hookdata.image);
                    }

                    if (hookdata?.fields) {
                        for (const field of hookdata.fields) {
                            firstPage.addFields({ name: field.name, value: field.value, inline: field.inline || false });
                        }
                    }

                    const pageList = [firstPage, secondPage];
                    BuildPagination(interaction, pageList).paginate();
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
