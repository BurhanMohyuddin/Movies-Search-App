import React, { useState, useEffect } from "react";
import "./App.css";
import "./Components/SearchMovie.css";
import MovieCards from "./Components/MovieCards";
import { BrowserRouter } from 'react-router-dom';
import Select from 'react-select';
import axios from "axios";

function App() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [filteredSearchResults, setFilteredSearchResults] = useState([]);
  const [orignalSearchResults, setOriginalSearchResults] = useState([]);
  const [filteredByGenre, setFilteredByGenre] = useState([]);
  const [filterdByGenreToCheck, setFilteredByGenreToCheck] = useState([]);
  const [filterByDate, setfilterByDate] = useState({
    firstDate: "",
    lastDate: "",
  });
  const [query, setQuery] = useState("");
 
  useEffect(() => {
    const url ="https://api.themoviedb.org/3/movie/popular?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&page=1";
    axios.get(url).then((response) => {
      setPopularMovies(response.data.results);
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

  //For Genre
  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=bcf11cf802fb05846974d00acd973616&language=en-US')
    .then(response =>{
       console.log("genre response", response.data.genres);
      setFilteredByGenre(response.data.genres);
      setFilteredByGenreToCheck(response.data.genres);

    });
  }, []);

  // For sorting asc or desc
  const handleSorting = async (e) => {
    // important to use "slice" because we need to get a "copy" of array fileredSearchResults, because Array.sort does "in-place" sorting and modifies actual array, but
    // we don't want to modify filteredSearchResults array directly. Need to use React way
    console.log("handle sorting", e);
    if (e === "date_desc") {
      const x = filteredSearchResults.slice().sort((a, b) => new Date(b.release_date.split("/").reverse().join("-")) - new Date(a.release_date.split("/").reverse().join("-")));
      setFilteredSearchResults(x);
    }
    if (e === "date_asc") {
       const x = filteredSearchResults.slice().sort((a, b) => new Date(a.release_date.split("/").reverse().join("-")) - new Date(b.release_date.split("/").reverse().join("-")));
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

  
  // For date input handler 
  const handleFiltering = async (e) => {
    const value = e.target.value;
    setfilterByDate({
      ...filterByDate,
      [e.target.name]: value,
    });

    // console.log("first value", filterByDate.firstDate);
    // console.log("second value", filterByDate.lastDate); 
  };

  //search by date Button handler
  const handleFilteringByClick = () => {
    const x = filteredSearchResults.filter(m => m.release_date.split("-")[0] > filterByDate.firstDate && m.release_date.split("-")[0] < filterByDate.lastDate);
    setFilteredSearchResults(x);
  }

  //   Genre Handler
  const genreHandler = async (arrayOfSelectedGenreObjects) => {
    // if(!arrayOfSelectedGenreObjects || arrayOfSelectedGenreObjects.length < 1){
    //   setFilteredSearchResults("");
    //  <p> <strong style={{alignContent:"center"}}><h2>Result Not Found</h2></strong> </p>
    // console.log("no result")
      
    // }else{ 
    console.log('array of selected genres objects', arrayOfSelectedGenreObjects);
    const filteredMoviesWithSelectedGenres = filteredSearchResults.filter(movie => {
      console.log('m', movie);
      for (let index = 0; index < arrayOfSelectedGenreObjects.length; index++) {
        const currentGenreObj = arrayOfSelectedGenreObjects[index];
        if (movie.genre_ids.includes(currentGenreObj.value)) {
          return true;
        }
      }
      return false;
    });
     setFilteredSearchResults(filteredMoviesWithSelectedGenres);
  //}

    // console.log("value of e", e);
    // const x = e.map((arr) => {

    //   return (
    //      //console.log("getting id", arr.value)
    //     filteredSearchResults.filter(movie => movie.genre_ids.includes(arr.value))
    //   )
    // })
    // console.log("getting value",x);
    
   // setFilteredSearchResults(x);

    // const genreIdInt = parseInt(e);
    // const x = filteredSearchResults.filter(movie => movie.genre_ids.includes(genreIdInt));
    // setFilteredSearchResults(x);
  }

  return (
    <BrowserRouter>
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

      {console.log("genre",filteredByGenre)}
      {/* show search results and filters menu if search is active. We detect active search based on query string value */}
      {query !== "" && (
        <div>
          <div className="dropdown">
            <select
              onChange={(e) => handleSorting(e.target.value)}
              style={{ borderRadius: "8px" }}
            >
              <option> Select</option>
              <option value="date_desc">Date: Descending</option>
              <option value="date_asc">Date: Ascending</option>
              <option value="rating_asc">Rating: Ascending</option>
              <option value="rating_desc">Rating: Descending</option>
            </select>
            <div className="dateHandler">
              <input
                className="start-date"
                type="text"
                name="firstDate"
                placeholder="i.e 2010"
                size="4"
                value={filterByDate.firstDate}
                onChange={handleFiltering}
              />
              <strong className="textData"> TO </strong>
              <input
                className="last-date"
                type="text"
                name="lastDate"
                placeholder="i.e 2020"
                size="4"
                value={filterByDate.lastDate}
                onChange={handleFiltering}
              />
              <button onClick={handleFilteringByClick}> Search </button>
            </div>
          </div>
          <div className="genre-dropdown">
          {/* <Select options={options1} /> */}
           <Select 
           onChange={genreHandler} 
           options= {
             filteredByGenre.map((genre) => { 
               return { value: genre.id, label: genre.name }
               })
            } isMulti 
            noOptionsMessage={() => "Zero Result"}/>
          </div>

          <div className="search-results-title">Search Results</div>
          <div className="card-list">
            {/* display cards only if filteredSearchResults array has something */}
            {filteredSearchResults.length > 0 && filteredSearchResults
              .filter((movie) => movie.poster_path)
              .map((movie) => {
                return <MovieCards movie={movie} key={movie.id} />;
              })}
              {/* if filteredSearchResults is empty, show no serach results message */}
              {filteredSearchResults.length === 0 && (
                <div>
                  <h2 class="search-results-title">No Search Results for given input and filters.</h2>
                </div>
              )}
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
  </BrowserRouter>
  );
}

export default App;
