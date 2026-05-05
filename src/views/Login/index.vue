<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import { UserLoginServer, UserRegisterServer } from '@/api/user'
import { getCaptcha } from '@/api/captcha'
import { useUserStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'

const { showToast } = useToast()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

defineOptions({
  name: "loginPage",
})

const showFrom = ref(true) // true: 登录, false: 注册

// 登录表单
const LoginfromModel = ref({
  userName: {
    value: "",
    rex: /^[a-zA-Z0-9_-]{4,16}$/,
    msg: '用户名必须是4-16位字母、数字、下划线、减号'
  },
  passWord: {
    value: "",
    rex: /^[a-zA-Z0-9_-]{4,16}$/,
    msg: '密码必须是4-16位字母、数字、下划线、减号'
  },
  [Symbol.iterator]: function* () {
    yield* Object.values(this)
  }
})

// 注册表单
const RegisterfromModel = ref({
  userName: {
    value: "",
    rex: /^[a-zA-Z0-9_-]{4,16}$/,
    msg: '用户名必须是4-16位字母、数字、下划线、减号'
  },
  passWord: {
    value: "",
    rex: /^[a-zA-Z0-9_-]{4,16}$/,
    msg: '密码必须是4-16位字母、数字、下划线、减号'
  },
  confirmPassWord: {
    value: "",
    rex: /^[a-zA-Z0-9_-]{4,16}$/,
    customValidator: () => {
      return RegisterfromModel.value.passWord.value === RegisterfromModel.value.confirmPassWord.value
    },
    msg: '密码不一致'
  },
  phoneNumber: {
    value: '',
    rex: /^[1][3-9]\d{9}$/,
    msg: '手机号格式不正确'
  },
  captchaText: {
    value: "",
    rex: /^[A-Za-z0-9]{1,6}$/,
    msg: '验证码格式不正确'
  },
  [Symbol.iterator]: function* () {
    yield* Object.values(this)
  }
})

// 登录提交
const login = async () => {
  for (let { value, rex, msg } of LoginfromModel.value) {
    if (!rex.test(value)) {
      return showToast(msg, 3000)
    }
  }
  const res = await UserLoginServer({
    UserName: LoginfromModel.value.userName.value,
    PassWord: LoginfromModel.value.passWord.value
  })
  userStore.setUser(res.data.data)
  userStore.setToken(res.data.token)

  if(route.query.backPath){
    return router.go(-1)
  }
  router.replace('/layout')
}

// 注册提交
const register = async () => {
  for (let field of RegisterfromModel.value) {
    // 处理自定义验证（如密码确认）
    if (field.customValidator && !field.customValidator()) {
      return showToast(field.msg, 3000)
    }
    // 正则验证
    if (field.rex && !field.rex.test(field.value)) {
      return showToast(field.msg, 3000)
    }
  }

  try {
    await UserRegisterServer({
      UserName: RegisterfromModel.value.userName.value,
      PassWord: RegisterfromModel.value.passWord.value,
      PhoneNumber: RegisterfromModel.value.phoneNumber.value,
      captchaId: captchaId.value,
      captchaText: RegisterfromModel.value.captchaText.value
    })

    showFrom.value = true
    LoginfromModel.value.userName.value = RegisterfromModel.value.userName.value
    LoginfromModel.value.passWord.value = RegisterfromModel.value.passWord.value
    RegisterfromModel.value.captchaText.value = ""
    fetchCaptcha()
  } catch (error) {
    if (error.response?.status === 429) {
      showToast('注册过于频繁，请1小时后再试', 3000)
    }
    RegisterfromModel.value.captchaText.value = ""
    fetchCaptcha()
  }
}

const captchaId = ref('')
const captchaSvg = ref('')
const captchaType = ref('text')

const fetchCaptcha = async () => {
  try {
    const res = await getCaptcha()
    captchaId.value = res.data.captchaId
    captchaSvg.value = res.data.svg
    captchaType.value = res.data.type || 'text'
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

const captchaPlaceholder = computed(() => {
  return captchaType.value === 'math' ? '请输入计算结果' : '请输入验证码'
})

function toBase64Svg(svg) {
  if (!svg) return ''
  try {
    const encoded = btoa(unescape(encodeURIComponent(svg)))
    return 'data:image/svg+xml;base64,' + encoded
  } catch {
    return ''
  }
}

onMounted(() => fetchCaptcha())

</script>

<template>
  <div class="glitch-form-wrapper">
    <!-- 登录表单 -->
    <form @submit.prevent="login" v-if="showFrom" class="glitch-card">
      <div class="card-header">
        <div class="card-title"><span>用户登陆</span></div>
        <div class="card-title changeBtn" @click="showFrom = !showFrom">
          <span>去注册</span>
        </div>
      </div>

      <div class="card-body">
        <div class="form-group">
          <input
            type="text"
            id="login-username"
            name="username"
            required=""
            placeholder=" "
            v-model="LoginfromModel.userName.value"
          />
          <label for="login-username" class="form-label" data-text="账号">账号</label>
        </div>

        <div class="form-group">
          <input
            type="password"
            id="login-password"
            name="password"
            required=""
            placeholder=" "
            v-model="LoginfromModel.passWord.value"
          />
          <label for="login-password" class="form-label" data-text="密码">密码</label>
        </div>

        <button data-text="登陆" type="submit" class="submit-btn">
          <span class="btn-text">登陆</span>
        </button>
      </div>
    </form>

    <!-- 注册表单 -->
    <form @submit.prevent="register" v-else class="glitch-card">
      <div class="card-header">
        <div class="card-title"><span>用户注册</span></div>
        <div class="card-title changeBtn" @click="showFrom = !showFrom">
          <span>去登陆</span>
        </div>
      </div>

      <div class="card-body">
        <div class="form-group">
          <input
            type="text"
            id="register-username"
            name="username"
            required=""
            placeholder=" "
            v-model="RegisterfromModel.userName.value"
          />
          <label for="register-username" class="form-label" data-text="账号">账号</label>
        </div>

        <div class="form-group">
          <input
            type="password"
            id="register-password"
            name="password"
            required=""
            placeholder=" "
            v-model="RegisterfromModel.passWord.value"
          />
          <label for="register-password" class="form-label" data-text="密码">密码</label>
        </div>

        <div class="form-group">
          <input
            type="password"
            id="register-confirm"
            name="confirmPassword"
            required=""
            placeholder=" "
            v-model="RegisterfromModel.confirmPassWord.value"
          />
          <label for="register-confirm" class="form-label" data-text="确认密码">确认密码</label>
        </div>

        <div class="form-group">
          <input
            type="tel"
            id="register-phone"
            name="phoneNumber"
            required=""
            placeholder=" "
            v-model="RegisterfromModel.phoneNumber.value"
          />
          <label for="register-phone" class="form-label" data-text="电话">电话</label>
        </div>

        <!-- 图形验证码 -->
        <div class="form-group form-group--code">
          <input
            type="text"
            id="register-captcha"
            name="captchaText"
            required=""
            placeholder=" "
            maxlength="6"
            v-model="RegisterfromModel.captchaText.value"
          />
          <label for="register-captcha" class="form-label" data-text="验证码">验证码</label>
          <img
            class="captcha-img"
            :src="toBase64Svg(captchaSvg)"
            alt="验证码"
            title="点击刷新验证码"
            @click="fetchCaptcha"
          />
        </div>

        <button data-text="注册" type="submit" class="submit-btn">
          <span class="btn-text">注册</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.glitch-form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--mg-font);
  background-color: var(--mg-white);
  min-height: 100vh;
}

.glitch-card {
  background-color: var(--mg-white);
  width: 100%;
  max-width: 420px;
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  margin: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--mg-gray);
  padding: 0.8em 1.2em;
  border-bottom: var(--mg-border-light);
}

.card-title {
  color: var(--mg-black);
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-family: var(--mg-font-display);
}

.changeBtn {
  cursor: pointer;
}

.card-body {
  padding: 1.5rem;
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-group input {
  width: 100%;
  background: var(--mg-white);
  border: var(--mg-border-light);
  padding: 0.75em;
  font-size: 1rem;
  color: var(--mg-black);
  font-family: var(--mg-font);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: var(--mg-black);
  box-shadow: var(--mg-shadow-sm);
}

.form-label {
  display: none;
}

.form-group--code {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group--code input {
  flex: 1;
  width: auto;
}

.form-group--code .captcha-img {
  flex-shrink: 0;
  cursor: pointer;
  border: var(--mg-border-light);
  background-color: var(--mg-gray);
  width: 160px;
  height: 50px;
  object-fit: contain;
}

.form-group--code .captcha-img:hover {
  border-color: var(--mg-black);
}

.submit-btn {
  width: 100%;
  padding: 0.8em;
  margin-top: 1rem;
  background-color: var(--mg-black);
  border: var(--mg-border);
  color: var(--mg-white);
  font-family: var(--mg-font-display);
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: var(--mg-shadow-sm);
}

.submit-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow);
}

.submit-btn:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.submit-btn .btn-text {
  position: relative;
}

[data-device="mobile"] .glitch-form-wrapper {
  min-height: 100dvh;
  padding: 0 12px;
}

[data-device="mobile"] .glitch-card {
  max-width: 100%;
  margin: 0.5rem;
}

[data-device="mobile"] .card-body {
  padding: 1rem;
}

[data-device="mobile"] .form-group {
  margin-bottom: 1rem;
}

[data-device="mobile"] .form-group input {
  font-size: 0.9rem;
  padding: 0.6em;
}

[data-device="mobile"] .form-group--code .captcha-img {
  width: 120px;
  height: 40px;
}

[data-device="mobile"] .submit-btn {
  font-size: 0.9rem;
  padding: 0.7em;
}
</style>
