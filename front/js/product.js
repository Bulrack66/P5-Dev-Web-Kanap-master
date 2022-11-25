const params = new URLSearchParams(window.location.search)
const productId = params.get('id')
const itemsToCart = document.getElementById('addToCart');

initAddToCart();

const getSofa = async () => {
        await fetch(`http://localhost:3000/api/products/${productId}`)
        .then((res) => res.json())
        .then((sofaData) => displaySofa(sofaData))
        .catch((err) => console.log(err.stack));
        
};

getSofa();

const displaySofa = (sofaData) => {
    const monImage     = document.querySelector('.item__img');
    monImage.innerHTML = `<img src="${sofaData.imageUrl}" alt="Photographie d'un canapé ${sofaData.name}">`;
    
    const nomDuProduit       = document.getElementById('title');
    nomDuProduit.textContent = `${sofaData.name}`;

    document.title = `${sofaData.name}`;
    
    const prix       = document.getElementById('price');
    prix.textContent = `${sofaData.price}`;
    
    const description       = document.getElementById('description');
    description.textContent = `${sofaData.description}`;
    
    sofaData.colors.forEach((colors) => {
        const couleurs = document.getElementById('colors');
        couleurs.innerHTML += `<option value="${colors}">${colors}</option>`
    });
    
}

function initAddToCart() {
    itemsToCart.addEventListener('click', function(e) {
        let tab = [];
        const lTab = window.localStorage.getItem('tab');
        if (lTab != null) {
            tab = JSON.parse(lTab);
        }
        let getCart = {
            id       : productId,
            name     : document.getElementById('title').textContent,
            color    : document.getElementById('colors').value,
            quantity : Number(document.getElementById('quantity').value),
        }
        let isNew = true;
        if (getCart.color != '' && getCart.quantity >= 1 && getCart.quantity <= 100) {
            tab = tab.map(t => {
                if (t.id === getCart.id && t.color === getCart.color) {
                    t.quantity += getCart.quantity;
                    isNew = false;
                }
            return t
            });
            if (isNew){
                tab.push(getCart);
            }
            window.localStorage.setItem("tab", JSON.stringify(tab));
            window.location = 'cart.html';
        } else {alert('Veuillez choisir correctement une valeur pour la couleur et la quantité')}
    });
};

        