const express                   =   require("express");
const bodyParser                =   require("body-parser");
const app                       =   express();
const mongoose                  =   require("mongoose");
const seedDB                    =   require("./seed");                       
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

// DB Config
mongoose.connect("mongodb://localhost/yelpcampV1",{useNewUrlParser:true , useUnifiedTopology:true})
const Camp      =   require("./models/CampGround");
const Comment   =   require("./models/comments");
seedDB();

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
            res.render("camp/campgrounds",{element:camps});
        }
    }) 
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("camp/new");
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
            res.redirect("camp/campgrounds");
        }
    })
});
 
// show route

app.get("/campgrounds/:id",(req,res)=>{
    Camp.findById(req.params.id).populate("comments").exec((err,camp)=>{
        if(err){
            console.log(err);
        }else{
            res.render("camp/show",{camp:camp});
        }
    });
});

/******************
 * COMMENT ROUTE * 
 *******************/

app.get("/campgrounds/:id/new",(req,res)=>{
    Camp.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comment/new",{camp:camp});
        }
    })
})

app.post("/campgrounds/:id",(req,res)=>{
    Comment.create(req.body.comment,(err,comment)=>{
        if(err){
            console.log(err);
        }else{
            Camp.findById(req.params.id,(err,camp)=>{
                if(err){
                    console.log(err);
                }else{
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect(`/campgrounds/${req.params.id}`);
                }
            })
        }
    });
});

app.listen(2020,()=>{
    console.log("server is running");
})
