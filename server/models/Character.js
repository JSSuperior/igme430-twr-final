const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const characterSchema = new mongoose.Schema({
    // character info
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName
    },
    description: {
        type: String,
        default: "",
    },
    class: {
        type: String,
        default: "",
    },
    powers: {
        type: String,
        default: "",
    },
    hitpoints: {
        type: String,
        default: "0/0",
    },

    // stat modifiers
    strength: {
        type: String,
        default: "0"
    },
    agility: {
        type: String,
        default: "0"
    },
    presence: {
        type: String,
        default: "0"
    },
    toughness: {
        type: String,
        default: "0"
    },
    omens: {
        type: String,
        default: "0"
    },

    // equiptment
    weapon1: {
        type: String,
        default: "",
    },
    weapon2: {
        type: String,
        default: "",
    },
    armor: {
        type: String,
        default: "0"
    },
    equipment: {
        type: String,
        default: "",
    },
    silver: {
        type: String,
        default: "0"
    },

    // admin
    characterID: {
        type: Number,
        required: true,
        unique: true,
    },
    campaignID: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

characterSchema.statics.toAPI = (doc) => ({
    name: doc.name,
});

const CharacterModel = mongoose.model('Character', characterSchema);
module.exports = CharacterModel;