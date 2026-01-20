let burgerRef = document.getElementById("burger-content");
let pizzaRef = document.getElementById("pizza-content");
let nuddlesRef = document.getElementById("nudles-content");
let salatRef = document.getElementById("extra-content");
let isDelivery = true;
let basketData = [];

function foodData() {
  getFoodCategory(foodDataBase);
}

const categoryRefs = {
  Burger: document.getElementById("burger-content"),
  Pizza: document.getElementById("pizza-content"),
  Nudeln: document.getElementById("nudles-content"),
  Beilagen: document.getElementById("extra-content"),
};

function foodData() {
  renderFoodItems(foodDataBase);
}

function getFoodTemplate(food) {
  let formattedPrice = food.price.toFixed(2).replace(".", ",");
  return `
        <div class="food-card">
            <div class="food-card-inner">
                <h3>${food.name}</h3>
                <p class="description">${food.description}</p>
                <span class="price">${formattedPrice} €</span>
            </div>
            <button class="add-btn" onclick="addToBasket('${food.name}')">Hinzufügen</button>
        </div>
    `;
}

function addToBasket(foodName) {
  const foodItem = getFoodData(foodName);
  basketData.push(foodItem);
  renderBasket();
}

function getFoodData(foodName) {
  for (let index = 0; index < foodDataBase.length; index++) {
    if (foodName == foodDataBase[index].name) {
      return foodDataBase[index];
    }
  }
  return null;
}

function getBasketItemTemplate(item) {
  let formattedPrice = item.price.toFixed(2).replace(".", ",");
  return `
    <div class="basket-content-inner">
        <span>${item.name}</span>
        <span>${formattedPrice} €</span>
    </div>
  `;
}

function renderFoodItems(items) {
  const htmlBuffers = {
    Burger: "",
    Pizza: "",
    Nudeln: "",
    Beilagen: "",
  };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (htmlBuffers[item.category] !== undefined) {
      htmlBuffers[item.category] += getFoodTemplate(item);
    }
  }

  for (let category in htmlBuffers) {
    if (categoryRefs[category]) {
      categoryRefs[category].innerHTML = `
        <h3 class="category-headline">${category}</h3>
        ${htmlBuffers[category]}
      `;
    }
  }
}

function setDelivery(status) {
  isDelivery = status;
  renderBasket();
}

function renderBasket() {
  let basketRef = document.getElementById("basket-wrapper");

  let itemsHtml = "";
  for (let index = 0; index < basketData.length; index++) {
    itemsHtml += getBasketItemTemplate(basketData[index]);
  }
  let basketContent;
  if (basketData.length > 0) {
    basketContent = `
        <div id="basket-items-container" class="basket-items-list">
            ${itemsHtml}
        </div>`;
  } else {
    basketContent = `<p class="empty-msg">Dein Warenkorb ist noch leer.</p>`;
  }
  basketRef.innerHTML = `
        <h2>Warenkorb</h2>
        <div class="basket-toggle-container">
            <button class="toggle-btn ${isDelivery ? "active" : ""}" onclick="setDelivery(true)">
                Lieferung
            </button>
            <button class="toggle-btn ${!isDelivery ? "active" : ""}" onclick="setDelivery(false)">
                Abholung
            </button>
        </div>
        ${basketContent}
    `;
}

renderBasket();
foodData();
