var bt=document.getElementById('searchButton');
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('q');
const refreshToken=urlParams.get('q2');

sessionStorage.setItem("accessToken", accessToken);
sessionStorage.setItem('refreshToken',refreshToken);

async function getid(arist_name)//searching the playlist id which is {this is alan walker}
{
var id=1;

await fetch('https://api.spotify.com/v1/search?q='+'This%20is%20'+arist_name+'&type=playlist&limit=1',{
headers: {'Authorization':'Bearer '+accessToken}
}).then(res=>res.json())
.then(res=>{
id=(res.playlists.items[0].id);   
});

return id;
}

async function getInfo(id)//getting the details of the particular singers song
{   var finalData=[];
    
    await fetch('https://api.spotify.com/v1/playlists/'+id+'?market=IN',{
    headers: {'Authorization':'Bearer '+accessToken}
    }).then(res=>res.json())
    .then(data=>{
    var init=data.tracks.items;
    
    init.forEach((item)=>{
    
    var imgUrl=item.track.album.images[0].url;
    var name=item.track.name;
    var previewUrl=item.track.preview_url;

        finalData.push({
        'name':name,
        'img':imgUrl,
        'previewUrl':previewUrl
        });
       
    });

});

    
    return finalData;
}
















bt.addEventListener('click',()=>{
    //now here we will do fetch and load up our card elements
    //seems simple but it is not

    //at first step we will clear the actual card container in body
    //then we will append cards in it one by one
    //for that first create a card 
    
   


    var text=document.getElementById('search-button').value;
    var cardContainer=document.getElementsByClassName('card-container')[0];
    cardContainer.innerHTML="";
    
    
    
    
    
    //lets write the fetch function for our information
    
    console.log(text);


    getid(text)
    .then(id=>{
    var promise=getInfo(id);
    promise.then(res=>{
    
    for(var i=0;i<Math.min(res.length,30);i++)
    {
        //here for each element of javascript array we will create card elements and 
        //put in card container
        
        var content=` <div class="card text-white bg-dark mb-3" style="width: 21rem;">
    <div class="card-header"><h3 class='heading'>${res[i].name}<i class="fas fa-heart " id='heart' ></i></h3></div>
    <img src=${res[i].img} class="card-img-top" alt="...">
    <div class="card-body">
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    </div>
    <div class="card-footer"><audio
        controls>
        <source src=${res[i].previewUrl}></source>
        </audio></div>
</div>`

  //now what we want to do is perform a fetch request to our database
  //and if that song is present in favourites we will add red to its classlist
   var data={
    previewUrl:res[i].previewUrl,
    imgUrl:res[i].img,
    name:res[i].name
   }
   
   var arr=[];
   

   fetch('/checkFavourite',{
    method:"POST",
    body:JSON.stringify(data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
   }).then(res=>res.json())
   .then(dataa=>{
    
    var x=document.getElementsByTagName('source');
   
    for(var i=0;i<x.length;i++)
    {
        if(x[i].getAttribute('src')==dataa.previewUrl)
        {   var p=x[i].parentNode.parentNode.parentNode;
            p.getElementsByClassName('fas')[0].classList.add('red');
        }
    }


   
    

}
   )
   
   
   cardContainer.innerHTML+=content;
   
           
    }

    });

    });
    
    

    

});

document.addEventListener('click',function(event){

if(event.target&&event.target.id=='heart')
{
    event.target.classList.toggle('red');
    
    var x=(event.target.parentNode.parentNode.parentNode);
    
    var ImgUrl;var Name;var PreviewUrl;
    ImgUrl=x.getElementsByClassName('card-img-top')[0].getAttribute('src');
    Name=x.getElementsByClassName('heading')[0].innerText;
    PreviewUrl=x.getElementsByTagName('source')[0].getAttribute('src');
    
    
    //after grabbing all the information now we will make a post request to our database
   if(event.target.classList.contains('red')){
       console.log(event.target.classList);
    var data={
        previewUrl:PreviewUrl,
        imgUrl:ImgUrl,
        name:Name
        
    }
    fetch('/like',{
        method:"POST",
        body:JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(res=>console.log(res));
}
 
   else
   { console.log(event.target.classList);
    var data={
        name:Name,
        imgUrl:ImgUrl,
        previewUrl:PreviewUrl
    }
    

    fetch('/dislike',{
        method:"POST",
        body:JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(res=>console.log(res));
   }


    
}


});




document.addEventListener('play', function(e){
    
    alert('triggered');
    var players = document.getElementsByTagName('audio');
    [...players].forEach(player => {
      if(e.target != player){
        player.pause();
      }
    });
  });