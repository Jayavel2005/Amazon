import { cart, removeFromCart, cartQuantity, updateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";

let checkOutHtml = '';

cart.forEach((cartItem) => {
  let matchingItem;

  products.forEach((product) => {
    if (cartItem.id === product.id) {
      matchingItem = product;
    }
  });

  checkOutHtml += `<div class="cart-item-container js-cart-item-container-${matchingItem.id}">
    <div class="delivery-date">
      Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingItem.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingItem.name}
        </div>
        <div class="product-price">
          &#8377;${matchingItem.price * cartItem.quantity}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary js-update-quantity-link" data-update-product-id="${matchingItem.id}">
            Update
          </span>
          <input type="number" class="quantity-input js-quantity-input">
          <span class="save-quantity-link link-primary js-save-quantity" data-save-product-id="${matchingItem.id}">save</span>
          <span class="delete-quantity-link link-primary js-delete-product" data-product-id="${matchingItem.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        <div class="delivery-option">
          <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-1-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">
              Tuesday, June 21
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-1-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">
              Wednesday, June 15
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-1-${matchingItem.id}">
          <div>
            <div class="delivery-option-date">
              Monday, June 13
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
});

document.querySelector(".js-order-summary").innerHTML = checkOutHtml;
console.log(cartQuantity());

document.querySelectorAll(".js-delete-product").forEach((cartItem) => {
  cartItem.addEventListener("click", () => {
    let productId = cartItem.dataset.productId;
    const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
    removeFromCart(productId);
    cartItemContainer.remove();
    document.querySelector(".js-return-to-home").innerHTML = `${cartQuantity()} items`;
  });
});

document.querySelector(".js-return-to-home").innerHTML = `${cartQuantity()} items`;

document.querySelectorAll(".js-update-quantity-link").forEach((product) => {
  product.addEventListener("click", () => {
    const productId = product.dataset.updateProductId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add("is-editing-quantity");
  });
});

document.querySelectorAll(".js-save-quantity").forEach((saveLink) => {
  saveLink.addEventListener("click", () => {
    const productId = saveLink.dataset.saveProductId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.remove("is-editing-quantity");

    const newQuantity = container.querySelector(".js-quantity-input").value;

    updateCartQuantity(productId, Number(newQuantity));

    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    quantityLabel.innerHTML = newQuantity;

    document.querySelector(".js-return-to-home").innerHTML = `${cartQuantity()} items`;
  });
});
