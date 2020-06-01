const mongoose = require("mongoose");

var commentSchema= new mongoose.Schema({
    author : String,
    remark : String
});

module.exports = mongoose.model("Comment",commentSchema);