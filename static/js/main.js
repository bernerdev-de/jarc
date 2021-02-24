function closePopup(id) {
  document.getElementById(id).classList.add('closed');
}

function openPopup(id) {
  console.log(id);
  document.getElementById(id).classList.remove('closed');
}

const width = localStorage.getItem('width');
const height = localStorage.getItem('height');

window.addEventListener('load', () => {
  const main = document.getElementsByClassName('main')[0];
  if (width) main.style.width = width;
  if (height) main.style.height = height;
});

window.addEventListener('beforeunload', e => {
  const main = document.getElementsByClassName('main')[0];
  localStorage.setItem('width', main.style.width);
  localStorage.setItem('height', main.style.height);
})
