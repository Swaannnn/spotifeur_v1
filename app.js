const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const ejs = require('ejs')
const path = require('path')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

var connect = false

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const cleApiYoutube = process.env.CLE_API_YOUTUBE

// Configuration de Spotify
const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret,
    // redirectUri: 'http://localhost:8888/callback'
    redirectUri: 'https://spotifeur.fr/callback'
})

function isLoggedIn(req, res, next) {
    if (connect) {
        next()
    } else {
        res.redirect('/login')
    }
}

// Route pour / (page d'accueil)
app.get('/', isLoggedIn, (req, res) => {
    res.render('home', {
        accessToken: req.cookies.accessToken,
        refreshToken: req.cookies.refreshToken,
        profile: JSON.parse(req.cookies.profile),
        connect: true
    })
})

// Route pour afficher les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render('error', { message: 'Une erreur est survenue.' })
})

// Route pour /login (page d'authentification)
app.get('/login', (req, res) => {
    res.render('login', {
        connect: connect
    })
})

app.get('/login/spotify', (req, res) => {
    const scopes = ['playlist-modify-private', 'user-top-read']
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes)
    res.redirect(authorizeURL)
})

// Route de redirection après l'autorisation
app.get('/callback', async (req, res) => {
    try {
        const { code } = req.query
        const data = await spotifyApi.authorizationCodeGrant(code)
        const accessToken = data.body['access_token']
        const refreshToken = data.body['refresh_token']
        spotifyApi.setAccessToken(accessToken)
        spotifyApi.setRefreshToken(refreshToken)

        // Récupérer les informations de l'utilisateur
        const user = await spotifyApi.getMe()
        const userId = user.body.id

        connect = true

        const profile = await fetchProfile(accessToken)
        // console.log(profile)

        // cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
        res.cookie('profile', JSON.stringify(profile), { httpOnly: true, secure: true })

        res.redirect('/')
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error)
        res.status(500).render('error', { message: 'Une erreur est survenue lors de la récupération du profil.' })
        // next(error)
    }
})

app.get('/statistics', (req, res) => {
    res.render('stats', {
        accessToken: req.cookies.accessToken,
        refreshToken: req.cookies.refreshToken,
        profile: JSON.parse(req.cookies.profile),
        connect: connect
    })
})

// Route pour /reco (page de recommandations)
app.get('/recommendations', (req, res) => {
    res.render('reco', {
        accessToken: req.cookies.accessToken,
        refreshToken: req.cookies.refreshToken,
        profile: JSON.parse(req.cookies.profile),
        connect: connect,
        cleApiYoutube: cleApiYoutube
    })
})

// Route pour /soon (pages pas faites)
app.get('/soon', (req, res) => {
    res.render('soon')
})

// Route pour /logout (déconnexion)
app.get('/logout', (req, res) => {
    connect = false
    res.redirect('/')
})


// démarrage serveur
const port = 8888
app.listen(port, () => {
// console.log(`Server is listening at http://localhost:${port}`)
    console.log('SPOTIFEUR !!')
})


// récupérer infos profil
async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    })

    return await result.json()
}