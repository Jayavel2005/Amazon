import { cart, addToCart, cartQuantity } from "../data/cart.js";
import { products, loadProducts } from "../data/products.js";

loadProducts(renderProductPage);

function renderProductPage() {



  let productHtml = ''

  products.forEach((product) => {
    productHtml += `
         <div class="product-container js-product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            &#8377;${product.priceCents}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}" data-product-name="${product.name}">
            Add to Cart
          </button>
        </div>
    `;
  });


  const mainProductContainer = document.querySelector(".js-product-grid").innerHTML = productHtml;


  document.querySelectorAll(".js-product-container").forEach((product) => {

    const addCartButton = product.querySelector(".js-add-to-cart");
    const quantitySelector = product.querySelector(".js-quantity-selector");
    const addedToCartMessage = product.querySelector(".js-added-to-cart");

    addCartButton.addEventListener("click", () => {

      const productId = addCartButton.dataset.productId;

      addToCart(productId, quantitySelector.value);

      if (addedToCartMessage._timeoutId) {
        clearTimeout(addedToCartMessage._timeoutId);
      }
      addedToCartMessage.classList.add("added-to-cart-display");

      addedToCartMessage._timeoutId = setTimeout(() => {
        addedToCartMessage.classList.remove("added-to-cart-display");
      }, 3000);


      document.querySelector(".js-cart-quantity").innerHTML = cartQuantity();




    });
  });

  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity();





}