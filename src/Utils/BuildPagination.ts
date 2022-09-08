import { Interaction, ButtonBuilder, EmbedBuilder } from "discord.js";
import { paginationWrapper } from "@acegoal07/discordjs-pagination";

export function BuildPagination(interaction: Interaction, pageList: Array<EmbedBuilder>): Object {
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
