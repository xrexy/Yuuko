const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    pagination = require("@acegoal07/discordjs-pagination"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");

module.exports = new Command({
    name: "manga",
    usage: "manga <title>",
    description: "Gets a manga from anilist based on a search result.",
    type: CommandCategories.Anilist,

    async run(message, args, run, hook = false, title = null) {
        let vars = { query: !hook ? args.slice(1).join(" ") : title };

        //^ Make the HTTP Api request
        GraphQLRequest(GraphQLQueries.Manga, vars)
            .then((response, headers) => {
                let data = response.Media;
                if (data) {
                    // Fix the description by replacing and converting HTML tags
                    const descLength = 350;
                    let description =
                        data.description
                            ?.replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ") /*.replace(/\n\n/g, "\n")*/ || "No description available.";
                    const firstPage = new Discord.MessageEmbed()
                        .setThumbnail(data.coverImage.large)
                        .setTitle(data.title.english || data.title.romaji || data.title.native)
                        .addFields(
                            {
                                name: "Chapters",
                                value: data.chapters ? data.chapters.toString() : "N/A",
                                inline: true,
                            },
                            {
                                name: "Format",
                                value: data.format || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Mean Score",
                                value: data.meanScore.toString() + "%" || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Start Date",
                                value: data.startDate.day ? `${data.startDate.day}-${data.startDate.month}-${data.startDate.year}` : "Unknown",
                                inline: true,
                            },
                            {
                                name: "End Date",
                                value: data.endDate.day ? `${data.endDate.day}/${data.endDate.month}/${data.endDate.year}` : "Unknown",
                                inline: true,
                            },
                            {
                                name: "\u200B",
                                value: "\u200B",
                                inline: true,
                            },
                            {
                                name: "Genres",
                                value: "``" + `${data.genres.join(", ") || "N/A"}` + "``",
                                inline: true,
                            }
                        )
                        .setDescription(description.length > descLength ? description.substring(0, descLength) + "..." || "No description available." : description || "No description available.")
                        .setURL("https://anilist.co/manga/" + data.id)
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));

                    const secondPage = new Discord.MessageEmbed()
                        .setAuthor(`${data.title.english} | Additional info`)
                        .setThumbnail(data.coverImage.large)
                        .addFields(
                            {
                                name: "Source",
                                value: data.source || "Unknown",
                                inline: true,
                            },
                            {
                                name: "\u200B",
                                value: "\u200B",
                                inline: true,
                            },
                            {
                                name: "\u200B",
                                value: "\u200B",
                                inline: true,
                            },
                            {
                                name: "Synonyms",
                                value: "``" + `${data.synonyms.join(", ") || "N/A"}` + "``",
                                inline: true,
                            }
                        )
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));

                    const buttonList = [
                        new Discord.MessageButton().setCustomId("firstbtn").setLabel("First page").setStyle("DANGER"),
                        new Discord.MessageButton().setCustomId("previousbtn").setLabel("Previous").setStyle("SUCCESS"),
                        new Discord.MessageButton().setCustomId("nextbtn").setLabel("Next").setStyle("SUCCESS"),
                        new Discord.MessageButton().setCustomId("lastbtn").setLabel("Last Page").setStyle("DANGER"),
                    ];
                    const pageList = [firstPage, secondPage];

                    pagination({
                        message,
                        pageList,
                        buttonList,
                        autoButton: true,
                        autoDelButton: true,
                        timeout: 20000,
                        replyMessage: true,
                        autoDelete: false,
                        authorIndependent: true,
                    });
                } else {
                    return message.channel.send({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.log(error);
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
