const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// const handleEdit = (e, onCharacterEdited) => {

// }

// const editCharacterForm = (props) => {


//     return (
//         <form id="editForm"
//             onSubmit={(e) => handleEdit(e, props.triggerReload)}
//             name="characterEditForm"
//             action="/edit"
//             method="POST"
//             className="editForm"
//         >

//             <label htmlFor="name">Name: </label>
//             <input id="characterName" type="text" name="name" placeholder="Character Name" />

//             <label htmlFor="description">Description: </label>
//             <input id="characterDescription" type="text" name="description" placeholder="Character Description" />

//             <label htmlFor="class">Class: </label>
//             <input id="characterClass" type="text" name="class" placeholder="Character Class" />

//             <label htmlFor="powers">Powers: </label>
//             <input id="characterPowers" type="text" name="powers" placeholder="Character Powers" />

//             <label htmlFor="hitpoints">Hit Points: </label>
//             <input id="characterHitpoints" type="text" name="hitpoints" placeholder="Character Hitpoints" />

//             <input id="editCharacterSubmit" type="submit" value="Save Changes" />
//         </form>
//     );
// }

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

// contains a box for campaingn ID and when entered will refresh with all characters in campaign 
const CampaignCharacterList = (props) => {
    const [campaignID, setCampaignID] = useState("");
    const [characters, setCharacters] = useState(props.characters);

    useEffect(() => {
        const loadCharactersFromServer = async () => {
            const response = await fetch(`/getByCampaign?campaignID=${campaignID}`);
            const data = await response.json();
            setCharacters(data.characters);
        };

        if(campaignID) {
            loadCharactersFromServer();
        }
    }, [campaignID]);

    if (characters.length === 0) {
        return (
            <div className="characterList">
                <label htmlFor="cid">Campaign ID: </label>
                <input id="campaignID" type="text" name="cid" placeholder="Campaign ID" onChange={(e) => setCampaignID(e.target.value)}/>
                <h3 className="emptyCharacter">No Characters In Campaign Yet!</h3>
            </div>
        );
    }

    const characterNodes = characters.map(character => {
        // const passUpData = () => {
        //     props.clickAction(character.characterID);
        // }
        // later add some sort of view functionality

        return (
            <div key={character.id} className="characterList">
                <h3 className="characterName">Name: {character.name}</h3>
                <h3 className="characterID">ID: {character.characterID}</h3>
            </div>
        );
        //<button onClick={passUpData}>Edit Character</button>
    });

    return (
        <div className="characterList">
            <label htmlFor="cid">Campaign ID: </label>
            <input id="campaignID" type="text" name="cid" placeholder="Campaign ID" onChange={(e) => setCampaignID(e.target.value)}/>
            {characterNodes}
        </div>
    );
};

// edit character info
const handleEdit = (e, onCharacterEdited) => {
    e.preventDefault();
    helper.hideError();

    const campaignID = e.target.querySelector('#campaignID').value;
    const name = e.target.querySelector('#characterName').value;
    const description = e.target.querySelector('#characterDescription').value;
    const characterClass = e.target.querySelector('#characterClass').value;
    const powers = e.target.querySelector('#characterPowers').value;
    const hitpoints = e.target.querySelector('#characterHitpoints').value;

    if (!campaignID || !name || ! description || !characterClass || !powers || !hitpoints) {
        helper.handleError('Field required!');
        return false;
    }

    helper.sendPost(e.target.action, { campaignID, name, description, characterClass, powers, hitpoints }, onCharacterEdited);
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

    // If character not retrieved, return blank
    if (!character) {
        return (
            <div className="editCharacter">
                <h3>Character edit view</h3>
                <p>Error retrieving character info</p>
                <button onClick={props.onClick}> Return to Main View </button>
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
                onSubmit={(e) => handleEdit(e, props.triggerReload)}
                name="characterEditForm"
                action="/edit"
                method="POST"
                className="editForm"
            >
                <label htmlFor="cid">Campaign ID: </label>
                <input id="campaignID" type="text" name="cid" placeholder="Campaign ID" value={character.campaignID} />

                <label htmlFor="name">Name: </label>
                <input id="characterName" type="text" name="name" placeholder="Character Name" value={character.name} />

                <label htmlFor="description">Description: </label>
                <input id="characterDescription" type="text" name="description" placeholder="Character Description" value={character.description} />

                <label htmlFor="class">Class: </label>
                <input id="characterClass" type="text" name="class" placeholder="Character Class" value={character.class} />

                <label htmlFor="powers">Powers: </label>
                <input id="characterPowers" type="text" name="powers" placeholder="Character Powers" value={character.powers} />

                <label htmlFor="hitpoints">Hit Points: </label>
                <input id="characterHitpoints" type="text" name="hitpoints" placeholder="Character Hitpoints" value={character.hitpoints} />

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
            <div id="campaignCharacters">
                <CampaignCharacterList characters={[]} />
            </div>
        </div>
    );

    // edit character if there is one
    // if (currentCharacterID === 0) {

    // } else {
    //     return (
    //         
    //     );
    // }


    // return (
    //     <div>
    //         <div id="makeDomo">
    //             <DomoForm triggerReload={() => setReloadCharacters(!reloadCharacters)} />
    //         </div>
    //         <div id="deleteForm">
    //             <DomoDelete triggerReload={() => setReloadCharacters(!reloadCharacters)} />
    //         </div>
    //         <div id="characters">
    //             <UserCharacterList characters={[]} reloadCharacters={reloadCharacters} />
    //         </div>
    //     </div>
    // );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;