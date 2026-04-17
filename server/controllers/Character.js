const models = require('../models');
const Character = models.Character;

const characterPage = async (req, res) => {
    return res.render('app');
}

const createCharacter = async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required!' });
    }

    const characterData = {
        name: req.body.name,
        age: req.body.age,
        cheeseWheels: req.body.cheeseWheels,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        //return res.json({ redirect: '/maker' });
        return res.status(201).json({ name: newDomo.name, age: newDomo.age, cheeseWheels: newDomo.cheeseWheels });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making domo!' });
    }
}

const editCharacter = async (req, res) => {
    const characterData = {
        name: req.body.name,
        age: req.body.age,
        cheeseWheels: req.body.cheeseWheels,
        owner: req.session.account._id,
    };

    try {
        const newDomo = new Domo(domoData);
        await newDomo.save();
        //return res.json({ redirect: '/maker' });
        return res.status(201).json({ name: newDomo.name, age: newDomo.age, cheeseWheels: newDomo.cheeseWheels });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making domo!' });
    }
}

const deleteCharacter = async (req, res) => {
    if(!req.body.name) {
        return res.status(400).json({ error: 'Name is required!' });
    }

    try {
        const theChosenOne = await Character.findOneAndDelete({ name: req.body.name });

        if(!theChosenOne) {
            return res.status(400).json({error: `Character ${req.body.name} not found!`});
        }
        return res.status(200).json({ message: `Character ${req.body.name} deleted!` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occured deleting Character!' });
    }
}

const getCharacterByName = async (req, res) => {
    if(!req.body.name) {
        return res.status(400).json({ error: 'Name is required!' });
    }

    try {
        // can probably change from doc to something else later
        const docs = await Character.find(req.body.name).lean().exec();

        return res.json({character: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving character!'});
    }
}

const getCharactersByUser = async (req, res) => {
    const query = { owner: req.session.account._id };
    getCharacters(req, res, query);
}

const getCharactersByCampaign = async (req, res) => {
    const query = { campaignID: req.body.campaignID };
    getCharacters(req, res, query);
}

const getCharacters = async (req, res, query) => {
    try {
        const docs = await Character.find(query).select('name').lean().exec();

        return res.json({ characters: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving characters!' });
    }
}

// get specific character (campaign based)?

// edit character
// get specific character (user based)
// get all characters (user based)
// get all characters (in campaign)