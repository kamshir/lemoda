const headerCityButton = document.querySelector('.header__city-button');

headerCityButton.textContent = localStorage.getItem('lemoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', e => {
  const city = prompt('Укажите город');
  headerCityButton.textContent = city;
  localStorage.setItem('lemoda-location', city)
});

// Блокировка скролла

const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  
  document.body.dbScrollY = window.scrollY;

  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding-right: ${widthScroll}px;
  `;
}

// Разблокировка скролла

const enableScroll = () => {
  document.body.style.cssText = '';
  window.scroll({
    top: document.body.dbScrollY
  })
}

// Modal Window

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

// ОТкрываем модальное окно
const cartModalOpen = () => {
  cartOverlay.classList.add('cart-overlay-open');
  disableScroll()
}

// Закрываем модальное окно
const cartModalClose = () => {
  cartOverlay.classList.remove('cart-overlay-open');
  enableScroll()
}

subheaderCart.addEventListener('click', cartModalOpen);

// Перекрытие модального окна
cartOverlay.addEventListener('click', e => {
  const target = e.target;
  if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')){
    cartModalClose()
  }
})

// Закрытие при нажатии Escape
document.addEventListener('keydown', e => {
  const key = e.key;
  if (key === "Escape" && cartOverlay.classList.contains('cart-overlay-open')){
    cartModalClose()
  }
})