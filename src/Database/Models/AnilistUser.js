const { Sequelize, Model, DataTypes } = require("sequelize");
const db = require("../db");

const AnilistUser = db.define("anilistuser", {
    discord_id: {
        type: DataTypes.STRING(18),
        allowNull: false,
        unique: true
    },
    anilist_token: {
        type: DataTypes.STRING(3000),
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 3000]
        }
    },
    anilist_id: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
            is: ["^[a-zA-Z0-9_]+$", 'i'],
            len: [1, 32]
        }
    }
});

// (async () => {
//   await sequelize.sync({ force: true });
// })();

module.exports = AnilistUser;