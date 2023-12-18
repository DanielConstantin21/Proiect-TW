const Sequelize = require("sequelize");
const sequelize = require("../server");

const Artist = sequelize.define("artist", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  birthDate: Sequelize.STRING,
});

module.exports = Artist;
