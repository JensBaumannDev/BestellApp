let contentRef = document.getElementById("content");

function foodData() {
  contentRef.innerHTML = "";
  for (let i = 0; i < foodDataBase.length; i++) {
    contentRef.innerHTML += getFoodTemplate(foodDataBase[i]);
  }
}

function getFoodTemplate(food) {
  let formattedPrice = food.price.toFixed(2).replace(".", ",");
  return `
    <div class="food-card">
        <h3>${food.name}</h3>
        <p class="description">${food.description}</p>
        <span class="price">${formattedPrice} €</span>
        <button class="add-btn">+</button>
    </div>
  `;
}

foodData();
