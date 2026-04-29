const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    // account functionality
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    // app handlebar views
    app.get('/maker', mid.requiresLogin, controllers.Character.characterPage);

    // change password
    app.post('/changePass', mid.requiresLogin, controllers.Account.changePassword);

    // character modification
    app.post('/create', mid.requiresLogin, controllers.Character.createCharacter);
    app.post('/edit', mid.requiresLogin, controllers.Character.editCharacter);
    app.post('/delete', mid.requiresLogin, controllers.Character.deleteCharacter);
    app.post('/removeFromCampaign', mid.requiresLogin, controllers.Character.removeCharacterFromCampaign);

    // character retrieval
    app.get('/getByID', mid.requiresLogin, controllers.Character.getCharacterByID);
    app.get('/getByUser', mid.requiresLogin, controllers.Character.getCharactersByUser);
    app.get('/getByCampaign', mid.requiresLogin, controllers.Character.getCharactersByCampaign);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

    // https://stackoverflow.com/questions/11500204/how-can-i-get-express-js-to-404-only-on-missing-routes
    // https://github.com/expressjs/express/issues/6711
    app.all('*fallback', controllers.NotFound.notFoundPage);
};

module.exports = router;