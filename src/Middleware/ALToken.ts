import AnilistUser = require("#Models/AnilistUser.js");
import { Middleware } from "#Structures/Middleware";
import { Interaction, Snowflake } from "discord.js";
import { RSAcryption } from '#Utils/RSACryption';

type TokenInteraction = Interaction & {
    ALtoken?: String;
}

async function requireALToken(interaction: TokenInteraction) {
    let id: Snowflake = interaction.user.id;
    let alUser = await AnilistUser.findOne({ where: { discord_id: id } });
    if (!alUser || !alUser.anilist_token) {
        throw new Error("You must have an AniList token set to use this action.");
    }
    interaction.ALtoken = RSAcryption(alUser.anilist_token, true);
}

async function optionalALToken(interaction: TokenInteraction) {
    let id: Snowflake = interaction.user.id;
    let alUser = await AnilistUser.findOne({ where: { discord_id: id } });
    if (alUser && alUser.anilist_token) {
        interaction.ALtoken = RSAcryption(alUser.anilist_token, true);
    }
}

const mwRequireALToken = new Middleware({
    name: "Require AniList Token",
    description: "This middleware enforces the presence of an AniList Token for a given Discord user ID and makes it available for the interaction object",
    run: requireALToken
})

const mwOptionalALToken = new Middleware({
    name: "Optional AniList Token",
    description: "This middleware makes an AniList token available on the interaction object if present",
    run: optionalALToken
})

module.exports = { mwRequireALToken, mwOptionalALToken }