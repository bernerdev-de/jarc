const formUpload = document.querySelector('#upload form');
const inputFiles = document.getElementById('files');
const inputFilesLabel = document.getElementById('files-label');

[
  'drag',
  'dragstart',
  'dragend',
  'dragover',
  'dragenter',
  'dragleave',
  'drop',
].forEach((event) => {
  window.addEventListener(event, (e) => {
    e.preventDefault();
    e.stopPropagation();
    openPopup('upload');
  });
});

['dragover', 'dragenter'].forEach((event) => {
  window.addEventListener(event, (e) => {
    formUpload.classList.add('is-dragover');
    inputFilesLabel.innerHTML = 'Release mouse to drop files here';
  });
});

['dragleave', 'dragend', 'drop'].forEach((event) => {
  window.addEventListener(event, (e) => {
    formUpload.classList.remove('is-dragover');
    update();
  });
});

window.addEventListener('drop', (e) => {
  inputFiles.files = e.dataTransfer.files;
  update();
});

inputFiles.addEventListener('change', (e) => update());

function update() {
  if (inputFiles.files && inputFiles.files.length > 0) {
    console.log(inputFiles.files);
    inputFilesLabel.innerHTML = 'Files:<br>';
    for (file of inputFiles.files) {
      inputFilesLabel.innerHTML += file.name + '<br>';
    }
  } else {
    inputFilesLabel.innerHTML =
      'Click to select file(s)<br>or<br>drag and drop file(s) here';
  }
}
update();
