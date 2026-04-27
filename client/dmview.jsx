const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// got help from here to find clean-ish way to refresh page without button
// https://www.youtube.com/watch?v=eg9rKpLrZBw
// contains a box for campaingn ID and when entered will refresh with all characters in campaign 


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