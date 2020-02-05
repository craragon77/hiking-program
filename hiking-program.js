function userInput(){
    $(".submit").click(function(event){
        event.preventDefault();
        let startingPoint = $(".starting-point").val()
        $(".weather").empty()
        $("ul").empty()
        $("#showing-results").remove()
        console.log(startingPoint)
        cleaningAddress(startingPoint)
        $("form").removeClass("search-form").addClass("searched-form").addClass("orangeBox")
        $("input").removeClass(".question").addClass(".question-new-form")
        $("form").prepend(
            `<h2 id="showing-results">Showing Results in ${startingPoint}</h2>`
        )
    })
}
userInput()

function cleaningAddress(startingPoint){
    let cleaned_location = startingPoint.split(" ").join(",")
    console.warn(cleaned_location)
    accessingCoordinates(cleaned_location)
}
    

function accessingCoordinates(cleaned_location){
    const mapquestKey = 'ZGADDfaBd92GKnmxjk6sAupluGqbaZgG'
    fetch('https://www.mapquestapi.com/geocoding/v1/address?key=' + mapquestKey + '&location=' + cleaned_location)
        .then(response =>{
            if (response.ok){
                return response.json()
            }
        })
        .then(mapquestResponse => cleanCoordinates(mapquestResponse))
        .catch(error => console.warn("Uh-Oh Something Went Wrong! Try Again later!"));
}

function cleanCoordinates(mapquestResponse){
    console.warn(mapquestResponse)
    let latitude = mapquestResponse.results[0].locations[0].latLng.lat
    let longitude = mapquestResponse.results[0].locations[0].latLng.lng
    console.log(latitude, longitude)
    accessingTrail(latitude, longitude)
    sunRiseSunSet(latitude, longitude)
    weatherNearYou(latitude, longitude)
}

function accessingTrail(latitude, longitude, ){
    const hikingKey = '200675990-157903a155210b46749a394996f4474f'
    let requestedNumber = $(".requested-number").val() === "" ? 10 : $(".requested-number").val() 
    let maxMiles = $(".max-miles").val() === ""? 15 : $(".max-miles").val()
    fetch('https://www.hikingproject.com/data/get-trails?lat=' + latitude + '&lon=' + longitude + '&maxResults=' + requestedNumber + '&maxDistance='+ maxMiles + '&key=' + hikingKey)
        .then(response =>{
            if (response.ok){
                return response.json()
            }
        })
        .then(hikingResponse => renderTrails(hikingResponse))
        .catch(error => console.warn("your trail cannot be found at this time"))
}
function renderTrails(hikingResponse){
    console.warn(hikingResponse)
    for (let i = 0; i < hikingResponse.trails.length; i++){
        let trailPicture = hikingResponse.trails[i].imgMedium === "" ? "hiking-path.jpg" : hikingResponse.trails[i].imgMedium
        let trailDetails = hikingResponse.trails[i].conditionDetails === null ? "n/a" : hikingResponse.trails[i].conditionDetails
        $(".trail-results").append(
            `<section class="image-results">
                    <p class="trail-name">${hikingResponse.trails[i].name} (${hikingResponse.trails[i].location})</p>
                    <p>${hikingResponse.trails[i].length} miles long
                <div class="img-container">
                    <div class="img-itself">
                        <div class="frontside">
                            <img class="big-picture" src="${trailPicture}" alt="image not found :(">
                        </div>
                        <div class="backside">
                            <ul>
                                <li>${hikingResponse.trails[i].summary}</li><br>
                                <li>${hikingResponse.trails[i].difficulty} difficulty (Green = easy, Blue = medium, Black = challenging)</li><br>
                                <li>${hikingResponse.trails[i].stars}/5 stars based on ${hikingResponse.trails[i].starVotes} reviews</li><br>
                                <li>${hikingResponse.trails[i].ascent} ft ascent</li><br>
                                <li>${hikingResponse.trails[i].descent} ft decent</li><br>
                                <li>${hikingResponse.trails[i].high} ft above sea-level at its highest</li><br>
                                <li>${hikingResponse.trails[i].low} ft above sea-level at its lowest</li><br>
                                <li>Trail Condition: ${hikingResponse.trails[i].conditionStatus} as of ${hikingResponse.trails[i].conditionDate}</li><br>
                                <li>Trail Condition Description: ${trailDetails}</li><br>
                                <li>Learn more at: <a>${hikingResponse.trails[i].url}</a>
                            </ul>
                        </div>
                    </div>
                </div>
            </section`
        )
    }
}
function sunRiseSunSet(latitude, longitude){
    const sunAPIKey = 'adf056764b2641d1a74b3b927c167240'
    fetch('https://api.ipgeolocation.io/astronomy?apiKey=' + sunAPIKey + '&lat=' + latitude + '&long=' + longitude )
        .then(response =>{
            if (response.ok){
            return response.json()
        }
    })
    .then(sunResponseJson => hereComesTheSun(sunResponseJson))
    .catch(error => "Guess you don't have the sun? Oh well!")
}
function hereComesTheSun(sunResponseJson){
    console.log(sunResponseJson)
    $(".weather").prepend(
        `<div class="sun-movements">
            <p>The Sun will rise at ${sunResponseJson.sunrise} and set at ${sunResponseJson.sunset}
        </div>`
    )
}
function weatherNearYou(latitude, longitude){
    let openWeatherKey = 'b67adfa745a7fb5ba49a440a715c89f9'
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + openWeatherKey)
    .then(response => {
        if(response.ok){
            return response.json()
        }
    })
    .then(weatherResponse => renderTemperature(weatherResponse))
    .catch(error => alert("The sky is falling!"))
}
function convertToFarenheight(tempKelvin){
    let tempFar = Math.round((9 / 5) * (tempKelvin - 275) + 32)
    return tempFar
}
function convertToCelcius(tempKelvin){
    let tempCel = Math.round(tempKelvin - 273.15)
    return tempCel
}

function renderTemperature(weatherResponse){
    console.log(weatherResponse)
    let currentTempFar = convertToFarenheight(weatherResponse.main.temp)
    let feelsLikeTempFar = convertToFarenheight(weatherResponse.main.feels_like)
    let tempMinFar = convertToFarenheight(weatherResponse.main.temp_min)
    let tempMaxFar = convertToFarenheight(weatherResponse.main.temp_max)
    let currentTempCel = convertToCelcius(weatherResponse.main.temp)
    let feelsLikeTempCel = convertToCelcius(weatherResponse.main.feels_like)
    let tempMinCel = convertToCelcius(weatherResponse.main.temp_min)
    let tempMaxCel = convertToCelcius(weatherResponse.main.temp_max)
    $(".weather").replaceWith(
        `<section class="weather orangeBox">
            <div class="forecast">
                <img src="https://openweathermap.org/img/wn/${weatherResponse.weather[0].icon}.png" alt="weather">
                <p>${weatherResponse.weather[0].description}</p>
                <p>${weatherResponse.main.humidity} % humidity</p>
            </div>
            <div class="temp">
                <p>It's currently ${currentTempFar} °F/ ${currentTempCel} °C</p>
                <p>Feels like ${feelsLikeTempFar} °F / ${feelsLikeTempCel} °C</p>
                <p>High of ${tempMaxFar} °F / ${tempMaxCel} °C and a low of ${tempMinFar} °F/ ${tempMinCel} °C</p>
                <p>${weatherResponse.wind.speed} mph winds</p>
            </div>
        </section>`
    )
}

function newSearchButton(){
    $(".submit").click(function(event){
        $(".title").replaceWith(
            `<section class="title"> 
                <h2 id="bearfoot">BearFoot</h2>
            </section>`
        )
        $(".search-form").replaceWith(
            `<form class="searched-form">
                <div class="question-new-form">
                    Type an address, location, or zip code to see nearby hiking trails
                    <input type="text" class="starting-point" placeholder="Washington, DC" required>
                </div>
                <div class="question-new-form">
                    I want to view <input type="number" class="requested-number" placeholder="10">trails in my area
                </div>
                <div class="question-new-form">
                    I want to hike no more than <input type="number" class="max-miles" placeholder="15"> miles
                </div>
                <div>
                    <button class="submit">Explore!</button>
                </div>
                </form>`
        )
    })
}

