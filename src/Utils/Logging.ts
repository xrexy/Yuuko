import path = require('path');
import fs = require('fs');

module.exports = (command, interaction) => {
    try {
        const logPath = path.join(__dirname, "../Logging/logs.txt");
        const currentDate = new Date().toISOString();
        if (!fs.existsSync(path.join(__dirname, "../Logging"))) {
            fs.mkdirSync(path.join(__dirname, "../Logging"));
            fs.writeFileSync(logPath, 'Initiating log!');
        }
        const log = fs.readFileSync(logPath, 'utf8').toString() + "\n" + `${currentDate}: ${interaction.user.id} / ${interaction.user.username}#${interaction.user.discriminator} ran command ${command.name}!`;
        fs.writeFileSync(logPath, log, 'utf8');
    } catch (e) {
        console.log(e);
    }
};