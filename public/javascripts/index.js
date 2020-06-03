import { getAnimals } from './modules/api.js';
import { setFilterButtonListeners } from './modules/filter.js';
import { makeAnimalCards } from './modules/card.js';
import { setFavorites } from './modules/favorite.js';
import { createModal } from './modules/modal.js';

(() => {
  const stopSpinner = () => {
    document.getElementById('loader').classList.add('disabled');
    document.getElementById('dimmer').classList.remove('active');
  };

  const mainFunction = async () => {
    const animals = await getAnimals();
    setFilterButtonListeners(animals);
    makeAnimalCards(animals);
    setFavorites();
    createModal();
    stopSpinner();
  };

  mainFunction();
})();
