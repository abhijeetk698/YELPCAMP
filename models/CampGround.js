var mongoose=require("mongoose");

var campSchema= new mongoose.Schema({
    title: String,
    img: String,
    description : String,
});

module.exports = mongoose.model("Camp",campSchema);