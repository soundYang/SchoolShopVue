import request from "@/unit/request"

export const getCaptcha = () => {
  return request.get('/captcha')
}
