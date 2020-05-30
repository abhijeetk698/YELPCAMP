const express=require("express");
const bodyParser=require("body-parser");
const app=express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

// NAKLI DATABASE
var element=[
    {
        name:"everest base camp",
        img: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
    },
    {
        name:"forest gump",
        img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
    },
    {
        name:"friend camp",
        img: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
    }
];

app.get("/",(req,res)=>{
    res.redirect("/landing");
});

app.get("/landing",(req,res)=>{
    res.render("landing");
});

app.get("/campgrounds",(req,res)=>{
    
    res.render("campgrounds",{element:element});
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("new");
})

app.post("/campgrounds",(req,res)=>{
    var camp={
        name:req.body.name,
        img:req.body.img
    }
    element.push(camp);
    res.redirect("/campgrounds");
});

app.listen(2020,()=>{
    console.log("server is running");
})
