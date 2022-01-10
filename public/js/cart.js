$(document).ready(function(){
    document.title="Giỏ hàng của tôi";
    $('.suggested-courses_slider .grid-list').slick({
    slidesToShow: 5,
    slidesToScroll: 5,
    speed:1500,
    prevArrow: $(".prev-control"),
    nextArrow: $(".next-control"),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  $(".remove-btn").click(()=>{
    const agreeDelete=confirm("Bạn chắc chắn muốn bỏ khóa học này chứ ?");
    if (agreeDelete){
      const courseId=$(".remove-btn").attr("data-id");
      $("#delete-sourse-form").attr(`action`,`/cart/delete/${courseId}?_method=DELETE`);
      $("#delete-sourse-form").submit();
    }
  })
 
  })        