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

//
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
        artist4 = artistRecoShort[Math.floor(Math.random() * 10)]
        namea4 = artist4.name
    }

    let namea5 = artists[0]
    while (artists.includes(namea5) || namea5 == namea1 || namea5 == namea2 || namea5 == namea3 || namea5 == namea4) {
        artist5 = artistRecoMedium[Math.floor(Math.random() * 10)]
        namea5 = artist5.name
    }
    
    let namea6 = artists[0]
    while (artists.includes(namea6) || namea6 == namea1 || namea6 == namea2 || namea6 == namea3 || namea6 == namea4 || namea6 == namea5) {
        artist6 = artistRecoLong[Math.floor(Math.random() * 10)]
        namea6 = artist6.name
    }

    return [artist1, artist2, artist3, artist4, artist5, artist6]
}

var artists = []

async function test() {
    artists = await getRelated()
    addRelatedArtists(0)
}

test()

async function addRelatedArtists(index) {
    const color1 = ["#79d2e6", "#ff6961", "#b0f2b6", "#cca9dd", "#c0ab8f", "#fd6c9e"]

    const reco = document.querySelector(".reco")
    const name = document.getElementById("name")
    const genre = document.getElementById("genre")
    const image = document.getElementById("image")

    reco.style.backgroundColor = color1[index]

    name.textContent = artists[index].name
    if (artists[index].genres[0] == null) {
        genre.textContent = "‎"
    } else {
        genre.textContent = artists[index].genres[0]
    }
    image.src = artists[index].images[0].url
}

const leftArrow = document.getElementById("leftArrow")
const rightArrow = document.getElementById("rightArrow")

let nb = 0

leftArrow.addEventListener("click", () => {
    if (nb == 0) {
        nb = 5
    } else {
        nb -= 1
    }
    addRelatedArtists(nb)
})

rightArrow.addEventListener("click", () => {
    if (nb == 5) {
        nb = 0
    } else {
        nb += 1
    }
    addRelatedArtists(nb)
})



// YOUTUBE

// async function searchYouTube(query, apiKey) {
//     const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(query)}&key=${apiKey}`

//     const response = await fetch(url)
//     const data = await response.json()

//     let videoId

//     if (data.items[0].id.kind === 'youtube#channel') {
//         videoId = data.items[1].id.videoId
//     } else {
//         videoId = data.items[0].id.videoId
//     }

//     const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

//     return videoUrl
// }


// async function yt(query) {
//     try {
//         const apiKey = cleApiYoutube

//         const videoUrl = await searchYouTube(query, apiKey)
//         return videoUrl
//     } catch (error) {
//         console.error('Erreur lors de la recherche sur YouTube :', error)
//     }
// }
