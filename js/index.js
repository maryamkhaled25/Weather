var subscribeEmail = document.getElementById('subscribeEmail') //form
var findLocation = document.getElementById('findLocation') //form
var findLocationInput = document.querySelector('.find-location input')

var errorCityMsg = document.getElementById('errorCityMsg')

var forecastCard = document.getElementById('forecastCard')

var city = ''


document.addEventListener('DOMContentLoaded', function () {
    getLocationAndWeather()
})

subscribeEmail.addEventListener('submit', function (e) {
    e.preventDefault()
})

findLocation.addEventListener('submit', function (e) { //when the form submit
    e.preventDefault()

    if (city === '') {
        errorCityMsg.classList.remove('d-none')
    } else {
        errorCityMsg.classList.add('d-none')
        getWeather(city)
    }
})

findLocationInput.addEventListener('input', function () {
    city = findLocationInput.value.trim()
    if (city.length >= 3) {
        getWeather(city)
    }
    errorCityMsg.classList.add('d-none')

})




async function getWeather(city) {
    try {
        const result = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c0f374d1e02547cc834153414251804&q=${city}&days=3`)
        const data = await result.json()

        const forecastArr = data.forecast.forecastday
        let cartona = ''

        for (let i = 0; i < forecastArr.length; i++) {
            const arrDay = forecastArr[i]
            const status = arrDay.day.condition.text;
            const dateObj = new Date(arrDay.date)  //Wed Apr 23 2025 02:00:00 GMT+0200
            let weekDay = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
            const dayNum = dateObj.getDate()
            const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
            const rain = arrDay.day.daily_chance_of_rain
            const wind = arrDay.day.maxwind_kph
            const compass = data.current.wind_dir
            const windDir = getWindDirection(compass)  // S N E W



            if (i === 0) {
                weekDay += ` (Today) `;
            }

            cartona += `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-4">
                        <div class="inner ${i === 0 ? 'bg-white' : ''}">
            
                        <div class="card-header d-flex justify-content-between">
                            <div class="day">${weekDay} </div>
                            <div class="date">${dayNum} ${monthName}</div>
                        </div>
            
                        <div class="card-content">
                            <div class="location">${data.location.name}</div>
                            <div class="degree d-flex justify-content-center py-5">
                            <div class="number">${arrDay.day.avgtemp_c} <sup>o</sup>C</div>
                            </div>
            
                            <div class="status d-flex justify-content-between align-items-center gap-2">
                            <div class="custom" id="customStatus">${status}</div>
                            <div class="icon"><img src="https:${arrDay.day.condition.icon}" alt="sun-img"></div>
                            </div>
            
                        </div>
            
                        <div class="card-footer">
                            <span id="rain"><i class="fa fa-umbrella"></i> ${rain}%</span>
            
                            <span id="wind"><i class="fa fa-wind"></i> ${wind}km/h</span>
            
                            <span id="compass"><i class="fa-solid fa-compass"></i> ${windDir}</span>
                        </div>
            
                        </div>
                    </div>
            `



        }


        forecastCard.innerHTML = cartona

    } catch (err) {
        console.log('Error in fetching', err);
    }

}



function getWindDirection(direction) {
    switch (direction) {
        case 'N': return "North";
        case 'NE': return "Northeast";
        case 'E': return "East";
        case 'SE': return "Southeast";
        case 'S': return "South";
        case 'SW': return "Southwest";
        case 'W': return "West";
        case 'NW': return "Northwest";
        default: return direction; // في حالة كانت القيمة غير معروفة
    }
}



async function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            // current location(lat, lon)
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // تحويل الإحداثيات لموقع المدينة باستخدام الـAPI
            const city = await getCityFromCoordinates(lat, lon);
            getWeather(city);
        }, function (error) {

            console.log("Error in getting location", error);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}


async function getCityFromCoordinates(lat, lon) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=c0f374d1e02547cc834153414251804&q=${lat},${lon}`);
        const data = await response.json();
        return data.location.name;  // city name
    } catch (err) {
        console.log("Error in fetching city name", err);
        return '';
    }
}


