// Import necessary functions and data
import { cart, removeFromCart, cartQuantity, updateCartQuantity, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOption } from "../data/deliveryOption.js";
import '../data/backend-practice.js';

// Initialize the checkout HTML string
let checkOutHtml = '';

// Loop through each item in the cart to build HTML
cart.forEach((cartItem) => {
  let matchingItem;
  const productId = cartItem.id;

  // Find the matching product
  products.forEach((product) => {
    if (productId === product.id) {
      matchingItem = product;
    }
  });

  // Find the selected delivery option
  let deliveryOptionSelected;
  const deliveryOptionId = cartItem.deliveryOptionId;
  deliveryOption.forEach((option) => {
    if (deliveryOptionId === option.id) {
      deliveryOptionSelected = option;
    }
  });

  const today = dayjs();
  const dateStirng = today.add(deliveryOptionSelected.deliverDays, 'days').format('dddd, MMMM D');

  // Build cart item HTML
  checkOutHtml += `
    <div class="cart-item-container js-cart-item-container-${matchingItem.id}">
      <div class="delivery-date">
        Delivery date: ${dateStirng}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingItem.image}">

        <div class="cart-item-details">
          <div class="product-name">${matchingItem.name}</div>
          <div class="product-price">&#8377;${matchingItem.price * cartItem.quantity}</div>
          <div class="product-quantity">
            <span>Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">${cartItem.quantity}</span></span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-update-product-id="${matchingItem.id}">Update</span>
            <input type="number" class="quantity-input js-quantity-input">
            <span class="save-quantity-link link-primary js-save-quantity" data-save-product-id="${matchingItem.id}">save</span>
            <span class="delete-quantity-link link-primary js-delete-product" data-product-id="${matchingItem.id}">Delete</span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          ${deliveryOptionHtml(matchingItem, cartItem)}
        </div>
      </div>
    </div>`;
});

// Inject the generated HTML into the DOM
document.querySelector(".js-order-summary").innerHTML = checkOutHtml;

// Add event listeners for delivery option changes
reattachDeliveryOptionListeners();

// Update cart quantity on top
document.querySelector(".js-return-to-home").innerHTML = `${cartQuantity()} items`;

// Add delete product listeners
document.querySelectorAll(".js-delete-product").forEach((cartItem) => {
  cartItem.addEventListener("click", () => {
    const productId = cartItem.dataset.productId;
    const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
    removeFromCart(productId);
    cartItemContainer.remove();
    document.querySelector(".js-return-to-home").innerHTML = `${cartQuantity()} items`;
    // document.querySelector(".js-payment-summary").innerHTML = generatePaymentSummary();
    document.querySelector(".js-payment-summary").innerHTML = cartQuantity() === 0 ? "" : generatePaymentSummary();


  });
});

// Add update quantity listeners
document.querySelectorAll(".js-update-quantity-link").forEach((product) => {
  product.addEventListener("click", () => {
    const productId = product.dataset.updateProductId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add("is-editing-quantity");
  });
});

// Add save quantity listeners
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
    container.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;

    const matchingItem = products.find(product => product.id === productId);
    const priceElement = container.querySelector(".product-price");
    priceElement.innerHTML = `&#8377;${matchingItem.price * newQuantity}`;

    document.querySelector(".js-return-to-home").innerHTML = `${cartQuantity()} items`;
    // document.querySelector(".js-payment-summary").innerHTML = generatePaymentSummary();
    document.querySelector(".js-payment-summary").innerHTML = cartQuantity() === 0 ? "" : generatePaymentSummary();


  });
});

// Function to generate delivery option HTML
function deliveryOptionHtml(matchingItem, cartItem) {
  let html = '';
  deliveryOption.forEach((option) => {
    const today = dayjs();
    const dateStirng = today.add(option.deliverDays, 'days').format('dddd, MMMM D');
    const priceString = option.price === 0 ? 'FREE' : `&#8377;${option.price}`;
    const isChecked = option.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option">
        <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingItem.id}"
          data-product-id="${matchingItem.id}"
          data-delivery-option-id="${option.id}"
          ${isChecked ? 'checked' : ''}>
        <div>
          <div class="delivery-option-date">${dateStirng}</div>
          <div class="delivery-option-price">${priceString} - Shipping</div>
        </div>
      </div>`;
  });
  return html;
}




function generatePaymentSummary() {
  let totalCost = 0;
  let shippingFee = 0;

  cart.forEach((cartItem) => {
    // Find matching product
    let matchingItem;
    products.forEach((product) => {
      if (product.id === cartItem.id) {
        matchingItem = product;
      }
    });

    if (matchingItem) {
      totalCost += matchingItem.price * cartItem.quantity;
    }

    // Find matching delivery option
    let deliveryOptionSelected;
    deliveryOption.forEach((option) => {
      if (cartItem.deliveryOptionId === option.id) {
        deliveryOptionSelected = option;
      }
    });

    if (deliveryOptionSelected) {
      shippingFee += deliveryOptionSelected.price;
    }
    console.log(deliveryOptionSelected);


  });

  let beforeTaxAmount = totalCost + shippingFee;
  let taxAmount = ((totalCost + shippingFee) * 0.02).toFixed(2);
  let afterTaxAmount = (((totalCost + shippingFee) * 0.02) + (totalCost + shippingFee)).toFixed(2);

  // alert(`Total Cost: $${totalCost}\nShipping Fee: $${shippingFee}`);

  let paymentHtml =
    `<div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (${cartQuantity()}):</div>
          <div class="payment-summary-money">&#8377;${totalCost}</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">${shippingFee === 0 ? 'FREE' : `&#8377;${shippingFee}`}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">&#8377;${beforeTaxAmount}</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (2%):</div>
          <div class="payment-summary-money">&#8377;${taxAmount}</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">&#8377;${afterTaxAmount}</div>
        </div>

        <button class="place-order-button button-primary">
          Place your order
        </button>`;

  return paymentHtml;


}


document.querySelector(".js-payment-summary").innerHTML = cartQuantity() === 0 ? "" : generatePaymentSummary();







// Function to reattach delivery option listeners
function reattachDeliveryOptionListeners() {
  document.querySelectorAll(".delivery-option-input").forEach((input) => {
    input.addEventListener("change", () => {
      const productId = input.dataset.productId;
      const deliveryOptionId = input.dataset.deliveryOptionId;

      updateDeliveryOption(productId, deliveryOptionId);
      // generatePaymentSummary();


      const selectedOption = deliveryOption.find(option => option.id === deliveryOptionId);
      const today = dayjs();
      const deliveryDate = today.add(selectedOption.deliverDays, 'days').format('dddd, MMMM D');

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      const deliveryDateElement = container.querySelector('.delivery-date');
      deliveryDateElement.innerHTML = `Delivery date: ${deliveryDate}`;

      const cartItem = cart.find(item => item.id === productId);
      const matchingItem = products.find(item => item.id === productId);
      const deliveryOptionsContainer = container.querySelector('.delivery-options');

      deliveryOptionsContainer.innerHTML = `
        <div class="delivery-options-title">Choose a delivery option:</div>
        ${deliveryOptionHtml(matchingItem, cartItem)}
      `;

      // Reattach again recursively
      reattachDeliveryOptionListeners();
      // document.querySelector(".js-payment-summary").innerHTML = generatePaymentSummary();
      document.querySelector(".js-payment-summary").innerHTML = cartQuantity() === 0 ? "" : generatePaymentSummary();


    });
  });
}