let setOderId = document.getElementById('orderId')

const order = () => {
    const params = new URLSearchParams(window.location.search)
    const productId = params.get('orderId');
    setOderId.textContent = productId
    setOderId.style.color = '#3398DB';
    setOderId.style.fontWeight= '600';
}
order()

localStorage.clear()