$(document).ready(function(){

    //on submit event listener
    $("#submit").on("click", function(event){
        //to stop page from reloading on 'submit' click
        event.preventDefault();
        //to clear out food info if anything was present before
        $(".foodInfo").empty();
        //getting user input
        cityName = $("#cityName").val().trim();
        console.log(cityName);
    
        //1st ajax call to Meta Weather to get WOEID for that City
        var weatherQueryURL = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=" + cityName;

        $.ajax({
            url: weatherQueryURL,
            method: "GET",
            headers: {
                "accept": "application/json",
                "x-requested-with": "xmlhttprequest",
                "Access-Control-Allow-Origin":"*"
            }
        }).then(function(weatherResponse) {
            console.log(weatherResponse);
            cityWoeid = weatherResponse[0].woeid;
            console.log(cityWoeid);
        //2nd ajax call to Meta Weather to use the WOEID for the selected city
        }).then(function(){
            var weatherQueryURL2 = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/" + cityWoeid;

            $.ajax({
                url: weatherQueryURL2,
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "x-requested-with": "xmlhttprequest",
                    "Access-Control-Allow-Origin":"*"
                }
            //after getting the WOEID from first call, appeding the appropriate imformation to the DOM
            }).then(function(weatherResponse2) {
                console.log(weatherResponse2);
                console.log(weatherResponse2.consolidated_weather[0].the_temp);
                $("#city").text("City: " + cityName)
                $("#temp").text("Temperature (F): " + (weatherResponse2.consolidated_weather[0].the_temp * 1.8 + 32).toFixed(2));
                $("#humidity").text("Humidity: " + weatherResponse2.consolidated_weather[0].humidity);
                $("#windSpeed").text("Wind Speed (mph): " + (weatherResponse2.consolidated_weather[0].wind_speed).toFixed(2));
                //changing the image displayed based on the responst from weather API
                if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "sn") {
                    weatherState = "sn";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "sl") {
                    weatherState = "sl";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "h") {
                    weatherState = "h";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "t") {
                    weatherState = "t";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "hr") {
                    weatherState = "hr";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "lr") {
                    weatherState = "lr";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "s") {
                    weatherState = "s";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "hc") {
                    weatherState = "hc";
                } else if (weatherResponse2.consolidated_weather[0].weather_state_abbr == "lc") {
                    weatherState = "lc";
                } else {
                    weatherState = "c";
                };
                $("#weatherPic").attr("src", "https://www.metaweather.com/static/img/weather/" + weatherState + ".svg");
        });
    });

        //Ajax call to yelp using the input city
        var foodQueryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=restaurants&location=" + cityName + "&limit=10";
        var apiKey = "tM-UqkhLSQAbJwmpKiTeXGPAagl3_g8ZSo1kpVtGKCbvuT1JLc9RIDJ9G425PSBg_90EakpuaP0p-9fUBWjoX257R6vRewtfaRzJWwoHtUDsxPRga7k0-ArIHPexXHYx" 

        $.ajax({
            url: foodQueryURL,
            method: "GET",
            headers: {
                "accept": "application/json",
                "x-requested-with": "xmlhttprequest",
                "Access-Control-Allow-Origin":"*",
                "Authorization": `Bearer ${apiKey}`
            }
        }).then(function(foodResponse) {
            console.log(foodResponse);
            for ( i = 0; i < foodResponse.businesses.length; i++) {
                var foodDiv = $("<div>");
                var $p = $("<p>").text("Name: " + foodResponse.businesses[i].name);
                foodDiv.addClass("foodInfo");
                foodDiv.append($p);
                $("#foodGoesHere").prepend(foodDiv);
            }
        });
    });
});