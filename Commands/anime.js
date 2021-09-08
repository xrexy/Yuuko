const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js"),
    CommandCategories = require("../Utils/CommandCategories"),
    {pagination} = require('reconlx')

module.exports = new Command({
    name: "anime",
    usage: "anime <title>",
    description: "Gets an anime from anilist based on a search result.",
    type: CommandCategories.Anilist,

    async run(message, args, run, hook = false, hookdata = null) {
        let query = `query ($query: String) { # Define which variables will be used in the query (id)
                Media (search: $query, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
                    id
                    description
                    coverImage {
                        large
                        medium
                    }
                    title {
                        romaji
                        english
                        native
                    }
                    format
                    source
                    genres
                    duration
                    synonyms
                    episodes
                    meanScore
                    startDate {
                        year
                        month
                        day
                    }
                    endDate {
                        year
                        month
                        day
                    }
                    bannerImage
                }
            }`;

        let vars = { };
        //*DEBUG: console.log(`Hook: ${hook}\nHookData:`, hookdata)

        if (!hook) {
            if (args.slice(1).join(" ").length < 3) {
                return message.channel.send({embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null, false)]});
            }
            vars.query = args.slice(1).join(" ");
        } else if (hook && hookdata?.title) {
            vars.query = hookdata.title;
        } else if (hook && hookdata?.id) {
            vars.query = hookdata.id;
        } else {
            return message.channel.send({embeds: [EmbedError(`AnimeCmd was hooked, yet there was no title or ID provided in hookdata.`, null, false)]});
        }

        if (hookdata?.id) {
            query = query.replace("$query: String", "$query: Int");
            query = query.replace("search:", "id:");
        }

        let url = "https://graphql.anilist.co";

        //^ Make the HTTP Api request
        axios
            .post(url, { query: query, variables: vars })
            .then((response) => {
                //console.log(response.data.data.Media);
                let data = response.data.data.Media;
                if (data) {
                    //^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
                    const descLength = 350;
                    let description =
                        data.description
                            .replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ")
                            .replace(/\n\n/g, "\n") || "No description available.";
                            
                    const firstPage = new Discord.MessageEmbed()
                        .setImage(data.bannerImage)
                        .setThumbnail(data.coverImage.large)
                        .setTitle(data.title.english || data.title.romaji || data.title.native)
                        .addFields(
                            {
                                name: "Episodes",
                                value: `${data.episodes}`,
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
                                value: `${data.startDate.day}-${data.startDate.month}-${data.startDate.year}`,
                                inline: true,
                            },
                            {
                                name: "End Date", 
                                value: `${data.endDate.day}-${data.endDate.month}-${data.endDate.year}`,
                                inline: true,
                            },
                            {
                                name: '\u200B', 
                                value: '\u200B',
                                inline: true,
                            },
                            {
                                name: 'Genres', 
                                value: '``' +`${data.genres.join(", ") || "N/A"}` + '``',
                                inline: true,
                            },
                        )
                        .setDescription(description.length > descLength ? description.substring(0, descLength) + "..." || "No description available." : description || "No description available.")
                        .setURL("https://anilist.co/anime/" + data.id)
                        .setColor("0x00ff00")
                        .setFooter(Footer(response));
                        
                    const secondPage = new Discord.MessageEmbed()
                        .setAuthor(`${data.title.english} | Additional info`)
                        .setThumbnail(data.coverImage.large)
                        .addFields(
                        {
                            name: 'Source',
                            value: data.source || "Unknown",
                            inline: true,
                        },
                        {
                            name: 'Episode Duration',
                            value: data.duration.toString(),
                            inline: true
                        },
                        {
                            name: '\u200B', 
                            value: '\u200B',
                            inline: true,
                        },
                        {
                            name: 'Synonyms',
                            value: '``' +`${data.synonyms.join(", ") || "N/A"}` + '``',
                            inline: true,
                        }
                        )
                        .setColor("0x00ff00")
                        .setFooter(Footer(response))

                    const pages = [firstPage, secondPage]

                    pagination({
                        embeds: pages,
                        channel: message.channel,
                        message: message,
                        author: message.author,
                        time: 100000
                    })

                    if (hookdata?.image) {
                        firstPage.setImage(hookdata.image);
                    }

                    if (hookdata?.fields) {
                        for (const field of hookdata.fields) {
                            firstPage.addField(field.name, field.value, field.inline || false)
                        }
                    }
                } else {
                    message.channel.send("Could not find any data.");
                }
            })
            .catch((error) => {
                //^ log axios request status code and error
                if (error.response) {
                    console.log(error.response.data.errors);
                } else {
                    console.log(error);
                }
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
