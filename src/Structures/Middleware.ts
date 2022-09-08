export class Middleware {
    name: string;
    description: string;
    run: Function;
    constructor(options: { name: string; description: string; run: Function; }) {
        this.name = options.name;
        this.description = options.description;
        this.run = options.run;
    }
}