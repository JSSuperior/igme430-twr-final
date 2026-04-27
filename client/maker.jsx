const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect} = React;
const { createRoot } = require('react-dom/client');

// Character create form
const handleCreate = (e, onCharacterCreated) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#characterName').value;

    if (!name) {
        helper.handleError('Field required!');
        return false;
    }

    console.log(name);

    helper.sendPost(e.target.action, { name }, onCharacterCreated);
    return false;
}

const CreateCharacter = (props) => {
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

// Character Delete form
const handleDelete = (e, onCharacterDeleted) => {
    e.preventDefault();
    helper.hideError();

    const characterID = e.target.querySelector('#characterID').value;

    if (!characterID) {
        helper.handleError('Field required!');
        return false;
    }

    helper.sendPost(e.target.action, { characterID }, onCharacterDeleted);
    return false;
}

const CharacterDelete = (props) => {
    return (
        <form id="deleteForm"
            onSubmit={(e) => handleDelete(e, props.triggerReload)}
            name="characterDeleteForm"
            action="/delete"
            method="POST"
            className="deleteForm"
        >
            <h1>
                Character Deletion Form
            </h1>
            <label htmlFor="id">Character ID: </label>
            <input id="characterID" type="number" name="id" placeholder="Character ID Number" />

            <input className="deleteCharacterSubmit" type="submit" value="Delete Character" />
        </form>
    );
};

// display user 
const UserCharacterList = (props) => {
    // help from this article for passing data upwards to main app component
    // https://medium.com/@ozhanli/passing-data-from-child-to-parent-components-in-react-e347ea60b1bb

    const [characters, setCharacters] = useState(props.characters);

    useEffect(() => {
        const loadCharactersFromServer = async () => {
            const response = await fetch('/getByUser');
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
        const passUpData = () => {
            props.clickAction(character.characterID);
        }

        return (
            <div key={character.id} className="characterList">
                <h3 className="characterName">Name: {character.name}</h3>
                <h3 className="characterID">ID: {character.characterID}</h3>
                <button onClick={passUpData}>Edit Character</button>
            </div>
        );
    });

    return (
        <div className="characterList">
            {characterNodes}
        </div>
    );
};

// edit character info
const handleEdit = (e, characterID, onCharacterEdited) => {
    e.preventDefault();
    helper.hideError();

    const campaignID = e.target.querySelector('#campaignID').value;
    const name = e.target.querySelector('#characterName').value;
    const description = e.target.querySelector('#characterDescription').value;
    const characterClass = e.target.querySelector('#characterClass').value;
    const powers = e.target.querySelector('#characterPowers').value;
    const hitpoints = e.target.querySelector('#characterHitpoints').value;

    if (!campaignID || !name || !description || !characterClass || !powers || !hitpoints) {
        helper.handleError('Field required!');
        return false;
    }

    helper.sendPost(e.target.action, { characterID, campaignID, name, description, characterClass, powers, hitpoints }, onCharacterEdited);
    return false;
}

const EditCharacter = (props) => {
    const [characterID, setCharacterID] = useState(props.characterID);
    const [character, setCharacter] = useState({});

    useEffect(() => {
        const loadCharacterFromServer = async () => {
            const response = await fetch(`/getByID?characterID=${characterID}`);
            const data = await response.json();
            setCharacter(data.character);
        };
        loadCharacterFromServer();
    }, [props.characterID]);

    // used code from this article for prepopulating text fields:
    // https://medium.com/@vanthedev/how-to-pre-populate-inputs-when-editing-forms-in-react-2530d6069ab3
    const handleChange = (event) => {
        const { target } = event;
        setCharacter((prevState) => ({
            ...prevState,
            [target.name]: target.value,
        }));
    };

    // If character not retrieved, return blank
    if (!character) {
        return (
            <div className="editCharacter">
                <h3>Character edit view</h3>
                <button onClick={props.onClick}> Return to Main View </button>
                <p>Loading</p>
            </div>
        );
    }

    // two things to fix, firs is to change how fields work/initially are set, might need things
    // also need to test the campaign ID, but it should work fine
    // https://medium.com/@vanthedev/how-to-pre-populate-inputs-when-editing-forms-in-react-2530d6069ab3
    // https://stackoverflow.com/questions/59668592/pre-populate-text-input-with-object-values-react 
    return (
        <div className="editCharacter">
            <h3>Character edit view</h3>
            <button onClick={props.onClick}> Return to Main View </button>

            <form id="editForm"
                onSubmit={(e) => handleEdit(e, characterID, props.triggerReload)}
                name="characterEditForm"
                action="/edit"
                method="POST"
                className="editForm"
            >
                <label htmlFor="cid">Campaign ID: </label>
                <input id="campaignID" type="text" name="campaignID" placeholder="Campaign ID"  value={character.campaignID} onChange={handleChange} />

                <label htmlFor="name">Name: </label>
                <input id="characterName" type="text" name="name" placeholder="Character Name" value={character.name} onChange={handleChange} />

                <label htmlFor="description">Description: </label>
                <input id="characterDescription" type="text" name="description" placeholder="Character Description" value={character.description} onChange={handleChange} />

                <label htmlFor="class">Class: </label>
                <input id="characterClass" type="text" name="class" placeholder="Character Class" value={character.class} onChange={handleChange} />

                <label htmlFor="powers">Powers: </label>
                <input id="characterPowers" type="text" name="powers" placeholder="Character Powers" value={character.powers} onChange={handleChange} />

                <label htmlFor="hitpoints">Hit Points: </label>
                <input id="characterHitpoints" type="text" name="hitpoints" placeholder="Character Hitpoints" value={character.hitpoints} onChange={handleChange} />

                <input id="editCharacterSubmit" type="submit" value="Save Changes" />
            </form>
        </div> 
    );
};

const App = () => {
    const [currentCharacterID, setCurrentCharacterID] = useState(0);
    const [reloadCharacters, setReloadCharacters] = useState(false);

    // might be able to condense these
    const setCharacter = (value) => {
        setCurrentCharacterID(value);
        //setReloadCharacters(!reloadCharacters)
    }

    const clearCharacter = () => {
        setCurrentCharacterID(0);
        //setReloadCharacters(!reloadCharacters)
    }

    // edit character if character exists
    if (currentCharacterID != 0) {
        return (
            <div>
                <div id="edit">
                    <EditCharacter reloadCharacters={reloadCharacters} characterID={currentCharacterID} onClick={clearCharacter} />
                </div>
            </div>
        );
    }

    // otherwise render page normally
    return (
        <div>
            <div id="makeCharacter">
                <CreateCharacter triggerReload={() => setReloadCharacters(!reloadCharacters)} />
            </div>
            <div id="deleteCharacter">
                <CharacterDelete triggerReload={() => setReloadCharacters(!reloadCharacters)} />
            </div>
            <div id="characters">
                <UserCharacterList characters={[]} reloadCharacters={reloadCharacters} clickAction={setCharacter} />
            </div>
        </div>
    );

    /*
            <div id="campaignCharacters">
                <CampaignCharacterList characters={[]} />
            </div>
    */
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;