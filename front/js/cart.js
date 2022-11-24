const url          = ('http://localhost:3000');
const displayCart  = document.getElementById('cart__items');
let cart           = JSON.parse(localStorage.getItem("tab"));
let totalQuantity  = document.getElementById('totalQuantity');
let totalPriceCart = document.getElementById('totalPrice');

let totalArticle = () => {

    let total = 0

    cart.forEach(a => {
        total += a.quantity
    });

    totalQuantity.innerHTML = total;
}

const getSofa = async () => {
        await fetch(url + '/api/products/')
        .then((res) => res.json())
        .then((sofaData) => displaySofa(sofaData))
        .catch((err) => console.log(err.stack));
};
getSofa()

const displaySofa = (sofaData) => {
    let mySofa = new Map();
    let i = 0
    cart.forEach(article=>{ 
        let articleFund = sofaData.find(a => a._id === article.id);
        mySofa.set(i++,{
            id : article.id,
            sofaName: article.name,
            color : article.color,
            quantity : article.quantity,
            price : articleFund.price,
            image : articleFund.imageUrl,
            alt : articleFund.altTxt,
            totalPrice: article.quantity * articleFund.price,
        })
        return mySofa
    })
    console.log(mySofa)
    mySofa.forEach(s =>{    
        displayCart.innerHTML += `<article class="cart__item" data-id="${s.id}" data-color="${s.color}">
        <div class="cart__item__img"><img src="${s.image}" alt="${s.alt}"></div>
        <div class="cart__item__content"><div class="cart__item__content__description"><h2>${s.sofaName}</h2><p>${s.color}</p>
        <p>${s.price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté :</p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${s.quantity}">
        </div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`
    });
    let totalSofaCartPrice = 0

    mySofa.forEach(tp =>{
        totalSofaCartPrice += tp.totalPrice
    });

    totalPriceCart.innerHTML = totalSofaCartPrice;
    totalArticle();
    
    let getQuantities    = document.querySelectorAll('.itemQuantity');
    
    for (const getQuantity of getQuantities) {
        getQuantity.addEventListener('input',(e) =>{
            var quantityUpdate = e.target.value;
            const quantityUpdateId = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
            const quantityUpdateColor = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color');
            mySofa.map
            // mySofa.find(i => {i.id === getQuantities.dataset.id});
            // mySofa.set(quantity, {quantityUpdate})
            console.log(mySofa);
        })
    }
    // console.log(quantityUpdate);
}

    
console.log(document.forms);

