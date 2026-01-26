// #region Global State & Configuration
let isDelivery = true;
let basketData = [];

const categoryRefs = {
  Burger: document.getElementById("burger-content"),
  Pizza: document.getElementById("pizza-content"),
  Nudeln: document.getElementById("noodles-content"),
  Beilagen: document.getElementById("extra-content"),
};
// #endregion

// #region Lifecycle / Initialization
function init() {
  renderFoodItems(foodDataBase);
  renderBasket();
}
// #endregion

// #region Rendering Functions
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
// #endregion

// #region Basket Logic
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

function setDelivery(status) {
  isDelivery = status;
  renderBasket();
}
// #endregion

// #region UI Helpers & Utility
function getFoodData(foodName) {
  return foodDataBase.find((item) => item.name === foodName);
}

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

function closeDialog() {
  document.getElementById("dialog").classList.add("d-none");
}
// #endregion
