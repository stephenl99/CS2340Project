// Initialize and add the map
let map;

async function initMap() {
  const lats = await fetch('aff/../static/latitude.txt');
  const latitudes = await lats.text();
  const longs = await fetch('aff/../static/longitude.txt');
  const longitudes = await longs.text();
  const n = await fetch('aff/../static/name.txt');
  const names = await n.text();
  const cats = await fetch('aff/../static/categories.txt');
  const categories = await cats.text();
  const r = await fetch('aff/../static/stars.txt');
  const stars = await r.text();
  const a = await fetch('aff/../static/address.txt');
  const addresses = await a.text();
  const at = await fetch('aff/../static/attributes.txt');
  const attributes = await at.text();
  //const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const firstLat = latitudes.split('\n')[0]
  const l = parseFloat(firstLat)
  const firstLong = longitudes.split('\n')[0]
  const long = parseFloat(firstLong)

  const position = { lat: l, lng: long};

    const {Map} = await google.maps.importLibrary("maps");

    // The map, centered in Atlanta
    map = new Map(document.getElementById("map"), {
        zoom: 8,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

  placeMarkers(1, latitudes, longitudes, names);
  getRestaurant(names, latitudes, longitudes, categories, stars, addresses, attributes);
}

async function placeMarkers(number, latitudes, longitudes, names) {
    const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
    const {InfoWindow} = await google.maps.importLibrary("maps")
    for (var i = 0; i < number; i++) {
        const lat = latitudes.split('\n')[i]
        const long = longitudes.split('\n')[i]
        const name = names.split('\n')[i]
        const positionVariable = {lat: parseFloat(lat), lng: parseFloat(long)}
        const contentString =
          '<div id="content">' +
          '<div id="siteNotice">' +
          "</div>" +
          '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>' +
          '<div id="bodyContent">' +
          "<p> information about the restaurant and cuisine, etc </p>" +
          "</div>";

        const infowindow = new google.maps.InfoWindow({
          content: contentString,
          ariaLabel: name,
        });
        const marker = new AdvancedMarkerElement({
            map: map,
            position: positionVariable,
            title: name,
        });
       marker.addListener("click", () => {
          infowindow.open({
            anchor: marker,
            map,
          });
        });
    }
}

async function getRestaurant(names, latitudes, longitudes, categories, stars, addresses, attributes) {
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  var input = document.getElementById('restaurant');
  filter = input.value.toUpperCase();
  input.addEventListener("dblclick", function(event) {
    for (var i = 0; i < 1000; i++) {
      var actName = names.split('\n')[i].toUpperCase();
      var category = categories.split('\n')[i].toUpperCase();
      var address = addresses.split('\n')[i].toUpperCase();
      const description = attributes.split('\n')[i];
      if (actName == filter || actName.includes(filter) || category.includes(filter) || address.includes(filter)) {
        const lat = latitudes.split('\n')[i]
        const long = longitudes.split('\n')[i]
        const star = stars.split('\n')[i]
        const location = {lat: parseFloat(lat), lng: parseFloat(long)};
        const property = {
          type: "store-alt",
          address: address,
          description: "ex: cozy coffee shop ",
          name: actName,
          cuisine: "cuisine of restaurant",
          rating: star,
        }
        const marker = new AdvancedMarkerElement({
          map: map,
          position: location,
          title: actName,
        });
        const contentString =
          '<div id="content">' +
          '<div id="siteNotice">' +
          "</div>" +
          '<h1 id="firstHeading" class="firstHeading">' + actName + '</h1>' +
          '<div id="bodyContent">' +
          "<p>" + category + ", " + star + "</p>" +
          "</div>";

        const infowindow = new google.maps.InfoWindow({
            content: contentString,
            ariaLabel: name,
          });
                 marker.addListener("click", () => {
            infowindow.open({
              anchor: marker,
              map,
            });
          });
      }
    }
  });
}

initMap();