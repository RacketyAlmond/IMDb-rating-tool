import {useEffect, useState} from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
        "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
        "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
        "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
        "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];



const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);



const KEY = "ea8978a";

export default function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);




    function handleSelectMovie(id){
        setSelectedId(selectedId => id === selectedId ? null : id);
    }

    function handleCloseMovie(){
        setSelectedId(null);
    }

    function handleAddWatched(movie){
        setWatched((watched)=>[...watched, movie]);
    }

    function handleDeleteWatched(id){
        setWatched((watched)=>watched.filter((movie)=>movie.imdbID !== id));
    }

    useEffect(
        function () {
            localStorage.setItem("watched", JSON.stringify(watched));
        },
        [watched]
    )


    useEffect(function (){
        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("");

                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
                );

                if (!res.ok)
                    throw new Error("Something went wrong with fetching movies");

                const data = await res.json();

                if (data.Response === "False")
                    throw new Error ("Movie not found");

                setMovies(data.Search);

                setError("");
            } catch (err) {
                console.log(err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        if(query.length < 3){
            setMovies([]);

            setError('');
            return;
        }
        fetchMovies();
        }, [query]);


    return (
      <>
        <NavBar>
            <Logo />
            <Search query={query} setQuery={setQuery}/>
            <NumResults movies={movies}/>
        </NavBar>
        <Main>
            <Box>
                {/*isLoading ? <Loader /> : <MovieList movies={movies}/>*/}
                {isLoading && <Loader />}
                {!isLoading && !error && (
                    <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>
                )}
                {error && <ErrorMessage message={error} />}
            </Box>
            <Box>
                {selectedId ? (<MovieDetail  onDeleteWatched={handleDeleteWatched} watched={watched} onAddWatched={handleAddWatched} selectedId={selectedId} onCloseMovie={handleCloseMovie}/>)
                    :(
                <>
                    <WatchedSummary watched={watched} />
                    <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} onSelectMovie={handleSelectMovie}/>
                </>
                )}
            </Box>
        </Main>
      </>
  );
}





function Loader(){
    return <p className="loader">Loading...</p>;
}

function ErrorMessage({message}){
    return <p className="error">
        <span>Problem</span> {message}
    </p>
}


function NavBar({children}){

  return(
    <nav className="nav-bar">
        {children}
    </nav>
  )

}



function NumResults({movies}){
  return(
      <p className="num-results">
      </p>

  )
}
function Logo(){
  return(
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>

  )
}
function Search({query, setQuery}){
    useEffect(function (){
        const el = document.querySelector(".search");
        console.log(el);
        el.focus();
    }, []);
  return(
    <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
    />
  )

}

function Main({children}){

  return(
    <main className="main">
        {children}
    </main>
  )

}

function Box({children}){
    const [isOpen, setIsOpen] = useState(true);

    return(
      <div className="box">
        <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "–" : "+"}
        </button>
        {isOpen && children}
      </div>

  )
}
/*
function WatchedBox() {
    const [watched, setWatched] = useState(tempWatchedData);
    const [isOpen2, setIsOpen2] = useState(true);

    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen2((open) => !open)}
            >
                {isOpen2 ? "–" : "+"}
            </button>
            {isOpen2 && (
                <>
                    <WatchedSummary watched={watched} />
                    <WatchedMoviesList watched={watched} />
                </>
            )}
        </div>
    );
}
*/
function MovieList({movies, onSelectMovie}){

    return(
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <Movie movie={movie} onSelectMovie={onSelectMovie}/>
            ))}
        </ul>

    )
}



function Movie({movie, onSelectMovie}) {
    return(
        <li key={movie.imdbID} onClick={()=>onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>

    )
}


function MovieDetail({selectedId, onCloseMovie, onAddWatched, onDeleteWatched, watched}){
    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);

    const {Title: title, Year: year, Poster: poster, Runtime: runtime,
        imdbRating, Plot: plot,  Released: released, Actors: actors,
        Director: director, Genre: genre,
    } = movie;
    const alreadyWatched = watched.some((movie) => movie.imdbID === selectedId);

    function handleAdd(){
        console.log(alreadyWatched);
        if(alreadyWatched){
            onDeleteWatched(movie.imdbID);
        }
            const newWatchedMovie = {
                imdbID: selectedId,
                title,
                year,
                poster,
                imdbRating: Number(imdbRating),
                runtime: Number(runtime.split(' ').at(0)),
                rating,

            }
            onAddWatched(newWatchedMovie);
            onCloseMovie();
    }

    useEffect(function (){
        async function getMovieDetails(){
            setLoading(true);
            const res = await fetch(
                `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
            );

            if (!res.ok)
                throw new Error("Something went wrong with fetching movies");

            const data = await res.json();

            if (data.Response === "False")
                throw new Error ("Movie not found");
            setMovie(data);
            setLoading(false);
        }
        getMovieDetails();
    }, [selectedId])


    useEffect(function (){
        document.title = `Movie | ${title}`;
        return function () {
            document.title = "IMDb rating website";
        }
    }, [title])


    return <div className="details">
        {loading ? <Loader /> :
            <>
        <header>
        <button className="btn-back" onClick={()=>onCloseMovie()}>
            &larr;
        </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
                <h2>{title}</h2>
                <p>
                    {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                    <span>{`\u2605`}</span>
                    {imdbRating} IMDb Rating
                </p>
            </div>
        </header>
        <section>
            <StarRating maxRating={10} size={24} onSetRating={setRating}></StarRating>
            {rating>0 && (
            <button className="btn-add" onClick={handleAdd}>{alreadyWatched ? "Change" : "+ Add to list"}</button>
                )
            }
            <p>
                <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
        </section>
            </>}
    </div>;
}





function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.rating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(1)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(1)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime.toFixed(0)} min</span>
                </p>
            </div>
        </div>
    );
}

function WatchedMoviesList({ watched, onDeleteWatched, onSelectMovie}) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <li key={movie.imdbID} onClick={()=>onSelectMovie(movie.imdbID)}
                    className="pipopu"
                >
                    <img src={movie.poster} alt={`${movie.title} poster`} />
                    <h3>{movie.title}</h3>
                    <div>
                        <p>
                            <span>⭐️</span>
                            <span>{movie.imdbRating}</span>
                        </p>
                        <p>
                            <span>🌟</span>
                            <span>{movie.rating}</span>
                        </p>
                        <p>
                            <span>⏳</span>
                            <span>{movie.runtime} min</span>
                        </p>
                        <button className="btn-delete"
                                onClick={()=> onDeleteWatched(movie.imdbID)}>
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
