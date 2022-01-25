const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');
const addToCartForm = document.querySelector('#add-to-cart-form');

addToCartBtns.forEach((element) => {
  element.addEventListener('click', () => {
    const courseId = element.getAttribute('data-id');
    if (getCookie('isLoggedIn') === 'true') {
      addToCartForm.action = `/cart/add/${courseId}`;
      addToCartForm.submit();
    } else {
      let cartList = getCookie('cart');
      if (!cartList || !Array.isArray(JSON.parse(cartList))) cartList = [];
      else cartList = JSON.parse(cartList);
      if (cartList.length === 0 || !cartList.find((e) => e === courseId))
        cartList.push(courseId);
      document.cookie = `cart=${JSON.stringify(cartList)}`;
      document.location.reload();
    }
  });
});

function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
