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
async function getTopArtists(timeAgo) {
    return (
        await fetchWebApi(
            accessToken, "v1/me/top/artists?time_range=" + timeAgo + "&limit=10", "GET"
        )
    ).items
}

// ajoute le top 10 artiste dans les variables
async function getArtists() {
    const topArtistsShortTerm = await getTopArtists("short_term")
    const topArtistsMediumTerm = await getTopArtists("medium_term")
    const topArtistsLongTerm = await getTopArtists("long_term")

    var artistsShortTerm = []
    for (i=0; i<10; i++) {
        artistsShortTerm.push(topArtistsShortTerm[i].id)
    }
    
    var artistsMediumTerm = []
    for (i=0; i<10; i++) {
        artistsMediumTerm.push(topArtistsMediumTerm[i].id)
    }
    
    var artistsLongTerm = []
    for (i=0; i<10; i++) {
        artistsLongTerm.push(topArtistsLongTerm[i].id)
    }

    return [artistsShortTerm, artistsMediumTerm, artistsLongTerm]
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
    var [ast, amt, alt] = await getArtists()

    const artistRecoShort = await getRelatedArtists(ast[Math.floor(Math.random() * 5)])
    const artistRecoMedium = await getRelatedArtists(amt[Math.floor(Math.random() * 5)])
    const artistRecoLong = await getRelatedArtists(alt[Math.floor(Math.random() * 5)])

    artist1 = artistRecoShort[Math.floor(Math.random() * 10)]
    artist2 = artistRecoMedium[Math.floor(Math.random() * 10)]
    artist3 = artistRecoLong[Math.floor(Math.random() * 10)]

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

    console.log(vida1url)
    console.log(vida2url)
    console.log(vida3url)

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
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    // if (!response.ok) {
    //     throw new Error(data.error.message || 'Failed to fetch YouTube data');
    // }

    // if (data.items.length === 0) {
    //     throw new Error('No video found')
    // }

    const videoId = data.items[0].id.videoId
    console.log(videoId)
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

    return videoUrl
}

async function yt(query) {
    try {
        const apiKey = cleApiYoutube

        const videoUrl = await searchYouTube(query, apiKey)
        console.log('Lien :', videoUrl)
        return videoUrl
    } catch (error) {
        console.error('Erreur lors de la recherche sur YouTube :', error)
    }
}