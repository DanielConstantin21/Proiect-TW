import React from "react";
import ArtistList from "./components/ArtistList";
import WorkList from "./components/WorkList";
import BrowseArtoworks from "./components/BrowseArtworks";

const App = () => {
  return (
    <div>
      <BrowseArtoworks />
      <ArtistList />
      <WorkList />
    </div>
  );
};

export default App;
