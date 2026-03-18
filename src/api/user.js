import request from "@/unit/request"

// 用户登录
export const UserLoginServer = ({ UserName, PassWord }) => {
  return request.post('/user/login',{
    UserName,
    PassWord,
  })
}

// 用户注册
export const UserRegisterServer = ({ UserName, PassWord, PhoneNumber }) => {
  return request.post('user/userInfo',{
    UserName,
    PassWord,
    PhoneNumber
  })
}

// 修改用户信息
export const UserPutInfoServer = (obj) => {
  return request.post('user/updateUser',{
    ...obj
  })
}

// 获取用户密码是否一致
export const UserGetPswServer = (PassWord) => {
  return request.get('user/pswGetInfo',{
    params:{
      PassWord
    }
  })
}

// 获取用户信息
export const UserGetInfoServer = () => {
  return request.get('user/getUserInfo')
}

// 通过id获取用户简要信息
export const UserGetSimpleInfoServer = (id) => {
  return request.get(`/user/UserSimpleInfo?id=${id}`)
}

// 确认用户是否存在
export const UserGetExistServer = (id) => {
  return request.get(`/user/checkUser?id=${id}`)
}