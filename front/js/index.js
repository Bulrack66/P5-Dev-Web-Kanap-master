const url = 'http://localhost:3000/api/products'
const card = document.querySelector('#items');
fetch(url)
    .then((res)  => res.json())
    .then((sofaApi) => displaySofa(sofaApi))
    .catch((err) => console.log(err.stack))

function displaySofa(sofaApi) {
    
    for (const sofa of sofaApi) {
        let a = document.createElement('a');
        a.href = './product.html?id=' + sofa._id
        let htmlElement = `<article>
                            <img src="${sofa.imageUrl}" alt="${sofa.altText}">
                            <h3 class="productName">${sofa.name}</h3>
                            <p class="productDescription">${sofa.description}</p>
                            </article>` ;
        a.innerHTML = htmlElement;
        card.appendChild(a)
    }
}
