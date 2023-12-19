const Sequelize = require("sequelize");
const sequelize = require("../server");

const Artist = sequelize.define("artist", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  birth_date: Sequelize.INTEGER,
});

module.exports = Artist;
