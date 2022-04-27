import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a firebase api url
  const API_URL = 'https://movie-project-5bf91-default-rtdb.firebaseio.com/'

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const response = await fetch('https://swapi.dev/api/films/');
      // API from Firebase
      // adding movies.json below will create a node to help us get and post data
      const response = await fetch(`${API_URL}/movies.json`)
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
      const movies = []

      for(const key in data) {
        movies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }
      setMovies(movies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    console.log(movie);
    try {
      const response = await fetch(`${API_URL}/movies.json`, {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const jsonData = await response.json()
      console.log(jsonData)
    } catch(e) {
      console.log(e)
    }
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
