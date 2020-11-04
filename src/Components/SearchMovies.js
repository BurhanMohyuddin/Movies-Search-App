import React, { useState} from "react";
import "./SearchMovie.css";
import PopularMovies from './PopularMovies';
import MovieCards from "./MovieCards";

function SearchMovies() {
   const [movies, setMovies] = useState([]);
   const [query, setQuery] = useState('');

const changeHandler = async (e) => {
    e.preventDefault();
    
      const url = `https://api.themoviedb.org/3/search/movie?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&query=${query}&page=1&include_adult=false`;
      console.log("submitting");
     try {
       const res = await fetch(url);
       const data = await res.json();
       console.log("zxaxaa",data.results);
       setMovies(data.results);
     } catch (err) {
       console.error(err);
     }
  };

  return (
    <div>
      
        <form className="form" onSubmit={changeHandler}>
            
          <label className="label">
            Movie Name
          </label>
          <input
            className="input"
            type="text"
            name="query"
            placeholder="i.e Spiderman"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
          />
          <button className="button" type="submit">
            Search
          </button>
        </form>

        <div className="card-list">
          {movies
            .filter((movie) => movie.poster_path)
            .map((movie) => (
              <MovieCards movie={movie} key={movie.id} />
            ))}
        </div>
        <PopularMovies />
      
    </div>
  );
}

export default SearchMovies;
