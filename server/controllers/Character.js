const models = require('../models');
const Character = models.Character;

const characterPage = async (req, res) => {
    return res.render('app');
}

const dmPage = async (req, res) => {
    return res.render('dmview');
}

// creates initial character entry
const createCharacter = async (req, res) => {
    // do checks for premium here

    if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required!' });
    }

    // find a way to randomly generate unique character ID here
    // help from this stack overflow article
    // https://stackoverflow.com/questions/37174096/generate-unique-ids-js
    const generateUniqueCharacterID = () => {
        return Date.now();
    }

    // initial character data
    const characterData = {
        name: req.body.name,
        characterID: generateUniqueCharacterID(),
        owner: req.session.account._id,
    }

    try {
        const newCharacter = new Character(characterData);
        await newCharacter.save();
        console.log(newCharacter);
        //return res.json({ redirect: '/maker' });
        return res.status(201).json({ name: newCharacter.name });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Character already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making character!' });
    }
}

// 
const editCharacter = async (req, res) => {
    console.log(req.body.characterID);

    if (!req.body.characterID || !req.body.name || !req.body.description
        || !req.body.characterClass || !req.body.powers || !req.body.hitpoints || !req.body.campaignID) {
        return res.status(400).json({ error: 'Character ID not found!' });
    }

    try {
        const character = await Character.findOneAndUpdate(
            { characterID: req.body.characterID },
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    class: req.body.class,
                    powers: req.body.powers,
                    hitpoints: req.body.hitpoints,
                    campaignID: req.body.campaignID,
                },
            }
        );

        // strength: req.body.strength,
        //             agility: req.body.agility,
        //             presence: req.body.presence,
        //             toughness: req.body.toughness,
        //             omens: req.body.omens,
        //             weapon1: req.body.weapon1,
        //             weapon2: req.body.weapon2,
        //             armorName: req.body.armorName,
        //             armorRating: req.body.armorRating,
        //             equipment: req.body.equipment,
        //             silver: req.body.silver,

        //return res.json({ redirect: '/maker' });
        //return res.status(200).json({ message: 'Character updated!' });
        console.log(character);
        return res.status(200).json(character);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured editing character!' });
    }
}

// Removes character with ID from a campaign
const removeCharacterFromCampaign = async (req, res) => {
    if (!req.body.characterID) {
        return res.status(400).json({ error: 'CharacterID is required!' });
    }

    try {
        const character = await Character.findOneAndUpdate(
            { characterID: req.body.characterID },
            {
                $set: {
                    campaignID: "",
                }
            }
        );
        return res.status(200).json({message: 'Character successfully removed!'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured removing character from campaign!' });
    }
}

// Deletes character with specific ID from database
const deleteCharacter = async (req, res) => {
    if (!req.body.characterID) {
        return res.status(400).json({ error: 'CharacterID is required!' });
    }

    try {
        const theChosenOne = await Character.findOneAndDelete({ characterID: req.body.characterID });

        if (!theChosenOne) {
            return res.status(400).json({ error: `Character ${req.body.characterID} not found!` });
        }
        return res.status(200).json({ message: `Character ${req.body.characterID} deleted!` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured deleting Character!' });
    }
}

// returns JSON obj of character with specific ID
const getCharacterByID = async (req, res) => {
    // change this to be a query param
    if (!req.query.characterID) {
        return res.status(400).json({ error: 'Character ID is required!' });
    }

    console.log(req.query.characterID);

    try {
        // can probably change from doc to something else later
        const docs = await Character.findOne({ characterID: req.query.characterID }).lean().exec();

        return res.json({ character: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving character!' });
    }
}

// Gets array of character JSON objs by owner ID
const getCharactersByUser = async (req, res) => {
    const query = { owner: req.session.account._id };
    getCharacters(req, res, query);
}

const getCharactersByCampaign = async (req, res) => {
    if (!req.query.campaignID) {
        return res.status(400).json({ error: 'Campaign ID is required!' });
    }

    const query = { campaignID: req.query.campaignID };
    getCharacters(req, res, query);
}

// Returns array of character objs based on query
const getCharacters = async (req, res, query) => {
    try {
        const docs = await Character.find(query).lean().exec();
        //console.log(docs);
        return res.json({ characters: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving characters!' });
    }
}

module.exports = {
    characterPage,
    dmPage,
    createCharacter,
    editCharacter,
    deleteCharacter,
    removeCharacterFromCampaign,
    getCharacterByID,
    getCharactersByUser,
    getCharactersByCampaign,
};