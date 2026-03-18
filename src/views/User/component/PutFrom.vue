<script setup>
import { UserPutInfoServer, UserGetPswServer } from '@/api/user'
import { useToast } from '@/composables/useToast'
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

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
  UserName: '',
  [Symbol.iterator]: function * () {
    yield* Object.entries(putFrom.value)
  }
})

const isLogin = ref(false)
const putInfo = async () => {
  if(props.putCount === 2) {
    if(putFrom.value.PassWord === putFrom.value.oldPassword) return showToast('新密码不能与旧密码相同')
    const res = await UserGetPswServer(putFrom.value.oldPassword)
    if(!res.data.isExist) return   
  }

  for (const [key, value] of putFrom.value) { 
     if(key !== 'oldPassword' && value){
      ( key === 'PassWord' ) && (isLogin.value = true)
      await UserPutInfoServer({
        [key]: value
      })
      if(isLogin.value) router.push('/login')
      putUser()
      return close()
     }     
  }
}
</script>

<template>
  <form class="form">
    <div class="title">修改信息<br><span>Edit Information</span></div>
     
    <!-- 电话 -->
  
    <!-- 密码 -->
    <input v-if="putCount === 2" v-model="putFrom.oldPassword" placeholder="原密码" required="" name="oldPassword" class="input">
    <input v-if="putCount === 2" v-model="putFrom.PassWord" placeholder="新密码" required="" name="newPassword" class="input">
    <!-- 用户名 -->
    <input v-if="putCount === 3" v-model="putFrom.UserName" placeholder="用户名" required="" name="userName" class="input">

    <button @click.prevent="putInfo" class="button-confirm">修改</button>
  </form>
</template>

<style scoped>
  .form {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    padding: 20px;
    background: lightgrey;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  .title {
    color: var(--font-color);
    font-weight: 900;
    font-size: 20px;
    margin-bottom: 25px;
  }

  .title span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
  }

  .input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }

  .input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .input:focus {
    border: 2px solid var(--input-focus);
  }

  .button-confirm {
    margin: 50px auto 0 auto;
    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
  }
</style>
