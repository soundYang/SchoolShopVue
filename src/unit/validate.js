const rules = {
  userName: {
    rex: /^[\u4e00-\u9fa5a-zA-Z0-9_-]{2,16}$/,
    msg: '用户名必须是2-16位的中文、字母、数字、下划线、减号'
  },
  passWord: {
    rex: /^[a-zA-Z0-9_-]{4,16}$/,
    msg: '密码必须是4-16位字母、数字、下划线、减号'
  },
  phoneNumber: {
    rex: /^[1][3-9]\d{9}$/,
    msg: '手机号格式不正确'
  },
  captchaText: {
    rex: /^[A-Za-z0-9]{1,6}$/,
    msg: '验证码格式不正确'
  }
}

const validateField = (value, rule) => {
  if (!rule) return { valid: true }
  if (!rule.rex.test(value)) {
    return { valid: false, msg: rule.msg }
  }
  return { valid: true }
}

export { rules, validateField }
