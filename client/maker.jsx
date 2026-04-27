const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Helper Post Functions
const handleCreate = (e, onCharacterCreated) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#characterName').value;
    //const premium = document.querySelector("#premiumCB").value;

    if (!name) {
        helper.handleError('Field required!');
        return false;
    }

    console.log(name);

    helper.sendPost(e.target.action, { name }, onCharacterCreated);
    return false;
}

const handleChangePass = (e) => {
    e.preventDefault();
    helper.hideError();

    const passOld = e.target.querySelector('#passOld').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!pass || !pass2 || !passOld) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass != pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    if (passOld == pass) {
        helper.handleError('Old password and new password cannot be the same!');
        return dalse
    }

    helper.sendPost(e.target.action, { pass, pass2, passOld });

    return false;
}

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
    const strength = e.target.querySelector('#characterStrength').value;
    const agility = e.target.querySelector('#characterAgility').value;
    const presence = e.target.querySelector('#characterPresence').value;
    const toughness = e.target.querySelector('#characterToughness').value;
    const omens = e.target.querySelector('#characterOmens').value;
    const weapon1 = e.target.querySelector('#characterWeapon1').value;
    const weapon2 = e.target.querySelector('#characterWeapon2').value;
    const armor = e.target.querySelector('#characterArmor').value;
    const equipment = e.target.querySelector('#characterEquipment').value;
    const silver = e.target.querySelector('#characterSilver').value;

    if (!name) {
        helper.handleError('Name required!');
        return false;
    }

    const body = {
        campaignID,
        characterID,
        name,
        description,
        characterClass,
        powers,
        hitpoints,
        strength,
        agility,
        presence,
        toughness,
        omens,
        weapon1,
        weapon2,
        armor,
        equipment,
        silver,
    }

    helper.sendPost(e.target.action, body, onCharacterEdited);
    return false;
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

const handleRemove = (e, characterID, onCharacterRemoved) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(e.target.action, { characterID }, onCharacterDeleted);
    return false;
}

// React Components
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
            props.onClick(character.characterID);
            helper.hideError();
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
    const handleChange
        = (event) => {
            const { target } = event;
            setCharacter((prevState) => ({
                ...prevState,
                [target.name]: target.value,
            }));
        };

    const passUpData = () => {
        props.onClick(0);
        setCharacter({});
        helper.hideError();
    }

    // If character not retrieved, return blank
    if (!character) {
        return (
            <div className="editCharacter">
                <h3>Character edit view</h3>
                <button onClick={passUpData}> Return to Main View </button>
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
            <button onClick={passUpData}> Return to Main View </button>

            <form id="editForm"
                onSubmit={(e) => handleEdit(e, characterID, props.triggerReload)}
                name="characterEditForm"
                action="/edit"
                method="POST"
                className="editForm"
            >
                <label htmlFor="cid">Campaign ID: </label>
                <input id="campaignID" type="text" name="campaignID" placeholder="Campaign ID" value={character.campaignID} onChange={handleChange} />

                <label htmlFor="name">Name: </label>
                <input id="characterName" type="text" name="name" placeholder="Character Name" value={character.name} onChange={handleChange} />

                <div className="editInfo">
                    <label htmlFor="description">Description: </label>
                    <input id="characterDescription" type="text" name="description" placeholder="Character Description" value={character.description} onChange={handleChange} />
                    <label htmlFor="class">Class: </label>
                    <input id="characterClass" type="text" name="class" placeholder="Character Class" value={character.class} onChange={handleChange} />
                    <label htmlFor="powers">Powers: </label>
                    <input id="characterPowers" type="text" name="powers" placeholder="Character Powers" value={character.powers} onChange={handleChange} />
                </div>

                <div className="editStats">
                    <label htmlFor="hitpoints">Hit Points: </label>
                    <input id="characterHitpoints" type="text" name="hitpoints" placeholder="Character Hitpoints" value={character.hitpoints} onChange={handleChange} />
                    <label htmlFor="strength">Strength Modifier: </label>
                    <input id="characterStrength" type="text" name="strength" placeholder="Character Strength Modifier" value={character.strength} onChange={handleChange} />
                    <label htmlFor="agility">Agility Modifier: </label>
                    <input id="characterAgility" type="text" name="agility" placeholder="Character Agility Modifier" value={character.agillity} onChange={handleChange} />
                    <label htmlFor="presence">Presence Modifier: </label>
                    <input id="characterPresence" type="text" name="presence" placeholder="Character Presence" value={character.presence} onChange={handleChange} />
                    <label htmlFor="toughness">Toughness Modifier: </label>
                    <input id="characterToughness" type="text" name="toughness" placeholder="Character Toughness" value={character.toughness} onChange={handleChange} />
                    <label htmlFor="omens">Omens: </label>
                    <input id="characterOmens" type="text" name="omens" placeholder="Omens" value={character.omens} onChange={handleChange} />
                </div>

                <div className="editInventory">
                    <label htmlFor="weapon1">First Weapon: </label>
                    <input id="characterWeapon1" type="text" name="weapon1" placeholder="First Weapon" value={character.weapon1} onChange={handleChange} />
                    <label htmlFor="weapon2">Second Weapon: </label>
                    <input id="characterWeapon2" type="text" name="weapon2" placeholder="Second Weapon" value={character.weapon2} onChange={handleChange} />
                    <label htmlFor="armor">Armor: </label>
                    <input id="characterArmor" type="text" name="armor" placeholder="Armor" value={character.armor} onChange={handleChange} />
                    <label htmlFor="equipment">Equipment: </label>
                    <input id="characterEquipment" type="text" name="equipment" placeholder="Equipment" value={character.equipment} onChange={handleChange} />
                    <label htmlFor="silver">Silver: </label>
                    <input id="characterSilver" type="text" name="silver" placeholder="Silver" value={character.silver} onChange={handleChange} />
                </div>

                <input id="editCharacterSubmit" type="submit" value="Save Changes" />
            </form>
        </div>
    );
};

const CharacterWindow = () => {
    const [currentCharacterID, setCurrentCharacterID] = useState(0);
    const [reloadCharacters, setReloadCharacters] = useState(false);

    // might be able to condense these
    const setCharacter = (value) => {
        setCurrentCharacterID(value);
        //setReloadCharacters(!reloadCharacters)
    }

    // edit character if character exists
    if (currentCharacterID != 0) {
        return (
            <div>
                <div id="edit">
                    <EditCharacter characterID={currentCharacterID} onClick={setCharacter} />
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
                <UserCharacterList characters={[]} reloadCharacters={reloadCharacters} onClick={setCharacter} />
            </div>
        </div>
    );
};

const CampaignCharacterWindow = (props) => {
    const [campaignID, setCampaignID] = useState("");
    const [characters, setCharacters] = useState(props.characters);

    // pings server every time campaignID text field is updated
    useEffect(() => {
        const loadCharactersFromServer = async () => {
            if (campaignID) {
                const response = await fetch(`/getByCampaign?campaignID=${campaignID}`);
                const data = await response.json();
                setCharacters(data.characters);
            }
        };

        loadCharactersFromServer();
    }, [campaignID, props.reloadCharacters]);

    if (characters.length === 0) {
        return (
            <div className="characterList">
                <label htmlFor="cid">Campaign ID: </label>
                <input id="campaignID" type="text" name="cid" placeholder="Campaign ID" onChange={(e) => setCampaignID(e.target.value)} />
                <h3 className="emptyCharacter">No Characters In Campaign Yet!</h3>
            </div>
        );
    }

    const characterNodes = characters.map(character => {
        return (
            <div key={character.id} className="characterList">
                <h3 className="characterName">Name: {character.name}</h3>
                <h3 className="characterID">ID: {character.characterID}</h3>

                <div className='viewInfo'>
                    <p className="viewDescription">Description: {character.description}</p>
                    <p className="viewClass">Class: {character.class}</p>
                    <p className="viewPowers">Powers: {character.powers}</p>
                </div>

                <div className="viewStats">
                    <p className="viewHitpoints">Hitpoints: {character.hitpoints}</p>
                    <p className="viewStrength">Strength: {character.strength}</p>
                    <p className="viewAgility">Agility: {character.agility}</p>
                    <p className="viewPresence">Presence: {character.presence}</p>
                    <p className="viewToughness">Toughness: {character.toughness}</p>
                    <p className="viewOmens">Omens: {character.omens}</p>
                </div>

                <div className="viewInventory">
                    <p className="viewWeapon1">First Weapon: {character.weapon1}</p>
                    <p className="viewWeapon2">Second Weapon: {character.weapon2}</p>
                    <p className="viewArmor">Armor: {character.armor}</p>
                    <p className="viewEquipment">Equipment: {character.equipment}</p>
                    <p className="viewSilver">Silver: {character.silver}</p>
                </div>

                <button onClick={(e) => handleRemove(e, character.characterID, props.triggerReload)}>Remove</button>
                <hr />
            </div>
        );
        //
    });

    return (
        <div className="characterList">
            <label htmlFor="cid">Campaign ID: </label>
            <input id="campaignID" type="text" name="cid" placeholder="Campaign ID" onChange={(e) => setCampaignID(e.target.value)} />
            <button onClick={props.triggerReload}>Refresh</button>
            {characterNodes}
        </div>
    );
};

const ChangePasswordWindow = () => {
    return (
        <form id="changePasswordForm"
            name="changePasswordForm"
            onSubmit={handleChangePass}
            action="/changePass"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="passOld">Old Password: </label>
            <input id="passOld" type="password" name="passOld" placeholder="old password" />
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="new password" />
            <label htmlFor="pass2">New Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype new password" />
            <input className="formSubmit" type="submit" value="Sign in" />
        </form>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));

    const changePasswordButton = document.getElementById('changePasswordButton');
    const characterButton = document.getElementById('characterButton');
    const dmViewButton = document.getElementById('dmViewButton');

    changePasswordButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideError();
        root.render(<ChangePasswordWindow />);
        return false;
    });

    characterButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideError();
        root.render(<CharacterWindow />);
        return false;
    });

    dmViewButton.addEventListener('click', (e) => {
        e.preventDefault();
        helper.hideError();
        // render the window here
        root.render(<CampaignCharacterWindow />);
        return false;
    });

    root.render(<CharacterWindow />);
};

window.onload = init;