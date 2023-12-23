const express = require("express");
const router = express.Router();
const Work = require("../database/models/Work");
const { Sequelize, Op } = require("sequelize");
const Artist = require("../database/models/Artist");

router.post("/", async function (req, res) {
  try {
    const idArtist = req.body.artistId;
    console.log(idArtist);
    const artist = await Artist.findOne({ where: { id: idArtist } });
    if (!artist) {
      return res
        .status(400)
        .json({ success: false, message: "Artist does not exist", data: {} });
    }
    console.log(artist);
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("body is missing");
    }

    if (
      !req.body.hasOwnProperty("id") ||
      !req.body.hasOwnProperty("title") ||
      !req.body.hasOwnProperty("imageId") ||
      !req.body.hasOwnProperty("artistId")
    ) {
      throw new Error("malformed request");
    }
    const { id, title, imageId } = req.body;
    if (isNaN(id) || id < 0) {
      throw new Error("id should be a positive number");
    }

    const work = await Work.create({
      id,
      title,
      imageId,
      artistId: artist.id,
    });
    // Returnăm un răspuns corespunzător
    return res
      .status(201)
      .json({ success: true, message: "artwork created", data: work }); // TODO
  } catch (err) {
    console.error(err.stack);
    console.log(err);
    let statusCode = 500;
    let errorMessage = "server error";
    if (err.name === "SequelizeUniqueConstraintError") {
      statusCode = 403;
      errorMessage = "Artwork already exists";
    }
    if (err.message === "body is missing") {
      statusCode = 400;
      errorMessage = "body is missing";
    } else if (err.message === "malformed request") {
      statusCode = 400;
      errorMessage = "malformed request";
    } else if (err.message === "id should be a positive number") {
      statusCode = 400;
      errorMessage = "id should be a positive number";
    }

    res.status(statusCode).json({ message: errorMessage });
  }
});

router.get("/search", async (req, res) => {
  try {
    const term = req.query.title;
    console.log(term);
    const works = await Work.findAll({
      where: Sequelize.where(
        Sequelize.fn("LOWER", Sequelize.col("title")),
        "LIKE",
        `%${term.toLowerCase()}%`
      ),
    });
    if (works.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "Not found", data: {} });
    }
    res.status(200).json(works);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: `Error occured: ${err}.` });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const work = await Work.findByPk(id);
    if (!work) {
      return res
        .status(404)
        .json({ success: false, message: "Artwork not found", data: {} });
    }
    return res.status(200).json(work);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving artwork.", data: {} });
  }
});

//get works by artist id
router.get("/artist/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res
        .status(404)
        .json({ success: false, message: "Artist not found", data: {} });
    }
    const works = await Work.findAll({ where: { artistId: artist.id } });
    return res.status(200).json(works);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving artwork.", data: {} });
  }
});

//get work by id
router.put("/:id", async function (req, res) {
  try {
    const work = Work.findByPk(req.params.id);
    if (!work) {
      return res
        .status(404)
        .json({ success: false, message: "Artwork not found.", data: {} });
    }
    work.title = req.body.title;
    work.imageId = req.body.imageId;
    work.artistId = req.body.artistId;
    return res
      .status(201)
      .json({ success: true, message: "Artwork updated!", data: work });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving artwork.", data: {} });
  }
});
router.get("/", async function (req, res) {
  try {
    const works = await Work.findAll();
    res.status(200).json(works);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error retrieving artworks.",
      data: {},
    });
  }
});
router.delete("/:id", async function (req, res) {
  const id = req.params.id;
  Work.findByPk(id)
    .then((work) => {
      if (work) {
        work.destroy();
        return res
          .status(202)
          .json({ success: true, message: "Artwork was deleted", data: {} });
      } else {
        console.log("Artwork not found.");
        return res.status(404).json({ message: "Artwork not found" });
      }
    })
    .then((deletedWork) => {
      if (deletedWork) {
        console.log("Work deleted successfully.");
      }
    })
    .catch((error) => {
      console.error("Error deleting record:", error);
    });
});
module.exports = router;
