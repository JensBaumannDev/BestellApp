// #region Template Functions (HTML Blueprints)
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
// #endregion

// #region Basket Rendering
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
    renderEmptyBasket(basketRef);
  } else {
    renderFullBasket(
      basketRef,
      itemsHtml,
      formattedSubtotal,
      formattedDelivery,
      formattedTotal,
    );
  }
  updateBasketBadge();
}

// Sub-functions for cleaner renderBasket logic
function renderEmptyBasket(basketRef) {
  basketRef.classList.add("mobile-hidden");
  basketRef.classList.remove("open");
  basketRef.innerHTML = `
        <h2 onclick="toggleMobileBasket()">Warenkorb</h2>
        <div id="basket-content" class="empty-basket">Dein Warenkorb ist leer.</div>
        <img class="basketcontainer-basketlogo" src="./assets/navibuttons/basket.svg" alt="Einkaufswagen Logo">
        `;
}

function renderFullBasket(basketRef, itemsHtml, subtotal, delivery, total) {
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
                <span>${subtotal} €</span>
            </div>
            <div class="basket-total-row">
                <span>Lieferkosten:</span>
                <span>${delivery} €</span>
            </div>
            <div class="basket-total-row total-sum-bold">
                <span>Gesamt:</span>
                <span>${total} €</span>
            </div>
        </div>
        <button class="order-button" onclick="submitOrder()">Bestellen</button>
    `;
}
// #endregion

// #region Order Process & Dialogs
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
// #endregion

init();
