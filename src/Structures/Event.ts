import { ClientEvents, Events } from "discord.js";
import Client from "./Client.js";
/**
 * @template {keyof ClientEvents K}
 * @param {Client} client 
 * @param  {ClientEvents[K]} eventArgs 
 */
function runFunction(client, ...eventArgs) {

}
class Event {
    event: Events;
    run: Function;
    constructor(event, runFunction) {
        this.event = event;
        this.run = runFunction;
    }
}

module.exports = Event;