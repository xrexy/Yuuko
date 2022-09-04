import { Interaction, Snowflake } from "discord.js";
const Middleware = require("#Structures/Middleware.ts");
const AnilistUser = require("#Models/AnilistUser.js");

type UserInteraction = Interaction & {
    alID?: String;
}

async function getUserEntry(interaction: UserInteraction) {
    let id: Snowflake = interaction.user.id;
    let alUser = await AnilistUser.findOne({ where: { discord_id: id } });
    if (alUser && alUser.anilist_id) {
        interaction.alID = alUser.anilist_id;
    }
}

const mwGetUserEntry = new Middleware({
    name: "Require AniList Token",
    description: "This middleware gets you the user's AniList ID and add's it to the interaction object.",
    run: getUserEntry
})

module.exports = { mwGetUserEntry }