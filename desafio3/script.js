const productsContainer = document.getElementById("products-container");
const cartCount = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const closeCart = document.getElementById("close-cart");
const cartBtn = document.querySelector(".cart-btn");

let cart = [];

fetch("produtos.json")
.then(response => response.json())
.then(products => {

  products.forEach(product => {

    const card = document.createElement("div");

    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.foto}" alt="${product.nome}">

      <div class="product-info">

        <h2>${product.nome}</h2>

        <p class="price">R$ ${product.preco}</p>

        <p class="category">${product.categoria}</p>

        <p class="stock">Estoque: ${product.estoque}</p>

        <button onclick='addToCart(${JSON.stringify(product)})'>
          Adicionar ao Carrinho
        </button>

      </div>
    `;

    productsContainer.appendChild(card);

  });

});

function addToCart(product){

  cart.push(product);

  updateCart();

}

function updateCart(){

  cartCount.innerText = cart.length;

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {

    total += item.preco;

    cartItems.innerHTML += `
      <div class="cart-item">
        <h4>${item.nome}</h4>
        <p>R$ ${item.preco}</p>
      </div>
    `;

  });

  cartTotal.innerText = `Total: R$ ${total.toFixed(2)}`;

}

cartBtn.addEventListener("click", () => {
  cartModal.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartModal.classList.remove("active");
});