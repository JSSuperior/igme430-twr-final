const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// Helper Post Functions
const handleCreate = (e, premium, onCharacterCreated) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#characterName').value;

    if (!name) {
        helper.handleError('Name required!');
        return false;
    }

    console.log(name);

    helper.sendPost(e.target.action, { name, premium }, onCharacterCreated);
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

    // if (!characterID) {
    //     helper.handleError('Field required!');
    //     return false;
    // }

    helper.sendPost(e.target.action, { characterID }, onCharacterDeleted);
    return false;
}

const handleRemove = (e, action, characterID, onCharacterRemoved) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(action, { characterID }, onCharacterRemoved);
    return false;
}

// React Components
const CreateCharacter = (props) => {
    return (
        <form id="createForm"
            onSubmit={(e) => handleCreate(e, props.premiumEnabled, props.triggerReload)}
            name="characterCreateForm"
            action="/create"
            method="POST"
            className="createForm"
        >
            <label htmlFor="name">Create New Character: </label>
            <input id="characterName" type="text" name="name" placeholder="Character Name" />
            <input id="createCharacterSubmit" type="submit" value="Create" />
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
            <label htmlFor="id">Delete Character: </label>
            <input id="characterID" type="number" name="id" placeholder="Character ID Number" />

            <input className="deleteCharacterSubmit" type="submit" value="Delete (Permanently!)" />
        </form>
    );
};

// display user 
const UserCharacterList = (props) => {
    // help from this article for passing data upwards to main app component
    // https://medium.com/@ozhanli/passing-data-from-child-to-parent-components-in-react-e347ea60b1bb

    const [characters, setCharacters] = useState(props.characters);
    let number = 0;

    useEffect(() => {
        const loadCharactersFromServer = async () => {
            number = 0;
            const response = await fetch(`/getByUser`);
            const data = await response.json();
            setCharacters(data.characters);
        };
        loadCharactersFromServer();
    }, [props.reloadCharacters, props.premiumEnabled]);

    if (characters.length === 0) {
        return (
            <div className="characterList">
                <h3 className="emptyCharacter">No Characters Yet!</h3>
            </div>
        );
    }

    const characterNodes = characters.map(character => {
        number++;

        const passUpData = () => {
            props.onClick(character.characterID);
            helper.hideError();
        }

        return (
            <div key={number} className="characterList">
                <h3 className="characterName">Name: {character.name}</h3>
                <h3 className="characterID">ID: {character.characterID}</h3>
                {number < 6 || props.premiumEnabled == true ? (<button onClick={passUpData}>Edit Character</button>) : (<p>You need to be a premium member to edit this character!</p>)}
            </div>
        );
    });

    return (
        <div className="characterList">
            <h3>My Characters: </h3>
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
            <button onClick={passUpData}> Return to Main View </button>
            <h3>Edit Character:</h3>

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
                    <label htmlFor="powers">Powers (Presence + d4 times per day): </label>
                    <input id="characterPowers" type="text" name="powers" placeholder="Character Powers" value={character.powers} onChange={handleChange} />
                    <p>Presence DR12, or -d2 HP and no Powers for 1 hr.</p>
                </div>

                <div className="editStats">
                    <label htmlFor="hitpoints">Hit Points: </label>
                    <input id="characterHitpoints" type="text" name="hitpoints" placeholder="Character Hitpoints" value={character.hitpoints} onChange={handleChange} />
                    <label htmlFor="strength">Strength Modifier: </label>
                    <input id="characterStrength" type="text" name="strength" placeholder="Character Strength Modifier" value={character.strength} onChange={handleChange} />
                    <label htmlFor="agility">Agility Modifier: </label>
                    <input id="characterAgility" type="text" name="agility" placeholder="Character Agility Modifier" value={character.agility} onChange={handleChange} />
                    <label htmlFor="presence">Presence Modifier: </label>
                    <input id="characterPresence" type="text" name="presence" placeholder="Character Presence" value={character.presence} onChange={handleChange} />
                    <label htmlFor="toughness">Toughness Modifier: </label>
                    <input id="characterToughness" type="text" name="toughness" placeholder="Character Toughness" value={character.toughness} onChange={handleChange} />
                    <label htmlFor="omens">Omens: </label>
                    <input id="characterOmens" type="text" name="omens" placeholder="Omens" value={character.omens} onChange={handleChange} />
                    <p>Maximum damage, Reroll, –d6 damage, DR –4, No Crit/Fumble</p>
                </div>

                <div className="editInventory">
                    <label htmlFor="weapon1">First Weapon: </label>
                    <input id="characterWeapon1" type="text" name="weapon1" placeholder="First Weapon" value={character.weapon1} onChange={handleChange} />
                    <label htmlFor="weapon2">Second Weapon: </label>
                    <input id="characterWeapon2" type="text" name="weapon2" placeholder="Second Weapon" value={character.weapon2} onChange={handleChange} />
                    <label htmlFor="armor">Armor: </label>
                    <input id="characterArmor" type="text" name="armor" placeholder="Armor" value={character.armor} onChange={handleChange} />
                    <label htmlFor="equipment">Equipment (Strength + 8 items or DR+2 on Agility/Strength tests): </label>
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
    const [premium, setPremium] = useState(false);

    // might be able to condense these
    const setCharacter = (value) => {
        setCurrentCharacterID(value);
    }

    // edit character if character exists
    if (currentCharacterID != 0) {
        return (
            <div>
                {premium === false ? (<div className='advertisment'><p>Advertisment Here</p></div>) : (<div><p>Premium account!</p></div>)}
                <div id="edit">
                    <EditCharacter characterID={currentCharacterID} onClick={setCharacter} />
                </div>
            </div>
        );
    }

    // otherwise render page normally
    return (
        <div>
            <div id="premiumToggle">
                <button onClick={(e) => setPremium(!premium)}>Toggle Premium Subscription</button>
            </div>
            {premium === false ? (<div className='advertisment'><p>Advertisment Here</p></div>) : (<div><p>Premium account!</p></div>)}
            <h1>Character Management Page</h1>
            <div id="makeCharacter">
                <CreateCharacter premiumEnabled={premium} triggerReload={() => setReloadCharacters(!reloadCharacters)} />
            </div>
            <div id="deleteCharacter">
                <CharacterDelete triggerReload={() => setReloadCharacters(!reloadCharacters)} />
            </div>
            <hr />
            <div id="characters">
                <UserCharacterList premiumEnabled={premium} characters={[]} reloadCharacters={reloadCharacters} onClick={setCharacter} />
            </div>
        </div>
    );
};

const CampaignCharacterWindow = (props) => {
    const [campaignID, setCampaignID] = useState("");
    const [characters, setCharacters] = useState([]);
    const [reloadView, triggerReloadView] = useState(false);
    const [premium, setPremium] = useState(false);

    // update this later so that fields respond properly
    // could probably move this to a seperate?
    useEffect(() => {
        const loadCharactersFromServer = async () => {
            helper.hideError();
            // if (!characters) {
                
            // }
            const response = await fetch(`/getByCampaign?campaignID=${campaignID}`);
            const data = await response.json();
            setCharacters(data.characters);
        };

        loadCharactersFromServer();
    }, [reloadView]);

    let content;

    if (characters) {
        content = characters.map(character => {
            return (
                <div key={character.id} className="characterList">
                    <h3 className="characterName">Name: {character.name}</h3>

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

                    <button onClick={(e) => handleRemove(e, '/removeFromCampaign', character.characterID, onClick)}>Remove</button>
                    <hr />
                </div>
            );
        });
    } else {
        content = (<div></div>);
    }

    return (
        <div className="characterList">
            <div id="premiumToggle">
                <button onClick={(e) => setPremium(!premium)}>Toggle Premium Subscription</button>
            </div>
            {premium === false ? (<div className='advertisment'><p>Advertisment Here</p></div>) : (<div><p>Premium account!</p></div>)}
            <h1>Campaign Search</h1>
            <label htmlFor="cid">Campaign ID: </label>
            <input id="campaignID" type="text" name="cid" placeholder="Campaign ID" onChange={(e) => setCampaignID(e.target.value)} />
            <button onClick={(e) => triggerReloadView(!reloadView)}>Search!</button>
            <button onClick={(e) => triggerReloadView(!reloadView)}>Refresh</button>
            {content}
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
            <h1>Account Settings: </h1>
            <h3>Change Password:</h3>
            <label htmlFor="passOld">Old Password: </label>
            <input id="passOld" type="password" name="passOld" placeholder="Old Password" />
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="New Password" />
            <label htmlFor="pass2">Retype New Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="New Password" />
            <input className="formSubmit" type="submit" value="Update Info" />
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