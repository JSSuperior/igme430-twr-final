const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// handles creating new character
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

// handles changing password
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
        return false;
    }

    helper.sendPost(e.target.action, { pass, pass2, passOld });
    return false;
}

// handles editing character info
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

// handles deleting character
const handleDelete = (e, onCharacterDeleted) => {
    e.preventDefault();
    helper.hideError();

    const characterID = e.target.querySelector('#characterID').value;

    helper.sendPost(e.target.action, { characterID }, onCharacterDeleted);
    return false;
}

// handles removing character from campaign
const handleRemove = (e, action, characterID, onCharacterRemoved) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(action, { characterID }, onCharacterRemoved);
    return false;
}

//
// REACT COMPONENTS
// 

// character creation form
const CreateCharacter = (props) => {
    return (
        <div>
            <div class="w3-container w3-yellow" style={{ marginLeft: "100px", marginRight: "100px", marginTop: "20", height: "50px" }}>
                <h3>Create New Character: </h3>
            </div>
            <div class="w3-container w3-center w3-light-gray" style={{ marginLeft: "100px", marginRight: "100px", height: "56px" }}>
                <form class="w3-container" id="createForm"
                    onSubmit={(e) => handleCreate(e, props.premiumEnabled, props.triggerReload)}
                    name="characterCreateForm"
                    action="/create"
                    method="POST"
                    className="createForm"
                >
                    <div className="w3-flex" style={{ gap: "8px", marginTop: "8px" }}>
                        <input class="w3-input w3-border" id="characterName" type="text" name="name" placeholder="Character Name" />
                        <input class="w3-button w3-pink" id="createCharacterSubmit" type="submit" value="Create" />
                    </div>
                </form>
            </div>
        </div>
    );
}

// character deletion form
const CharacterDelete = (props) => {
    return (
        <div>
            <div class="w3-container w3-yellow" style={{ marginLeft: "100px", marginRight: "100px", marginTop: "20", height: "50px" }}>
                <h3>Delete Character: </h3>
            </div>
            <div class="w3-container w3-center w3-light-gray" style={{ marginLeft: "100px", marginRight: "100px", height: "56px" }}>
                <form class="w3-container" id="deleteForm"
                    onSubmit={(e) => handleDelete(e, props.triggerReload)}
                    name="characterDeleteForm"
                    action="/delete"
                    method="POST"
                    className="deleteForm"
                >

                    <div className="w3-flex" style={{ gap: "8px", marginTop: "8px" }}>
                        <input class="w3-input w3-border" id="characterID" type="number" name="id" placeholder="Character ID Number" />
                        <input class="w3-button w3-pink" id="deleteCharacterSubmit" type="submit" value="Delete (Permanently!)" />
                    </div>
                </form>
            </div>
        </div>
    );
};

// displays all characters currently signed in user has
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

    if (!characters) {
        return (
            <div className="characterList">
                <h3 className="emptyCharacter">No Characters Yet!</h3>
            </div>
        );
    }

    // if the user is not premium, prevents user from editing more than 5 characters
    const characterNodes = characters.map(character => {
        number++;

        const passUpData = () => {
            props.onClick(character.characterID);
            helper.hideError();
        }

        return (
            <div key={number} className="w3-container w3-light-gray w3-center" style={{ marginLeft: "100px", marginRight: "100px", marginBottom: "20px", padding: "8px" }}>
                <div className="w3-flex w3-center" style={{ gap: "20px", alignItems: "center", justifyContent: "center" }}>
                    <h3 className="characterName">Name: {character.name}</h3>
                    <h3 className="characterID">ID: {character.characterID}</h3>
                </div>
                {number < 6 || props.premiumEnabled == true ? (<button className="w3-button w3-pink" onClick={passUpData}>Edit Character</button>) : (<p>You need to be a premium member to edit this character!</p>)}
            </div>
        );
    });

    return (
        <div className="characterList">
            {characterNodes}
        </div>
    );
};

// lets user edit character details
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
    const onChange
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
                <button className="w3-button w3-pink" onClick={passUpData}> Return to Main View </button>
                <p>Loading</p>
            </div>
        );
    }

    return (
        <div>
            <h3><span id="errorMessage"></span></h3>
            <div className="w3-container w3-yellow w3-center" style={{ marginTop: "8px" }}>
                <h3>Edit Character:</h3>
            </div>
            <div className="w3-container w3-light-gray" style={{ padding: "5px", marginBottom: "10px" }}>
                <form id="editForm" style={{ gap: "8px" }}
                    onSubmit={(e) => handleEdit(e, characterID, props.triggerReload)}
                    name="characterEditForm"
                    action="/edit"
                    method="POST"
                    className="editForm"
                >
                    <div className="w3-flex" style={{ alignItems: "center", gap: "8px" }}>
                        <button className="w3-button w3-pink" onClick={passUpData}> Return to Main View </button>
                        <input class="w3-button w3-pink" id="editCharacterSubmit" type="submit" value="Save Changes" />
                    </div>

                    <div class="w3-container">
                        <label htmlFor="cid">Campaign ID: </label>
                        <input className="w3-input" id="campaignID" type="text" name="campaignID" placeholder="Campaign ID" value={character.campaignID} onChange={onChange} />

                        <label htmlFor="name">Name: </label>
                        <input className="w3-input" id="characterName" type="text" name="name" placeholder="Character Name" value={character.name} onChange={onChange} />
                    </div>

                    <div className="w3-flex">
                        <div className="w3-container w3-center">
                            <div class="w3-flex" style={{ flexDirection: "column", alignItems: "center" }}>
                                <label htmlFor="description">Description: </label>
                                <textarea style={{ resize: "none", width: "300px", height: "150px" }} className="w3-input w3-border" id="characterDescription" type="text" name="description" placeholder="Character Description" value={character.description} onChange={onChange} />
                                <label htmlFor="class">Class: </label>
                                <textarea style={{ resize: "none", width: "300px", height: "120px" }} className="w3-input w3-border" id="characterClass" type="text" name="class" placeholder="Character Class" value={character.class} onChange={onChange} />
                                <label htmlFor="powers">Powers (Presence + d4 times per day): </label>
                                <textarea style={{ resize: "none", width: "300px", height: "150px" }} className="w3-input w3-border" id="characterPowers" type="text" name="powers" placeholder="Character Powers" value={character.powers} onChange={onChange} />
                                <p>Presence DR12, or -d2 HP and no Powers for 1 hr.</p>
                            </div>
                        </div>

                        <div className="w3-container w3-center">
                            <div class="w3-flex" style={{ flexDirection: "column", alignItems: "center" }}>
                                <label htmlFor="hitpoints">Hit Points: </label>
                                <textarea style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" id="characterHitpoints" type="text" name="hitpoints" placeholder="Character Hitpoints" value={character.hitpoints} onChange={onChange} />
                                <label htmlFor="strength">Strength Modifier: </label>
                                <textarea style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" id="characterStrength" type="text" name="strength" placeholder="Character Strength Modifier" value={character.strength} onChange={onChange} />
                                <label htmlFor="agility">Agility Modifier: </label>
                                <textarea style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" id="characterAgility" type="text" name="agility" placeholder="Character Agility Modifier" value={character.agility} onChange={onChange} />
                                <label htmlFor="presence">Presence Modifier: </label>
                                <textarea style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" id="characterPresence" type="text" name="presence" placeholder="Character Presence" value={character.presence} onChange={onChange} />
                                <label htmlFor="toughness">Toughness Modifier: </label>
                                <textarea style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" id="characterToughness" type="text" name="toughness" placeholder="Character Toughness" value={character.toughness} onChange={onChange} />
                                <label htmlFor="omens">Omens: </label>
                                <textarea style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" id="characterOmens" type="text" name="omens" placeholder="Omens" value={character.omens} onChange={onChange} />
                                <p>Maximum damage, Reroll, –d6 damage, DR –4, No Crit/Fumble</p>
                            </div>
                        </div>

                        <div className="w3-container w3-center">
                            <div class="w3-flex" style={{ flexDirection: "column", alignItems: "center" }}>
                                <label htmlFor="weapon1">First Weapon: </label>
                                <textarea style={{ resize: "none", width: "200px", height: "70px" }} className="w3-input w3-border" id="characterWeapon1" type="text" name="weapon1" placeholder="First Weapon" value={character.weapon1} onChange={onChange} />
                                <label htmlFor="weapon2">Second Weapon: </label>
                                <textarea style={{ resize: "none", width: "200px", height: "70px" }} className="w3-input w3-border" id="characterWeapon2" type="text" name="weapon2" placeholder="Second Weapon" value={character.weapon2} onChange={onChange} />
                                <label htmlFor="armor">Armor: </label>
                                <textarea style={{ resize: "none", width: "200px", height: "70px" }} className="w3-input w3-border" id="characterArmor" type="text" name="armor" placeholder="Armor" value={character.armor} onChange={onChange} />
                                <label htmlFor="equipment">Equipment (Strength + 8 items or DR+2 on Agility/Strength tests): </label>
                                <textarea style={{ resize: "none", width: "200px", height: "200px" }} className="w3-input w3-border" id="characterEquipment" type="text" name="equipment" placeholder="Equipment" value={character.equipment} onChange={onChange} />
                                <label htmlFor="silver">Silver: </label>
                                <textarea style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" id="characterSilver" type="text" name="silver" placeholder="Silver" value={character.silver} onChange={onChange} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 
// REACT WINDOWS
//

const CharacterWindow = () => {
    const [currentCharacterID, setCurrentCharacterID] = useState(0);
    const [reloadCharacters, setReloadCharacters] = useState(false);
    const [premium, setPremium] = useState(false);

    const setCharacter = (value) => {
        setCurrentCharacterID(value);
    }

    // edit character if character exists
    if (currentCharacterID != 0) {
        return (
            <div>
                {premium === false ? (<div className='advertisment'><img style={{ height: "100px" }} src="/assets/img/advertplaceholder.png" alt="advertisement" /></div>) : (<div><p>Premium account!</p></div>)}
                <div id="edit">
                    <EditCharacter characterID={currentCharacterID} onClick={setCharacter} />
                </div>
            </div>
        );
    }

    // otherwise render page normally
    return (
        <div>
            <div id="premiumToggle" style={{ marginBottom: "10px" }}>
                <button class="w3-button w3-padding-large w3-orange" onClick={(e) => setPremium(!premium)}>Toggle Premium Subscription</button>
            </div>
            {premium === false ? (<div className='advertisment'><img style={{ height: "100px" }} src="/assets/img/advertplaceholder.png" alt="advertisement" /></div>) : (<div><p>Premium account!</p></div>)}
            <h1>Character Management Page</h1>
            <div id="makeCharacter">
                <CreateCharacter premiumEnabled={premium} triggerReload={() => setReloadCharacters(!reloadCharacters)} />
            </div>
            <div id="deleteCharacter">
                <CharacterDelete triggerReload={() => setReloadCharacters(!reloadCharacters)} />
            </div>
            <h3><span id="errorMessage"></span></h3>
            <hr />
            <div id="characters">
                <UserCharacterList premiumEnabled={premium} characters={[]} reloadCharacters={reloadCharacters} onClick={setCharacter} />
            </div>
        </div>
    );
};

// window for searching for campaigns
const CampaignCharacterWindow = (props) => {
    const [campaignID, setCampaignID] = useState("");
    const [characters, setCharacters] = useState([]);
    const [reloadView, triggerReloadView] = useState(false);
    const [premium, setPremium] = useState(false);

    const loadCharacterFromServer = async () => {
        helper.hideError();
        if (!campaignID) {
            helper.handleError('Campaign ID required!');
        } else {
            const response = await fetch(`/getByCampaign?campaignID=${campaignID}`);
            const data = await response.json();

            if (data.error) {
                helper.handleError(data.error);
                setCharacters([]);
            } else {
                setCharacters(data.characters);
            }
        }
    }

    let content;

    if (!characters || characters.length < 1) {
        content = (<div><h3>No Characters!</h3></div>);
    } else {
        content = characters.map(character => {
            return (
                <div key={character.id} className="characterList">
                    <div className="w3-container w3-yellow w3-center" style={{ marginTop: "8px" }}>
                        <h3 className="characterName">Name: {character.name}</h3>
                    </div>

                    <div className="w3-container w3-light-gray" style={{ padding: "5px", marginBottom: "10px" }}>
                        <div className="w3-flex" style={{justifyContent: "center", alignItems:"center"}}>
                            <div className="w3-container w3-center">
                                <div class="w3-flex" style={{ flexDirection: "column", gap: "8px" }}>
                                    <label htmlFor="description">Description: </label>
                                    <textarea readonly style={{ resize: "none", width: "300px", height: "150px" }} className="w3-input w3-border" type="text" name="description" placeholder="Character Description" value={character.description} />
                                    <label htmlFor="class">Class: </label>
                                    <textarea readonly style={{ resize: "none", width: "300px", height: "120px" }} className="w3-input w3-border" type="text" name="class" placeholder="Character Class" value={character.class} />
                                    <label htmlFor="powers">Powers: </label>
                                    <textarea readonly style={{ resize: "none", width: "300px", height: "150px" }} className="w3-input w3-border" type="text" name="powers" placeholder="Character Powers" value={character.powers} />
                                </div>
                            </div>

                            <div className="w3-container w3-center">
                                <div class="w3-flex" style={{ flexDirection: "column", gap: "8px" }}>
                                    <label htmlFor="hitpoints">Hit Points: </label>
                                    <textarea readonly style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" type="text" name="hitpoints" placeholder="Character Hitpoints" value={character.hitpoints} />
                                    <label htmlFor="strength">Strength Modifier: </label>
                                    <textarea readonly style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" type="text" name="strength" placeholder="Character Strength Modifier" value={character.strength} />
                                    <label htmlFor="agility">Agility Modifier: </label>
                                    <textarea readonly style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" type="text" name="agility" placeholder="Character Agility Modifier" value={character.agility} />
                                    <label htmlFor="presence">Presence Modifier: </label>
                                    <textarea readonly style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" type="text" name="presence" placeholder="Character Presence" value={character.presence} />
                                    <label htmlFor="toughness">Toughness Modifier: </label>
                                    <textarea readonly style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" type="text" name="toughness" placeholder="Character Toughness" value={character.toughness} />
                                    <label htmlFor="omens">Omens: </label>
                                    <textarea readonly style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" type="text" name="omens" placeholder="Omens" value={character.omens} />
                                </div>
                            </div>

                            <div className="w3-container w3-center">
                                <div class="w3-flex" style={{ flexDirection: "column", gap:"8px" }}>
                                    <label htmlFor="weapon1">First Weapon: </label>
                                    <textarea readonly style={{ resize: "none", width: "200px", height: "70px" }} className="w3-input w3-border" type="text" name="weapon1" placeholder="First Weapon" value={character.weapon1} />
                                    <label htmlFor="weapon2">Second Weapon: </label>
                                    <textarea readonly style={{ resize: "none", width: "200px", height: "70px" }} className="w3-input w3-border" type="text" name="weapon2" placeholder="Second Weapon" value={character.weapon2} />
                                    <label htmlFor="armor">Armor: </label>
                                    <textarea readonly style={{ resize: "none", width: "200px", height: "70px" }} className="w3-input w3-border" type="text" name="armor" placeholder="Armor" value={character.armor} />
                                    <label htmlFor="equipment">Equipment: </label>
                                    <textarea readonly style={{ resize: "none", width: "200px", height: "200px" }} className="w3-input w3-border" type="text" name="equipment" placeholder="Equipment" value={character.equipment} />
                                    <label htmlFor="silver">Silver: </label>
                                    <textarea readonly style={{ resize: "none", width: "100px", height: "30px" }} className="w3-input w3-border" type="text" name="silver" placeholder="Silver" value={character.silver} />
                                </div>
                            </div>
                        </div>

                        <button className="w3-button w3-pink" style={{marginTop:"8px"}} onClick={(e) => handleRemove(e, '/removeFromCampaign', character.characterID, loadCharacterFromServer)}>Remove Items From Campaign</button>
                    </div>
                    <hr />
                </div>
            );
        });
    }

    return (
        <div className="characterList">
            <div id="premiumToggle" style={{ marginBottom: "10px" }}>
                <button className="w3-button w3-orange" onClick={(e) => setPremium(!premium)}>Toggle Premium Subscription</button>
            </div>
            {premium === false ? (<div className='advertisment'><img style={{ height: "100px" }} src="/assets/img/advertplaceholder.png" alt="advertisement" /></div>) : (<div><p>Premium account!</p></div>)}
            <h1>Campaign Search</h1>
            <div className="w3-container w3-yellow" style={{ marginLeft: "100px", marginRight: "100px", marginTop: "20", height: "50px" }}>
                <h3>Campaign ID:</h3>
            </div>
            <div class="w3-container w3-center w3-light-gray" style={{ marginLeft: "100px", marginRight: "100px", height: "56px" }}>
                <div className="w3-flex" style={{ gap: "8px", marginTop: "8px" }}>
                    <input className="w3-input w3-border" id="campaignID" type="text" name="cid" placeholder="Campaign ID" onChange={(e) => setCampaignID(e.target.value)} />
                    <button className="w3-button w3-pink" onClick={loadCharacterFromServer}>Search!</button>
                    {characters.length > 0 ? (<button className="w3-button w3-pink" onClick={loadCharacterFromServer}>Refresh!</button>) : (<div></div>)}
                </div>
            </div>
            <h3><span id="errorMessage"></span></h3>
            <hr />
            {content}
        </div>
    );
};

// window for changing user password
const ChangePasswordWindow = () => {
    return (
        <div>
            <h1>Account Settings: </h1>
            <div className="w3-container w3-yellow" style={{ marginLeft: "100px", marginRight: "100px", marginTop: "20", height: "50px" }}>
                <h3>Change Password:</h3>
            </div>
            <div class="w3-container w3-center w3-light-gray" style={{ marginLeft: "100px", marginRight: "100px", height: "200px" }}>
                <form id="changePasswordForm"
                    name="changePasswordForm"
                    onSubmit={handleChangePass}
                    action="/changePass"
                    method="POST"
                    className="mainForm"
                >
                    <div className="w3-flex" style={{ gap: "8px", flexDirection: "column", marginTop: "8px" }}>
                        <input className="w3-input w3-border" id="passOld" type="password" name="passOld" placeholder="Old Password" />
                        <input className="w3-input w3-border" id="pass" type="password" name="pass" placeholder="New Password" />
                        <input className="w3-input w3-border" id="pass2" type="password" name="pass2" placeholder="Retype New Password" />
                        <input className="w3-button w3-pink" type="submit" value="Update Info" />
                    </div>
                </form>
            </div>
            <h3><span id="errorMessage"></span></h3>
        </div>
    );
};

// render page
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
        root.render(<CampaignCharacterWindow />);
        return false;
    });

    root.render(<CharacterWindow />);
};

window.onload = init;