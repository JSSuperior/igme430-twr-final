const models = require('../models');
const Character = models.Character;

// renders main page
const characterPage = async (req, res) => {
    return res.render('app');
}

// creates initial character entry
const createCharacter = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required!' });
    }

    // if not premium and have 5 characters or more, then can't make any new ones
    if (req.body.premium === false) {
        const characters = await Character.find({ owner: req.session.account._id }).lean().exec();
        if (characters.length >= 5) {
            return res.status(500).json({ error: 'Non premium users cannot make more than 5 characters!' })
        }
    }

    // help from this stack overflow article for generating unique character IDs
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
        //console.log(newCharacter);
        //return res.json({ redirect: '/maker' });
        return res.status(201).json({ message: 'Character successfully created!' });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Character already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making character!' });
    }
}

// edits character's data
const editCharacter = async (req, res) => {
    // if (!req.body.characterID || !req.body.name || !req.body.description
    //     || !req.body.characterClass || !req.body.powers || !req.body.hitpoints || !req.body.campaignID || !req.body.strength || !req.body.agility
    //     || !req.body.presence || !req.body.toughness || !req.body.omens || !req.body.weapon1 || !req.body.weapon2 || !req.body.armor || !req.body.equipment || !req.body.silver) {
    //     return res.status(400).json({ error: 'Missing Fields' });
    // }

    // I want the user to be able to leave entries blank but I don't think this is the way to do that
    if (!req.body.characterID) {
        return res.status(400).json({ error: 'Missing character ID' });
    }

    // try to change data
    try {
        const character = await Character.findOneAndUpdate(
            { characterID: req.body.characterID },
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    class: req.body.characterClass,
                    powers: req.body.powers,
                    hitpoints: req.body.hitpoints,
                    campaignID: req.body.campaignID,
                    strength: req.body.strength,
                    agility: req.body.agility,
                    presence: req.body.presence,
                    toughness: req.body.toughness,
                    omens: req.body.omens,
                    weapon1: req.body.weapon1,
                    weapon2: req.body.weapon2,
                    armor: req.body.armor,
                    equipment: req.body.equipment,
                    silver: req.body.silver,
                },
            }
        );

        if(!character) {
            return res.status(404).json({ error: 'Character not found!' });
        }

        return res.status(200).json({ message: 'Character successfully updated!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured editing character!' });
    }
}

// removes character with ID from a campaign
const removeCharacterFromCampaign = async (req, res) => {
    if (!req.body.characterID) {
        return res.status(400).json({ error: 'CharacterID is required!' });
    }

    // try to set character's campaignID to blank
    try {
        await Character.findOneAndUpdate(
            { characterID: req.body.characterID },
            {
                $set: {
                    campaignID: "",
                }
            }
        );
        return res.status(200).json({ message: 'Character successfully removed from campaign!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured removing character from campaign!' });
    }
}

// deletes character with specific ID from database
const deleteCharacter = async (req, res) => {
    if (!req.body.characterID) {
        return res.status(400).json({ error: 'CharacterID is required!' });
    }

    // try to delete character
    try {
        const theChosenOne = await Character.findOneAndDelete({ characterID: req.body.characterID });

        if (!theChosenOne) {
            return res.status(404).json({ error: `Character ${req.body.characterID} not found!` });
        }

        return res.status(200).json({ message: `Character successfully ${req.body.characterID} deleted!` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured deleting character!' });
    }
}

// returns JSON obj of character with specific ID
const getCharacterByID = async (req, res) => {
    if (!req.query.characterID) {
        return res.status(400).json({ error: 'Character ID is required!' });
    }

    try {
        const doc = await Character.findOne({ characterID: req.query.characterID }).lean().exec();

        if(!doc) {
            return res.status(404).json({ error: 'Character not found!' });
        }

        return res.json({ character: doc });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving character!' });
    }
}

// returns array of character JSON objs by owner ID
const getCharactersByUser = async (req, res) => {
    const query = { owner: req.session.account._id };
    getCharacters(req, res, query, 'No characters found!');
}

// returns array of character JSON objs by campaign ID
const getCharactersByCampaign = async (req, res) => {
    if (!req.query.campaignID) {
        return res.status(400).json({ error: 'Campaign ID is required!' });
    }

    const query = { campaignID: req.query.campaignID };
    getCharacters(req, res, query, 'Campaign not found!');
}

// returns array of character objs based on query
const getCharacters = async (req, res, query, message) => {
    try {
        const docs = await Character.find(query).lean().exec();

        if(docs.length < 1) {
            return res.status(404).json({ error: message });
        }

        return res.json({ characters: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving characters!' });
    }
}

module.exports = {
    characterPage,
    createCharacter,
    editCharacter,
    deleteCharacter,
    removeCharacterFromCampaign,
    getCharacterByID,
    getCharactersByUser,
    getCharactersByCampaign,
};