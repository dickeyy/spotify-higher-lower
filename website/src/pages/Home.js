import '../assets/css/home.css';
import {useEffect, useState} from 'react';
import axios from 'axios';

// Sleep function
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function HomePage() {

  const CLIENT_ID = 'YOUR_CLIENT_ID'
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = 'playlist-read-private playlist-modify-private playlist-modify-public user-follow-read'

  var [token, setToken] = useState("")
  var [stat, setStat] = useState("")
  var [artist1, setArtist1] = useState([])
  var [artist2, setArtist2] = useState([])
  var [score, setScore] = useState(0)
  var [lose, setLose] = useState(false)

  // Set spotify user token
  useEffect(() => {
    
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])

  // Logout function
  const logout = () => {
      setToken("")
      setStat("")
      setArtist1("")
      setArtist2("")
      setScore(0)
      setLose(false)
      window.localStorage.removeItem("token")
      window.location.reload()
  }

  // Render stat choices
  const renderStatChoices = () => {

    return (

      <div className='statChoiceCont'>

        <h3>Choose a stat to play with</h3>

        <div className='statCont' onClick={getArtistPopularities}>
          <h3 className='statH3'>Artist Popularity</h3>
        </div>

      </div>

    )

  }

  // Get artists Popularity
  const getArtistPopularities = async () => {

    const token = window.localStorage.getItem('token')

    const data1 = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchQuery(),
        type: 'artist',
        limit: 1,
        offset: offset()
      }
    })

    const data2 = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchQuery(),
        type: 'artist',
        limit: 1,
        offset: offset()
      }
    })

    var artist1 = data1.data.artists.items[0]
    var artist2 = data2.data.artists.items[0]

    setArtist1(artist1)
    setArtist2(artist2)

    setStat('ArtistPopularites')

    console.log('Set Artists')

  }

  // Render artists pop
  const renderArtistsPop = () => {

    return (

      <div className="gameCont">

        <p className='score'>Score: {score}</p>
        <br></br>

        <div className='artistImgCont'>

          <img style={{ float: 'left' }} className='artistImg' src={artist1.images[0].url} alt='Artist Profile Pic' onClick={() => {

            if (artist1.popularity >= artist2.popularity) {

              setScore(score + 1)
              
              setArtist1('')
              setArtist2('')

              getArtistPopularities()

            } else {

              setArtist1('')
              setArtist2('')

              setLose(true)

            }
        
          }}></img>
        

          <img style={{ float: 'right' }} className='artistImg' src={artist2.images[0].url} alt='Artist Profile Pic' onClick={() => {

            if (artist2.popularity >= artist1.popularity) {

              setScore(score + 1)
              
              setArtist1('')
              setArtist2('')

              getArtistPopularities()

            } else {

              setArtist1('')
              setArtist2('')

              setLose(true)

            }

          }}></img>

        </div>

        <br></br>

        <div className='artistInfoCont'>

          <p><p className='artistName'>{artist1.name}</p>     or     <p className='artistName'>{artist2.name}</p></p>

        </div>

      </div>

    )

  }

  const renderLose = () => {

    return (

      <div className='loseDiv'>

        <h1>You Lost!</h1>
        <h4>You scored: {score}</h4>

      </div>

    )

  }

  // Page Load Stuff
  useEffect(() => {
    const onPageLoad = () => {

      sleep(100).then(() => {
 
        const hash = window.location.hash
             let token = window.localStorage.getItem("token")
       
             if (!token && hash) {
                 token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
       
                 window.location.hash = ""
                 window.localStorage.setItem("token", token)
             }
       
             setToken(token)

             sleep(200).then(() => {
               // do stuff
             })

      })

    };
    // Check if the page has already loaded
    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener("load", onPageLoad);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        
        <h1 className='headerText'>Spotify Higher Lower</h1>

        {!artist1 && !artist2 && token && stat && lose ? renderLose(): <p style={{ display: 'none' }}></p>}

        {artist1 && token && stat ? renderArtistsPop(): <p style={{ display: 'none' }}></p>}

        {!stat && token ? renderStatChoices(): <p style={{ display: 'none' }}></p>}

        {!token ? <a className="login" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`}>Login to Spotify</a>: <button className="logout" onClick={logout}>Reset</button>}

      </header>
    </div>
  );
}

export default HomePage;


// Functions
function searchQuery() {
  var letters = 'abcdefghijklmnopqrstuvwxyz'
  var q = letters[Math.floor(Math.random() * letters.length)]
  return q
}

function offset() {
  var offsetMultiplier = Math.round(Math.random() * 100)
  var offset = Math.round(Math.random() * offsetMultiplier)
  return offset
}