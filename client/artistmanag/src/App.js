import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ArtistsPage from "./pages/ArtistsPage";
import CollectionPage from "./pages/CollectionPage";
import BrowseArtworksPage from "./pages/BrowseArtworksPage";
import ArtworkPage from "./pages/ArtworkPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="browse" element={<BrowseArtworksPage />} />
        <Route path="artists" element={<ArtistsPage />} />
        <Route path="collection" element={<CollectionPage />} />
        <Route path="/collection/details/:id" element={<ArtworkPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
