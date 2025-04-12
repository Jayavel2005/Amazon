import { cart, removeFromCart, cartQuantity, updateCartQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../data/deliveryOption.js";

let checkOutHtml = '';

const today = dayjs();
const deliveryDate = today.subtract(7, 'day');
console.log(deliveryDate.format('MMMM, dddd D'));

cart.forEach((cartItem) => {
  let matchingItem;

  products.forEach((product) => {
    if (cartItem.id === product.id) {
      matchingItem = product;
    }
  });

  checkOutHtml += `
    <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
      <div class="delivery-date js-delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingItem.image}">

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
          ${generateDeliveryOptionHTML(matchingItem)}
        </div>
      </div>
    </div>`;
});

document.querySelector(".js-order-summary").innerHTML = checkOutHtml;

// ✅ Delivery Option Generator — FIXED
function generateDeliveryOptionHTML(matchingItem) {
  let html = '';

  deliveryOptions.forEach((product, index) => {
    const today = dayjs();
    const deliverdate = today.add(product.deliverdays, 'days');
    const dateString = deliverdate.format('dddd, MMMM D');
    const priceString = product.id === '1' ? 'FREE' : `&#8377;${product.price}`;

    html += `
      <div class="delivery-option">
        <input 
          type="radio"
          class="delivery-option-input"
          name="delivery-option-1-${matchingItem.id}"
          ${index === 0 ? 'checked' : ''}>
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>`;
  });

  return html;
}

// ✅ Delete product from cart
document.querySelectorAll(".js-delete-product").forEach((cartItem) => {
  cartItem.addEventListener("click", () => {
    const productId = cartItem.dataset.productId;
    const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
    removeFromCart(productId);
    cartItemContainer.remove();
    document.querySelector(".js-return-to-home").innerHTML = `${cartQuantity()} items`;
  });
});

// ✅ Display initial cart count
document.querySelector(".js-return-to-home").innerHTML = `${cartQuantity()} items`;

// ✅ Update quantity view toggle
document.querySelectorAll(".js-update-quantity-link").forEach((product) => {
  product.addEventListener("click", () => {
    const productId = product.dataset.updateProductId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add("is-editing-quantity");
  });
});

// ✅ Save quantity and update UI
document.querySelectorAll(".js-save-quantity").forEach((saveLink) => {
  saveLink.addEventListener("click", () => {
    const productId = saveLink.dataset.saveProductId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.remove("is-editing-quantity");

    const newQuantity = container.querySelector(".js-quantity-input").value;
    if (newQuantity <= 0 || newQuantity >= 1000) {
      alert('Quantity must be at least 0 and less than 1000');
      return;
    }

    updateCartQuantity(productId, Number(newQuantity));

    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    quantityLabel.innerHTML = newQuantity;

    const matchingItem = products.find(product => product.id === productId);
    const priceElement = container.querySelector(".product-price");
    priceElement.innerHTML = `&#8377;${matchingItem.price * newQuantity}`;

    document.querySelector(".js-return-to-home").innerHTML = `${cartQuantity()} items`;
  });
});
