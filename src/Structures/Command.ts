const Discord = require("discord.js");
import { Interaction, Message, SlashCommandBuilder } from "discord.js";
import Client from "./Client.js";
/**
 *
 * @param {Message | Interaction} message
 * @param {string[]} args
 * @param {Client} client
 */
function RunFunction(message, args, client) { }

class Command {
  usage: String;
  name: String;
  description: String;
  type: String;
  run: Function;
  slash: SlashCommandBuilder;
  middlewares: Middleware;
  /**
   * @param {objects} options
   */
  constructor(options) {
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

module.exports = Command;
