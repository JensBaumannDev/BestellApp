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

function getFoodCategory(food) {
  for (let index = 0; index < foodDataBase.length; index++) {
    if (foodDataBase[index].category == "Burger") {
      burgerRef.innerHTML += getFoodTemplate(foodDataBase[index]);
    } else if (foodDataBase[index].category == "Pizza") {
      pizzaRef.innerHTML += getFoodTemplate(foodDataBase[index]);
    } else if (foodDataBase[index].category == "Nudeln") {
      nuddlesRef.innerHTML += getFoodTemplate(foodDataBase[index]);
    } else if (foodDataBase[index].category == "Beilagen") {
      salatRef.innerHTML += getFoodTemplate(foodDataBase[index]);
    }
  }
}

foodData();
