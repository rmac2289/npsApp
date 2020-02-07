'use strict';

const apiKey = '&api_key=eGxRVKcshgxWrMU14D9dReyvzX8mQNhxrdhu9Yo1'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function displayResults(responseJson) {
    console.log(responseJson);
    
    let newData = responseJson.data;
    $('#resultList').empty();
        newData.forEach(function(val){
            $('#resultList').append(
                `<li><h3><a class="links" href="${val.url}">${val.fullName}</a></h3>
                <p>${val.description}</p>
                <img src="${val.images[0].url}">`);
                if (val.addresses[0].type === "Mailing"){
                $('#resultList').append(`<h5>${val.addresses[1].line1}<br>${val.addresses[1].city}, ${val.addresses[1].stateCode} ${val.addresses[1].postalCode}</h5>
               </li>`)
                } else {
                    $('#resultList').append(`<h5>${val.addresses[0].line1}<br>${val.addresses[0].city}, ${val.addresses[0].stateCode} ${val.addresses[0].postalCode}</h5>
               </li>`)
                }
            })

        $('#results').removeClass('hidden');
    }
    
function getParks(searchTerm, limit=10) {
    const params = {
      stateCode: searchTerm,
      limit: limit,
      fields: ['addresses', 'images'],
      
    };
    const queryString = formatQueryParams(params);
    const newurl = searchURL + '?' + queryString + apiKey;
  
    {
    fetch(newurl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } 
            throw new Error(response.statusText);
        })
        .then(responseJson => 
            displayResults(responseJson))
        .catch(err => {
            $('#error').text(`Something went wrong: ${err.message}`)
        })

}}

    function watchForm() {
        $('form').submit(event => {
            event.preventDefault();
            const searchTerm = $('.text').val().split(',');
            const userMax = $('.maxnumber').val()
            getParks(searchTerm,userMax);
            $('#searchresult').html(`<h3 id="searchTerm">Results for ${searchTerm}:</h3>`)
        })
    }

    $(watchForm);