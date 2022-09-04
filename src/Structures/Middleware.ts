class Middleware {
    name: String;
    description: String;
    run: Function;
    constructor(options: { name: String; description: String; run: Function; }) {
        this.name = options.name;
        this.description = options.description;
        this.run = options.run;
    }
}

module.exports = Middleware;