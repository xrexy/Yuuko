const Discord = require("discord.js");
import { Interaction, Message, SlashCommandBuilder } from "discord.js";
import { Middleware } from "#Structures/Middleware";
import { Client } from '#Structures/Client';
function RunFunction(message: Message | Interaction, args: string[], client: Client) { }
export class Command {
  usage: string;
  name: string;
  description: string;
  type: string;
  run: Function;
  slash: Partial<SlashCommandBuilder>;
  middlewares: Middleware[];
  constructor(options: { usage: string; name: string; description: string; type: string; run: Function; slash: Partial<SlashCommandBuilder>; middlewares: Middleware[]; }) {
    this.usage = options.usage;
    this.name = options.name;
    this.description = options.description;
    this.type = options.type;
    this.run = options.run;
    if (options.slash) {
      this.slash = options.slash;
    }
    if (options.middlewares) {
      this.middlewares = options.middlewares;
    }
  }
}