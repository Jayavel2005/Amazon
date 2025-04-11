export let cart = JSON.parse(localStorage.getItem("cart")) || [
    {
        id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
    },
    {
        id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 2,
    }
];
;

// if(!cart){
//     cart = [
//         {
//             id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
//             quantity: 1,
//         },
//         {
//             id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
//             quantity: 2,
//         }
//     ];
    
// }


[
    {
        id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
    },
    {
        id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 2,
    }
];

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
    saveToStorage();
};


export const cartQuantity = () => {
    let toalCartQuantity = 0;

    cart.forEach((product) => {
        toalCartQuantity += product.quantity;
    });

    return toalCartQuantity;

}

export const removeFromCart = (productId) => {
    cart = cart.filter(product => product.id !== productId);
    saveToStorage();

}



const saveToStorage = () => {
    localStorage.setItem("cart",JSON.stringify(cart));
}

export const updateCartQuantity = (productId, newQuantity) =>{
    let matchingItem;
    cart.forEach((item)=>{
        if(item.id === productId){
            matchingItem = item;
        }
    })

    matchingItem.quantity = newQuantity;
    saveToStorage();
}