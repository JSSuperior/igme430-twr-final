const React = require('react');
const { createRoot } = require('react-dom/client');

// not found page
const NotFoundWindow = () => {
    return(
        <div id="notFound">
            <h1>404 Page Not Found</h1>
        </div>
    );
}

// render not found page
const init = () => {
    const root = createRoot(document.getElementById('content'));

    root.render(<NotFoundWindow />);
};

window.onload = init;