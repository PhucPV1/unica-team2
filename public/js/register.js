Validator({
  idForm: "#form",
  formGroupSelector: ".form-group",
  errorSelector: ".form-message",
  passwordSelector: "#password",
  passwordConfirmationSelector: "#password_confirmation",
  passwordName: "password",
  // selectOption_Name: "province",
  captchaRequired: "yes",
  rules: [
    Validator.isRequired("#fullname", "Họ và tên không được để trống"),
    Validator.isRequired("#email", "Email không được để trống"),
    Validator.isRequired("#phone_number", "Số điện thoại không được để trống"),
    Validator.isRequired("#password", "Mật khẩu không được để trống"),
    Validator.isRequired("#password_confirmation", "Vui lòng xác nhận lại mật khẩu"),
    // Validator.isRequired("#province"),
    // Validator.isRequired("input[name='gender']"),
    // Validator.isRequired("#avatar"),
    Validator.isName("#fullname", "Vui lòng nhập lại họ và tên hợp lệ"),
    Validator.isEmail("#email", "Vui lòng nhập lại email hợp lệ"),
    Validator.isPhoneNumber("#phone_number", "Vui lòng nhập lại số điện thoại hợp lệ "),
    // Validator.isAddress("#address"),
    Validator.isMinLength("#password", 6, "Vui lòng nhập lại mật khẩu độ dài trên 6 ký tự"),
    // Validator.isStrengthPassword(
    //   "#password",
    //   "Mật khẩu chưa đủ mạnh, phải dài trên 8 ký tự, chứa ít nhất một số, chữ thường, chữ hoa và ký tự đặc biệt",
    // ),
    Validator.isConfirmPassword(
      "#password_confirmation",
      () => {
        return document.querySelector("#form #password").value
      },
      "Vui lòng nhập lại mật khẩu trùng khớp",
    ),
  ],
  captchaErrorMessage: "Vui lòng nhập captcha",
  onSubmit: function (data) {
    // Post method to API server
    var api = "/register"
    var options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
    fetch(api, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.success == true) {
          alert("Tài khoản của bạn đã được tạo thành công")
          window.location.href = "/login"
        } else {
          var errMessage = document.querySelector(".invalid-info-message")
          errMessage.innerText = "Email hoặc số điện thoại này đã tồn tại"
          errMessage.style.display = "block"
        }
      })
      .catch(() => alert("Có lỗi xảy ra khi gửi dữ liệu lên server, vui lòng kiểm tra kết nối mạng và thử lại"))
  },
})
/* Fb login */
function statusChangeCallback(response) {
  // Called with the results from FB.getLoginStatus().
  if (response.status === "connected") {
    // Logged into your webpage and Facebook.
    testAPI()
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
    appId: "3041898986069663",
    cookie: true, // Enable cookies to allow the server to access the session.
    xfbml: true, // Parse social plugins on this webpage.
    version: "v12.0", // Use this Graph API version for this call.
  })

  // FB.getLoginStatus(function (response) {
  //   // Called after the JS SDK has been initialized.
  //   statusChangeCallback(response) // Returns the login status.
  // })
}

function testAPI() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  FB.api("/me?fields=name,email", function (response) {
    fbUserData = {
      full_name: response.name,
      email: response.email,
      avatar: `https://graph.facebook.com/${response.id}/picture?type=square`,
    }
    localStorage.setItem("userDataStorage", JSON.stringify(fbUserData))
    alert("Đăng nhập thành công, sẽ tự động chuyển sang trang chủ trong 3 giây")
    setTimeout(() => {
      window.location = "../"
    }, 3000)
  })
}
function fblogin() {
  FB.login(statusChangeCallback, { scope: "email,public_profile", return_scopes: true })
}
