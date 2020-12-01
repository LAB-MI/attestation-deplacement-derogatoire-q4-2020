
/**
 * OSM example here: http://esri.github.io/esri-leaflet/examples/geocoding-control.html
 */

// France bounding rect
const southWest = L.latLng(42.144314, -5.428104);
const northEast = L.latLng(51.369423, 9.029903);
const franceBounds = L.latLngBounds(southWest, northEast); // métropole

// add a hidden div with id 'osm-zone'
function addHtmlElement() {
  const checkboxWithMap = document.querySelector('.form-checkbox [for="checkbox-sport_animaux"]')
  const mapHtmlElement = document.createElement('div')
  mapHtmlElement.id = 'osm-zone'
  mapHtmlElement.style.height = '400px'
  checkboxWithMap.parentNode.insertBefore(mapHtmlElement, checkboxWithMap.nextSibling);
}

function setupLeaflet() {
  // setup leaflet and center on Nantes
  const map = L.map('osm-zone', {scrollWheelZoom: 'center'}).setView([47.2173, -1.5534], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // init search form
  const searchControl = L.esri.Geocoding.geosearch({ zoomToResult: false, searchBounds: franceBounds }).addTo(map)
  const results = L.layerGroup().addTo(map)
  searchControl.on('results', function (data) {
    results.clearLayers()
    for (let i = data.results.length - 1; i >= 0; i--) {
      results.addLayer(L.marker(data.results[i].latlng))
    }
    map.setView(data.results[0].latlng, 13)
  });

  // create a circle in the center of map
  const circle = L.circle(map.getCenter(), {
    radius: 1000,
    color: 'red',
    weight: 1,
    fillOpacity: 0.15,
  }).addTo(map)

  // move circle with the map
  map.on('move', (e) => {
    circle.setLatLng(map.getCenter())
    map._renderer._update()
  })

  goToFormAddress(map)

  window.MAP = map // debug
}

// when address is set into the form, we center the map to this addresse
function goToFormAddress(map) {
  const address = document.getElementById('field-address').value
  const city = document.getElementById('field-city').value

  if (address == '' && city == '')
      return;

  const geocode = L.esri.Geocoding.geocode()

  if (!!address && address.length) geocode.address(address)
  if (!!city && city.length) geocode.city(city)

  geocode.within(franceBounds).country('France').run((err, response) => {
    if (err) {
      console.error(err)
      return
    }

    if (response.results.length == 0)
      return
    
    const latlng = response.results[0].latlng
    // map.flyTo(latlng, 13, {duration: 1})
    map.setView(latlng, 13);
  })
}

function closeLeaflet() {
  document.getElementById('osm-zone').remove();
}

function onCheckboxSwitched() {
  // show/hide map on checkbox selection
  if (this.checked) {
    addHtmlElement()
    setupLeaflet();
  }
  else {
    closeLeaflet();
  }
}

export function appendMap() {
  document.getElementById('checkbox-sport_animaux').addEventListener('change', onCheckboxSwitched);
};
