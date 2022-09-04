module.exports = {
    apps: [{
        name: "Yuuko Production",
        script: "./src/app.js",
        max_memory_restart: "500M",
        watch: ["commit.hash"],
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        }
    }]
}