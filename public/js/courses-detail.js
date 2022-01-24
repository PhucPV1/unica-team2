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
const detailContentCmt = $('#comment .detail-content');
const loadmoreBtnCmt = $('#comment .load-more');
const detailContentSimCourse = $('.similar-course .detail-content');
const loadmoreBtnSimCourse = $('.similar-course .load-more');
let startFromCmt = 0;
let startFromSimCourse = 0;
let cmtHTML = '';
let simCourseHTML = '';

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

window.addEventListener('load', () => {
  getComment();
  getCourse();
});
loadmoreBtnCmt.addEventListener('click', () => getComment());
loadmoreBtnSimCourse.addEventListener('click', () => getCourse());

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

async function getComment() {
  const limit = 4;
  const slug = loadmoreBtnCmt.getAttribute('slug');
  const url = `/${slug}`;
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: `${courseId}`, startFrom: startFromCmt }),
  };
  try {
    const res = await fetch(url, init);
    const data = await res.json();

    const result = data.comments.map((item) => {
      return `             
          <div class="comment">
            <div class="avatar">
              <i class="fa fa-user-circle-o" aria-hidden="true"></i>
            </div>
            <div class="comment-deatail">
              <div class="student-name" style="font-size: 18px; font-weight: bold;">
                ${item.user_id.full_name}
              </div>
              <div class="comment-content">
               ${item.comment}
              </div>
            </div>
          </div>
      `;
    });
    cmtHTML += result.join(' ');
    detailContentCmt.innerHTML = cmtHTML;
    startFromCmt += limit;
    if (startFromCmt >= data.length) loadmoreBtnCmt.style.display = 'none';
  } catch (error) {
    console.log(error);
  }
}

async function getCourse() {
  const limit = 4;
  const id = loadmoreBtnSimCourse.getAttribute('data');

  const url = `/courses?c=${id}`;
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ startFrom: startFromSimCourse }),
  };
  try {
    const res = await fetch(url, init);
    const data = await res.json();

    const result = data.courses.map((item) => {
      return `             
      <div class="similar-course-content">
      <div class="row">
        <div class="col-3 col-lg-2">
          <img
            src=" ${item.img_src} "
            alt="${item.description} "
          />
        </div>
        <div class="col-9 col-lg-10 info-general">
          <div class="row">
            <div class="col-12 col-lg-6 sourcename-time">
              <a href="" class="sourse-name">
                 ${item.name}
              </a>
              <div class="time"><b class="hours">4</b> giờ <b class="minutes">30</b> phút</div>
            </div>
            <div class="col-12 col-lg-6 rate-price">
              <div>
                <span class="quantity">${item.review_count}</span>
                <span class="star_rate">
                  <i class="fa fa-star co-or" aria-hidden="true"></i>
                </span>
              </div>
              <div class="student-quantity">
                <i class="fa fa-users" aria-hidden="true"></i>
                <span class="quantity">${item.trainee_count}</span>
              </div>
              <div class="price-course">
                <div class="present_price"> 
                  ${item.present_price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} 
                   <sup>đ</sup></div> 
                <div class="previous_price"> 
                  ${item.previous_price
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} 
                  <sup>đ</sup></div>
              </div>
              <div class="fav-course">
                <a><i class="fa fa-heart-o" aria-hidden="true"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      `;
    });
    simCourseHTML += result.join(' ');
    detailContentSimCourse.innerHTML = simCourseHTML;
    startFromSimCourse += limit;
    if (data.end) loadmoreBtnSimCourse.style.display = 'none';
  } catch (error) {
    console.log(error);
  }
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
