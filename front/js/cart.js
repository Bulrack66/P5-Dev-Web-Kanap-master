const url          = ('http://localhost:3000');
const displayCart  = document.getElementById('cart__items');
let cart           = JSON.parse(localStorage.getItem("tab"));
let totalQuantity  = document.getElementById('totalQuantity');
let totalPriceCart = document.getElementById('totalPrice');
const sendConfirm = document.getElementsByClassName('cart__order__form__submit');
const getForms = document.forms;
let refresh = () => window.location.reload()
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
    let timOut = true;
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
    let totalSofaCartPrice = 0;
    mySofa.forEach(tp =>{
        totalSofaCartPrice += tp.totalPrice;
    });
    totalPriceCart.innerHTML = totalSofaCartPrice;
    totalArticle();
    let getQuantities = document.querySelectorAll('.itemQuantity');
    let deleteProducts = document.getElementsByClassName('deleteItem')
    let newCart = [];
    for (const getQuantity of getQuantities) {
        getQuantity.addEventListener('input',(e) => {
            let newItems = {
            id : e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id'),
            color : e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color'),
            quantity : Number(e.target.value)
            }
            // if(cart.quantity === 0){deleteProducts()}
            newCart.push(newItems);
            cart = cart.map(t =>{
                if (t.id === newItems.id && t.color === newItems.color && newItems.quantity <= 100) {
                    t.quantity = newItems.quantity;
                }else {alert('Vous ne pouvez pas choisir plus de 100 produits!')}
            return t
            });
            if(newItems.quantity == 0){
                if(confirm('Voulez vous supprimer le produit?')){
                    cart = cart.filter(cc => {
                        if(cc.quantity == 0){
                        return false
                        }else return true
                    })
                }
            }else{timOut = false}
            if (timOut){setTimeout(refresh, 3000)}else{setTimeout(refresh, 1000)}
            window.localStorage.setItem("tab", JSON.stringify(cart));
        })
    }
    for (const deleteProduct of deleteProducts) {
        deleteProduct.addEventListener('click', (e) => {
            let deleteMySofa = e.path[4].dataset;
            cart = cart.filter(cc => {
                if(cc.id === deleteMySofa.id && cc.color === deleteMySofa.color){
                    return false
                }else return true
                })
            window.location.reload()
            window.localStorage.setItem("tab", JSON.stringify(cart));
            console.log(deleteMySofa.id, deleteMySofa.color);
        })
    }
}
for (const getAllForms of getForms) {
    getAllForms.addEventListener('input', (e) => console.log(e))
}

console.log(getForms)//[0][0]);
for (const sendConfirms of sendConfirm) {
    sendConfirms.addEventListener('click', (e) => {
        window.location = 'confirmation.html'
        console.log(e)
    })
}

