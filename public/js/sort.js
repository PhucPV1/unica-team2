const navItems = document.querySelectorAll('li.nav-item');

navItems.forEach((element) => {
  if (element.getAttribute('data-id') === getId().toString())
    element.classList.add('active');
});
function getId() {
  const params = new URLSearchParams(window.location.search);
  let arr = [];
  for (const param of params) {
    arr.push(param);
  }
  return arr[2][1];
}
