//#region Globals & Init
let isDelivery = true;
let basketData = [];

const categoryRefs = {
  Burger: document.getElementById("burger-content"),
  Pizza: document.getElementById("pizza-content"),
  Nudeln: document.getElementById("noodles-content"),
  Beilagen: document.getElementById("extra-content"),
};

function init() {
  renderFoodItems(foodDataBase);
  renderBasket();
}
//#endregion

//#region Templates & Rendering
function getFoodTemplate(food) {
  let formattedPrice = food.price.toFixed(2).replace(".", ",");
  return `
      <div class="food-card">
          <img src="${food.imgSrc}" alt="${food.name}" class="food-img">
          <div class="food-card-inner">
              <h3>${food.name}</h3>
              <p class="description">${food.description}</p>
              <span class="price">${formattedPrice} €</span>
          </div>
          <button class="add-btn" onclick="addToBasket('${food.name}')">Hinzufügen</button>
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
      categoryRefs[category].innerHTML = htmlBuffers[category];
    }
  }
}

function getBasketItemTemplate(item, index) {
  let itemTotal = item.price * item.amount;
  let formattedPrice = itemTotal.toFixed(2).replace(".", ",");
  return `
        <div class="basket-item">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${formattedPrice} €</span>
            </div>
            <div class="item-controls">
                <div class="quantity-picker">
                    <button class="ctrl-btn" onclick="changeAmount(${index}, -1)">-</button>
                    <span class="qty-display">${item.amount}</span>
                    <button class="ctrl-btn" onclick="changeAmount(${index}, 1)">+</button>
                </div>
                <img src="assets/icons/delete.png" alt="Löschen" class="trash-icon" onclick="deleteFromBasket(${index})">
            </div>
        </div>
    `;
}
//#endregion

//#region Basket Logic
function setDelivery(status) {
  isDelivery = status;
  renderBasket();
}

function getFoodData(foodName) {
  return foodDataBase.find((item) => item.name === foodName);
}

function addToBasket(foodName) {
  const foodItem = getFoodData(foodName);
  if (foodItem) {
    const existingItem = basketData.find((item) => item.name === foodName);
    if (existingItem) {
      existingItem.amount++;
    } else {
      basketData.push({ ...foodItem, amount: 1 });
    }
    renderBasket();
  }
}

function changeAmount(index, delta) {
  basketData[index].amount += delta;
  if (basketData[index].amount <= 0) {
    basketData.splice(index, 1);
  }
  renderBasket();
}

function deleteFromBasket(index) {
  basketData.splice(index, 1);
  renderBasket();
}

function renderBasket() {
  let basketRef = document.getElementById("basket-wrapper");
  if (!basketRef) return;

  let itemsHtml = "";
  let subtotal = 0;
  let deliveryCosts = isDelivery ? 5.0 : 0.0;

  for (let index = 0; index < basketData.length; index++) {
    itemsHtml += getBasketItemTemplate(basketData[index], index);
    subtotal += basketData[index].price * basketData[index].amount;
  }

  let totalSum = subtotal + deliveryCosts;
  let formattedSubtotal = subtotal.toFixed(2).replace(".", ",");
  let formattedDelivery = deliveryCosts.toFixed(2).replace(".", ",");
  let formattedTotal = totalSum.toFixed(2).replace(".", ",");

  if (basketData.length === 0) {
    basketRef.classList.add("mobile-hidden");
    basketRef.classList.remove("open");
    basketRef.innerHTML = `
        <h2 onclick="toggleMobileBasket()">Warenkorb</h2>
        <div id="basket-content" class="empty-basket">Dein Warenkorb ist leer.</div>
        <img class="basketcontainer-basketlogo" src="./assets/navibuttons/basket.svg" alt="Einkaufswagen Logo">
        `;
  } else {
    basketRef.classList.remove("mobile-hidden");
    basketRef.innerHTML = `
        <h2 onclick="toggleMobileBasket()">Warenkorb</h2>
        <div class="basket-toggle-container">
            <button class="toggle-btn ${isDelivery ? "active" : ""}" onclick="setDelivery(true)">Lieferung</button>
            <button class="toggle-btn ${!isDelivery ? "active" : ""}" onclick="setDelivery(false)">Abholung</button>
        </div>
        <div id="basket-content">${itemsHtml}</div>
        <div class="basket-subtotal-container">
            <div class="basket-total-row">
                <span>Zwischensumme:</span>
                <span>${formattedSubtotal} €</span>
            </div>
            <div class="basket-total-row">
                <span>Lieferkosten:</span>
                <span>${formattedDelivery} €</span>
            </div>
            <div class="basket-total-row total-sum-bold">
                <span>Gesamt:</span>
                <span>${formattedTotal} €</span>
            </div>
        </div>
        <button class="order-button" onclick="submitOrder()">Bestellen</button>
    `;
  }
  updateBasketBadge();
}
//#endregion

//#region Navigation UI
function updateBasketBadge() {
  let badge = document.getElementById("basket-badge");
  if (badge) {
    let totalItems = basketData.reduce((sum, item) => sum + item.amount, 0);
    if (totalItems > 0) {
      badge.classList.remove("d-none");
      badge.innerHTML = totalItems;
    } else {
      badge.classList.add("d-none");
    }
  }
}

function toggleMobileBasket() {
  let basketRef = document.getElementById("basket-wrapper");
  if (basketData.length > 0) {
    basketRef.classList.toggle("open");
  }
}
//#endregion

//#region Order & Dialog Logic
function closeDialog() {
  document.getElementById("dialog").classList.add("d-none");
}

function submitOrder() {
  basketData = [];
  renderBasket();

  if (window.innerWidth <= 1000) {
    document.getElementById("basket-wrapper").classList.remove("open");
  }

  let dialogRef = document.getElementById("dialog");
  dialogRef.innerHTML = `
    <div class="dialog-overlay" onclick="closeDialog()">
      <div class="dialog-content" onclick="event.stopPropagation()">
        <img src="./assets/icons/delivercar.svg" alt="Lieferwagen Logo">
        <h2>Vielen Dank!</h2>
        <p>Deine Bestellung wurde aufgenommen!</p>
        <div class="dialog-buttons">
           <button class="confirm-btn" onclick="closeDialog()">Schließen</button>
        </div>
      </div>
    </div>
  `;
  dialogRef.classList.remove("d-none");
}
//#endregion

init();
