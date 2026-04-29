/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  const widget = document.getElementById('errorMessage');
  widget.style.color = "#E91E63";
  widget.textContent = message;
  //document.getElementById('domoMessage').classList.remove('hidden');
};

// takes in message and displays it. Used for non-error messages.
const handleMessage = (message) => {
  const widget = document.getElementById('errorMessage');
  widget.style.color = "#00F200";
  widget.textContent = message;
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  const widget = document.getElementById('errorMessage').textContent = "";

  if(result.redirect) {
    window.location = result.redirect;
  }

  if(result.error) {
    handleError(result.error);
  }

  if(result.message) {
    handleMessage(result.message);
  }

  if(handler) {
    handler(result);
  }
};

const hideError = () => {
  const widget = document.getElementById('errorMessage').textContent = "";
};

const hideMessage = () => {
  const widget = document.getElementById('errorMessage').textContent = "";
};

module.exports = {
    handleError,
    sendPost,
    hideError,
};