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

const deleteDomo = async (req, res) => {
    if(!req.body.name) {
        return res.status(400).json({ error: 'Name is required!' });
    }

    try {
        //const item = await Domo.deleteOne(req.body.name);
        const goner = await Domo.findOneAndDelete({ name: req.body.name });

        if(!goner) {
            return res.status(400).json({error: `Domo ${req.body.name} not found!`});
        }
        return res.status(200).json({ message: `Domo ${req.body.name} deleted!` });
    } catch (err) {
        return res.status(500).json({ error: 'An error occured deleting domo!' });
    }
}

// get specific character (campaign based)?

// edit character
// get specific character (user based)
// get all characters (user based)
// get all characters (in campaign)