const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const cheeseWheels = e.target.querySelector('#domoCheeseWheels').value;

    if (!name || !age || !cheeseWheels) {
        helper.handleError('All fields are required');
        return false;
    }

    // generate character ID
    // do check here to see if character ID is taken

    helper.sendPost(e.target.action, { name, age, cheeseWheels }, onDomoAdded);
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />

            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />

            <label htmlFor="cheeseWheels">Cheese Wheels: </label>
            <input id="domoCheeseWheels" type="number" min="0" name="cheeseWheels" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

// Character create form
const handleCreate = (e, onCharacterCreated) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#characterName').value;

    if (!name) {
        helper.handleError('Field required!');
        return false;
    }

    helper.sendPost(e.target.action, { name }, onCharacterCreated);
    return false;
}

const createCharacterForm = (props) => {
    return (

        <form id="createForm"
            onSubmit={(e) => handleCreate(e, props.triggerReload)}
            name="characterCreateForm"
            action="/create"
            method="POST"
            className="createForm"
        >
            <h1>
                Character Creation Form
            </h1>
            <label htmlFor="name">Name: </label>
            <input id="characterName" type="text" name="name" placeholder="Character Name" />
            <input id="createCharacterSubmit" type="submit" value="Create Character" />
        </form>
    );
}

const handleEdit = (e, onCharacterEdited) => {

}

const editCharacterForm = (props) => {
    return (
        <form id="editForm"
            onSubmit={(e) => handleEdit(e, props.triggerReload)}
            name="characterEditForm"
            action="/edit"
            method="POST"
            className="editForm"
        >
            
        <label htmlFor="name">Name: </label>
            <input id="characterName" type="text" name="name" placeholder="Character Name" />


            <input id="createCharacterSubmit" type="submit" value="Save Changes" />
        </form>
    );
}

// Character Delete form
const handleDelete = (e, onCharacterDeleted) => {
    e.preventDefault();
    helper.hideError();

    const characterID = e.target.querySelector('#characterID').value;

    if (characterID) {
        helper.handleError('Field required!');
        return false;
    }

    helper.sendPost(e.target.action, { characterID }, onCharacterDeleted);
    return false;
}

const DomoDelete = (props) => {
    return (
        <form id="deleteForm"
            onSubmit={(e) => handleDelete(e, props.triggerReload)}
            name="characterDeleteForm"
            action="/delete"
            method="POST"
            className="deleteForm"
        >
            <label htmlFor="id">Character ID: </label>
            <input id="characterID" type="number" name="id" placeholder="Character ID Number" />

            <input className="deleteCharacterSubmit" type="submit" value="Delete Character" />
        </form>
    );
};

const UserCharacterList = (props) => {
    const [characters, setCharacters] = useState(props.characters);

    useEffect(() => {
        const loadCharactersFromServer = async () => {
            const response = await fetch('/getCharactersByUser');
            const data = await response.json();
            setCharacters(data.characters);
        };
        loadCharactersFromServer();
    }, [props.reloadCharacters]);

    if (characters.length === 0) {
        return (
            <div className="characterList">
                <h3 className="emptyCharacter">No Characters Yet!</h3>
            </div>
        );
    }

    const characterNodes = characters.map(character => {
        return (
            <div key={character.id} className="characterList">
                <h3 className="characterName">Name: {character.name}</h3>
            </div>
        );
    });

    return (
        <div className="characterList">
            {characterNodes}
        </div>
    );
};

// contains a box for campaingn ID and when entered will refresh with all characters in campaign 
const CampaignCharacterList = (props) => {
    const [campaignID, setCampaignID] = useState(props.campaignID);
    const [characters, setCharacters] = useState(props.characters);

    useEffect(() => {
        const loadCharactersFromServer = async () => {
            const response = await fetch('/getCharactersByUser', {
                
            });
        };
        loadCharactersFromServer();
    }, [props.reloadCharacters]);
};

const App = () => {
    const [reloadCharacters, setReloadCharacters] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadCharacters(!reloadCharacters)} />
            </div>
            <div id="deleteForm">
                <DomoDelete triggerReload={() => setReloadCharacters(!reloadCharacters)} />
            </div>
            <div id="characters">
                <UserCharacterList characters={[]} reloadCharacters={reloadCharacters} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;