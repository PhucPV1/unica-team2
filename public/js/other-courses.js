const courseList=document.querySelector('.grid.drag_to_scroll');
const loadmoreBtn=document.querySelector(".load-more");
const addToCartForm=document.querySelector('#add-to-cart-form');
let startFrom=0;
let html='';

loadmoreBtn.addEventListener('click',()=>getCourses());
window.addEventListener('load',()=>getCourses());

// Function getCourse loadmore
function getCourses(){
    const ajax=new XMLHttpRequest();

    ajax.open('POST',window.location.href,true);

    ajax.onreadystatechange=function(){
        if (this.readyState===4){
            if (this.status===200){
                const courses=JSON.parse(this.responseText);
                const render=courses.map(course=>{
                        return `
                        <div class="grid_items">
                            <a href="/courses/${course.slug}">
                                <span class="sale-off"> -75%</span>
                                <img src='${course.img_src }' alt="" />
                                <div class="course_content">
                                    <h3 class="course_title">${ course.name}</h3>
                                    <div class="teacher_and_prevPrice">
                                    <span class="teacher_name">${ course.trainer_id}</span>
                                    <span class="previous_price"
                                        >${ course.previous_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}<sup>đ</sup></span
                                    >
                                    </div>
                                    <div class="stars_and_presentPrice">
                                        <span class="star_rate">
                                            <i class="fa fa-star co-or" aria-hidden="true"></i>
                                            <i class="fa fa-star co-or" aria-hidden="true"></i>
                                            <i class="fa fa-star co-or" aria-hidden="true"></i>
                                            <i class="fa fa-star co-or" aria-hidden="true"></i>
                                            <i class="fa fa-star co-or" aria-hidden="true"></i>
                                            (7)
                                        </span>
                                        <span class="present_price"
                                            >${ course.present_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}<sup>đ</sup></span
                                        >
                                    </div>
                                </div>
                            </a>        
                            <div class="d-flex justify-content-center">
                                <div class="btn btn-add-to-cart mb-2" onclick="addToCart(this)"data-id="${ course._id}">
                                    <span class="d-block txt-add">Thêm vào giỏ hàng</span>
                                    <span class="d-block txt-mem"> Đã có 847 người học</span>
                                </div>
                            </div>
                        </div>`;
                    });
                html+=render.join(' ');
                courseList.innerHTML=html;

                const limit=2;
                startFrom+=limit;

            }
        }
    };
    const formData= new FormData();
    formData.append('startFrom',startFrom);
    ajax.send(formData);
}

// Function add course to cart
function addToCart(element){
    console.log(element)
    const courseId=element.getAttribute("data-id");
    console.log(courseId)
    if (getCookie('isLoggedIn')==='true'){        
        addToCartForm.action=`/cart/add/${courseId}`;                
        addToCartForm.submit();
    }
    else {
        let cartList=getCookie('cart');
        if (!cartList || !Array.isArray(JSON.parse(cartList))) cartList=[];
        else cartList=JSON.parse(cartList);
        if (cartList.length===0||!cartList.find(e=>e===courseId))
            cartList.push(courseId);
        document.cookie=`cart=${JSON.stringify(cartList)}`;
        document.location.reload();
    }
}

//  Function get value of cookie item
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}