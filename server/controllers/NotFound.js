const models = require('../models');

const notFoundPage = (req, res) => {
    return res.render('notFound');
};

module.exports = {
    notFoundPage,
}