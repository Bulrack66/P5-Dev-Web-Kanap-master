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
    totalQuantity.textContent = total;
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
    mySofa.forEach(sofa => {
        const newSofa = document.createElement("article");
                newSofa.setAttribute("class", "cart__item");
                newSofa.setAttribute("data-id", sofa._id);
                newSofa.setAttribute("data-color", sofa.color);
                newSofa.innerHTML = `
                    <div class="cart__item__img">
                        <img src="${sofa.image}" alt="${sofa.alt}">
                    </div>
                    <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${sofa.sofaName}</h2>
                        <p>${sofa.color}</p>
                        <p>${sofa.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${sofa.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                    </div>`
         displayCart.appendChild(newSofa);
    })
    
    let totalSofaCartPrice = 0;
    mySofa.forEach(tp =>{
        totalSofaCartPrice += tp.totalPrice;
    });
    totalPriceCart.textContent = totalSofaCartPrice;
    totalArticle();
    let getQuantities = document.querySelectorAll('.itemQuantity')
   
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
            errorFirstName.textContent = 'Prénom Incorrect (exemple: Jean-Edouard)';
            a1 = false;
        }else{
            errorFirstName.textContent = formOk;
            a1 = true;
        }        
        
        let lastName   = getAllForms[1].value;
        let lastNameRegEx = new RegExp(/^[a-zA-Z|\s]{2,15}$/g);
        let testLastName = lastNameRegEx.test(lastName);
        if (!testLastName) {
            e.preventDefault();
            errorLastName.textContent = 'Nom Incorrect (exemple: Dupont)';
            a2 = false;
        }else{
            errorLastName.textContent = formOk;
            a2 = true;
        }
        
        let adress   = getAllForms[2].value;
        let adressRegEx = new RegExp(/^([1-9][0-9]*(?:-[1-9][0-9]*)*)[\s,-]+(?:(bis|ter|qua)[\s,-]+)?([\w]+[\-\w]*)[\s,]+([-\w].+[^#\(\)])$/g);
        let testAdress = adressRegEx.test(adress);
        if (!testAdress) {
            e.preventDefault();
            errorAdress.textContent = 'Adresse Incorrect (exemple: 1 rue Jean Jaures)';
            a3 = false;
        }else{
            errorAdress.textContent = formOk;
            a3 = true;
        }
        
        let city      = getAllForms[3].value;
        let cityRegEx = new RegExp(/^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]{3,15}$/g);
        let testCity = cityRegEx.test(city);
        if (!testCity) {
            e.preventDefault();
            errorCity.textContent = `Ville Incorrect (exemple: L'Isle-en-Rigault)`;
            a4 = false;
        }else{
            errorCity.textContent = formOk;
            a4 = true;
        }

        var email      = getAllForms[4].value;
        let emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
        let testEmail = emailRegEx.test(email);
        if (!testEmail) {
            e.preventDefault();
            errorEmail.textContent = 'Email Incorrect (exemple: je.dupont@gmail.com)'
            a5 = false;
        }else{
            errorEmail.textContent = formOk;
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