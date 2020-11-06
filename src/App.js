import React, { useState, useEffect } from "react";
import "./App.css";
import "./Components/SearchMovie.css";
import MovieCards from "./Components/MovieCards";
import axios from "axios";

function App() {

  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");


  useEffect(() => {
    const url = "https://api.themoviedb.org/3/movie/popular?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&page=1";
    const fetchData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results);
    }
    fetchData();
  }, []);

  const changeHandler = async (e) => {
    let input = e.target.value;
    input = input.replace(/^\s+/, "");
    console.log("input ", input);
    setQuery(input);
    if (input.trim() === "") {
      // reset search results
      setSearchResults([]);
      return;
    }
    const newurl = `https://api.themoviedb.org/3/search/movie?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&query=${input}&page=1&include_adult=false`;
    axios.get(newurl).then(response => {
      setSearchResults(response.data.results);
    });

  }

  return (
    <div className="App">
      <div className="title">Movie Search</div>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label className="label">Movie Name</label>
        <input
          className="input"
          type="text"
          name="query"
          placeholder="i.e Spiderman"
          value={query}
          onChange={changeHandler}
        />
      </form>

      <div className="popular-movie-title">Popular Movie</div>
      <div className="card-list">
        {searchResults.length > 0 && searchResults.filter(movie => movie.poster_path).map(movie => {
          return (
            <MovieCards movie={movie} key={movie.id} />
          )
        })}

        {searchResults.length === 0 && movies.filter(movie => movie.poster_path).map(movie => {
          return (
            <MovieCards movie={movie} key={movie.id} />
          )
        })}
      </div>

    </div>
  );
}

export default App;
