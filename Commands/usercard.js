const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require('discord.js'),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    Canvas = require("canvas"),
    path = require("path"),
    { roundRect } = require("#Utils/CanvasHelper.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "usercard";
const usage = 'usercard <anilist user>';
const description = "Searches for an anilist user and displays a banner with the user's manga and anime statistics.";

module.exports = new Command({
    name,
    usage,
    description,
    type: CommandCategories.Misc,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The user to search for')
                .setRequired(true)),

    async run(interaction, args, run) {
        let vars = { username: interaction.options.getString('query') };

        // Make the HTTP Api request
        GraphQLRequest(GraphQLQueries.UserCard, vars)
            .then(async (response) => {
                let data = response.User;
                if (data) {
                    //^ Create canvas
                    Canvas.registerFont(path.join(__dirname, "../Assets/OpenSans-SemiBold.ttf"), { family: "Open_Sans" });
                    let width = 1700;
                    let height = 330;
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext("2d");
                    const bg = await Canvas.loadImage(data.bannerImage);
                    const pfp = await Canvas.loadImage(data.avatar.large);

                    //^ Math to resize image to fill
                    const scale = Math.max(canvas.width / bg.width, canvas.height / bg.height);
                    const x = (canvas.width / 2) - (bg.width / 2) * scale;
                    const y = (canvas.height / 2) - (bg.height / 2) * scale;

                    //^ Show the Profile Picture and Background images
                    ctx.textAlign = "center";
                    ctx.drawImage(bg, x, y, bg.width * scale, bg.height * scale);
                    ctx.filter = "none";
                    ctx.drawImage(pfp, 50, 50);
                    //(canvas.width/2) - (pfp.width / 2)
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";

                    //^ Get all of the text needed and measure its width
                    //^ Profile name
                    const name = data.name;
                    const nameWidth = ctx.measureText(name).width;

                    //^ Anime statistics
                    const anime = 'Anime';
                    const watched = `Watched: ${data.statistics.anime.count.toString()}`;
                    const watchedWidth = ctx.measureText(watched).width;
                    const aMeanScore = `Score: ${data.statistics.anime.meanScore.toString()}%`;

                    //^ Manga statistics
                    const manga = 'Manga';
                    const read = `Completed: ${data.statistics.manga.count.toString()}`;
                    //* Not needed right now
                    const readWidth = ctx.measureText(read).width;
                    const mMeanScore = `Score: ${data.statistics.manga.meanScore.toString()}%`;

                    //^ Create a round rectangle 
                    ctx.fillStyle = "rgba(0, 0, 0, 0.5);";
                    roundRect(ctx, 800, 5, 600, 325, 100, true, false);
                    //ctx.fillRect(750, 5, 700, 320);

                    //^ Display all of the text 

                    //^ Name text
                    ctx.fillStyle = "#fff";
                    ctx.font = "35pt Open_Sans";
                    ctx.textAlign = "left";
                    ctx.fillText(name, 290, 130);
                    ctx.strokeText(name, 290, 130);

                    //^ Anime Completed/Mean Score text
                    ctx.textAlign = "center";
                    ctx.font = "30pt Open_Sans";
                    ctx.fillText(anime, 1100, 20)
                    ctx.font = "25pt Open_Sans";
                    ctx.fillText(watched, 950, 90);
                    ctx.fillText(aMeanScore, 1250, 90);

                    //^ Manga Completed/Mean Score text
                    ctx.textAlign = "center"
                    ctx.font = "30pt Open_Sans";
                    ctx.fillText(manga, 1100, 170);
                    ctx.font = "25pt Open_Sans";
                    ctx.fillText(read, 950, 250);
                    ctx.fillText(mMeanScore, 1250, 250)

                    try {
                        const attachment = new AttachmentBuilder(canvas.toBuffer(), "anilist_banner.png");
                        interaction.reply({ files: [attachment] });
                    } catch (error) {
                        console.error(error)
                    }
                } else {
                    return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.error(error);
                interaction.reply({ embeds: [EmbedError(error, vars)] });
            });
    },
});
