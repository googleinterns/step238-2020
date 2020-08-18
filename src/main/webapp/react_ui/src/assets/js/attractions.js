const API_KEY = config.SECRET_KEY;

document.addEventListener('click',function(e)
{
    if(e.target && e.target.id == 'submit_button')
    {
        const searchValue = document.getElementById('searchbox').value;
        console.log(searchValue);
        searchValue.replace(/\s/g, '%20');
        const url = 'https://m...content-available-to-author-only...s.com/maps/api/place/findplacefromtext/json?input=' + searchValue +
        '&inputtype=textquery&fields=geometry&key=' + API_KEY;
        console.log(url);
        fetch(url)
        .then(response => response.json())
        .then(function(data){
            console.log(data);
            const lat = data.candidates[0].geometry.location.lat;
            const lng = data.candidates[0].geometry.location.lng;
            const adress = '/attractions?lat=' + lat + '&long=' + lng;
            console.log(adress);
            fetch(adress)
            .then(response => response.json())
            .then(function (attractions){
        setTimeout(function(){
        const list = document.getElementById("attractions_list");
        console.log(list);
        const listDiv = document.createElement("div");
        listDiv.className = "row";
        listDiv.innerHTML = attractions;
        list.appendChild(listDiv);
        
      }
      , 200);
    }
);
})
} })