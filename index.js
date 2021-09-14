// === IP API === //
//  https://geo.ipify.org/api/v1?apiKey=at_buolCeBWmSm37OCUs5M7VfDn6RD38&ipAddress=

const ipAddressElement = document.getElementById("ip-address");
const locationElement = document.getElementById("location");
const timezoneElement = document.getElementById("timezone");
const ispElement = document.getElementById("isp");
const errorElement = document.getElementById("error-message");
const formElement = document.getElementById("ip-domain-search");
// let mymap = L.map("mapid");

function removeMap(map) {
  map.off();
  map.remove();
}

formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  errorElement.classList.add("show");
  errorElement.innerHTML =
    "Looks like you didn't enter a domain or an IP address. A domain looks something like 'google.com' or 'mozilla.org'. An IP address looks something like '8.8.8.8'or '172.67.150.108'";
});

function fetchFakeipAndMapData() {
  data = {
    ip: "8.8.8.8",
    location: {
      country: "US",
      region: "California",
      city: "Mountain View",
      lat: 37.38605,
      lng: -122.08385,
      postalCode: "94035",
      timezone: "-07:00",
      geonameId: 5375480,
    },
    domains: [
      "0--9.ru",
      "000180.top",
      "00049ok.com",
      "000xs.net",
      "001998.com.he2.aqb.so",
    ],
    as: {
      asn: 15169,
      name: "Google LLC",
      route: "8.8.8.0/24",
      domain: "https://about.google/intl/en/",
      type: "Content",
    },
    isp: "Google LLC",
    proxy: { proxy: false, vpn: false, tor: false },
  };

  ipAddressElement.innerHTML = data.ip;
  locationElement.innerHTML = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
  timezoneElement.innerHTML = data.location.timezone;
  ispElement.innerHTML = data.isp;
}

async function fetchipAndMapData() {
  let userInput = {
    value: document.getElementById("ip-domain-user-input").value,
    type: null,
  };
  if (userInput.value.match(/\d*\.\d*\.\d*\.\d*/)) {
    userInput.type = "ipAddress";
  } else {
    userInput.type = "domain";
  }

  // if no user input => get default API value (which uses user's IP address as a default)
  const url = userInput.value
    ? `https://geo.ipify.org/api/v1?apiKey=at_buolCeBWmSm37OCUs5M7VfDn6RD38&${userInput.type}=${userInput.value}`
    : "https://geo.ipify.org/api/v1?apiKey=at_buolCeBWmSm37OCUs5M7VfDn6RD38";
  const res = await fetch(url);
  const data = await res.json();

  if (data.location) {
    removeMap(mymap);
    ipAddressElement.innerHTML = data.ip;
    locationElement.innerHTML = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    timezoneElement.innerHTML = data.location.timezone;
    ispElement.innerHTML = data.isp;
    // === Map API === //

    mymap = L.map("mapid").setView([data.location.lat, data.location.lng], 13);

    await L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3dlZW5lanAiLCJhIjoiY2t0aHB6d3k3MHU0MjMxbXZtMnBjdnRqZSJ9.CAZHA9NWRWytRhDCtDAHGw",
      {
        attribution:
          '<a href="https://www.mapbox.com/about/maps">&copy Mapbox</a>, <a href="http://www.openstreetmap.org/copyright">&copy OpenStreetMap</a>, <a href="https://www.mapbox.com/map-feedback/">Improve this map</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: "your.mapbox.access.token",
      }
    ).addTo(mymap);
  } else {
    handleError();
  }
}
