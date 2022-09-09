import { EmbedBuilder } from "discord.js";

export function EmbedError(err: string, params?: Object, showparams: Boolean = true): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setTitle("Error")
        .addFields({ name: `Tracelog / Message `, value: "```" + `${err.toString()}` + "```" })
        .setColor('#0xff0000')
    if (showparams) {
        embed.addFields({ name: `Params `, value: params ? "```json\n" + JSON.stringify(params) + "```" : "No parameters provided" })
    }

    return embed;
}