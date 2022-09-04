import { Interaction, ButtonBuilder, EmbedBuilder } from "discord.js";
import paginationWrapper = require("@acegoal07/discordjs-pagination");

/**
 * Creates the default pagination object to avoid boilerplate.
 * @param {Array} pageList - An array of pages to be embedded.
 * @param {Interaction} interaction - The Discord interaction object.
 * @returns {Object} The pagination object.
 */
module.exports = (interaction: Interaction, pageList: Array<EmbedBuilder>) => {
    const buttonList = [
        new ButtonBuilder().setCustomId("firstbtn").setLabel("First Page").setStyle(4),
        new ButtonBuilder().setCustomId("previousbtn").setLabel("Previous").setStyle(3),
        new ButtonBuilder().setCustomId("nextbtn").setLabel("Next").setStyle(3),
        new ButtonBuilder().setCustomId("lastbtn").setLabel("Last Page").setStyle(4),
    ];

    return new paginationWrapper().setInterface(interaction)
        .setPageList(pageList)
        .setButtonList(buttonList)
        .enableAutoButton()
        .setTimeout(20000)
    //.enableAuthorIndependent()
}
