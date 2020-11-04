import React, {useState, useEffect} from 'react'
import MovieCards from './MovieCards';
import './PopularMovies.css';

function PopularMovies() {
    const [movies, setMovies] = useState([]);

    const url = "https://api.themoviedb.org/3/movie/popular?api_key=bcf11cf802fb05846974d00acd973616&language=en-US&page=1";

    useEffect( () => {
        const fetchData = async () => {
        const res = await fetch(url);
        const data = await res.json();
        setMovies(data.results);
        // console.log(data);
        }
        fetchData();
    }, []);
    return (
    <>
        <div className="popular-movie-title">Popular Movie</div>
        <div className="card-list">
            {movies.filter(movie => movie.poster_path).map(movie => {
                return(
                    <MovieCards movie={movie} key={movie.id}/>
                )
                
            })}
        </div>
    </>
    )
}

export default PopularMovies
