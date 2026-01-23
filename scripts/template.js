/* Referenzen */
let burgerRef = document.getElementById("burger-content");
let pizzaRef = document.getElementById("pizza-content");
let noodlesRef = document.getElementById("noodles-content");
let salatRef = document.getElementById("extra-content");

/* Globale Variablen */
let isDelivery = true;
let basketData = [];

/* Initialisierung */
function init() {
  renderFoodItems(foodDataBase);
  renderBasket();
}

const categoryRefs = {
  Burger: document.getElementById("burger-content"),
  Pizza: document.getElementById("pizza-content"),
  Nudeln: document.getElementById("noodles-content"),
  Beilagen: document.getElementById("extra-content"),
};

/* --- Templates & Rendering --- */

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

/* --- Warenkorb Logik --- */

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

function deleteFromBasket(index) {
  basketData.splice(index, 1);
  renderBasket();
}

function getBasketItemTemplate(item, index) {
  let formattedPrice = item.price.toFixed(2).replace(".", ",");
  return `
    <div class="basket-item">
        <div class="basket-info">
            <span class="basket-amount">1x</span>
            <span class="basket-name">${item.name}</span>
        </div>
        <div class="basket-right">
            <span class="basket-price">${formattedPrice} €</span>
            <img src="./assets/icons/delete.png" alt="Löschen" class="trash-icon" onclick="deleteFromBasket(${index})">
        </div>
    </div>
  `;
}

function renderBasket() {
  let basketRef = document.getElementById("basket-wrapper");
  let itemsHtml = "";
  let totalSum = 0;

  // 1. Items generieren und Summe berechnen
  for (let index = 0; index < basketData.length; index++) {
    itemsHtml += getBasketItemTemplate(basketData[index], index);
    totalSum += basketData[index].price;
  }

  let formattedTotal = totalSum.toFixed(2).replace(".", ",");

  // 2. Inhalt zusammenbauen
  let basketContent;
  if (basketData.length === 0) {
    basketRef.classList.add("mobile-hidden");
  } else {
    basketRef.classList.remove("mobile-hidden");
  }

  if (basketData.length > 0) {
    basketContent = `
        <div id="basket-items-container" class="basket-items-list">
            ${itemsHtml}
        </div>
  <div class="basket-total-row">
     <span>Gesamtsumme:</span>
     <strong>${formattedTotal} €</strong>
</div>
<button onclick="submitOrder()" class="order-button">
    Bestellen (${formattedTotal} €)
</button>
    `;
  } else {
    basketContent = `
        <div class="empty-basket">
            <p class="empty-msg">Dein Warenkorb ist noch leer.</p>
            <img src="./assets/icons/shopping_cart.png" alt="Leer">
        </div>`;
  }

  // 3. Alles in den Wrapper schreiben
  basketRef.innerHTML = `
        <h2 onclick="toggleMobileBasket()">Warenkorb</h2>
        <div class="basket-toggle-container">
            <button class="toggle-btn ${isDelivery ? "active" : ""}" onclick="setDelivery(true)">
                Lieferung<br><span class="basket-toggle-deliverinfo">20-25 min.</span> 
            </button>
            <button class="toggle-btn ${!isDelivery ? "active" : ""}" onclick="setDelivery(false)">
                Abholung<br><span class="basket-toggle-deliverinfo">15 min.</span>  
            </button>
        </div>
        ${basketContent}
    `;
}

function setDelivery(status) {
  isDelivery = status;
  renderBasket();
}

/* --- Dialog Logik --- */

function openOrderDialog(totalAmount) {
  let dialogRef = document.getElementById("dialog");
  let formattedTotal = totalAmount.toFixed(2).replace(".", ",");

  dialogRef.innerHTML = `
    <div class="dialog-overlay" onclick="closeDialog()">
      <div class="dialog-content" onclick="event.stopPropagation()">
        
        <h2>Bestellung abschließen</h2>
        <p>Möchtest du die Bestellung für <b>${formattedTotal} €</b> aufgeben?</p>
        
        <div class="dialog-buttons">
           <button class="confirm-btn" onclick="submitOrder()">Ja, jetzt bestellen</button>
           <button class="close-btn" onclick="closeDialog()">Abbrechen</button>
        </div>

      </div>
    </div>
  `;

  dialogRef.classList.remove("d-none");
}

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
        <img src="./assets/icons/delivercar.png" alt="Lieferwagen Logo">
        <h2>Vielen Dank!</h2>
        <p>Deine Bestellung wurde aufgenommen und befindet sich bald auf dem Weg zu dir!</p>
        <div class="dialog-buttons">
           <button class="confirm-btn" onclick="closeDialog()">Schließen</button>
        </div>
      </div>
    </div>
  `;
  dialogRef.classList.remove("d-none");
}

function toggleMobileBasket() {
  const basket = document.getElementById("basket-wrapper");
  basket.classList.toggle("open");
}

// Starten
init();
