$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

var starsElement = $$('.fa-star');
var rateBtn = $('.rate');
var reviewInput = $('#review');

function star(currentRating) {
  for (i = currentRating; i > 0; i--) {
    starsElement[i - 1].style.color = '#eb8a2f';
  }
  for (j = currentRating; j < 5; j++) {
    starsElement[j].style.color = '#333';
  }
  rateBtn.onclick = () => {
    var options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rate: currentRating, review: reviewInput.value }),
    };
    fetch('/login', options)
      .then((response) => response.json())
      .then(() => {});
  };
}
