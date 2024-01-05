const express = require("express");
const router = express.Router();
const Work = require("../database/models/Work");
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const pagination = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    // Construieste parametrii pentru cerere
    const apiParams = {
      page: pagination.page,
      limit: pagination.limit,
      fields: "id,title,image_id,artist_id",
    };

    // Obține lista de lucrări de artă
    const artworksResponse = await axios.get(
      `https://api.artic.edu/api/v1/artworks`,
      { params: apiParams }
    );

    // Filtrare pentru a exclude înregistrarile cu image_id null
    const artworksWithImages = artworksResponse.data.data.filter(
      (artwork) => artwork.image_id !== null && artwork.artist_id !== null
    );

    // Alegem primele lucrari cu image_id si artist_id ne-null
    const limitedArtworks = artworksWithImages.slice(0, req.query.limit);

    // Obtinem informatiile despre artisti intr-o singura cerere batch
    try {
      const artistIds = limitedArtworks.map((artwork) => artwork.artist_id);
      const artistIdsString = artistIds.join(",");

      const artistsResponse = await axios.get(
        `https://api.artic.edu/api/v1/artists`,
        {
          params: {
            ids: artistIdsString,
            fields: "id,title,birth_date",
          },
        }
      );

      // Verificam daca exista date valide în raspunsul artistilor
      if (artistsResponse.data && artistsResponse.data.data) {
        const artistDataMap = new Map(
          artistsResponse.data.data.map((artist) => [artist.id, artist])
        );

        // Verificam existenta lucrărilor in baza de date
        const existWorkPromises = await limitedArtworks.map((artwork) =>
          Work.findOne({ where: { id: artwork.id } })
        );
        const existWork = await Promise.all(existWorkPromises);

        // Construim raspunsul final
        const response = {
          data: limitedArtworks.map((artwork) => ({
            id: artwork.id,
            title: artwork.title,
            image_id: artwork.image_id,
            birth_date: artistDataMap.get(artwork.artist_id)?.birth_date,
            idArtist: artwork.artist_id,
            titleArtist: artistDataMap.get(artwork.artist_id)?.title,
            exists: existWork.some((work) => work && work.id === artwork.id),
          })),
          pagination: artworksResponse.data.pagination,
        };

        res.status(200).json(response);
      } else {
        console.log("Raspuns invalid de la API-ul artistilor");
        res
          .status(500)
          .json({ error: "Raspuns invalid de la API-ul artistilor" });
      }
    } catch (error) {
      console.error(
        "Eroare in timpul apelului către API-ul artistilor:",
        error.message
      );

      if (error.response && error.response.status === 400) {
        // Tratare speciala pentru eroarea de tip 400 (Bad Request)
        console.log("Eroare 400 de la API-ul artistilor:", error.response.data);
        res
          .status(400)
          .json({ error: "Eroare de sintaxa la API-ul artistilor" });
      } else {
        res
          .status(500)
          .json({ error: "Eroare interna la apelarea API-ului artistilor" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/artists/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const artistResponse = await axios.get(
      `https://api.artic.edu/api/v1/artists/${id}?fields=id,title,birth_date`
    );
    if (artistResponse.data && artistResponse.data.data) {
      res.status(200).json(artistResponse.data.data);
    } else {
      res.status(404).json({ message: "nu a fost gasit artistul" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Eroare gasire artist cu id-ul specificat" });
  }
});
module.exports = router;
