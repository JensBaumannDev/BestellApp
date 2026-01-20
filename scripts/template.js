let burgerRef = document.getElementById("burger-content");
let pizzaRef = document.getElementById("pizza-content");
let nuddlesRef = document.getElementById("nudles-content");
let salatRef = document.getElementById("extra-content");

function foodData() {
  getFoodCategory(foodDataBase);
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
        <button class="add-btn">Hinzufügen</button>
    </div>
  `;
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

foodData();

foodData();
