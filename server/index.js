const express = require("express");
const app = express();
const Artist = require("./database/models/Artist");
const Work = require("./database/models/Work");
const cors = require("cors");
const artistRoutes = require("./routes/artistRoutes");
const workRoutes = require("./routes/workRoutes");
const externalRoutes = require("./routes/externalRoutes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

Artist.hasMany(Work, {
  foreignKey: "artistId",
  onDelete: "cascade",
  hooks: true,
});
Work.belongsTo(Artist, { foreignKey: "artistId" });
app.use("/api/v1/artists", artistRoutes);
app.use("/api/v1/works", workRoutes);
app.use("/api/v1/external-api", externalRoutes);
app.get("/", function (req, res) {
  res.send("Hi");
});
app.listen(8080);
console.log("Server started on port 8080!");
