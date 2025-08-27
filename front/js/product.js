const params = new URLSearchParams(window.location.search)
const productId = params.get('id')
const itemsToCart = document.getElementById('addToCart');
const color = document.getElementById('colors');
const productPicture     = document.querySelector('.item__img');
const nomDuProduit       = document.getElementById('title');
const prix       = document.getElementById('price');

initAddToCart();

const getSofa = async () => {
        await fetch(`http://localhost:3000/api/products/${productId}`)
        .then((res) => res.json())
        .then((sofaData) => displaySofa(sofaData))
        .catch((err) => console.log(err.stack));
        
};

getSofa();

const displaySofa = (sofaData) => {
    
    const insertPicture = document.createElement('img');
    insertPicture.setAttribute('src', sofaData.imageUrl);
    insertPicture.setAttribute('alt', sofaData.altTxt);
    productPicture.appendChild(insertPicture);
    
    nomDuProduit.textContent = `${sofaData.name}`;

    document.title = `${sofaData.name}`;
    
    prix.textContent = `${sofaData.price}`;
    
    const description       = document.getElementById('description');
    description.textContent = `${sofaData.description}`;
    
    sofaData.colors.forEach((colors) => {
        addColor = document.createElement('option');
        addColor.setAttribute('value', colors);
        addColor.textContent = colors;
        color.appendChild(addColor);
    });
    
}

function initAddToCart() {
    itemsToCart.addEventListener('click', function(e) {
        let tab = [];
        const lTab = localStorage.getItem('tab');
        if (lTab != null) {
            tab = JSON.parse(lTab);
        }
        let getCart = {
            _id       : productId,
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
            localStorage.setItem("tab", JSON.stringify(tab));
            window.location = 'cart.html';
        } else {alert('Veuillez choisir correctement une valeur pour la couleur et la quantité')}
    });
};

        