import React, { useEffect, useState } from "react";
//import axios from "axios";

const BrowseArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/external-api?page=${pagination.page}&limit=${pagination.limit}`
        );
        const data = await response.json();

        // const myData = JSON.parse(data.data);
        // console.log(myData);

        setArtworks(data.data);
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: data.pagination.total,
          totalPages: data.pagination.total_pages,
        }));
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchData();
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    setPagination((prevPagination) => ({ ...prevPagination, page: newPage }));
  };

  const handleAddToWorks = async (artwork) => {
    try {
      console.log("Adding artwork to works:", artwork);
      //  console.log(artwork.id);
      // Check if the artist is already in the artists table
      const artistResponse = await fetch(
        `http://localhost:8080/api/v1/artists/${artwork.idArtist}`
      );
      const artistData = await artistResponse.json();

      // console.log(
      //   JSON.stringify({
      //     id: artwork.id,
      //     title: artwork.title,
      //     imageId: artwork.image_id,
      //     artistId: artwork.artist_id, // Send artist data along with the artwork
      //   })
      // );

      if (artistData.message === "Artist not found") {
        // Artist does not exist, add artist to artists table first
        // const artistResponse = await fetch(
        //   `https://api.artic.edu/api/v1/artists/${artwork.artist_id}`
        // );
        // // const artistData = await artistResponse.json();

        const addArtistResponse = await fetch(
          "http://localhost:8080/api/v1/artists",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: artwork.idArtist,
              title: artwork.titleArtist,
              birth_date: artwork.birth_date,
            }),
          }
        );
      }

      // Artist exists, proceed to add artwork to works table

      const resp = await fetch("http://localhost:8080/api/v1/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: artwork.id,
          title: artwork.title,
          imageId: artwork.image_id,
          artistId: artwork.idArtist,
        }),
      });

      const respData = await resp.json();
      console.log("Artwork added to works:", respData);
    } catch (error) {
      console.error("Error adding artwork to works:", error);
    }
  };

  return (
    <div>
      <h2>Browse Collection</h2>
      <ul className="card-container">
        {artworks.map((artwork) => (
          <li key={artwork.id}>
            <div className="artwork-card">
              <img
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/200,/0/default.jpg`}
                alt={artwork.title}
              />
              <div>
                <p>{artwork.title}</p>
                <p>Artist: {artwork.titleArtist}</p>
                <button onClick={() => handleAddToWorks(artwork)}>Add</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div>
        <button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous Page
        </button>

        <span>
          {" "}
          Page {pagination.page} of {pagination.totalPages}{" "}
        </span>
        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default BrowseArtworks;
