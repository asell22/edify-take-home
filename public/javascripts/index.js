(() => {
  let favorites;
  const getToken = async (key, secret) => {
    const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
      method: 'POST',
      body:
        'grant_type=client_credentials&client_id=' +
        key +
        '&client_secret=' +
        secret,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.json();
  };

  const getAnimals = async (token) => {
    const listUrl = new URL('https://api.petfinder.com/v2/animals');
    const listParams = {
      type: 'cat',
      color: 'black',
      location: 'Los Angeles, CA',
    };

    listUrl.search = new URLSearchParams(listParams).toString();
    const response = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  };

  const getAnimalAttributesTemplate = (animal) => {
    return `
    <div class="ui grid" style="padding-left: 25px">
      <div class="five wide column">
        <h3>Attributes</h3>
        <ul style="padding: 0; list-style-type: none">
          <li><strong>Breed:</strong><span> ${animal.breeds.primary}</span></li>
          <li><strong>Color:</strong><span> ${animal.colors.primary}</span></li>
          <li><strong>Gender:</strong><span> ${animal.gender}</span></li>
          <li><strong>Size:</strong><span> ${animal.size}</span></li>
          <li><strong>Declawed:</strong> <span>${
            animal.attributes.declawed ? 'Yes' : 'No'
          }</span></li>
          <li><strong>House Trained:</strong> <span>${
            animal.attributes.house_trained ? 'Yes' : 'No'
          }</span></li>
          <li><strong>Received Shots:</strong> <span>${
            animal.attributes.shots_current ? 'Yes' : 'No'
          }</span></li>
          <li><strong>Neutered:</strong> <span>${
            animal.attributes.spayed_neutered ? 'Yes' : 'No'
          }</span></li>
          <li><strong>Special Needs:</strong> <span>${
            animal.attributes.special_needs ? 'Yes' : 'No'
          }</span></li>
        </ul>
      </div>
      <div class="eight wide column">
        <h3>Contact Info</h3>
        <ul style="padding: 0; list-style-type: none">
          <li><strong>Email:</strong> <span>${
            animal.contact.email ? animal.contact.email : 'None listed'
          }</span></li>
          <li><strong>Phone:</strong> <span>${
            animal.contact.phone ? animal.contact.phone : 'None listed'
          }</span></li>
        </ul>
    </div>
    `;
  };

  const handleShow = (animal) => {
    let img;
    if (animal.photos[1]) {
      img = animal.photos[1].medium;
    } else {
      img = animal.photos[0].medium;
    }
    document.querySelector('.modal-header').textContent = `Meet ${animal.name}`;
    document.querySelector(
      '.img-container'
    ).innerHTML = `<img src=${img} height="240" width="250" style="object-fit:cover;"/>`;
    document.querySelector(
      '.url-btn'
    ).innerHTML = `<a href=${animal.url} target="_blank" style="color: white">Meet on Petfinder</a> `;
    document.querySelector(
      '.modal-desc'
    ).innerHTML = getAnimalAttributesTemplate(animal);
    $('#modal').modal('show');
    console.log(animal);
  };

  const setFilterButtonListeners = (btns, males, females, animals) => {
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

  const openFavorites = () => {
    $('.sidebar')
      .sidebar({
        dimPage: false,
        transition: 'overlay',
      })
      .sidebar('toggle');
  };

  const setFavoritesBtnListener = () => {
    const favoritesButton = document.querySelector('#favorites-btn');
    favoritesButton.addEventListener('click', openFavorites);
  };

  const setActive = (collection, btn) => {
    Array.prototype.forEach.call(collection, (btn) => {
      btn.classList.remove('active');
    });
    btn.classList.add('active');
  };

  const handleFavorite = (event, icon) => {
    console.log(event);
    console.log(JSON.parse(localStorage.getItem('favIds')));
    event.stopPropagation();
    console.log();
    const favId = event.target.dataset.favId;
    console.log('favId:', favId);
    const favName = event.target.dataset.favName;
    console.log('favName:', favName);
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
    // console.log(JSON.parse(localStorage.getItem('favs')));
    setFavoritesList(JSON.parse(localStorage.getItem('favs')));
  };

  setFavoritesList = (list) => {
    console.log('list:', list);
    const sidebar = document.querySelector('.sidebar');
    sidebar.innerHTML = `<h3 style="text-align: center; margin-top: 15px;">Favorites</h3>`;
    if (list.length) {
      const ul = document.createElement('ul');
      // ul.innerHTML = ;
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

  setFavoriteHandlers = () => {
    const favIcons = document.getElementsByClassName('star icon');
    Array.prototype.forEach.call(favIcons, (icon) => {
      icon.addEventListener('click', (evt) => handleFavorite(evt, icon));
    });
  };

  const makeAnimalCards = (animals) => {
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
    setFavoriteHandlers();
  };

  const createModal = () => {
    const modal = document.createElement('div');
    modal.classList.add('ui', 'modal', 'large');
    modal.id = 'modal';
    modal.innerHTML = `
      <i class="close icon"></i>
      <div class="header modal-header">
        Profile Picture
      </div>
      <div class="image content">
        <div class="img-container" style="border: 1px solid #ccc;"></div>
        <div class="description modal-desc"></div>
      </div>
      <div class="actions">
        <div class="ui violet button url-btn"></div>
      </div>`;
    document.querySelector('body').append(modal);
  };

  const stopSpinner = () => {
    document.getElementById('loader').classList.add('disabled');
    document.getElementById('dimmer').classList.remove('active');
  };

  const mainFunction = async () => {
    const key = '61kzMj4j2v9qbl0uKSVFhu5zDwo78gs7DpmzZim0bhS3VUGAI3';
    const secret = 'SxgikrMVJ7ROxf9KsnrJYmdpstlJZKkzSI9P52uh';

    let token = await getToken(key, secret);
    let response = await getAnimals(token.access_token);

    const animals = response.animals.filter(
      (animal) => animal.photos[0] != undefined
    );

    const males = animals.filter((animal) => animal.gender === 'Male');
    const females = animals.filter((animal) => animal.gender === 'Female');
    const btns = document.querySelectorAll('.ui.buttons > .ui.button');

    setFilterButtonListeners(btns, males, females, animals);
    setFavoritesBtnListener();
    makeAnimalCards(animals);
    createModal();
    setFavoritesList(JSON.parse(localStorage.getItem('favs')));
    stopSpinner();
  };

  if (!localStorage.getItem('favs')) {
    const favs = [];
    localStorage.setItem('favs', JSON.stringify(favs));
  }
  mainFunction();
})();
