import React, { useState, useEffect } from "react";
import "./SearchMovie.css";
import MovieCards from "./MovieCards";
import axios from 'axios';

function SearchMovies(props) {
  const [movies, setMovies] = useState([]);
  let newUrl = props.searchUrl;
  console.log("url in search", newUrl);
  axios.get(newUrl)
  .then(response => {
    console.log("zxaxaa", response.data.results);
      //setMovies(response.data.results)
   });
  //   const changeHandler = async (e) => {
  //       let input = e.target.value;
  //       input = input.replace(/^\s+/, "");
  //       console.log('input ', input);
  //       setQuery(input);
  //     if (input.trim() === '') {
  //         return;
  //     }
  // const url = `https://api.themoviedb.org/3/search/movie?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&query=${input}&page=1&include_adult=false`;

//   useEffect(() => {
//     const setData = async () => {
//       console.log("newUrl ", newUrl);
//       try {
        //  const res = fetch(newUrl);
        //  console.log("ress", res);
        //   const data =  res.json();
//         console.log("zxaxaa", data.results);
//         // setMovies(data.results);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     setData();
//   },[movies]);

  //   };

  return (
    <div>
      {/* <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label className="label">Movie Name</label>
        <input
          className="input"
          type="text"
          name="query"
          placeholder="i.e Spiderman"
          value={query}
          onChange={changeHandler}
        />
      </form> */}

      <div className="card-list">
        {movies
          .filter((movie) => movie.poster_path)
          .map((movie) => (
            <MovieCards movie={movie} key={movie.id} />
          ))}
      </div>
    </div>
  );
}

export default SearchMovies;
