var express= require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride=require("method-override");
app=express();

//app config
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true,useUnifiedTopology: true});
mongoose.set('useFindAndModify',false); //to avoid depcrecation error
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//mongoose/model config
var blogSchema= new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var Blog= mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"test blog",
//     image:"pic/tulips.jpg",
//     body:"hello this is a blog post"
// });


//RESTful routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("error!!");
        }else{
            res.render("index",{blogs: blogs});
        }
    })
});

//new route
app.get("/blogs/new",function(req,res){
    res.render("new")
})

app.post("/blogs",function(req,res){
    //create route
    Blog.create(req.body.blog, function(err,blog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
});

//show route

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundBlog});
        }
    })
});

//edit route

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
    })
    
});

//update route

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

//delete route

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})


app.listen(3000,function(req,res){
    console.log("server is running");
});



