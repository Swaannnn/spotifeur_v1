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

// variables utiles
var numberArtist = 50
var numberTrack = 50
var arrayNoms = []
var arrayArtistes = []
var arrayCovers = []

const btn4w = document.getElementById("4w")
const btn6m = document.getElementById("6m")
const btnaw = document.getElementById("aw")

const son = document.getElementById("son")
const artiste = document.getElementById("artiste")

// true = track / false = artist
var isTrack = true
const soa = document.getElementById("soa")
soa.textContent = "sons"

// appel à l'API pour récupérer les top tracks
async function getTopTracks(timeAgo) {
  return (
    await fetchWebApi(
      accessToken, "v1/me/top/tracks?time_range=" + timeAgo + "&limit=" + numberTrack, "GET"
    )
  ).items
}

// appel à l'API pour récupérer les top artistes
async function getTopArtists(timeAgo) {
  return (
    await fetchWebApi(
      accessToken, "v1/me/top/artists?time_range=" + timeAgo + "&limit=" + numberArtist, "GET"
    )
  ).items
}

// met en forme le résultat pour les tracks
async function startTracks(timeAgo) {
  const topTracks = await getTopTracks(timeAgo)
  console.log(topTracks)
    
  arrayNoms = []
  arrayArtistes = []
  arrayCovers = []

  for (let i = 0; i < numberTrack; i++) {
    arrayNoms.push(topTracks?.map(({name}) => `${name}`))
    arrayArtistes.push(topTracks?.map(({artists}) => `${artists.map((artist) => artist.name).join(", ")}`))
    arrayCovers.push(topTracks?.map(({album}) => `${album.images[0].url}`))
  }
  arrayNoms = arrayNoms[0]
  arrayArtistes = arrayArtistes[0]
  arrayCovers = arrayCovers[0]

  addElementTracks(arrayNoms, arrayArtistes, arrayCovers)
}

// // met en forme le résultat pour les artistes
async function startArtists(timeAgo) {
  const topArtists = await getTopArtists(timeAgo)
    
  arrayArtistes = []
  arrayCovers = []

  console.log(topArtists)

  for (let i = 0; i < numberTrack; i++) {
    arrayArtistes.push(topArtists?.map(({name}) => `${name}`));
    arrayCovers.push(topArtists?.map(({images}) => `${images[0]?.url}`))
  }
  arrayArtistes = arrayArtistes[0]
  arrayCovers = arrayCovers[0]

  addElementArtists(arrayArtistes, arrayCovers)
}

// affiche les tracks sur la page
function addElementTracks(noms, artistes, covers) {
  for (let i = 0; i < numberTrack; i++) {
    let tr = document.createElement("tr")
    let tdcover = document.createElement("td")
    let tdinfos = document.createElement("td")
    let divcover = document.createElement("div")
    divcover.classList.add("cvr");
    let imgcover = document.createElement("img")
    imgcover.style.height = "150px"
    let ptrack = document.createElement("p")
    let partist = document.createElement("p")

    imgcover.src = covers[i]
    ptrack.textContent = i+1 + ". " + noms[i]
    partist.textContent = artistes[i]

    table = document.querySelector('.result')

    divcover.appendChild(imgcover)
    tdcover.appendChild(divcover)
    tdinfos.appendChild(ptrack)
    tdinfos.appendChild(partist)

    tr.appendChild(tdcover)
    tr.appendChild(tdinfos)

    table.appendChild(tr)
  }
}

// affiche les artistes sur la page
function addElementArtists(artistes, covers) {
  for (let i = 0; i < numberTrack; i++) {
    let tr = document.createElement("tr")
    let tdcover = document.createElement("td")
    let tdinfos = document.createElement("td")
    let divartist = document.createElement("div")
    divartist.classList.add("cvr");
    let imgartist = document.createElement("img")
    imgartist.style.height = "150px"
    let partist = document.createElement("p")

    imgartist.src = covers[i]
    partist.textContent = i+1 + ". " + artistes[i]

    table = document.querySelector('.result')

    divartist.appendChild(imgartist)
    tdcover.appendChild(divartist)
    tdinfos.appendChild(partist)

    tr.appendChild(tdcover)
    tr.appendChild(tdinfos)

    table.appendChild(tr)
  }
}

// supprime les elements du top actuel
function resetTop() {
  const trs = document.querySelectorAll('tr')
  trs.forEach(tr => {
      tr.remove()
  })
}

// lance le top artiste pour le mois passé à l'ouverture de la page
startTracks("short_term")

btn4w.addEventListener("click", () => {
  resetTop()
  btn4w.classList.add("active")
  btn6m.classList.remove("active")
  btnaw.classList.remove("active")
  if (isTrack) {
    startTracks("short_term")
  } else {
    startArtists("short_term")
  }
})

btn6m.addEventListener("click", () => {
  resetTop()
  btn4w.classList.remove("active")
  btn6m.classList.add("active")
  btnaw.classList.remove("active")
  if (isTrack) {
    startTracks("medium_term")
  } else {
    startArtists("medium_term")
  }
})

btnaw.addEventListener("click", () => {
  resetTop()
  btn4w.classList.remove("active")
  btn6m.classList.remove("active")
  btnaw.classList.add("active")
  if (isTrack) {
    startTracks("long_term")
  } else {
    startArtists("long_term")
  }
})

son.addEventListener("click", () => {
  isTrack = true
  soa.textContent = "sons"
  son.classList.add("active")
  artiste.classList.remove("active")
  startTracks(document.querySelector('.btn.active').value)
  resetTop()
})

artiste.addEventListener("click", () => {
  isTrack = false
  soa.textContent = "artistes"
  son.classList.remove("active")
  artiste.classList.add("active")
  startArtists(document.querySelector('.btn.active').value)
  resetTop()
})

// Enlève overflow: hidden à la fin de l'animation d'apparition
var elt = document.querySelectorAll('td');
elt.forEach(function (elt){
  elt.addEventListener('animationend', function() {
    elt.style.overflow = 'visible';
  })
});

// animation des covers
const covers = document.querySelectorAll(".cvr")
covers.forEach( el =>{
  el.addEventListener("mousemove", e =>{
    let elRect = el.getBoundingClientRect()

    let x = e.clientX - elRect.x
    let y = e.clientY - elRect.y

    let midCoverW = elRect.width / 2
    let midCoverH = elRect.height / 2

    // indice d'efficacité de l'effet
    let angleY = (x - midCoverW) / 3
    let angleX = (y - midCoverH) / 3

    el.children[0].style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.1)`
  })

  // replace la cover quand la souris part
  el.addEventListener("mouseleave", () => {
    el.children[0].style.transform = "rotateX(0) rotateY(0)"
  })
})