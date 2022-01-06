$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);

// var form = $("#form")
var logInBtn = $('#login');
var login_input = $$('.login_input');
var emailOrPhoneElement = $('#email_or_phone');
var passwordElement = $('#password');
var invalidInfoMessages = document.querySelectorAll('.invalid-info-message');

function checkEmpty(element) {
  var formGroupElement = element.parentElement.parentElement;
  var formMessageElement = formGroupElement.querySelector('.form-message');
  if (element.value) {
    formGroupElement.classList.remove('invalid');
    formMessageElement.style.display = 'none';
  } else {
    formGroupElement.classList.add('invalid');
    formMessageElement.style.display = 'block';
  }
}
/* validate when blur and change*/
Array.from(login_input).forEach((element) => {
  element.onblur = () => {
    Array.from(invalidInfoMessages).forEach(
      (invalidInfoMessage) => (invalidInfoMessage.style.display = 'none')
    );
    checkEmpty(element);
  };
  element.onkeyup = () => {
    Array.from(invalidInfoMessages).forEach(
      (invalidInfoMessage) => (invalidInfoMessage.style.display = 'none')
    );
    checkEmpty(element);
  };
});
/* validate when click btn or press enter*/
function validateSubmit() {
  if (!(emailOrPhoneElement.value && passwordElement.value)) {
    if (!emailOrPhoneElement.value) {
      emailOrPhoneElement.parentElement.parentElement.classList.add('invalid');
      $('.email_or_phone_message').style.display = 'block';
    }
    if (!passwordElement.value) {
      passwordElement.parentElement.parentElement.classList.add('invalid');
      $('.password_message').style.display = 'block';
    }
    /* when fulfilled */
  } else {
    validateUserInput();
    // form.submit()
  }
}
logInBtn.onclick = () => {
  validateSubmit();
};
window.onkeydown = (e) => {
  if (e.which === 13) {
    validateSubmit();
  }
};
function validateUserInput() {
  /* call api */
  var api = '/login';
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_or_phone: emailOrPhoneElement.value,
      password: passwordElement.value,
    }),
  };
  fetch(api, options)
    .then((response) => response.json())
    .then((data) => {
      if (data.success == false) {
        invalidInfoMessages.forEach((invalidInfoMessages) => {
          invalidInfoMessages.style.display = 'block';
        });
      } else {
        window.location = '/info';
      }
    })
    .catch(() => {
      alert(
        'Có lỗi xảy ra khi gửi dữ liệu lên server, vui lòng kiểm tra kết nối mạng và thử lại'
      );
    });
}
/* Fb login */
function statusChangeCallback(response) {
  // Called with the results from FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your webpage and Facebook.
    testAPI();
  }
  // else {
  //   // Not logged into your webpage or we are unable to tell.
  //   document.getElementById("status").innerHTML = "Please log " + "into this webpage."
  // }
}

// function checkLoginState() {
//   // Called when a person is finished with the Login Button.
//   FB.getLoginStatus(function (response) {
//     // See the onlogin handler
//     statusChangeCallback(response)
//   })
// }

window.fbAsyncInit = function () {
  FB.init({
    // appId: "3041898986069663",
    appId: '713243330023004', // unica test
    cookie: true, // Enable cookies to allow the server to access the session.
    xfbml: true, // Parse social plugins on this webpage.
    version: 'v12.0', // Use this Graph API version for this call.
  });

  // FB.getLoginStatus(function (response) {
  //   // Called after the JS SDK has been initialized.
  //   statusChangeCallback(response) // Returns the login status.
  // })
};

function testAPI() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  FB.api('/me?fields=name,email', function (response) {
    fbUserData = {
      full_name: response.name,
      email: response.email,
      avatar: `https://graph.facebook.com/${response.id}/picture?type=square`,
    };
    localStorage.setItem('userDataStorage', JSON.stringify(fbUserData));
    alert(
      'Đăng nhập thành công, sẽ tự động chuyển sang trang chủ trong 3 giây'
    );
    setTimeout(() => {
      window.location = '../';
    }, 3000);
  });
}
function fblogin() {
  FB.login(statusChangeCallback, {
    scope: 'email,public_profile',
    return_scopes: true,
  });
}

/* Google Login */
var googleUser = {};
var startApp = function () {
  gapi.load('auth2', function () {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    auth2 = gapi.auth2.init({
      client_id:
        '1080471704850-lhaludep42b8j3rimvh40ebu5n8ai723.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    attachSignin(document.getElementById('GGlogin'));
  });
};

function attachSignin(element) {
  // console.log(element.id)
  auth2.attachClickHandler(
    element,
    {},
    function (googleUser) {
      // console.log("Signed in: " + googleUser.getBasicProfile().getId())
      // console.log("Signed in: " + googleUser.getBasicProfile().getName())
      // console.log("Signed in: " + googleUser.getBasicProfile().getEmail())
      // console.log("Signed in: " + googleUser.getBasicProfile().getImageUrl())
      fbUserData = {
        full_name: googleUser.getBasicProfile().getName(),
        email: googleUser.getBasicProfile().getEmail(),
        avatar: googleUser.getBasicProfile().getImageUrl(),
      };
      localStorage.setItem('userDataStorage', JSON.stringify(fbUserData));
      alert(
        'Đăng nhập thành công, sẽ tự động chuyển sang trang chủ trong 3 giây'
      );
      setTimeout(() => {
        window.location = '../';
      }, 3000);
    }
    // function (error) {
    //   alert(JSON.stringify(error, undefined, 2))
    // }
  );
}
startApp();
