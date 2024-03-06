/// connexion au compte (avec le token)
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

/// récupère le bouton et lance la fonction au click
const valider = document.querySelector("#boutonValider")
/// récupère l'endroit ou afficher les top titres
// const topTitres = document.querySelector(".topTitres")

/// endroit sans texte pour le moment
// const endroitListe = document.querySelector(".listTopTitres")
var numberTrack = 0
var arrayNoms = []
var arrayArtistes = []
var arrayCovers = []

/// fonction qui récupère les top tracks
async function getTopTracks() {
  /// constante qui récupère le nombre de track souhaité
  numberTrack = document.getElementById("nbTrack").value
  var timeAgo = document.getElementById("timeAgoT").value

  return (
    await fetchWebApi(
      accessToken, "v1/me/top/tracks?time_range=" + timeAgo + "&limit=" + numberTrack, "GET"
    )
  ).items
}

// /// top artistes
// async function getTopArtists() {
//   /// constante qui récupère le nombre de track souhaité
//   numberArtist = document.getElementById("nbArtist").value
//   var timeAgo = document.getElementById("timeAgoA").value

//   return (
//     await fetchWebApi(
//       "v1/me/top/artists?time_range=" + timeAgo + "&limit=" + numberArtist, "GET"
//     )
//   ).items
// }

/// récupère les tops tracks et l'écrit dans la consoles
async function startTracks() {
  const topTracks = await getTopTracks()

  for (let i = 0; i < numberTrack; i++) {
    arrayNoms.push(topTracks?.map(({name}) => `${name}`))
    arrayArtistes.push(topTracks?.map(({artists}) => `${artists.map((artist) => artist.name).join(" & ")}`))
    arrayCovers.push(topTracks?.map(({album}) => `${album.images[0].url}`))
  }
  arrayNoms = arrayNoms[0]
  arrayArtistes = arrayArtistes[0]
  arrayCovers = arrayCovers[0]

  // topTitres.style.display = "inline"
  valider.style.display = "none"
  addElementTracks(arrayNoms, arrayArtistes)
  // endroitListe.innerText = arrayNoms
}

/// ajoute les covers/noms/artistes sur la page
function addElementTracks(noms, artistes) {
  for (let i = 0; i < numberTrack; i++) {
    let divNumber = document.createElement("div")
    let divNumber2 = document.createElement("div")
    let img = document.createElement("img")
    let divTrack = document.createElement("div")
    let divArtist = document.createElement("div")
    divNumber.style.fontSize = "42.5px"
    divNumber.style.marginBottom = "20px"
    divTrack.style.fontSize = "30px"
    divArtist.style.color = "#949494"
    divArtist.style.marginBottom = "15px"

    let contentNumber = document.createTextNode(i+1 + ". ")
    let contentNumber2 = document.createTextNode("")
    img.src = arrayCovers[i]
    img.style.height = "50px"
    img.style.width = "50px"
    img.style.border = "1px solid black"
    img.style.borderRadius = "3px"
    let contentTrack = document.createTextNode(noms[i])
    let contentArtist = document.createTextNode(artistes[i])

    divNumber.appendChild(contentNumber)
    divNumber2.appendChild(contentNumber2)
    divTrack.appendChild(contentTrack)
    divArtist.appendChild(contentArtist)

    let number = document.getElementById("number")
    let cover = document.getElementById("cover")
    let trackArtist = document.getElementById("trackArtist")

    cover.appendChild(img)

    let nc = number.parentNode
    let ta = trackArtist.parentNode

    nc.insertBefore(divNumber, number)
    nc.insertBefore(divNumber2, number)
    ta.insertBefore(divTrack, trackArtist)
    ta.insertBefore(divArtist, trackArtist)
  }
}

valider.addEventListener("click", () => {
  /// lance la fonction topTracks et affiche les top tracks
  startTracks()
})