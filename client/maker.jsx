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

const CharacterForm = (props) => {
    
}

const handleDomoDelete = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#deleteName').value;

    if(!name) {
        helper.handleError('Field required!');
        return false;
    }

    helper.sendPost(e.target.action, { name }, onDomoAdded);
}

const DomoDelete = (props) => {
    return (
        <form id="domoDelete"
        onSubmit={(e) => handleDomoDelete(e, props.triggerReload)}
        name="domoDelete"
        action="/delete"
        method="POST"
        className="domoDelete" 
        >
            <label htmlFor="name">Name: </label>
            <input id="deleteName" type="text" name="name" placeholder="Domo Name" />

            <input className="deleteDomoSubmit" type="submit" value="Delete Domo" />
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