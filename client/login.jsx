const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

// logs in user with post assuming info is right
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass });
    return false;
}

// signs user up with post assuming info is right
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass != pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, { username, pass, pass2 });

    return false;
}

// log in window
const LoginWindow = (props) => {
    return (
        <div>
            <h1>MorkBorg Character Sheet Manager</h1>
            <div class="w3-container w3-yellow" style={{ marginLeft: "100px", marginRight: "100px", marginTop: "20", height: "50px" }}>
                <h3>Sign In: </h3>
            </div>
            <div class="w3-container w3-center w3-light-gray" style={{ marginLeft: "100px", marginRight: "100px", height: "154px" }}>
                <form id="loginForm"
                    name="loginForm"
                    onSubmit={handleLogin}
                    action="/login"
                    method="POST"
                    className="mainForm"
                >

                    <div className="w3-flex" style={{ gap: "8px", flexDirection: "column", marginTop: "8px" }}>
                        <input className="w3-input w3-border" id="user" type="text" name="username" placeholder="Username" />
                        <input className="w3-input w3-border" id="pass" type="password" name="pass" placeholder="Password" />
                        <input className="w3-button w3-pink" type="submit" value="Sign in" />
                    </div>
                </form>
            </div>
            <h3><span id="errorMessage"></span></h3>
        </div>
    );
};

// sign up window
const SignupWindow = (props) => {
    return (
        <div>
            <div class="w3-container w3-yellow" style={{ marginLeft: "100px", marginRight: "100px", marginTop: "20", height: "50px" }}>
                <h3>Create Account: </h3>
            </div>
            <div class="w3-container w3-center w3-light-gray" style={{ marginLeft: "100px", marginRight: "100px", height: "200px" }}>
                <form id="signupForm"
                    name="signupForm"
                    onSubmit={handleSignup}
                    action="/signup"
                    method="POST"
                    className="mainForm"
                >

                    <div className="w3-flex" style={{ gap: "8px", flexDirection: "column", marginTop: "8px" }}>
                        <input className="w3-input w3-border" id="user" type="text" name="username" placeholder="Username" />
                        <input className="w3-input w3-border" id="pass" type="password" name="pass" placeholder="Password" />
                        <input className="w3-input w3-border" id="pass2" type="password" name="pass2" placeholder="Retype Password" />
                        <input className="w3-button w3-pink" type="submit" value="Sign in" />
                    </div>
                </form>
            </div>
            <h3><span id="errorMessage"></span></h3>
        </div>
    );
};

// handles rendering
const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow />);
        return false;
    });

    root.render(<LoginWindow />);
};

window.onload = init;