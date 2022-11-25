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
        const articleFund = sofaData.find(a => a._id === article.id);
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
    let newCart = [];
    for (const getQuantity of getQuantities) {
        getQuantity.addEventListener('input',(e) =>{
            let newItems = {
            id : e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id'),
            color : e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color'),
            quantity : Number(e.target.value)
            }
            newCart.push(newItems)
            let isNew = true
            cart = cart.map(t =>{
                if (t.id === newItems.id && t.color === newItems.color && newItems.quantity!= 0) {
                    t.quantity = newItems.quantity;
                    isNew = false
                }
                if (isNew || cart.quantity == 0) {
                    cart.filter(c => {
                        c.quantity == 0
                        return true
                    })
                }
                return t
            });
            
            window.location.reload()
            window.localStorage.setItem("tab", JSON.stringify(cart));

                // let cartUpdate = cart.find(a => {
                //     a._id === v.id;
                //     a.color === v.color;
                // });
                // if (condition) {
                    
                // }
            
            // console.log(cart)
            // let result = cart.filter(val => {
            //     val.id = quantityUpdateId;
            //     val.color = quantityUpdateColor;
            //     console.log(val.id, quantityUpdateId);
            //     return
            // }).map(q => )
            
        })
    }
    // console.log(quantityUpdate);
}

    
console.log(document.forms);

