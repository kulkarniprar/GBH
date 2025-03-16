import React from "react";
import "./riderDashboard.css";

const SearchBar = ({ setSearchTerm }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Where are you going?"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
