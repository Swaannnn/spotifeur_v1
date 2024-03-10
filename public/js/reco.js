// connexion au compte avec le token
async function fetchWebApi(token, endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body),
    })
    return await res.json()
}

// récupère le top 10 artiste
async function getTopArtists(timeAgo, nbA) {
    return (
        await fetchWebApi(
            accessToken, "v1/me/top/artists?time_range=" + timeAgo + "&limit=" + nbA, "GET"
        )
    ).items
}

// renvoie des artistes proches d'un artiste
async function getRelatedArtists(id) {
    return (
        await fetchWebApi(
            accessToken,  "v1/artists/" + id + "/related-artists", "GET"
        )
    ).artists
}

// ajoute le top 10 artiste dans les variables
async function getArtists() {
    const topArtistsShortTerm = await getTopArtists("short_term", 5)
    const topArtistsMediumTerm = await getTopArtists("medium_term", 5)
    const topArtistsLongTerm = await getTopArtists("long_term", 5)

    var idArtistsShortTerm = []
    for (i=0; i<5; i++) {
        idArtistsShortTerm.push(topArtistsShortTerm[i].id)
    }
    
    var idArtistsMediumTerm = []
    for (i=0; i<5; i++) {
        idArtistsMediumTerm.push(topArtistsMediumTerm[i].id)
    }
    
    var idArtistsLongTerm = []
    for (i=0; i<5; i++) {
        idArtistsLongTerm.push(topArtistsLongTerm[i].id)
    }

    return [idArtistsShortTerm, idArtistsMediumTerm, idArtistsLongTerm]
}

// ajoute les suggestion d'artiste dans les variables
async function getRelated() {
    var artists = []
    const topArtistsShortTerm = await getTopArtists("short_term", 50)
    const topArtistsMediumTerm = await getTopArtists("medium_term", 50)
    const topArtistsLongTerm = await getTopArtists("long_term", 50)
    for (i=0; i<50; i++) {
        if (!(artists.includes(topArtistsLongTerm[i].name))) {
            artists.push(topArtistsLongTerm[i].name)
        }
        if (!(artists.includes(topArtistsMediumTerm[i].name))) {
            artists.push(topArtistsMediumTerm[i].name)
        }
        if (!(artists.includes(topArtistsShortTerm[i].name))) {
            artists.push(topArtistsShortTerm[i].name)
        }
    }

    var [ast, amt, alt] = await getArtists()

    const artistRecoShort = await getRelatedArtists(ast[Math.floor(Math.random() * 5)])
    const artistRecoShort2 = await getRelatedArtists(ast[Math.floor(Math.random() * 5)])
    const artistRecoMedium = await getRelatedArtists(amt[Math.floor(Math.random() * 5)])
    const artistRecoMedium2 = await getRelatedArtists(amt[Math.floor(Math.random() * 5)])
    const artistRecoLong = await getRelatedArtists(alt[Math.floor(Math.random() * 5)])
    const artistRecoLong2 = await getRelatedArtists(alt[Math.floor(Math.random() * 5)])

    let namea1 = artists[0]
    while (artists.includes(namea1)) {
        artist1 = artistRecoShort[Math.floor(Math.random() * 10)]
        namea1 = artist1.name
    }

    let namea2 = artists[0]
    while (artists.includes(namea2) || namea2 == namea1) {
        artist2 = artistRecoMedium[Math.floor(Math.random() * 10)]
        namea2 = artist2.name
    }
    
    let namea3 = artists[0]
    while (artists.includes(namea3) || namea3 == namea1 || namea3 == namea2) {
        artist3 = artistRecoLong[Math.floor(Math.random() * 10)]
        namea3 = artist3.name
    }

    let namea4 = artists[0]
    while (artists.includes(namea4) || namea4 == namea1 || namea4 == namea2 || namea4 == namea3) {
        artist4 = artistRecoShort2[Math.floor(Math.random() * 10)]
        namea4 = artist4.name
    }

    let namea5 = artists[0]
    while (artists.includes(namea5) || namea5 == namea1 || namea5 == namea2 || namea5 == namea3 || namea5 == namea4) {
        artist5 = artistRecoMedium2[Math.floor(Math.random() * 10)]
        namea5 = artist5.name
    }
    
    let namea6 = artists[0]
    while (artists.includes(namea6) || namea6 == namea1 || namea6 == namea2 || namea6 == namea3 || namea6 == namea4 || namea6 == namea5) {
        artist6 = artistRecoLong2[Math.floor(Math.random() * 10)]
        namea6 = artist6.name
    }

    return [artist1, artist2, artist3, artist4, artist5, artist6]
}

var artists = []

const image = document.getElementById("image")
const imaga = document.getElementById("imaga")
const spotify = document.getElementById("spotify")
const color = ["#79d2e6", "#ff6961", "#b0f2b6", "#cca9dd", "#c0ab8f", "#fd6c9e"]
const reco = document.querySelector(".reco")
const name = document.getElementById("name")
const genre = document.getElementById("genre")
const leftArrow = document.getElementById("leftArrow")
const rightArrow = document.getElementById("rightArrow")
const bntYouTube = document.querySelector(".btnYouTube")
const youtube = document.querySelector(".youtube")
const blur = document.querySelector(".blur")
const close = document.getElementById("close")
const video = document.getElementById("video")
const load = document.querySelector(".load")

async function addFirstArtist() {
    artists = await getRelated()
    addRelatedArtists(0)
    setTimeout(() => {
        load.style.display = "none"
    }, 500)
}

// ajoute le premier artiste au chargement de la page
addFirstArtist()

async function addRelatedArtists(index) {
    reco.style.backgroundColor = color[index]

    setTimeout(() => {
        name.textContent = artists[index].name
        if (artists[index].genres[0] == null) {
            genre.textContent = "‎"
        } else {
            genre.textContent = artists[index].genres[0]
        }
        image.src = artists[index].images[0].url
        imaga.href = artists[index].external_urls.spotify
    }, 500)
}

let nb = 0

function transition(index) {
    var styleElement = document.createElement('style')
    var styleText = '#name::after { width: 0% !important; }'
    styleElement.appendChild(document.createTextNode(styleText))
    document.getElementsByTagName('head')[0].appendChild(styleElement)
        
    const reco = document.querySelector(".reco")
    reco.style.backgroundColor = color[index]

    setTimeout(() => {
        styleElement.firstChild.nodeValue = '#name::after { width: 120% !important; }'
    }, 1000)
}

leftArrow.addEventListener("click", () => {
    transition(nb)
    if (nb == 0) {
        nb = 5
    } else {
        nb -= 1
    }
    addRelatedArtists(nb)
})

rightArrow.addEventListener("click", () => {
    transition(nb)
    if (nb == 5) {
        nb = 0
    } else {
        nb += 1
    }
    addRelatedArtists(nb)
})

imaga.addEventListener("mouseover", () => {
    spotify.style.transform = "translateY(-120px)"
})

imaga.addEventListener("mouseout", () => {
    spotify.style.transform = "translateY(-80px)";
});

async function showDivYt() {
    youtube.style.display = "flex"
    blur.style.display = "flex"

    setTimeout(() => {
        youtube.style.transform = "translateY(0)"
        youtube.style.backgroundColor = color[nb]
        blur.style.transform = "translateY(0)"
    }, 1)

    console.log(artists[nb].name)
    url = await getVideoUrl(artists[nb].name)
    console.log(url)
    video.src = url
}

bntYouTube.addEventListener("click", () => {
    showDivYt()
})

close.addEventListener(("click"), () => {
    youtube.style.transform = "translateY(200vh)"
    blur.style.transform = "translateY(200vh)"

    setTimeout(() => {
        youtube.style.display = "none"
        blur.style.display = "none"
    }, 1000)

    video.src = ""
})


// récupère une
async function searchYouTube(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(query)}&key=${cleApiYoutube}`

    const response = await fetch(url)
    const data = await response.json()

    let videoId

    if (data.items[0].id.kind === 'youtube#channel') {
        videoId = data.items[1].id.videoId
    } else {
        videoId = data.items[0].id.videoId
    }

    const videoUrl = `https://www.youtube.com/embed/${videoId}`

    return videoUrl
}


async function getVideoUrl(query) {
    try {
        return await searchYouTube(query)
    } catch (error) {
        console.error('Erreur lors de la recherche sur YouTube :', error)
    }
}
