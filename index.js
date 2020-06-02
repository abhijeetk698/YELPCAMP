const express                   =   require("express");
const bodyParser                =   require("body-parser");
const app                       =   express();
const mongoose                  =   require("mongoose");
const seedDB                    =   require("./seed");  
const passport                  =   require("passport");
const localStrategy             =   require("passport-local")

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

// DB Config
mongoose.connect("mongodb://localhost/yelpcampV1",{useNewUrlParser:true , useUnifiedTopology:true})
const Camp      =   require("./models/CampGround");
const Comment   =   require("./models/comments");
const User      =   require("./models/User");

seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "do you know god of death likes apples",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    next();
});

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

app.get("/campgrounds/:id/new",isLoggedIn,(req,res)=>{
    Camp.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comment/new",{camp:camp});
        }
    })
})

app.post("/campgrounds/:id",isLoggedIn,(req,res)=>{
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

//  AUTHENTICATION ROUTE

app.get('/register',(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res)=>{
    var newUser={username:req.body.username};
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),(req,res)=>{});

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

app.listen(3000,()=>{
    console.log("server is running");
})
