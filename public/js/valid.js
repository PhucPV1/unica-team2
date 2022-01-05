function Validator(options) {
  var invalidInfoMessage = document.querySelector(".invalid-info-message")
  function getParent(element, targetElement) {
    while (element.parentElement) {
      if (element.parentElement.matches(targetElement)) {
        return element.parentElement
      }
      element = element.parentElement
    }
  }
  var allRules = {}
  /* validate function */
  function validate(inputElement, rule) {
    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
    var errorMessage
    // get rule for selector
    var rules = allRules[rule.selector]
    // loop each rules and check, if have error message -> stop check
    for (var i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMessage = rules[i](formElement.querySelector(rule.selector + ":checked"))
          break
        default:
          errorMessage = rules[i](inputElement.value)
      }
      if (errorMessage) break
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage
      getParent(inputElement, options.formGroupSelector).classList.add("invalid")
    } else {
      errorElement.innerText = ""
      getParent(inputElement, options.formGroupSelector).classList.remove("invalid")
    }
    return !errorMessage
  }
  /* get element from form */
  var formElement = document.querySelector(options.idForm)
  if (formElement) {
    // submit form
    formElement.onsubmit = (e) => {
      e.preventDefault()
      var isFormValid = true

      options.rules.forEach((rule) => {
        var inputElement = formElement.querySelector(rule.selector)
        var isValid = validate(inputElement, rule)
        if (!isValid) {
          isFormValid = false
        }
      })
      if (isFormValid) {
        // submit with js
        if (typeof options.onSubmit === "function") {
          // var validInputs = formElement.querySelectorAll("[name]:not([disabled])")
          // for the case don't want to record user-recaptcha-response => enable this below
          var validInputs = formElement.querySelectorAll("[name]:not([disabled]):not(#g-recaptcha-response)")
          var outputValues = Array.from(validInputs).reduce(function (values, input) {
            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector(`input[name= ${input.name}]:checked`).value
                break
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = ""
                  return values
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = []
                }
                values[input.name].push(input.value)
                break
              case "file":
                values[input.name] = input.files
                break
              default:
                values[input.name] = input.value
            }
            return values
          }, {})
          if (options.captchaRequired == "no") {
            options.onSubmit(outputValues)
          } else {
            if (recaptcha_response) {
              options.onSubmit(outputValues)
            } else {
              errorFormGroupCaptcha.classList.add("invalid")
              formMessageElement.innerText = options.captchaErrorMessage
            }
          }
          // submit with default html
        } else {
          if (options.captchaRequired == "no") {
            formElement.submit()
          } else {
            if (recaptcha_response) {
              formElement.submit()
            } else {
              errorFormGroupCaptcha.classList.add("invalid")
              formMessageElement.innerText = options.captchaErrorMessage
            }
          }
        }
      }
    }
    // loop all input element
    options.rules.forEach((rule) => {
      // save all rules
      if (Array.isArray(allRules[rule.selector])) {
        allRules[rule.selector].push(rule.check)
      } else {
        allRules[rule.selector] = [rule.check]
      }
      var inputElements = formElement.querySelectorAll(rule.selector)
      Array.from(inputElements).forEach(function (inputElement) {
        //   when blur
        inputElement.onblur = () => {
          invalidInfoMessage.style.display = "none"
          validate(inputElement, rule)
        }
        //   when input
        inputElement.oninput = () => {
          invalidInfoMessage.style.display = "none"
          var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
          errorElement.innerText = ""
          getParent(inputElement, options.formGroupSelector).classList.remove("invalid")
        }

        inputElement.onchange = () => {
          invalidInfoMessage.style.display = "none"
          switch (inputElement.name) {
            //when change select-options
            case options.selectOption_Name:
              options.rules.forEach(() => {})
              validate(inputElement, rule)
              break
            // auto validate confirm password when changing password
            case options.passwordName:
              validate(
                formElement.querySelector(options.passwordConfirmationSelector),
                Validator.isConfirmPassword(options.passwordConfirmationSelector),
              )
              break
            default:
              break
          }
        }
      })
    })
  }
  var captchaElement = document.querySelector(".g-recaptcha")
  var errorFormGroupCaptcha = getParent(captchaElement, options.formGroupSelector)
  var formMessageElement = errorFormGroupCaptcha.querySelector(options.errorSelector)
}
/* Rules */
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      return value ? undefined : message || "This is a required field"
    },
  }
}
Validator.isName = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      var regexName =
        /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/iu
      return regexName.test(value) ? undefined : message || "Please enter a valid name"
    },
  }
}
Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      return regexEmail.test(value) ? undefined : message || "Please enter a valid email"
    },
  }
}
Validator.isPhoneNumber = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      var regexPhone = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
      return regexPhone.test(value) ? undefined : message || "Please enter a valid email"
    },
  }
}
Validator.isAddress = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      var regexAddress =
        /^[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ \/\-]*[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/iu
      return regexAddress.test(value) ? undefined : message || "Please enter a valid address"
    },
  }
}
Validator.isMinLength = function (selector, min, message) {
  return {
    selector: selector,
    check: function (value) {
      return value.length >= min ? undefined : message || `Please enter a password longer than ${min} characters `
    },
  }
}
Validator.isStrengthPassword = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      var regexStrengthPassword = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/
      return regexStrengthPassword.test(value)
        ? undefined
        : message ||
            "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
    },
  }
}
Validator.isConfirmPassword = function (selector, checkConfirm, message) {
  return {
    selector: selector,
    check: function (value) {
      return value === checkConfirm() ? undefined : message || `Please re-enter the matching password`
    },
  }
}
/* Validate google captcha */
var recaptcha_response = false
function validateCaptcha() {
  recaptcha_response = true
  var errorFormGroupCaptcha = document.querySelector(".g-recaptcha").parentElement
  var formMessageElement = errorFormGroupCaptcha.querySelector(".form-message")
  errorFormGroupCaptcha.classList.remove("invalid")
  formMessageElement.innerText = ""
}
