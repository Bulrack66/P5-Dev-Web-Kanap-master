const params = new URLSearchParams(window.location.search)
const productId = params.get('orderId');

const order = () => {
    let setOderId = document.getElementById('orderId')
    setOderId.innerHTML = productId
    setOderId.style.color = '#3398DB';
    setOderId.style.fontWeight= '600';
}
order()

localStorage.clear()