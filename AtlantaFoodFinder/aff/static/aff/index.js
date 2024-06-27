// Initialize and add the map
let map;
let markersList = [];
favorites = [];
userLat = 0.0;
userLong = 0.0;
let userName = "temp";


let latitudes;
let longitudes;
let names;
let categories;
let stars;
let addresses;
let attributes;
let business_ids;
let length;
async function initMap() {
    const lats = await fetch('aff/../static/latitude.txt');
    latitudes = await lats.text();
    const longs = await fetch('aff/../static/longitude.txt');
    longitudes = await longs.text();
    const n = await fetch('aff/../static/name.txt');
    names = await n.text();
    const cats = await fetch('aff/../static/categories.txt');
    categories = await cats.text();
    const r = await fetch('aff/../static/stars.txt');
    stars = await r.text();
    const a = await fetch('aff/../static/address.txt');
    addresses = await a.text();
    const at = await fetch('aff/../static/attributes.txt');
    attributes = await at.text();
    const bid = await fetch('aff/../static/business_id.txt');
    business_ids = await bid.text();
    //length = names.split('\n').length;
    length = 1000;


    const {Map} = await google.maps.importLibrary("maps");

    // The map, centered in Atlanta
    map = new Map(document.getElementById("map"), {
        zoom: 9,
        center: {lat: 33.7488, lng: -84.3877},
        mapId: "DEMO_MAP_ID",
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Browser does not support geolocation.");
    }

  await getRestaurantGeneral();
  await getRestaurantCuisine();
  await getRestaurantRating();
  await getRestaurantRadius();
  //await choiceCuisine("empty");
}

async function showPosition(position) {
    const {AdvancedMarkerElement, PinElement} = await google.maps.importLibrary("marker");
    let userLat = position.coords.latitude;
    let userLong = position.coords.longitude;
    const location = {lat: userLat, lng: userLong};
    const pinChanges = new PinElement({
        background: "#4cbbd3",
        borderColor: "#FFFFFF",
        glyphColor: "#FFFFFF",
        scale: 1.5,
  });
    const marker = new AdvancedMarkerElement({
        map: map,
        position: location,
        content: pinChanges.element,
        title: "Your Location",
    });
}

async function getRestaurantGeneral() {
  clearMarkers();
  const input = document.getElementById('restaurant');
  filter = input.value.toUpperCase();
  input.addEventListener("dblclick", function(event) {
    for (var i = 0; i < length; i++) {
        const actName = this.names.split('\n')[i].toUpperCase();
        const category = categories.split('\n')[i].toUpperCase();
        const address = addresses.split('\n')[i].toUpperCase();
        const description = attributes.split('\n')[i];
      if (actName === filter || actName.includes(filter) || category.includes(filter) || address.includes(filter)) {
          const lat = latitudes.split('\n')[i]
          const long = longitudes.split('\n')[i]
          const star = stars.split('\n')[i]
          const business_id = business_ids.split('\n')[i]
          makeMarker(lat, long, actName, category, star, business_id);
      }
    }
  });
}

async function display_list() {
    var list = document.getElementById("cuisine_id");
    if (list.style.display === "block") {
        list.style.display = "none"
    } else {
        list.style.display = "block";
    }
}

async function choiceCuisine(name) {
    clearMarkers();
    for (let i = 0; i < length; i++) {
        if (categories.split('\n')[i].toUpperCase().includes(name.toUpperCase())) {
            const lat = latitudes.split('\n')[i];
            const long = longitudes.split('\n')[i];
            await makeMarker(lat, long, names.split('\n')[i], categories.split('\n')[i], stars.split('\n')[i], business_ids.split('\n')[i]);
        }
    }
}

async function getRestaurantCuisine() {
  clearMarkers();
  var input = document.getElementById('restaurantCuisine');
  filter = input.value.toUpperCase();
  input.addEventListener("dblclick", function(event) {
    for (var i = 0; i < length; i++) {
        const actName = names.split('\n')[i].toUpperCase();
        const category = categories.split('\n')[i].toUpperCase();
        const address = addresses.split('\n')[i].toUpperCase();
        const description = attributes.split('\n')[i];
      if (category.includes(filter)) {
          const lat = latitudes.split('\n')[i]
          const long = longitudes.split('\n')[i]
          const star = stars.split('\n')[i]
          const business_id = business_ids.split('\n')[i]
          makeMarker(lat, long, actName, category, star, business_id);
      }
    }
  });
}

async function getRestaurantRating() {
  clearMarkers();
  var input = document.getElementById('restaurantStar');
  filter = input.value;
  input.addEventListener("dblclick", function(event) {
    for (var i = 0; i < length; i++) {
        const actName = names.split('\n')[i].toUpperCase();
        const category = categories.split('\n')[i].toUpperCase();
        const address = addresses.split('\n')[i].toUpperCase();
        const star = stars.split('\n')[i];
        if (star.includes(filter)) {
          const lat = latitudes.split('\n')[i];
          const long = longitudes.split('\n')[i];
          const star = stars.split('\n')[i];
          const business_id = business_ids.split('\n')[i];
          makeMarker(lat, long, actName, category, star, business_id);
      }
    }
  });
}

async function getRestaurantRadius() {
  clearMarkers();
    const input = document.getElementById('restaurantRadius');
    let filter = input.value;
  input.addEventListener("dblclick", function(event) {
    for (let i = 0; i < length; i++) {
        const lat = latitudes.split('\n')[i]
        const long = longitudes.split('\n')[i]
      if (getDistanceFromLatLonInKm(userLat, userLong, lat, long) <= parseFloat(filter)) {
          const actName = this.names.split('\n')[i].toUpperCase();
          const category = categories.split('\n')[i].toUpperCase();
          const address = addresses.split('\n')[i].toUpperCase();
          const star = stars.split('\n')[i];
          const business_id = business_ids.split('\n')[i];
          makeMarker(lat, long, actName, category, star, business_id);
      }
    }
  });
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

async function makeMarker(lat, long, name, category, star, business_id) {
    let newName = name.replaceAll("'", "`");
    let newCategory = category.replaceAll("'", "`");
    let newBusiness_id = "https://www.yelp.com/biz/" + business_id;
    let leaveReview = "https://www.yelp.com/writeareview/biz/" + business_id + "?return_url=%2Fbiz%2F" + business_id + "&review_origin=biz-details-war-button";
    //alert(newBusiness_id);
    const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
    const location = {lat: parseFloat(lat), lng: parseFloat(long)};
    const marker = new AdvancedMarkerElement({
        map: map,
        position: location,
        title: newName,
    });
    const contentString = `
        <div>
            <h3>${newName}</h3>
            <p><strong>Categories:</strong> ${newCategory}</p>
            <p><strong>Rating:</strong> ${star}</p>
            <p><a href="${leaveReview}" target = "_blank">Leave a review on Yelp</a></p>
            <button onclick="addToFavorites('${lat}', '${long}','${newName}', '${newCategory}', '${star}', '${business_id}')">Add to Favorites</button>
        </div>
    `;


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
    markersList.push(marker);
}

function addToFavorites(name) {
    //const fs = require('fs');
    //fs.writeFile('userFavoritesList.txt', "hello", err => {
      //  if (err) throw err;
    //});
    favorites.push(name);
    alert(favorites.length + ", " + name + ", " + userName);
}

async function name(inputName, fav) {
    userName = inputName;
    favorites = fav;
    alert(userName + ", " + favorites);
}

async function showFavorites() {
    clearMarkers();
    //alert(ids.split('\n')[0]);
    //alert(ids.split('\n')[0] === 'z8-_6l5EhX5NuPfWzJYQMA');
    for (var i = 0; i < 100; i++) {
        var tempID = String(business_ids.split('\n')[i]);
        //alert(tempID);
        for (var j = 0; j < favorites.length; j++) {
            var s = favorites[j];
            //alert(s);
            if (s === tempID) {
                alert("working, " + s);
                var actName = names.split('\n')[i].toUpperCase();
                var category = categories.split('\n')[i].toUpperCase();
                const lat = latitudes.split('\n')[i];
                const long = longitudes.split('\n')[i];
                const star = stars.split('\n')[i];
                const business_id = business_ids.split('\n')[i];
                await makeMarker(parseFloat(lat), parseFloat(long), actName, category, star, business_id);
            }
        }
    }
}

function clearMarkers() {
    for (let j = 0; j < markersList.length; j++) {
      markersList[j].map = null;
    }
}

initMap();