export const setFavorites = () => {
  if (!localStorage.getItem('favs')) {
    const favs = [];
    localStorage.setItem('favs', JSON.stringify(favs));
  }

  setFavoritesBtnListener();
  setFavoriteHandlers();
  setFavoritesList(JSON.parse(localStorage.getItem('favs')));
};

const setFavoritesBtnListener = () => {
  const favoritesButton = document.querySelector('#favorites-btn');
  favoritesButton.addEventListener('click', openFavorites);
};

const setFavoriteHandlers = () => {
  const favIcons = document.getElementsByClassName('star icon');
  Array.prototype.forEach.call(favIcons, (icon) => {
    icon.addEventListener('click', (evt) => handleFavorite(evt, icon));
  });
};

const handleFavorite = (event, icon) => {
  event.stopPropagation();
  const favId = event.target.dataset.favId;
  const favName = event.target.dataset.favName;
  const favUrl = event.target.dataset.favUrl;
  const favs = JSON.parse(localStorage.getItem('favs'));
  const favIds = favs.map((fav) => fav.id);
  if (favIds.includes(favId)) {
    icon.classList.remove('active');

    localStorage.setItem(
      'favs',
      JSON.stringify(favs.filter((fav) => fav.id !== favId))
    );
  } else {
    icon.classList.add('active');
    localStorage.setItem(
      'favs',
      JSON.stringify([...favs, { id: favId, name: favName, url: favUrl }])
    );
  }
  setFavoritesList(JSON.parse(localStorage.getItem('favs')));
};

const setFavoritesList = (list) => {
  const sidebar = document.querySelector('.sidebar');
  sidebar.innerHTML = `<h3 style="text-align: center; margin-top: 15px;">Favorites</h3>`;
  if (list.length) {
    const ul = document.createElement('ul');
    ul.style.listStyleType = 'none';
    list.map((animal) => {
      const animalLi = document.createElement('li');
      animalLi.innerHTML = `<a href=${animal.url} target="_blank">${animal.name}</a>`;
      ul.append(animalLi);
    });
    sidebar.append(ul);
  } else {
    const p = document.createElement('p');
    p.textContent =
      'You currently have no favorite cats. Click on the star icon to seelect a favorite cat.';
    p.style.padding = '15px';
    sidebar.append(p);
  }
};

const openFavorites = () => {
  $('.sidebar')
    .sidebar({
      dimPage: false,
      transition: 'overlay',
    })
    .sidebar('toggle');
};
