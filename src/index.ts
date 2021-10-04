/*
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
import "./style.css";
// require("./JS/script.js");

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
export let geometriLocationLang = 0;
export let geometriLocationLate = 0;

async function initMap(geometriLocationLang: number | undefined, geometriLocationLate: number | undefined): Promise<void> {

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 47.21387, lng: 38.93344 },
      zoom: 13,
      mapTypeControl: false,
    }
  );
  const card = document.getElementById("pac-card") as HTMLElement;
  const input = document.getElementById("pac-input") as HTMLInputElement;
  const biasInputElement = document.getElementById(
    "use-location-bias"
  ) as HTMLInputElement;
  const strictBoundsInputElement = document.getElementById(
    "use-strict-bounds"
  ) as HTMLInputElement;
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
    types: ["establishment"],
  };

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo("bounds", map);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById(
    "infowindow-content"
  ) as HTMLElement;

  infowindow.setContent(infowindowContent);

  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
  });

  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);

    const place = autocomplete.getPlace();
    console.log('place', place);
    geometriLocationLang = place.geometry?.location?.lng()
    geometriLocationLate  = place.geometry?.location?.lat()
    console.log('geometriLocationLang', geometriLocationLang);
    console.log('geometriLocationLate', geometriLocationLate);
    
    
    
    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(14);
    }
    
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent =
    place.formatted_address;
    infowindow.open(map, marker);

    if(place){
      GetWather();
    }
    
  });
  
  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    const radioButton = document.getElementById(id) as HTMLInputElement;
    
    radioButton.addEventListener("click", () => {
      autocomplete.setTypes(types);
      console.log("TEST INPT VALUE 3", input.value)
      
      input.value = "";
    });
  }
  
  setupClickListener("changetype-all", []);
  setupClickListener("changetype-address", ["address"]);
  setupClickListener("changetype-establishment", ["establishment"]);
  setupClickListener("changetype-geocode", ["geocode"]);
  setupClickListener("changetype-cities", ["(cities)"]);
  setupClickListener("changetype-regions", ["(regions)"]);
  
  biasInputElement.addEventListener("change", () => {
    if (biasInputElement.checked) {
      autocomplete.bindTo("bounds", map);
    } else {
      // User wants to turn off location bias, so three things need to happen:
      // 1. Unbind from map
      // 2. Reset the bounds to whole world
      // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
      autocomplete.unbind("bounds");
      autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 });
      strictBoundsInputElement.checked = biasInputElement.checked;
    }
    
    input.value = "";
  });
  
  strictBoundsInputElement.addEventListener("change", () => {
    autocomplete.setOptions({
      strictBounds: strictBoundsInputElement.checked,
    });
    
    if (strictBoundsInputElement.checked) {
      biasInputElement.checked = strictBoundsInputElement.checked;
      autocomplete.bindTo("bounds", map);
    }
    
    input.value = "";
  });

  const createTable = (td) => {
    let newTR = document.createElement('tr');
    let newTH = document.createElement('th')
    newTH.innerText = td.wind_cdir;

  }

  async function GetWather (){

    const table: HTMLElement | null = document.getElementById("createTable")

    let Position = `&lat=${geometriLocationLate}&lon=${geometriLocationLang}&key=3e5a7edcafad4a91810e3f2484395f59`;
    const weatherURL: string = "http://api.weatherbit.io/v2.0/forecast/daily?";
    let getWeatherApi = fetch(weatherURL+Position);
    
    if (getWeatherApi){
      let resWeather = await (await getWeatherApi).json();
      console.log("weather response", resWeather);

      let weatherArr: string[] = [];
      weatherArr = resWeather.data;
      weatherArr.map((day, index) => {
        let trd = document.createElement('tr');
        let tdh = document.createElement('th');
        //@ts-ignore
        tdh.innerText = day.wind_cdir
        trd.append(tdh)
        table?.append(trd)
        console.log('MAP WORK', tdh)
      })
      console.log("ARRAY", weatherArr)


    } else {
      console.log("Bad request", getWeatherApi)
    }
    
  }
  const test = document.getElementById("test") as HTMLElement 

}
export { initMap };

console.log(initMap)
