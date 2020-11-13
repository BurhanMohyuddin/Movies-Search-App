import React, { useState, useEffect } from "react";
import "./App.css";
import "./Components/SearchMovie.css";
import MovieCards from "./Components/MovieCards";
import axios from "axios";

function App() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [filteredSearchResults, setFilteredSearchResults] = useState([]);
  const [orignalSearchResults, setOriginalSearchResults] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const url =
      "https://api.themoviedb.org/3/movie/popular?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&page=1";
    axios.get(url).then((response) => {
      setPopularMovies(response.data.results);
      // setFullDate(response.data.results.release_date)
      // setMoviePopularity(response.data.results.popularity)
    });
  }, []);

  const changeHandler = async (e) => {
    let input = e.target.value;
    input = input.replace(/^\s+/, "");
    console.log("input ", input);
    setQuery(input);
    if (input.trim() === "") {
      // reset search results
      setFilteredSearchResults([]);
      setOriginalSearchResults([]);
      return;
    }
    const newurl = `https://api.themoviedb.org/3/search/movie?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&query=${input}&page=1&include_adult=false`;
    axios.get(newurl).then((response) => {
      setOriginalSearchResults(response.data.results);
      setFilteredSearchResults(response.data.results); 
    });
  };

  const handleSorting = async (e) => {
    // important to use "slice" because we need to get a "copy" of array fileredSearchResults, because Array.sort does "in-place" sorting and modifies actual array, but
    // we don't want to modify filteredSearchResults array directly. Need to use React way
    console.log("handle sorting", e);
    if (e === "date_desc") {
      const x = filteredSearchResults.slice().sort((a, b) =>new Date(b.release_date.split("/").reverse().join("-")) - new Date(a.release_date.split("/").reverse().join("-")));
      setFilteredSearchResults(x);
    }
    if (e === "date_asc") {
      const x = filteredSearchResults.slice().sort((a, b) =>new Date(a.release_date.split("/").reverse().join("-")) -new Date(b.release_date.split("/").reverse().join("-")));
      setFilteredSearchResults(x);
    }
    if (e === "rating_asc") {
      const x = filteredSearchResults.slice().sort((a, b) => a.vote_average - b.vote_average);
      setFilteredSearchResults(x);
    }
    if (e === "rating_desc") {
      const x = filteredSearchResults.slice().sort((a, b) => b.vote_average - a.vote_average);
      setFilteredSearchResults(x);
    }
  };
  
  //to filter by date
  let maxOffset = 30;
  let thisYear = (new Date()).getFullYear();
  let allYears = [];
  for(let x = 0; x <= maxOffset; x++) {
    allYears.push(thisYear - x)
  }
  const yearList = allYears.map((x) => {return(<option key={x}>{x}</option>)});
  
  
  const handleFiltering = async (e) => {
    console.log("date filtering", e);
    const x = filteredSearchResults.filter(m => m.release_date.split("-")[0] === e);
    setFilteredSearchResults(x);
    // filteredSearchResults.filter((filteredResult) => filteredResult.poster_path).map(filteredResult => {
    //   let dates = filteredResult.release_date;
    //   console.log("asdakdkasdhajkd",dates)
    //    if(e === dates)
    //      setFilteredSearchResults(filteredResult);
    //     console.log("date filtering",filteredResult);
    //   return <MovieCards movie={filteredResult} key={filteredResult.id} />;
    // })


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

      {/* show search results if available & sorting dropdown */}
      {filteredSearchResults.length > 0 && (
        <div>
          <div className="dropdown">
            <select onChange={(e) => handleSorting(e.target.value)} style={{borderRadius: '8px' }}>
              <option> Select</option>
              <option value="date_desc">Date: Descending</option>
              <option value="date_asc">Date: Ascending</option>
              <option value="rating_asc">Rating: Ascending</option>
              <option value="rating_desc">Rating: Descending</option>
            </select>
            <select className="date-dropdown" onChange={(e) => handleFiltering(e.target.value)}>
              <option>Select</option>
              {yearList}
            </select>
          </div>
    
          <div className="search-results-title">Search Results</div>
          <div className="card-list">
            {filteredSearchResults
              .filter((movie) => movie.poster_path)
              .map((movie) => {
                return <MovieCards movie={movie} key={movie.id} />;
              })}
          </div>
        </div>
      )}

      {orignalSearchResults.length === 0 && (
        <div>
          <div className="popular-movie-title">Popular Movies</div>
          <div className="card-list">
            {/* Display Popular Movies, check against original search results - not filtered */}
            {popularMovies
              .filter((movie) => movie.poster_path)
              .map((movie) => {
                return <MovieCards movie={movie} key={movie.id} />;
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
