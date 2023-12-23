const express = require("express");
const app = express();
const Artist = require("./database/models/Artist");
const Work = require("./database/models/Work");
const cors = require("cors");
const artistRoutes = require("./routes/artistRoutes");
const workRoutes = require("./routes/workRoutes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/", function (req, res) {
  res.send("Hi");
});
Artist.hasMany(Work, { foreignKey: "artistId" });
Work.belongsTo(Artist, { foreignKey: "artistId" });
app.use("/artists", artistRoutes);
app.use("/works", workRoutes);
app.listen(8080);
console.log("Server started on port 8080!");
