const express                   =   require("express");
const bodyParser                =   require("body-parser");
const app                       =   express();
const mongoose                  =   require("mongoose");

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

// DB Config
mongoose.connect("mongodb://localhost/yelpcampV1",{useNewUrlParser:true , useUnifiedTopology:true})
var Camp=require("./models/CampGround");


app.get("/",(req,res)=>{
    res.redirect("/landing");
});

app.get("/landing",(req,res)=>{
    res.render("landing");
});

app.get("/campgrounds",(req,res)=>{
    Camp.find({},(err,camps)=>{
        if(err){console.log(err);}
        else{
            res.render("campgrounds",{element:camps});
        }
    }) 
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("new");
})

app.post("/campgrounds",(req,res)=>{
    var camp={
        title : req.body.title,
        img : req.body.img,
        description:req.body.description
    }
    Camp.create(camp,(err,camp)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
});
 
// show route

app.get("/campgrounds/:id",(req,res)=>{
    Camp.findById(req.params.id,(err,camp)=>{
        res.render("show",{camp:camp});
    })
});


app.listen(2020,()=>{
    console.log("server is running");
})
