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
    window.localStorage.setItem("tab", JSON.stringify(tab));
    cart = JSON.parse(localStorage.getItem("tab"));
    displayCart.innerHTML = '<h2 style= "display: flex;justify-content: center;border-radius: 10px;padding: 20px;background: white;color: rgb(51, 152, 219);font-weight: bold; padding-left: 10px; width: 53%;margin: 90px auto;">Panier vide ! Allez vite choisir un Kanap! 😉</h2>';
}

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
    let timOut = false;
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
            let newItems = {
            _id : e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id'),
            color : e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color'),
            quantity : Number(e.target.value)
            }
            // if(cart.quantity === 0){deleteProducts()}
            newCart.push(newItems);
            cart = cart.map(t =>{
                if (t._id === newItems._id && t.color === newItems.color && newItems.quantity <= 100) {
                    t.quantity = newItems.quantity;
                }
            return t
            });
            if(newItems.quantity == 0){
                if(confirm('Voulez vous supprimer le produit?')){
                    cart = cart.filter(cc => {
                        if(cc.quantity == 0){
                        return false
                        }else return true
                    })
                }else{timOut = true}
            }
            if (timOut){setTimeout(refresh, 3000)}else{setTimeout(refresh, 1000)}
            window.localStorage.setItem("tab", JSON.stringify(cart));
        })
    }
    for (const deleteProduct of deleteProducts) {
        deleteProduct.addEventListener('click', (e) => {
            let deleteMySofa = e.path[4].dataset;
            cart = cart.filter(cc => {
                if(cc._id === deleteMySofa.id && cc.color === deleteMySofa.color){
                    return false
                }else return true
                })
            window.location.reload()
            window.localStorage.setItem("tab", JSON.stringify(cart));
        })
    }
    
}

let a1 = false;
let a2 = false;
let a3 = false;
let a4 = false;
let a5 = false;
let sendForm = false;
var formOk = '<div style="font-weight: 600; color: #3aff3a">Valide ✅</div>';
var formNok = '<div style="font-weight: 600; color: red">'
for (const getAllForms of getForms) {
    getAllForms.addEventListener('input', (e) => {
        
        let firstName   = getAllForms[0].value;
        let firstNameRegEx = new RegExp(/^[A-Z][A-Za-z\é\è\ê\-]+$/g);
        let testFirstName = firstNameRegEx.test(firstName);
        
        if (!testFirstName) {
            e.preventDefault();
            errorFirstName.innerHTML = formNok + 'Prénom Incorrect (exemple: Jean-Edouard)</div>';
            console.log(testFirstName)
        }else{
            errorFirstName.innerHTML = formOk;
            a1 = true;
        }        
        
        let lastName   = getAllForms[1].value;
        let lastNameRegEx = new RegExp(/^[A-Z][A-Za-z\é\è\ê\-]+$/g);
        let testLastName = lastNameRegEx.test(lastName);
        if (!testLastName) {
            e.preventDefault();
            errorLastName.innerHTML = formNok + 'Nom Incorrect (exemple: Dupont)</div>';
            
        }else{
            errorLastName.innerHTML = formOk;
            a2 = true;
        }
        
        let adress   = getAllForms[2].value;
        let adressRegEx = new RegExp(/^([1-9][0-9]*(?:-[1-9][0-9]*)*)[\s,-]+(?:(bis|ter|qua)[\s,-]+)?([\w]+[\-\w]*)[\s,]+([-\w].+)$/g);
        let testAdress = adressRegEx.test(adress);
        if (!testAdress) {
            e.preventDefault();
            errorAdress.innerHTML = formNok + 'Adresse Incorrect (exemple: 1 rue Jean Jaures)</div>';
        }else{
            errorAdress.innerHTML = formOk;
            a3 = true;
        }
        
        let city      = getAllForms[3].value;
        let cityRegEx = new RegExp(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]{3,15}$/g);
        let testCity = cityRegEx.test(city);
        if (!testCity) {
            e.preventDefault();
            errorCity.innerHTML = formNok + 'Ville Incorrect (exemple: Argeles-sur-Mer)</div>';
        }else{
            errorCity.innerHTML = formOk;
            a4 = true;
        }

        var email      = getAllForms[4].value;
        let emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
        let testEmail = emailRegEx.test(email);
        if (!testEmail) {
            e.preventDefault();
            errorEmail.innerHTML = formNok + 'Email Incorrect (exemple: je.dupont@gmail.com)</div>'
        }else{
            errorEmail.innerHTML = formOk;
            a5 = true;
        }
        
        if (a1 && a2 && a3 && a4 && a5) {
            sendForm = true
        }
    })
    
    getAllForms.addEventListener('submit', (e) => {
        e.preventDefault()
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
            window.location = 'confirmation.html' + '?orderId=' + data.orderId;
        })
        }else {alert('Panier vide ou verifiez que tout les champs du formulaire sois valide')}
        
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