$(document).ready(function () {
  document.title = 'Giỏ hàng của tôi';
  $('.suggested-courses_slider .grid-list').slick({
    slidesToShow: 5,
    slidesToScroll: 5,
    speed: 1500,
    prevArrow: $('.prev-control'),
    nextArrow: $('.next-control'),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  $('.remove-btn').click(function (e) {
    const agreeDelete = confirm('Bạn chắc chắn muốn bỏ khóa học này chứ ?');
    if (agreeDelete) {
      const courseId = $(this).attr('data-id');
      if (getCookie('isLoggedIn') === 'true') {
        $('#delete-course-form').attr(`action`, `/cart/delete/${courseId}?_method=DELETE`);
        $('#delete-course-form').submit();
      } else {
        let cartList = JSON.parse(getCookie('cart'));
        cartList = cartList.filter((e) => e !== courseId);
        document.cookie = `cart=${JSON.stringify(cartList)}`;
        window.location.reload();
      }
    }
  });

  $('.btn-payment').click(function () {
    if (getCookie('isLoggedIn') === 'true') {
      $('#payment-form').attr('action', '/order');
    } else $('#payment-form').attr('action', '/login');
    $('#payment-form').submit();
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
