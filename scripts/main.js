
const headerCityButton = document.querySelector('.header__city-button');
const goodsTitle = document.querySelector('.goods__title');

let hash = location.hash.substring(1);

headerCityButton.textContent = localStorage.getItem('lemoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', e => {
  const city = prompt('Укажите город');
  if (city) {
    headerCityButton.textContent = city;
    localStorage.setItem('lemoda-location', city)
  }
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

// Запрос базы данных

const getData = async () => {
  const data = await fetch("db.json");

  if (data.ok) {
    return data.json()
  } else {
    throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`)
  }
}

const changeTitle = () => {
    hash = location.hash.substring(1);
    switch(hash){
      case 'men':
        goodsTitle.textContent = 'Мужчинам';
        break;
      case 'women':
        goodsTitle.textContent = 'Женщинам';
        break;
      case 'kids':
        goodsTitle.textContent = 'Детям';
        break;
      default:
        return true;
        break;
    }
  }

const getGoods = (callback, value) => {
  getData()
    .then(data => {
      if (value) {
        changeTitle()
        callback(data.filter(item => item.category === value)); 
      } else {
        callback(data);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

try {
  const goodsList = document.querySelector('.goods__list');

  if (!goodsList) {
    throw "This is not a goods page";
  }

  const createCard = ({ id, preview, cost, brand, name, sizes }) => {

    const li = document.createElement('li');
    li.classList.add('goods__item');
    li.innerHTML = `
      <article class="good">
          <a class="good__link-img" href="card-good.html#${id}">
              <img class="good__img" src="goods-image/${preview}" alt="${name}">
          </a>
          <div class="good__description">
              <p class="good__price">${cost} ₽</p>
              <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
              ${sizes ?
                `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
                ""}
              <a class="good__link" href="card-good.html#id56454">Подробнее</a>
          </div>
      </article>
    `;
    return li;
  };

  const renderGoodsList = data => {
    goodsList.textContent = '';

    data.forEach(item => {
      const card = createCard(item);
      goodsList.append(card);
    });
  };

  window.addEventListener('hashchange', () => {
    getGoods(renderGoodsList, hash);
  })

  getGoods(renderGoodsList, hash);

} catch (err) {
  console.warn(err);
}

// Закрытие при нажатии Escape
document.addEventListener('keydown', e => {
  const key = e.key;
  if (key === "Escape" && cartOverlay.classList.contains('cart-overlay-open')){
    cartModalClose()
  }
})