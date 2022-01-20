$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

/* Auto render course every accessing homepage */
(function renderCourses() {
  var bestSalesCoursesElement = $('.best_sales_render_courses');
  columnLayoutCount = Math.ceil(bestSalesCoursesElement.childElementCount / 2); // => 2: number of row want to display
  bestSalesCoursesElement.classList.add('render');
  bestSalesCoursesElement.style.gridTemplateColumns = `repeat(${columnLayoutCount}, minmax(255px, 1fr)`;
})();

/* Drag to scroll */
var grabElements = $$('.drag_to_scroll');
let isDown = false;
let startX;
let scrollLeft;
Array.from(grabElements).map((grabElement) => {
  grabElement.addEventListener('mousedown', (e) => {
    isDown = true;
    grabElement.classList.add('grab');
    startX = e.pageX - grabElement.offsetLeft;
    scrollLeft = grabElement.scrollLeft;
  });
  grabElement.addEventListener('mouseleave', () => {
    isDown = false;
    grabElement.classList.remove('grab');
  });
  grabElement.addEventListener('mouseup', () => {
    isDown = false;
    grabElement.classList.remove('grab');
  });
  grabElement.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - grabElement.offsetLeft;
    const walk = (x - startX) * 1; //scroll-speed
    grabElement.scrollLeft = scrollLeft - walk;
  });
});

/* Show menu on mobile scr */
let menuMobileBtn = $('.menu_tablet');
menuMobileBtn.onclick = () => {
  let menu_tablet_content = $('.menu_tablet_content');
  menu_tablet_content.classList.toggle('active');
  menu_tablet_content.style.animation = 'slide-menu-mobile linear 0.2s';
  let arrowBtn = $('.menu_mobile_arrow-left');
  arrowBtn.onclick = (e) => {
    e.stopPropagation();
    menu_tablet_content.classList.toggle('active');
  };
  menuMobileBtn.onclick = () => {
    menu_tablet_content.classList.toggle('active');
  };
};

// Search
async function search() {
  try {
    const search = $(`search`).val();
    const res = await $.ajax();
    $.ajax({
      type: 'GET',
      url: '/search?name=' * search,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
