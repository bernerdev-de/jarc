const errorLabel = document.getElementById('mkdir-error');

document.getElementById('mkdir').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nameField = document.getElementById('path').value;
  errorLabel.innerText = '';

  if (nameField.length <= 0) {
    errorLabel.innerText = 'Please specify the name';
    return false;
  }

  const path = document.getElementById('rootPath').value + nameField;

  try {
    const response = await fetch('/mkdir', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ path: path }),
    });
    const data = await response.json();
    if (!data.created) {
      if (data.message) errorLabel.innerText = data.message;
      else errorLabel.innerText = 'Folder could not be created';
      return false;
    }
    closePopup('mkdir');
    location.reload();
  } catch (e) {
    errorLabel.innerText = 'Sorry, something went wrong';
    console.error(e);
  }

  return false;
});
