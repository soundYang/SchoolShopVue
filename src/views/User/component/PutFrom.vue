<script setup>
import { UserPutInfoServer } from '@/api/user'
import { useToast } from '@/composables/useToast'
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { rules } from '@/unit/validate'

const { putUser } = useUserStore()

const router = useRouter()
const { showToast } = useToast()

const close = inject('close')

/**
 * putCount的值
 * 0: 修改电话
 * 1: 修改地址
 * 2: 修改密码
 * 3: 修改用户名
 */
const props = defineProps({
  putCount: Number
})

const putFrom = ref({
  oldPassword: '',
  PassWord: '',
  confirmPassWord: '',
  UserName: '',
  PhoneNumber: ''
})

const putInfo = async () => {
  if (props.putCount === 0) {
    putFrom.value.PhoneNumber = putFrom.value.PhoneNumber.trim()
    if (!rules.phoneNumber.rex.test(putFrom.value.PhoneNumber)) {
      return showToast(rules.phoneNumber.msg)
    }
    await UserPutInfoServer({ PhoneNumber: putFrom.value.PhoneNumber })
    putUser()
    return close()
  }

  if (props.putCount === 2) {
    putFrom.value.oldPassword = putFrom.value.oldPassword.trim()
    putFrom.value.PassWord = putFrom.value.PassWord.trim()
    putFrom.value.confirmPassWord = putFrom.value.confirmPassWord.trim()

    if (!putFrom.value.oldPassword) return showToast('请输入原密码')
    if (!rules.passWord.rex.test(putFrom.value.oldPassword)) return showToast(rules.passWord.msg)
    if (!rules.passWord.rex.test(putFrom.value.PassWord)) return showToast(rules.passWord.msg)
    if (putFrom.value.PassWord === putFrom.value.oldPassword) return showToast('新密码不能与旧密码相同')
    if (putFrom.value.PassWord !== putFrom.value.confirmPassWord) return showToast('两次密码不一致')

    await UserPutInfoServer({
      oldPassWord: putFrom.value.oldPassword,
      PassWord: putFrom.value.PassWord
    })
    router.push('/login')
    putUser()
    return close()
  }

  if (props.putCount === 3) {
    putFrom.value.UserName = putFrom.value.UserName.trim()
    if (!rules.userName.rex.test(putFrom.value.UserName)) {
      return showToast(rules.userName.msg)
    }
    await UserPutInfoServer({ UserName: putFrom.value.UserName })
    putUser()
  }
  close()
}
</script>

<template>
  <form class="form">
    <div class="title">修改信息<br><span>Edit Information</span></div>

    <input v-if="putCount === 0" v-model="putFrom.PhoneNumber" placeholder="新手机号" required="" name="phoneNumber" class="input">

    <input v-if="putCount === 2" v-model="putFrom.oldPassword" placeholder="原密码" required="" name="oldPassword" class="input">
    <input v-if="putCount === 2" v-model="putFrom.PassWord" placeholder="新密码" required="" name="newPassword" class="input">
    <input v-if="putCount === 2" v-model="putFrom.confirmPassWord" placeholder="确认新密码" required="" name="confirmPassword" class="input">

    <input v-if="putCount === 3" v-model="putFrom.UserName" placeholder="新用户名" required="" name="userName" class="input">

    <button @click.prevent="putInfo" class="button-confirm">修改</button>
  </form>
</template>

<style scoped>
  .form {
    --input-focus: #2d8cf0;
    --font-color: #000;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #000;
    padding: 20px;
    background: var(--mg-white);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border: var(--mg-border);
    box-shadow: var(--mg-shadow);
  }

  .title {
    color: var(--font-color);
    font-weight: 900;
    font-size: 20px;
    margin-bottom: 25px;
    font-family: var(--mg-font);
  }

  .title span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
    font-family: var(--mg-font);
  }

  .input {
    width: 250px;
    height: 40px;
    border: var(--mg-border-light);
    background-color: var(--bg-color);
    box-shadow: var(--mg-shadow-sm);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
    font-family: var(--mg-font);
  }

  .input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .input:focus {
    border: 2px solid var(--mg-black);
  }

  .button-confirm {
    margin: 50px auto 0 auto;
    width: 120px;
    height: 40px;
    border: var(--mg-border-light);
    background-color: var(--bg-color);
    box-shadow: var(--mg-shadow-sm);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
    font-family: var(--mg-font);
    transition: all 0.1s;
  }

  .button-confirm:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--mg-shadow);
  }
</style>
