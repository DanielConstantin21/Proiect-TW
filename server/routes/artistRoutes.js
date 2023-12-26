const express = require("express");
const router = express.Router();
const Artist = require("../database/models/Artist");
const Work = require("../database/models/Work");
const { Sequelize, Op } = require("sequelize");

//add artist
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

//search artist by title
router.get("/search", async (req, res) => {
  try {
    const { page, limit, title, gt, lt } = req.query;
    const { size, offset } = getPagination(page - 1, limit);
    const condition1 = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const condition2 = gt
      ? { birth_date: { [Op.gt]: parseInt(gt, 10) } }
      : null;

    const condition3 = lt
      ? { birth_date: { [Op.lt]: parseInt(lt, 10) } }
      : null;

    // Build the final conditions object
    const conditions = {
      [Op.and]: [],
    };
    if (condition1) {
      conditions[Op.and].push(condition1);
    }
    if (condition2 && condition3) {
      conditions[Op.and].push({
        [Op.and]: [condition2, condition3],
      });
    } else if (condition2 || condition3) {
      conditions[Op.and].push({
        [Op.or]: [condition2, condition3].filter(Boolean),
      });
    }
    console.log(conditions);
    await Artist.findAndCountAll({
      where: conditions,
      size,
      offset,
    }).then((data) => {
      const response = getPagingData(data, page, size);
      if (response.artists.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Not found", data: {} });
      }
      res.send(response);
    });
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: `Error occured: ${err}.` });
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
    const works = await Work.findAll({ where: { artistId: id } });

    return res.status(200).json({ artist, works });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving artist.", data: {} });
  }
});

router.put("/:id", async function (req, res) {
  try {
    const reqid = req.params.id;
    const { id, title, birth_date } = req.body;
    const artist = await Artist.findByPk(reqid);
    if (!artist)
      return res
        .status(404)
        .json({ success: false, message: "Artist not found.", data: {} });
    if (birth_date > new Date().getFullYear() - 5) {
      return res
        .status(400)
        .json({ success: false, message: "Birth date is invalid.", data: {} });
    }
    const updated = await Artist.update(req.body, { where: { id: reqid } });
    console.log(updated);
    return res
      .status(200)
      .json({ success: true, message: "Artist updated!", data: {} });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error updating artist.", data: {} });
  }
});

router.get("/", async function (req, res) {
  try {
    const { page, limit } = req.query;
    const { size, offset } = getPagination(page - 1, limit);

    Artist.findAndCountAll({ size, offset }).then((data) => {
      const response = getPagingData(data, page, size);
      res.send(response);
    });
    // res.status(200).json(response);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Error retrieving artists.", data: {} });
  }
});
//delete artist
router.delete("/:id", async function (req, res) {
  const id = req.params.id;
  await Artist.findByPk(id)
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
  const { count: totalItems, rows: artists } = data;
  const currentPage = page ? (page > 0 ? page : 1) : 1;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, artists, totalPages, currentPage };
};
module.exports = router;
