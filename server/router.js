const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    //
    app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

    // account functionality
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    // character modification
    app.get('/maker', mid.requiresLogin, controllers.Character.characterPage);
    app.post('/create', mid.requiresLogin, controllers.Character.createCharacter);
    app.post('/edit', mid.requiresLogin, controllers.Character.editCharacter);
    app.post('/delete', mid.requiresLogin, controllers.Character.deleteCharacter);

    // character retrieval
    app.get('/getByID', mid.requiresLogin, controllers.Character.getCharacterByID);
    app.get('/getByUser', mid.requiresLogin, controllers.Character.getCharactersByUser);
    app.get('/getByCampaign', mid.requiresLogin, controllers.Character.getCharactersByCampaign);

    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;