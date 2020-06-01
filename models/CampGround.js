var mongoose=require("mongoose");
var Comment=require("./comments");
var campSchema= new mongoose.Schema({
    title: String,
    img: String,
    description : String,
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ]
});

module.exports = mongoose.model("Camp",campSchema);