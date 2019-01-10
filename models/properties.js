var mongoose = require("mongoose");

var PropSchema = new mongoose.Schema({
    
    title: {
        type: String,
        ref: "_id"
    },

    slug: {
        type: String
    },

    location: {
        type: String
    },

    status: {
        type: String
    },

    mImage: {
        type: String
    },

    gImage:[{
        type: mongoose.Schema.Types.Mixed
    }],

    devDesc: {
        type: String
    },

    propDesc:{
        type: String
    },

    bed: {
        type: String
    },

    bath: {
        type: String
    },

    hba: {
        type: String
    },


    bsmnt: {
        type: String
    },

    ter: {
      type: String
    },

    swim: {
      type: String
    },

    total: {
      type: String
    },

    plot: {
      type: String
    },

    price: {
      type: String
    },

    version: {
        type: Number
    },
   
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prop"
        },
        username: String
    },

    date: {
        type: Date,
        default: Date.now
    },

    updated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Prop", PropSchema);