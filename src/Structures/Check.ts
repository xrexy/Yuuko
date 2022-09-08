export class Check {
    name: string;
    description: string;
    run: Function;
    optional: Boolean;
    constructor(options: { name: string, description: string, run: Function, optional: Boolean }) {
        this.name = options.name;
        this.description = options.description;
        this.run = options.run;
        this.optional = options.optional;
    }
}