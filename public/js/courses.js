$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

const courseList = $('.grid.drag_to_scroll');
const loadmoreBtn = $('.load-more');
const quantity = $('.cart_quantity b');
const addedAnnounce = $('.added-announce');
const loadingIcon = $('.load-more .icon-loading');
let startFrom = 0;
let html = '';

loadmoreBtn.addEventListener('click', () => getCourses());
window.addEventListener('load', () => getCourses());

// Function getCourse loadmore
async function getCourses() {
  const limit = 4;
  const url = window.location.href;
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ startFrom }),
  };
  try {
    loadingIcon.style.display = 'inline';
    const response = await fetch(url, init);
    const data = await response.json();

    const courses = data.courses;
    const render = courses.map((course) => {
      const discountPercent = Math.ceil(
        100 - (course.present_price / course.previous_price) * 100,
      );
      var ratingIconsElement;
      switch (course.rating) {
        case 0:
          ratingIconsElement =
            '<i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i>';
          break;
        case 1:
          ratingIconsElement =
            '<i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i>';
          break;
        case 2:
          ratingIconsElement =
            '<i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i>';
          break;
        case 3:
          ratingIconsElement =
            '<i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i>';
          break;
        case 4:
          ratingIconsElement =
            '<i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star-o co-or" aria-hidden="true"></i>';
          break;
        case 5:
          ratingIconsElement =
            '<i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i><i class="fa fa-star co-or" aria-hidden="true"></i>';
          break;
        default:
          break;
      }
      return `
                <div class="grid_items" >
                    <a href="/${course.slug}">
                        <span class="sale-off"> -${discountPercent}%</span>
                        <img src='${course.img_src}' alt="" />
                        <div class="course_content">
                            <h3 class="course_title">${course.name}</h3>
                            <div class="teacher_and_prevPrice">
                            <span class="teacher_name">${
                              course.trainer_id.full_name
                            }</span>
                            <span class="previous_price"
                                >${course.previous_price
                                  .toString()
                                  .replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    '.',
                                  )}<sup>đ</sup></span
                            >
                            </div>
                            <div class="stars_and_presentPrice">
                                <span class="star_rate">
                                  ${ratingIconsElement}
                                  (${course.review_count})
                                </span>
                                <span class="present_price"
                                    >${course.present_price
                                      .toString()
                                      .replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        '.',
                                      )}<sup>đ</sup></span
                                >
                            </div>
                        </div>
                    </a>
                    <div class="d-flex justify-content-center grid_items-btn " 
                        data-id='${course._id}' 
                        traineecount="${course.trainee_count}"
                        trainee_courses=${JSON.stringify(data.trainee_courses)}
                       >                
                        <div class="btn btn-add-to-cart mb-2" onclick="addToCart(this)"data-id="${
                          course._id
                        }">
                            <span class="d-block txt-add">Thêm vào giỏ hàng</span>
                            <span class="d-block txt-mem" > Đã có ${
                              course.trainee_count
                            } người học</span>
                        </div>
                    </div>
                </div>`;
      console.log(render);
    });
    html += render.join(' ');
    courseList.innerHTML = html;
    setTimeout(() => (loadingIcon.style.display = 'none'), 500);
    if (data.end) loadmoreBtn.style.display = 'none';
    checkInCartAndUserCourse(data.cart, data.usercourses);
    startFrom += limit;
  } catch (error) {
    console.log(error);
  }
}

// Function add course to cart

async function addToCart(element) {
  const courseId = element.getAttribute('data-id');
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
      console.log(data);
      quantity.innerHTML = JSON.stringify(data.cart.length);
      quantity.parentElement.style.display = 'block';
      addedAnnounce.style.display = 'flex';
      setTimeout(() => {
        addedAnnounce.style.display = 'none';
      }, 1000);
      checkInCartAndUserCourse(data.cart, data.courses);
    } catch (error) {
      console.log(error);
    }
  } else {
    let cartList = getCookie('cart');
    if (!cartList || !Array.isArray(JSON.parse(cartList))) cartList = [];
    else cartList = JSON.parse(cartList);
    if (cartList.length === 0 || !cartList.find((e) => e === courseId))
      cartList.push(courseId);
    document.cookie = `cart=${JSON.stringify(cartList)}`;
    quantity.innerHTML = JSON.stringify(cartList.length);
    quantity.parentElement.style.display = 'block';
    addedAnnounce.style.display = 'flex';
    setTimeout(() => {
      addedAnnounce.style.display = 'none';
    }, 1000);
    checkInCartAndUserCourse(cartList, []);
  }
}

function checkInCartAndUserCourse(cart, courses) {
  const list = $$('.grid_items-btn');
  
  list.forEach((e) => {
    const courseId=e.getAttribute('data-id');
    if (cart.includes(courseId)) {
      const trainee_count = e.getAttribute('traineecount');
      e.innerHTML = `
            <div class="btn into-cart mb-2"  >
                <span class="d-block txt-add">Đã chọn</span>
                <span class="d-block txt-mem"> Đã có ${trainee_count} người học</span>
            </div>`;
    }

    if (courses.includes(courseId)) {
      const traineeCourses=JSON.parse(e.getAttribute('trainee_courses'));
      traineeCourses.map(item=>{
        if (courseId===item.course_id)
          e.innerHTML = `
          <a href="/overview/${item._id}">
              <div class="btn join-class-btn mb-2">
                  <span class="d-block txt-add">Vào học ngay</span>
                  <div><i class="fa fa-history" aria-hidden="true" ></i></div>
              </div>
          </a>
        `;
      })

    }
  });
}

//  Function get value of cookie item
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
