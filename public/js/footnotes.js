// Create a modal background and element.
const modal = document.createElement('div');
modal.classList.add('modal');
modal.innerHTML = '<aside><h3></h3><q></q></aside>';
const aside = modal.querySelector('aside');
const header = modal.querySelector('h3');
const content = modal.querySelector('q');

function closeModal() {
  modal.classList.remove('active');
  header.innerHTML = '';
  content.innerHTML = '';
}

// Allow clicking outside or hitting escape to close the modal.
modal.onclick = (e) => {
  if (e.target.classList.contains('modal')) {
    e.preventDefault();
    closeModal();
  }
};
document.onkeydown = (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeModal();
  }
};

// Append modal to body.
document.querySelector('main').appendChild(modal);

// Collect all of the footnotes and hide the static display.
try {
  document.querySelector('.footnotes').style.display = 'none';
} catch(e) {
  const fakeFootnotes = document.createElement('div');
  fakeFootnotes.classList.add('footnotes');
  document.querySelector('main').appendChild(fakeFootnotes);
}
let footnotes = {};
document.querySelectorAll('.footnotes li').forEach((fn) => {
  footnotes[fn.getAttribute('id')] = fn.innerHTML;
})

// For each ref link, set up an event that populates the modal.
function fnClick(e) {
  e.preventDefault();
  const id = e.target.getAttribute('href').substring(1);
  content.innerHTML = footnotes[id];
  header.innerText = id.split(':')[1];
  modal.classList.add('active');
  aside.style.top = `max(calc(50vh - 1rem - ${aside.clientHeight}px / 2), 0px)`;

  // Block the usual action of clicking the backref link, just close the modal
  content.querySelector('.footnote-backref').onclick = (ee) => {
    ee.preventDefault();
    closeModal();
  };

  // Allow nested footnotes
  content.querySelectorAll('.footnote-ref').forEach((fnRefNested) => {
    fnRefNested.onclick = fnClick;
  });
  content.querySelectorAll('.cite').forEach((citeNested) => {
    citeNested.onclick = citeClick;
  });
}
document.querySelectorAll('.footnote-ref').forEach((fnRef) => {
  fnRef.onclick = fnClick;
});

// Do the same for citation references.
function citeClick(e) {
  header.innerText = e.target.childNodes[0].textContent;
  content.innerHTML = e.target.querySelector('.cite-ref').innerHTML;
  modal.classList.add('active');
  aside.style.top = `max(calc(50vh - 1rem - ${aside.clientHeight}px / 2), 0px)`;
}
document.querySelectorAll('.cite').forEach((cite) => {
  cite.onclick = citeClick;
});
