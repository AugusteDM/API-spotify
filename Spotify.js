import React from 'react';
import './Spotify.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Spotify() {

    const CLIENT_ID = "160001abaf2d499681ee273e52a1ea19"
    const REDIRECT_URI = "http://localhost:3000/"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        // Récupération du lien
        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""

            window.localStorage.setItem("token", token)

        }
        setToken(token)
    },

    )

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")

    }

    // Fonction de recherche de l'artiste 

    const searchArtist = async (e) => {
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },

            params: {
                q: searchKey,
                type: "artist"
            }

        })
        setArtists(data.artists.items)
    }


    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"10%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
                {artist.name}
            </div>
        ))
    }

    return (



        <div className="spotify-container">
            <div className="header">

                <h1> SPOTIFY</h1>
            </div>
            <div className='Recherche'>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri = ${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>login to spotify</a>
                    : <button className='bouton-logout' onClick={logout}> Log out</button>}

                {token ?
                    <form onSubmit={searchArtist}>
                        <input type="text" onChange={e => setSearchKey(e.target.value)} />
                        <button className='bouton-recherche' type={"submit"}>Recherche</button>
                    </form>

                    : <h2>Connecte toi !</h2>
                }
                {renderArtists()}

            </div>


        </div>
    );
}

export default Spotify;