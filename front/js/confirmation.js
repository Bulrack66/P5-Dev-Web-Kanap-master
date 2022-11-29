const params = new URLSearchParams(window.location.search)
const productId = params.get('orderId');


setOderId = document.getElementById('orderId');
setOderId.innerHTML = productId;