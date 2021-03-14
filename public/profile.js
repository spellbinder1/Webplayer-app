const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('q');

console.log('accessToken is '+accessToken);

fetch('https://api.spotify.com/v1/me',{headers: {'Authorization':'Bearer '+accessToken}})
.then(res=>res.json())
.then(res=>{
console.log(res);

var rr=document.getElementById('root');
rr.innerHTML=`<div>
<img src='https://i.scdn.co/image/ab6775700000ee85bccf45da1815d6de725cf341'>

<div><span class="material-icons md-48">perm_identity</span>   <h1 class='info'>${res.display_name}</h1></div>
<div><span class="material-icons md-48">email</span>  <h1 class='info' >${res.email}</h1></div>
<div><span class="material-icons md-48">face</span>   <h1 class='info'>${res.followers.total}</h1></div>
<div><h1><a href=${res.external_urls.spotify}> <span class="material-icons md-48">link</span> </a></h1></div>
<div><img src="https://www.countryflags.io/${res.country}/flat/64.png"> <h1 class='info'> India </h1></div>
<div><h1><span class="material-icons md-48">check_circle_outline</span>${res.id} </h1></div>
<hr style="height:2px;border-width:1;color:white;background-color:white">
</div>`;

});
