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
// Search works by title
router.get("/search", async (req, res) => {
  try {
    const { page, limit, title } = req.query;
    const { size, offset } = getPagination(page - 1, limit);
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    Work.findAndCountAll({
      where: condition,
      size,
      offset,
    }).then((data) => {
      const response = getPagingData(data, page, size);
      if (response.works.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Not found", data: {} });
      }
      return res.send(response);
    });
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: `Error occured: ${err}.` });
  }
});
//works by id
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

//works by artist id
router.get("/artist/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res
        .status(404)
        .json({ success: false, message: "Artist not found", data: {} });
    }
    const { page, limit } = req.query;
    const { size, offset } = getPagination(page - 1, limit);

    Work.findAndCountAll({ where: { artistId: artist.id }, size, offset }).then(
      (data) => {
        const response = getPagingData(data, page, size);
        return res.send(response);
      }
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving artwork.", data: {} });
  }
});

//create work by id
router.put("/:id", async function (req, res) {
  try {
    const reqid = req.params.id;
    const { id, title, imageId, artistId } = req.body;
    console.log(id);
    const work = await Work.findByPk(reqid);
    console.log(work);
    if (!work)
      return res
        .status(404)
        .json({ success: false, message: "Artwork not found.", data: {} });
    console.log(artistId);
    if (artistId) {
      const artist = await Artist.findByPk(artistId);
      if (!artist)
        return res.status(400).json({
          success: false,
          message: "ArtistId not in database",
          data: {},
        });
    }
    const updated = await Work.update(req.body, { where: { id: reqid } });
    return res
      .status(200)
      .json({ success: true, message: "Artwork updated!", data: updated });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving artwork.",
      data: null,
    });
  }
});

// all works
router.get("/", async function (req, res) {
  try {
    const { page, limit } = req.query;
    const { size, offset } = getPagination(page - 1, limit);

    await Work.findAndCountAll({ size, offset }).then((data) => {
      const response = getPagingData(data, page, size);
      res.status(200).send(response);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error retrieving artworks.",
      data: null,
    });
  }
});
router.delete("/:id", async function (req, res) {
  const id = req.params.id;
  await Work.findByPk(id)
    .then((work) => {
      if (work) {
        work.destroy();
        return res
          .status(202)
          .json({ success: true, message: "Artwork was deleted", data: {} });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Artwork not found", data: {} });
      }
    })
    .catch((error) => {
      console.error("Error deleting record:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error deleting artwork!" });
    });
});

const getPagination = (page, lim) => {
  const size = lim ? +lim : 12;
  const offset = page ? page * size : 0;
  return { size, offset };
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: works } = data;
  const currentPage = page ? (page > 0 ? page : 1) : 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, works, totalPages, currentPage };
};
module.exports = router;
