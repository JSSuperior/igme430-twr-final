const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const NotFoundWindow = () => {
    return(
        <div id="notFound">
            <h1>404 Page Not Found</h1>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('content'));

    root.render(<NotFoundWindow />);
};

window.onload = init;