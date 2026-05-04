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
/* --- Root Variables --- */
.glitch-form-wrapper {
  --bg-color: #0d0d0d;
  --primary-color: #00f2ea;
  --secondary-color: #a855f7;
  --text-color: #e5e5e5;
  --font-family: "Fira Code", Consolas, "Courier New", Courier, monospace;
  --glitch-anim-duration: 0.5s;
}

.glitch-form-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-family);
  background-color: #050505;
  min-height: 100vh;
}

/* --- Card --- */
.glitch-card {
  background-color: var(--bg-color);
  width: 100%;
  max-width: 380px;
  border: 1px solid rgba(0, 242, 234, 0.2);
  box-shadow: 0 0 20px rgba(0, 242, 234, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  margin: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.5em 1em;
  border-bottom: 1px solid rgba(0, 242, 234, 0.2);
}

.card-title {
  color: var(--primary-color);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.changeBtn {
  cursor: pointer;
}

.card-body {
  padding: 1.5rem;
}

/* --- Form Group Base --- */
.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-group input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(0, 242, 234, 0.3);
  padding: 0.75em 0;
  font-size: 1rem;
  color: var(--text-color);
  font-family: inherit;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: var(--primary-color);
}

/* --- Floating Label --- */
.form-label {
  position: absolute;
  top: 0.75em;
  left: 0;
  font-size: 1rem;
  color: var(--primary-color);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  pointer-events: none;
  transition: all 0.3s ease;
}

.form-group input:focus + .form-label,
.form-group input:not(:placeholder-shown) + .form-label {
  top: -1.2em;
  font-size: 0.8rem;
  opacity: 1;
}

/* Glitch effect on label when input focused */
.form-group input:focus + .form-label::before,
.form-group input:focus + .form-label::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
}

.form-group input:focus + .form-label::before {
  color: var(--secondary-color);
  animation: glitch-anim var(--glitch-anim-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.form-group input:focus + .form-label::after {
  color: var(--primary-color);
  animation: glitch-anim var(--glitch-anim-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
}

@keyframes glitch-anim {
  0% { transform: translate(0); clip-path: inset(0 0 0 0); }
  20% { transform: translate(-5px, 3px); clip-path: inset(50% 0 20% 0); }
  40% { transform: translate(3px, -2px); clip-path: inset(20% 0 60% 0); }
  60% { transform: translate(-4px, 2px); clip-path: inset(80% 0 5% 0); }
  80% { transform: translate(4px, -3px); clip-path: inset(30% 0 45% 0); }
  100% { transform: translate(0); clip-path: inset(0 0 0 0); }
}

/* --- Special Form Group for Verification Code (input + button inline) --- */
.form-group--code {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group--code input {
  flex: 1;
  width: auto; /* override width:100% */
}

/* Captcha image style */
.form-group--code .captcha-img {
  flex-shrink: 0;
  cursor: pointer;
  border: 1px solid rgba(0, 242, 234, 0.3);
  border-radius: 4px;
  background-color: #1a1a1a;
  width: 160px;
  height: 50px;
  object-fit: contain;
}

.form-group--code .captcha-img:hover {
  border-color: var(--primary-color);
}

/* Ensure label stays left-aligned (relative to the whole group) */
.form-group--code .form-label {
  left: 0;
}

/* --- Submit Button --- */
.submit-btn {
  width: 100%;
  padding: 0.8em;
  margin-top: 1rem;
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  overflow: hidden;
}

.submit-btn:hover,
.submit-btn:focus {
  background-color: var(--primary-color);
  color: var(--bg-color);
  box-shadow: 0 0 25px var(--primary-color);
  outline: none;
}

.submit-btn:active {
  transform: scale(0.97);
}

/* Glitch effect on button hover */
.submit-btn .btn-text {
  position: relative;
  z-index: 1;
  transition: opacity 0.2s ease;
}

.submit-btn:hover .btn-text {
  opacity: 0;
}

.submit-btn::before,
.submit-btn::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  background-color: var(--primary-color);
  transition: opacity 0.2s ease;
}

.submit-btn:hover::before,
.submit-btn:focus::before {
  opacity: 1;
  color: var(--secondary-color);
  animation: glitch-anim var(--glitch-anim-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.submit-btn:hover::after,
.submit-btn:focus::after {
  opacity: 1;
  color: var(--bg-color);
  animation: glitch-anim var(--glitch-anim-duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both;
}

/* --- Reduced motion --- */
@media (prefers-reduced-motion: reduce) {
  .form-group input:focus + .form-label::before,
  .form-group input:focus + .form-label::after,
  .submit-btn:hover::before,
  .submit-btn:focus::before,
  .submit-btn:hover::after,
  .submit-btn:focus::after {
    animation: none;
    opacity: 0;
  }

  .submit-btn:hover .btn-text {
    opacity: 1;
  }
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
  padding: 0.6em 0;
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
