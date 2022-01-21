$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

const rightBlockBuyCourse = $('.right-buy-block .block-buy-cource-detail');
const registerCourseBtns = $$('.register-course-btn.btn');
const addCartBtns = $$('.add-cart-btn.btn');
const blockBtns = $$('.btn-block');
const quantity = $('.cart_quantity b');
const cartNoUser = $('.cart_quantity.no-user ');
const addedAnnounce = $('.added-announce');
const courseId = blockBtns[1].getAttribute('data-id');

document.onscroll = () => {
  if (window.innerWidth >= 992) {
    if (window.scrollY > 0 && window.scrollY < 170) {
      rightBlockBuyCourse.parentNode.style.position = 'relative';
      rightBlockBuyCourse.style.position = 'absolute';
      rightBlockBuyCourse.style.top = '-215px';
      rightBlockBuyCourse.style.bottom = 'unset';
    } else if (window.scrollY > 1550) {
      rightBlockBuyCourse.parentNode.style.position = 'relative';
      rightBlockBuyCourse.style.position = 'absolute';
      rightBlockBuyCourse.style.bottom = '100px';
      rightBlockBuyCourse.style.top = 'unset';
    } else {
      rightBlockBuyCourse.parentNode.style.position = 'unset';
      rightBlockBuyCourse.style.position = 'fixed';
      rightBlockBuyCourse.style.top = '110px';
      rightBlockBuyCourse.style.bottom = 'unset';
    }
  }
};

registerCourseBtns.forEach((item) => {
  item.addEventListener('click', async () => {
    if (getCookie('isLoggedIn') === 'true') {
      const url = `/cart/add`;
      const init = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: `${courseId}` }),
      };
      try {
        const res = await fetch(url, init);
      } catch {
        console.log(error);
      }
      window.location.href = '/order';
    } else {
      window.location.href = '/login';
    }
  });
});

addCartBtns.forEach((item) => {
  item.addEventListener('click', async () => {
    if (getCookie('isLoggedIn') === 'true') {
      const url = `/cart/add`;
      const init = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: `${courseId}` }),
      };
      try {
        const res = await fetch(url, init);
        const data = await res.json();
        quantity.innerHTML = JSON.stringify(data.cart.length);
        quantity.parentElement.style.display = 'block';
        addedAnnounce.style.display = 'flex';
        setTimeout(() => {
          addedAnnounce.style.display = 'none';
        }, 1000);
        renderAddedCart();
      } catch {
        console.log(error);
      }
    } else {
      let cartList = getCookie('cart');
      if (!cartList || !Array.isArray(JSON.parse(cartList))) cartList = [];
      else cartList = JSON.parse(cartList);
      if (cartList.length === 0 || !cartList.find((e) => e === courseId))
        cartList.push(courseId);
      document.cookie = `cart=${JSON.stringify(cartList)}`;

      cartNoUser.style.display = 'none';
      quantity.innerHTML = JSON.stringify(cartList.length);
      quantity.parentElement.style.display = 'block';
      addedAnnounce.style.display = 'flex';
      setTimeout(() => {
        addedAnnounce.style.display = 'none';
      }, 1000);
      renderAddedCart();
    }
  });
});

function renderAddedCart() {
  blockBtns.forEach((item) => {
    item.innerHTML = `
        <div class="register-course-btn btn">
            ĐĂNG KÍ HỌC
        </div>  
        <div class="added-btn btn" >                                                    
            <i class="fa fa-cart-plus" aria-hidden="true"></i>
            Đã thêm vào giỏ                                                   
        </div>
        <div class="note">
            <span>Hoàn tiền trong 7 ngày nếu không hài lòng</span>
        </div>
    `;
  });
}

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
