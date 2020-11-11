import React, { useState, useEffect } from "react";
import "./App.css";
import "./Components/SearchMovie.css";
import MovieCards from "./Components/MovieCards";
import axios from "axios";

function App() {

  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [dataByDate, setDataByDate] = useState([]);
  const [dataByPopularity, setDataByPopularity] = useState([]);
  // const [fullDate, setFullDate] = useState([]);
  // const [moviePopularity, setMoviePopularity] = useState([]);
  // const [sortTypeByDate, setSortTypeByDate] = useState('date');
  // const [sortTypeByPopularity, setSortTypeByPopularity] = useState('popularity');


  useEffect(() => {
    const url = "https://api.themoviedb.org/3/movie/popular?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&page=1";
    axios.get(url).then(response => {
      setMovies(response.data.results)
      // setFullDate(response.data.results.release_date)
      // setMoviePopularity(response.data.results.popularity)

    })
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
      setSearchResults(response.data.results)
    });
    // console.log("searchone", searchResults);
    
  }

    const sortArrayByDate = () => {
      // const url = "https://api.themoviedb.org/3/movie/popular?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&page=1";
      // axios.get(url).then(response => {
      // const sortByDate = response.data.results;
      const sortByDate = searchResults;
      console.log("first",sortByDate)
      let sorted = sortByDate.sort((a, b) => new Date(b.release_date.split('/').reverse().join("-")) - new Date(a.release_date.split('/').reverse().join("-")) );
      console.log("second",sorted);
      setDataByDate(sorted);
    //})
    };

    const sortArrayByPopularity = () => {
      const url = "https://api.themoviedb.org/3/movie/popular?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&page=1";
    axios.get(url).then(response => {
      const sortByPopularity = response.data.results;
      console.log("first",sortByPopularity.popularity)
      let sorted = sortByPopularity.sort((a, b) => (b.popularity) -(a.popularity));
      console.log("second",sorted);
      setDataByPopularity(sorted);
    })
    };

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


      <div className="dropdown">
      <select onClick={(e) => sortArrayByDate(e.target.value)} >
        <option >Select</option>
        <option  value="date" >By Date</option>
        <option value="popularity" >By Popularity</option>
      </select>
      </div>
      

      <div className="popular-movie-title">Popular Movie</div>
      <div className="card-list">
      {/* {console.log("releaseDate", releaseDate)} */}
        {console.log("searchResult", searchResults)}
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
        {/* {dataByDate.map(movie => {
          return(
            <MovieCards movie={movie} key={movie.id} />
          )
        })} */}
      </div>

    </div>
  );
}

export default App;