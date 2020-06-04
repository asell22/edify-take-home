import { handleShow } from './modal.js';
import { setFavorites } from './favorite.js';

export const makeAnimalCards = (animals) => {
  const favs = JSON.parse(localStorage.getItem('favs'));
  const favIds = favs.map((fav) => fav.id);
  const app = document.querySelector('#list');
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('ui', 'link', 'cards');
  app.append(cardsContainer);

  animals.map((animal) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.addEventListener('click', () => {
      handleShow(animal);
    });
    const iconClass = favIds.includes(animal.id.toString())
      ? 'star icon active'
      : 'star icon';
    card.innerHTML = `
        <img src=${animal.photos[0].medium} height="260" style="object-fit: cover">
        <div class="content">
          <div class="header">${animal.name}</div>
        </div>
        <div class="extra content">
        <span class="right floated star">
          <i class="${iconClass}" 
            data-fav-id=${animal.id} 
            data-fav-name=${animal.name} 
            data-fav-url=${animal.url}></i>
          Favorite
        </span>`;
    cardsContainer.append(card);
  });
  setFavorites();
};
