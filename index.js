const express=require('express');
const app=express();

const fetch=require('node-fetch');
const bodyParser = require("body-parser");
global.accessToken;
global.refreshToken;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
global.currentUserId;
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin-anshuman:test123@cluster0.v667o.mongodb.net/wbpDB",{useNewUrlParser:true});

const UserSchema=new mongoose.Schema({
    _id:String,
    userName:String,
    Followers:Number,
    Link:String,
    Country:String,
    Favourites:[{
        previewUrl:String,
        imgUrl:String,
        name:String
    }]

});


const User=mongoose.model("User",UserSchema);




async function AuthenticateUser()
{
    await fetch('https://api.spotify.com/v1/me',{headers: {'Authorization':'Bearer '+accessToken}})
    .then(res=>res.json())
    .then(res=>{
    const id=res.id;
    const name=res.display_name;
    const followers=res.followers.total;
    const link=res.external_urls.spotify;
    const country=res.country;
    
    
    currentUserId=id;
    console.log('ID IS '+currentUserId);
    //now we will find if any users exist by this name or not 
    //if does not exist we will add this 
    //user to our database
    
    User.findById(id,function(err,docs){
    if(docs==null)//since in this case we did not found user now we will add this user to our database
    {
        var user=new User({
            _id:id,
            username:name,
            Followers:followers,
            Link:link,
            Country:country,
            Favourites:[]
        });

        user.save();

        console.log('Saved to Database');
    }
    else console.log('User Already Present');
    });
    
    });
}





app.get('/login',(req,res)=>{

    var url="https://accounts.spotify.com/authorize?";
    url+="client_id=0a42518cc5a64aa6b4ddf582443944c6";
    url+="&"+"response_type=code";
    url+="&"+"redirect_uri=https://shielded-shelf-38080.herokuapp.com/Home";
    url+="&"+"show_dialog=true";
    url+="&scope=user-read-private%20user-read-email";

    res.redirect(url);

});

app.get('/Home',(req,res)=>{

    var code=req.query.code;
    var urlen=new URLSearchParams();
        urlen.append('grant_type','authorization_code');
        urlen.append('code',code);
        urlen.append('redirect_uri',"https://shielded-shelf-38080.herokuapp.com/Home");
        
        fetch("https://accounts.spotify.com/api/token",{
        method:'POST',
        headers:{
            "Authorization":"Basic MGE0MjUxOGNjNWE2NGFhNmI0ZGRmNTgyNDQzOTQ0YzY6ZThkMjFlOWVkMGQ1NDQ5MGJlNzBlMTU4MDMxYTdjM2E=",
            "Content-Type":"application/x-www-form-urlencoded"
        
        },
        body:urlen,    
        }).then(result=>result.json())
        .then(dat=>{
        accessToken=dat.access_token;
        refreshToken=dat.refresh_token;
        AuthenticateUser()
        .then(res.redirect('/Homefinal?q='+accessToken+'&q2='+refreshToken));
    
        });
    

});



app.get('/',(req,res)=>{
res.redirect('/login')
});

app.get('/Homefinal',(req,res)=>{

res.sendFile(__dirname+'/public/homepage.html');

});


app.get('/pp',(req,res)=>{
res.redirect('/profile?q='+accessToken);
});

app.get('/profile',(req,res)=>{
res.sendFile(__dirname+'/public/profile.html');
});




app.post('/like',(req,res)=>{
console.log('liked');
var dataum=req.body;

User.updateOne({_id:currentUserId},{$push: { Favourites: dataum }},function(err){
if(err)console.log(err);
else console.log('SuccessFully Inserted');
}); 

});//now in this post method whenever a user clicks the like button or like the song the song is saved 
//to the users->favourite collections

app.post('/dislike',(req,res)=>{
console.log('disliked');
var dataum=req.body;
console.log(dataum);
User.updateOne({_id:currentUserId},{$pull: { Favourites:{ previewUrl:dataum.previewUrl} }},function(err){
if(err)console.log(err);
else console.log('SuccessFully Deleted Record');
}); 



});//whenever he dislikes the song it is removed from users->favourites database


app.post('/checkFavourite',(req,res)=>{
   var dataum=req.body;
   
   User.findById(currentUserId,function(err,docs){
    
    if(docs!=null){
        
    var len=docs.Favourites.length;
    var present=false;
    for(var i=0;i<len;i++)
    {
      if(docs.Favourites[i].name==dataum.name&&
        docs.Favourites[i].previewUrl==dataum.previewUrl&&
        docs.Favourites[i].imgUrl==dataum.imgUrl)present=true;       
    }
    
    if(present)res.send({'previewUrl':req.body.previewUrl});
    else res.send({'previewUrl':'notPresent'});

   }
   else console.log('Null Value');;  
    
   
       
   })
});


app.get('/favour',(req,res)=>{
    var data=User.findById(currentUserId,function(err,docs){
    console.log(docs);        
    res.send(docs);

    });
    
    
})


app.get('/Favourites',(req,res)=>{
    res.sendFile(__dirname+'/public/Favourites.html');
})


app.get('/newHome',(req,res)=>{

    console.log('in new home');
   res.redirect('/Homefinal?q='+accessToken+'&q2='+refreshToken) 
});

let port=process.env.PORT;
if(port==null||port=="")
{
    port=7801;
}

app.listen(port,(res,req)=>{
    console.log('server on port 7801 heroku');
});