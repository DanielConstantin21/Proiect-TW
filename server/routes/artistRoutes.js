const express = require("express");
const router = express.Router();
const Artist = require("../database/models/Artist");

router.get("/", async function (req, res) {
  try {
    const artists = await Artist.findAll();
    res.status(200).json(artists);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving artists.", data: {} });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("body is missing");
    }

    const { id, title, birth_date } = req.body;
    if (
      !req.body.hasOwnProperty("id") ||
      !req.body.hasOwnProperty("title") ||
      !req.body.hasOwnProperty("birth_date")
    ) {
      throw new Error("malformed request");
    }

    if (isNaN(id) || id < 0) {
      throw new Error("id should be a positive number");
    }
    const currentYear = new Date().getFullYear();
    if (birth_date > currentYear - 5) {
      throw new Error("invalid birth date");
    }
    const artist = await Artist.create({
      id,
      title,
      birth_date,
    });
    // Returnăm un răspuns corespunzător
    return res
      .status(201)
      .json({ success: true, message: "artist created", data: artist }); // TODO
  } catch (err) {
    console.error(err.stack);
    console.log(err);
    let statusCode = 500;
    let errorMessage = "server error";
    if (err.name === "SequelizeUniqueConstraintError") {
      statusCode = 403;
      errorMessage = "Artist already exists";
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
    } else if (err.message === "invalid birth date") {
      statusCode = 400;
      errorMessage =
        "Birth date is invalid. Artist should be at least 5 years old.";
    }

    res.status(statusCode).json({ message: errorMessage });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const artist = await Artist.findByPk(id);
    if (!artist) {
      return res
        .status(404)
        .json({ success: false, message: "Artist not found", data: {} });
    }
    return res.status(200).json(artist);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving artist.", data: {} });
  }
});

router.put("/:id", async function (req, res) {
  try {
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving artist.", data: {} });
  }
});
module.exports = router;
