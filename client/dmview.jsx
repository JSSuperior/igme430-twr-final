const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const HandleRemove = (e, ) => {
    e.preventDefault();
    helper.hideError();

    helper.sendPost(e.target.action, { name }, onCharacterCreated);
    return false;
}

// got help from here to find clean-ish way to refresh page without button
// https://www.youtube.com/watch?v=eg9rKpLrZBw
// contains a box for campaingn ID and when entered will refresh with all characters in campaign 
const CampaignCharacterList = (props) => {
    const [campaignID, setCampaignID] = useState("");
    const [characters, setCharacters] = useState(props.characters);
    const [reloadCharacters, setReloadCharacters] = useState(false);

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
    }, [campaignID, reloadCharacters]);

    // when page loads starts X second refresh of data
    // useEffect(() => {
    //     const timer
    // }, []);

    if (characters.length === 0) {
        return (
            <div className="characterList">
                <label htmlFor="cid">Campaign ID: </label>
                <input id="campaignID" type="text" name="cid" placeholder="Campaign ID" onChange={(e) => setCampaignID(e.target.value)} />

                <h3 className="emptyCharacter">No Characters In Campaign Yet!</h3>
            </div>
        );
        // <button onClick={(e) => setReloadCharacters(!reloadCharacters)}>Refresh</button>
    }

    const characterNodes = characters.map(character => {
        const removeFromCampaign = () => {
            //e.preventDefault();
            helper.hideError();
            helper.sendPost('/removeFromCampaign', { characterID }, setReloadCharacters(!reloadCharacters));
            //return false;
        }

        return (
            <div key={character.id} className="characterList">
                <h3 className="characterName">Name: {character.name}</h3>
                <h3 className="characterID">ID: {character.characterID}</h3>
                <button onClick={removeFromCampaign}>Remove</button>
            </div>
        );
        //
    });

    return (
        <div className="characterList">
            <label htmlFor="cid">Campaign ID: </label>
            <input id="campaignID" type="text" name="cid" placeholder="Campaign ID" onChange={(e) => setCampaignID(e.target.value)} />
            <button onClick={(e) => setReloadCharacters(!reloadCharacters)}>Refresh</button>
            {characterNodes}
        </div>
    );
};

const App = () => {


    // otherwise render page normally
    return (
        <div>
            <div id="campaignCharacters">
                <CampaignCharacterList characters={[]} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('dmView'));
    root.render(<App />);
};

window.onload = init;