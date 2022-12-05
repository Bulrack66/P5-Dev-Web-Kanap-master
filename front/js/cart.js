const url          = ('http://localhost:3000');
const displayCart  = document.getElementById('cart__items');
let cart           = JSON.parse(localStorage.getItem("tab"))
let totalQuantity  = document.getElementById('totalQuantity');
let totalPriceCart = document.getElementById('totalPrice');
const sendConfirm = document.getElementsByClassName('cart__order__form__submit');
const getForms = document.forms;
let deleteProducts = document.getElementsByClassName('deleteItem');
let errorFirstName = document.getElementById('firstNameErrorMsg');
let errorLastName = document.getElementById('lastNameErrorMsg');
let errorAdress = document.getElementById('addressErrorMsg');
let errorCity = document.getElementById('cityErrorMsg');
let errorEmail = document.getElementById('emailErrorMsg');

if (cart == null || cart == '') {
    let tab = []
    localStorage.setItem("tab", JSON.stringify(tab));
    cart = JSON.parse(localStorage.getItem("tab"));
    displayCart.innerHTML = '<h2 style= "display: flex;justify-content: center;border-radius: 10px;padding: 20px;background: white;color: rgb(51, 152, 219);font-weight: bold; padding-left: 10px; width: 53%;margin: 90px auto;">Panier vide ! Allez vite choisir un Kanap! 😉</h2>';
}
cart.map(c => {
    if(c.quantity > 100){
        c.quantity = 100
    }
    localStorage.setItem("tab", JSON.stringify(cart));
    return c
});

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
    let mySofa = new Map();
    let i = 0
    cart.forEach(article=>{ 
        const articleFund = sofaData.find(a => a._id === article._id);
        mySofa.set(i++,{
            _id : article._id,
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
        displayCart.innerHTML += `<article class="cart__item" data-id="${s._id}" data-color="${s.color}">
        <div class="cart__item__img"><img src="${s.image}" alt="${s.alt}"></div>
        <div class="cart__item__content"><div class="cart__item__content__description"><h2>${s.sofaName}</h2><p>${s.color}</p>
        <p>${s.price} €</p></div><div class="cart__item__content__settings"><div class="cart__item__content__settings__quantity"><p>Qté :</p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${s.quantity}"><div id="signal"></div>
        </div><div class="cart__item__content__settings__delete"><p class="deleteItem">Supprimer</p></div></div></div></article>`
        console.log(displayCart.closest('article'))
    });
    
    let totalSofaCartPrice = 0;
    mySofa.forEach(tp =>{
        totalSofaCartPrice += tp.totalPrice;
    });
    totalPriceCart.innerHTML = totalSofaCartPrice;
    totalArticle();
    let getQuantities = document.querySelectorAll('.itemQuantity');
   
    let newCart = [];
    for (const getQuantity of getQuantities) {
        getQuantity.addEventListener('input',(e) => {
            if (e.target.value === '') {
                return;
            }
            let newItems = {
            _id : e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id'),
            color : e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color'),
            quantity : Number(e.target.value)
            }
            newCart.push(newItems);
            cart = cart.map(t =>{
                if (t._id === newItems._id && t.color === newItems.color && newItems.quantity <= 100) {
                    t.quantity = newItems.quantity;
                }
            return t
            });
            console.log(e.target.value);
            if( newItems.quantity === 0){
                    cart = cart.filter(cc => {
                        if(cc.quantity == 0){
                        return false
                        }else return true
                    })
            }
            localStorage.setItem("tab", JSON.stringify(cart));
            refresh()
        })
    }
    for (const deleteProduct of deleteProducts) {
        deleteProduct.addEventListener('click', (e) => {
            let deleteMySofaId = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
            let deleteMySofaColor = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color');
            cart = cart.filter(cc => {
                if(cc._id === deleteMySofaId && cc.color === deleteMySofaColor){
                    return false
                }else return true
                })
            localStorage.setItem("tab", JSON.stringify(cart));
            refresh()
        })
    }
    
}

let a1 = false;
let a2 = false;
let a3 = false;
let a4 = false;
let a5 = false;
let sendForm = false;
var formOk = 'Valide ✓';
for (const getAllForms of getForms) {
    getAllForms.addEventListener('input', (e) => {
        
        let firstName   = getAllForms[0].value;
        let firstNameRegEx = new RegExp(/^[a-zA-Z|\s]{2,15}$/g);
        let testFirstName = firstNameRegEx.test(firstName);
        
        if (!testFirstName) {
            e.preventDefault();
            errorFirstName.innerText = 'Prénom Incorrect (exemple: Jean-Edouard)';
            a1 = false;
        }else{
            errorFirstName.innerText = formOk;
            a1 = true;
        }        
        
        let lastName   = getAllForms[1].value;
        let lastNameRegEx = new RegExp(/^[a-zA-Z|\s]{2,15}$/g);
        let testLastName = lastNameRegEx.test(lastName);
        if (!testLastName) {
            e.preventDefault();
            errorLastName.innerText = 'Nom Incorrect (exemple: Dupont)';
            a2 = false;
        }else{
            errorLastName.innerText = formOk;
            a2 = true;
        }
        
        let adress   = getAllForms[2].value;
        let adressRegEx = new RegExp(/^([1-9][0-9]*(?:-[1-9][0-9]*)*)[\s,-]+(?:(bis|ter|qua)[\s,-]+)?([\w]+[\-\w]*)[\s,]+([-\w].+[^#\(\)])$/g);
        let testAdress = adressRegEx.test(adress);
        if (!testAdress) {
            e.preventDefault();
            errorAdress.innerText = 'Adresse Incorrect (exemple: 1 rue Jean Jaures)';
            a3 = false;
        }else{
            errorAdress.innerText = formOk;
            a3 = true;
        }
        
        let city      = getAllForms[3].value;
        let cityRegEx = new RegExp(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]{3,15}$/g);
        let testCity = cityRegEx.test(city);
        if (!testCity) {
            e.preventDefault();
            errorCity.innerText = `Ville Incorrect (exemple: L'Isle-en-Rigault)`;
            a4 = false;
        }else{
            errorCity.innerText = formOk;
            a4 = true;
        }

        var email      = getAllForms[4].value;
        let emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
        let testEmail = emailRegEx.test(email);
        if (!testEmail) {
            e.preventDefault();
            errorEmail.innerText = 'Email Incorrect (exemple: je.dupont@gmail.com)'
            a5 = false;
        }else{
            errorEmail.innerText = formOk;
            a5 = true;
        }
        
    })
    
    getAllForms.addEventListener('submit', (e) => {
        e.preventDefault()
        if (a1 && a2 && a3 && a4 && a5) {
            sendForm = true
        }
        if (sendForm && cart != null && cart != '') {
        const body = buildOrder();
        fetch(url + '/api/products/order', {
            method: "POST",
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
        },
            body : JSON.stringify(body),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            location = 'confirmation.html' + '?orderId=' + data.orderId;
        })
        }else {alert('Panier vide ou verifiez que tout les champs du formulaire soient valide')}
        
    });
}


function buildOrder() {
for (const getAllForms of getForms) {
    
    let body = {
        contact : {
            firstName : getAllForms[0].value , 
            lastName  : getAllForms[1].value ,
            address    : getAllForms[2].value ,
            city      : getAllForms[3].value ,
            email     : getAllForms[4].value ,
        },
        products : cart.map(c => c._id)
    }
    return body
}
}