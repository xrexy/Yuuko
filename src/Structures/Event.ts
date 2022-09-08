import { ClientEvents, Events } from "discord.js";
import { Client } from "./Client";
function runFunction(client: Client, ...eventArgs: ClientEvents[keyof ClientEvents]) {

}
export class Event {
    event: Events;
    run: Function;
    constructor(event: Events, runFunction: Function) {
        this.event = event;
        this.run = runFunction;
    }
}