import React, { useState } from "react";
import games from "../data/gamesData";
import GameCard from "./GameCard";
import Filters from "./Filters";

const genresWithIcons = [
  { name: "Action", icon: "/assets/icons/geners/action.png" },
  { name: "3D Games", icon: "/assets/icons/geners/3d.png" },
  { name: "Adventure", icon: "/assets/icons/geners/adventure.png" },
  { name: "Race", icon: "/assets/icons/geners/race.png" },
  { name: "Minecraft", icon: "/assets/icons/geners/minecraft.png" },
  { name: "RPG", icon: "/assets/icons/geners/rpg.png" },
  { name: "Strategy", icon: "/assets/icons/geners/strategy.png" },
  { name: "Shooter", icon: "/assets/icons/geners/shooter.png" },
  { name: "Casual", icon: "/assets/icons/geners/casual.png" },
  { name: "Simulation", icon: "/assets/icons/geners/simulation.png" },
  { name: "Puzzle", icon: "/assets/icons/geners/puzzle.png" },
];

const ITEMS_PER_PAGE = 18;

const GameList: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("date");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const filteredGames = games
    .filter((game) =>
      selectedGenre ? game.genre.includes(selectedGenre) : true
    )
    .filter((game) =>
      searchQuery
        ? game.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (b.hot && !a.hot) return 1;
      if (a.hot && !b.hot) return -1;

      if (sortOption === "alphabetical") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "date") {
        return (
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      }
      return 0;
    });
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentGames = filteredGames.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number, scrollToTop: boolean = false) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (scrollToTop) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
  };
  return (
    <div>
      <h1 className="page-title">.io Games</h1>

      <div className="game-list-container">
        <div className="genre-sidebar">
          <h3>Genres</h3>
          <ul>
            {genresWithIcons.map((genre) => (
              <li
                key={genre.name}
                className={selectedGenre === genre.name ? "active" : ""}
                onClick={() => {
                  setSelectedGenre(genre.name);
                  setCurrentPage(1);
                }}
              >
                <img src={genre.icon} alt={`${genre.name} icon`} />
                {genre.name}
              </li>
            ))}
            <li
              className={!selectedGenre ? "active" : ""}
              onClick={() => {
                setSelectedGenre("");
                setCurrentPage(1);
              }}
            >
              <img src="/assets/icons/geners/all.png" alt="All genres icon" />
              All Games
            </li>
          </ul>
        </div>
        <div className="games-content">
          <Filters
            genres={genresWithIcons.map((g) => g.name)}
            selectedGenre={selectedGenre}
            searchQuery={searchQuery}
            sortOption={sortOption}
            onGenreChange={(genre) => {
              setSelectedGenre(genre);
              setCurrentPage(1);
            }}
            onSearchChange={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
            onSortChange={setSortOption}
          />
          <div className="game-list">
            {currentGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1, false)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => handlePageChange(page, false)}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1, true)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameList;
