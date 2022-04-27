import React, { useEffect, useState, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movieData, setMovieData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const movieHandler = useCallback(async() => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://swapi.dev/api/films')
      if(!response.ok) {
        throw new Error('Something went wrong')
      }
      const jsonData = await response.json()
      setMovieData(jsonData.results)
    } catch(e) {
      setError(e.message)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    movieHandler()
  }, [movieHandler])

  return (
    <React.Fragment>
      <section>
        <button onClick={movieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movieData.length > 0 && <MoviesList movies={movieData} />}
        {!isLoading && !error && movieData.length === 0 && <p>No movies found</p>}
        {isLoading && <p>Loading ...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
