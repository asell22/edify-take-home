export const createModal = () => {
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

export const handleShow = (animal) => {
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
  document.querySelector('.modal-desc').innerHTML = getAnimalAttributesTemplate(
    animal
  );
  $('#modal').modal('show');
  console.log(animal);
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
