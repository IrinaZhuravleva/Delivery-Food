// Переменные
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");

const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const cart = [];
const modalBody = document.querySelector(".modal-body");
const buttonClearCart = document.querySelector(".clear-cart");

const modaPrice = document.querySelector(".modal-pricetag");

let login = localStorage.getItem('delivery');

// Функции

function addToCart(e) {
  const target = e.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if(buttonAddToCart) {
    const card = buttonAddToCart.closest('.card');
    const title = card.querySelector('.card-title.card-title-reg').textContent;
    const price = card.querySelector('.card-price-bold').textContent;
    const id = card.id;

    //ВАЖНО!!!
    const food = cart.find(function(item){
      return item.id === id;
    })
    if(food){
      food.count +=1;
    } else {
      cart.push({
        id,
        title,
        price,
        // id: id,
        // title: title,
        // price: price,
        count: 1
      })
    }
     //ВАЖНО!!! ======= конец
    console.log(food);
    console.log(cart);
  }
}

const getData = async function(url) {
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url},статус ошибки ${response.status}`);
  }
   return await response.json();
};

const valid = function(str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
}
valid();
function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth () {
  loginInput.style.borderColor = '';
  modalAuth.classList.toggle("is-open");
}

function maskInput(string) {
  return !!string.trim();
}

function notAuthorized() {
  console.log("Не авторизован");

  function logIn(e){
    e.preventDefault();
    if (maskInput(loginInput.value)){
      
      login = loginInput.value;
      
      localStorage.setItem('delivery', login);

      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = 'red';
    }
  }
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('delivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    returnMain();
  }
  
  console.log("Авторизован");
  buttonAuth.style.display = 'none';
  userName.textContent = login;
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
}

function checkAuth(){
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurants(restaurant) {

  //деструктуризация
  const { image, 
      kitchen, 
      name, 
      price, 
      stars, 
      products, 
      time_of_delivery: timeOfDelivery
      } = restaurant;

  const card = `<a class="card card-restaurant" data-products="${products}">
                  <img src="${image}" alt="image" class="card-image" />
                  <div class="card-text">
                    <div class="card-heading">
                      <h3 class="card-title">${name}</h3>
                      <span class="card-tag tag">${timeOfDelivery} мин</span>
                    </div>
                    <div class="card-info">
                      <div class="rating">
                        ${stars}
                      </div>
                      <div class="price">От ${price} ₽</div>
                      <div class="category">${kitchen}</div>
                    </div>
                  </div>
                </a>`;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card);
}

function openGoods(e){
  const target = e.target;
  const restaurant = target.closest('.card-restaurant');
    if (login) {
      if (restaurant) {
        // console.log(restaurant.dataset);
        cardsMenu.textContent = '';
        restaurants.classList.add('hide');
        containerPromo.classList.add('hide');
        menu.classList.remove('hide');

        getData(`./db/${restaurant.dataset.products}`).then(function (data) {
          // console.log(data);
          data.forEach(createCardGood);
        });
       
    } else {
      toggleModalAuth(); //???
    }
  }
}

function createCardGood(goods) {

  const { description, id, image, name, price } = goods;

  const card = document.createElement('div');
  // console.log(card);
  card.className = 'card';
  card.id = id;
  card.insertAdjacentHTML('beforeend', `<img src="${image}" alt="image" class="card-image"  data-products="products"/>  
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
              <div class="ingredients">${description}</div>
            </div>
            <div class="card-buttons">
              <button class="button button-primary button-add-cart">
                <span class="button-card-text">В корзину</span>
                <span class="button-cart-svg"></span>
              </button>
              <strong class="card-price-bold">${price} ₽</strong>
            </div>
            `);
  cardsMenu.prepend(card);
}

function returnMain() {
  restaurants.classList.remove('hide');
  containerPromo.classList.remove('hide');
  menu.classList.add('hide');
}

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function({ id, title, price, count }){
    const itemCart = `
        <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${price}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id="${id}">-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id="${id}">+</button>
					</div>
				</div>`;
    modalBody.insertAdjacentHTML('beforeend', itemCart);
  })
  //ВАЖНО!!!
  const totalPrice = cart.reduce(function(result, item){
    return result + (parseFloat(item.price) * item.count);
  }, 0)
  modaPrice.textContent = `${totalPrice} ₽`;
   //ВАЖНО!!! ==== конец
}

function changeCount(e) {
  const target = e.target;

  if(target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    })
    if (target.classList.contains('counter-minus')) {
      
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }

    if (target.classList.contains('counter-plus')) food.count++;
    
    renderCart();
  }
}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurants);
  });
  modalBody.addEventListener("click", changeCount);
  buttonClearCart.addEventListener("click", function(){
    cart.length = 0;
    renderCart();
  });

  cardsMenu.addEventListener("click", addToCart);
  cartButton.addEventListener("click", function(){
    renderCart();
    toggleModal();
  });
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', returnMain);
  checkAuth();

  new Swiper('.swiper-container', {
    loop: true,
    sliderPerView: 1,
    // autoplay: true
  })
}

init();
