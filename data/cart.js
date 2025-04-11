export const cart = [];

export const addToCart = (productId, productQuantity) => {

    let matchingItem;

    cart.forEach((product) => {
        if (product.id === productId) {
            matchingItem = product;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += parseInt(productQuantity);
    }
    else {
        cart.push(
            {
                id: productId,
                quantity: parseInt(productQuantity),
            }
        )
    }
};


export const cartQuantity = () => {
    let toalCartQuantity = 0;

    cart.forEach((product) => {
        toalCartQuantity += product.quantity;
    });

    return toalCartQuantity;
    
}
