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

// récupère le top 10 artiste
async function getRelatedArtists(id) {
    return (
        await fetchWebApi(
            accessToken,  "v1/artists/" + id + "/related-artists", "GET"
        )
    ).artists
}

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
    const artistRecoMedium = await getRelatedArtists(amt[Math.floor(Math.random() * 5)])
    const artistRecoLong = await getRelatedArtists(alt[Math.floor(Math.random() * 5)])

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

    addRelatedArtists(artist1, artist2, artist3)
}

async function addRelatedArtists(a1, a2, a3) {
    const diva1 = document.getElementById("a1")
    const diva2 = document.getElementById("a2")
    const diva3 = document.getElementById("a3")

    const imga1 = document.getElementById("imga1")
    const imga2 = document.getElementById("imga2")
    const imga3 = document.getElementById("imga3")
    
    const namea1 = document.getElementById("namea1")
    const namea2 = document.getElementById("namea2")
    const namea3 = document.getElementById("namea3")

    imga1.src = a1.images[0].url
    imga2.src = a2.images[0].url
    imga3.src = a3.images[0].url
    
    namea1.textContent = a1.name
    namea2.textContent = a2.name
    namea3.textContent = a3.name
    
    const vida1 = document.getElementById("vida1")
    const vida2 = document.getElementById("vida2")
    const vida3 = document.getElementById("vida3")

    var vida1url = await yt(a1.name)
    var vida2url = await yt(a2.name)
    var vida3url = await yt(a3.name)

    vida1url = modifyUrl(vida1url)
    vida2url = modifyUrl(vida2url)
    vida3url = modifyUrl(vida3url)

    vida1.src = vida1url
    vida2.src = vida2url
    vida3.src = vida3url
}

getRelated()


function modifyUrl(url) {
    if (url.includes('youtube.com/watch?v=')) {
        return url.replace('watch?v=', 'embed/')
    }
    return url
}



// YOUTUBE

async function searchYouTube(query, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(query)}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    let videoId

    if (data.items[0].id.kind === 'youtube#channel') {
        videoId = data.items[1].id.videoId
    } else {
        videoId = data.items[0].id.videoId
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

    return videoUrl
}


async function yt(query) {
    try {
        const apiKey = cleApiYoutube

        const videoUrl = await searchYouTube(query, apiKey)
        return videoUrl
    } catch (error) {
        console.error('Erreur lors de la recherche sur YouTube :', error)
    }
}