var mongoose = require("mongoose");

var PropertiesSchema = new mongoose.Schema({
   title: String,
   image1: String,
   image2: String,
   image3: String,
   english: String,
   spanish: String,
   russian: String,
   french: String,
   author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Properties"
        },
        username: String
   },
   date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Properties", PropertiesSchema);