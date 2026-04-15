const models = require('../models');
const Domo = models.Domo;

const makerPage = async (req, res) => {
    //res.render('app');
    // try {
    //     const query = { owner: req.session.account._id };
    //     const docs = await Domo.find(query).select('name age').lean().exec();

    //     return res.render('app', { domos: docs });
    // } catch (err) {
    //     console.log(err);
    //     return res.status(500).json({ error: 'Error retrieving domos!' });
    // }
    return res.render('app');
}

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.body.cheeseWheels) {
        return res.status(400).json({ error: 'Both name and age are required!' });
    }

    const domoData = {
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

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age cheeseWheels').lean().exec();

        return res.json({ domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};

module.exports = {
    makerPage,
    makeDomo,
    deleteDomo,
    getDomos,
};