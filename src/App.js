import React, { useState, useEffect } from "react";
import './App.css';
import SearchMovies from './Components/SearchMovies';
import MovieCards from "./Components/MovieCards";

function App() {

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [searchUrl , setSearchUrl] = useState("");

  const displaySearchResultsFlag = false;

  
  useEffect( () => {
      const url = "https://api.themoviedb.org/3/movie/popular?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&page=1";
      const fetchData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results);
      // console.log(data);
      }
      fetchData();
  }, []);

  const changeHandler = async (e) => {
    let input = e.target.value;
    input = input.replace(/^\s+/, "");
    console.log('input ', input);
    setQuery(input);
  if (input.trim() === '') {
      return;
  }
 const newurl = `https://api.themoviedb.org/3/search/movie?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&query=${input}&page=1&include_adult=false`;
 setSearchUrl(newurl);
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
        {console.log("submitting" , searchUrl)}
        
        <SearchMovies searchUrl={searchUrl}/>
        {/* {displaySearchResultsFlag === true ? <SearchMovies searchUrl={searchUrl}/> : */}
            {movies.filter(movie => movie.poster_path).map(movie => {
                return(
                   <MovieCards movie={movie} key={movie.id}/>
            ) 
            })}
        </div>  
         
    </div>
  );
}

export default App;
