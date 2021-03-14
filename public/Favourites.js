fetch('/favour').then(res=>res.json())
.then(data=>{

var x=document.getElementsByClassName('card-container')[0]

x.innerHTML="";

if(data.Favourites.length==0)alert('NO Favourites Present');


for(var i=0;i<data.Favourites.length;i++)
{  var res=data.Favourites;
    var content=` <div class="card text-white bg-dark mb-3" style="width: 21rem;">
    <div class="card-header"><h3 class='heading'>${res[i].name}<i class="fas fa-heart red" id='heart' ></i></h3></div>
    <img src=${res[i].imgUrl} class="card-img-top" alt="...">
    <div class="card-body">
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    </div>
    <div class="card-footer"><audio
        controls>
        <source src=${res[i].previewUrl}></source>
        </audio></div>
</div>`

x.innerHTML+=content;

}

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
         
       
        console.log(event.target.classList);
        var data={
            name:Name,
            imgUrl:ImgUrl,
            previewUrl:PreviewUrl
        }
        
        x.remove();
    
        fetch('/dislike',{
            method:"POST",
            body:JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(res=>console.log(res));
       
    
    
        
    }
    
    
});
    
    

document.addEventListener('play', function(e){
    var players = document.getElementsByTagName('audio');
    [...players].forEach(player => {
      if(e.target != player){
        player.pause();
      }
    });
  });