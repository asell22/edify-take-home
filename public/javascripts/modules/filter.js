import { makeAnimalCards } from './card.js';

const btns = document.querySelectorAll('.ui.buttons > .ui.button');

const setActive = (collection, btn) => {
  Array.prototype.forEach.call(collection, (btn) => {
    btn.classList.remove('active');
  });
  btn.classList.add('active');
};

export const setFilterButtonListeners = (animals) => {
  const males = animals.filter((animal) => animal.gender === 'Male');
  const females = animals.filter((animal) => animal.gender === 'Female');

  Array.prototype.forEach.call(btns, (btn) => {
    btn.addEventListener('click', (evt) => {
      setActive(btns, btn);
      document.querySelector('#list').innerHTML = '';
      switch (evt.target.dataset.genderType) {
        case 'male':
          makeAnimalCards(males);
          break;
        case 'female':
          makeAnimalCards(females);
          break;
        default:
          makeAnimalCards(animals);
          break;
      }
    });
  });
};
