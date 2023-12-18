const Sequelize = require("sequelize");
const sequelize = require("../server");

const Work = sequelize.define("work", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  imageId: Sequelize.STRING,
});

module.exports = Work;
