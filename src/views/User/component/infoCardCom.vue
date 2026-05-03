<script setup>
import { useUserStore, useBlindBoxStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ref, provide } from 'vue'
import { UserPutInfoServer } from '@/api/user'

import manageAddress from '@/component/manageAddress.vue'
import addressFrom from '@/component/addressFrom.vue'
import PopupLayerCom from '@/component/PopupLayerCom.vue'
import TooltipsCom from '@/component/TooltipsCom.vue'
import PutFrom from './PutFrom.vue'

import { fileToBase64 } from '@/unit/fileToBase64'
import ToTime from '@/unit/ToTime'
import { formatPrice } from '@/unit/format'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const userStore = useUserStore()
const { clearUser, putUser } = userStore
const blindBoxStore = useBlindBoxStore()
const router = useRouter()

const putCount = ref(0) // 修改标记

defineProps({
  userInfo: Object
})

// 退出登陆
const logOut = () => {
  clearUser()
  blindBoxStore.clearBlindBox()
  router.push('/login')
}

const showPopup = ref(false)  // 弹窗显示标记
const close = () => { showPopup.value = false }

provide('close', close)

// 头像修改
const putAvatar = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件')
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    showToast('图片大小不能超过 10MB')
    return
  }

  const base64 = await fileToBase64(file)

  await UserPutInfoServer({
    Avatar: base64
  })
  putUser()
}

// 地址管理
const openAddressFrom = (value) => {
  putCount.value = value
}
provide('openAddressFrom', openAddressFrom)

// 将要修改的数据传入addressFrom子组件
const putAddress = ref({})
const openPutAddressFrom = (address) => {
  putAddress.value = {
    ...address
  }
  putCount.value = 4
}
provide('openPutAddressFrom', openPutAddressFrom)

</script>

<template>
  <div class="container" v-if="userInfo">
    <!-- 书卡效果 -->
    <div class="book">
      <!-- 反面内容（翻开后显示） -->
      <div class="back-content" v-if="userInfo.CreatedTime">
        <p class="heading" style="font-size: 30px;">修改信息</p>

        <div class="avatar">
          <input @change="putAvatar" class="putInput" type="file">
          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
            <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"></path>
          </svg>
        </div>

        <div class="icons">
          <TooltipsCom @click="showPopup = true, putCount = 0">
            <template #icon>
              <i class="iconfont icon-dianhua1"></i>
            </template>
            <h4>当前电话: {{ userInfo.PhoneNumber }}</h4>
          </TooltipsCom>
          <TooltipsCom @click="showPopup = true, putCount = 1">
            <template #icon>
              <i class="iconfont icon-dizhi"></i>
            </template>
            <h4>当前地址个数: {{ userInfo.Addresses?.length }}</h4>
          </TooltipsCom>
          <TooltipsCom @click="showPopup = true, putCount = 2">
            <template #icon>
              <i class="iconfont icon-mima"></i>
            </template>
            <h4>密码</h4>
          </TooltipsCom>
          <TooltipsCom @click="showPopup = true, putCount = 3">
            <template #icon>
              <i class="iconfont icon-ziyuanxhdpi"></i>
            </template>
            <h4>当前用户名: {{ userInfo.UserName }}</h4>
          </TooltipsCom>
        </div>

        <button @click="logOut" class="boton-elegante">退出登陆</button>
      </div>
      <div v-else class="back-content">
        <h2>暂无权限访问</h2>
      </div>

      <!-- 封面（初始可见） -->
      <div class="cover">
        <div class="card-top">
          <p class="card-top-para">用户信息</p>
        </div>
        <img class="acatar" :src="userInfo.Avatar" alt="" v-if="userInfo.Avatar">
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
          <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"></path>
        </svg>
        <p class="userName"> {{ userInfo.UserName }} </p>
        <p class="userinfo" v-if="userInfo.CreatedTime">用户余额:    {{ formatPrice(userInfo.Balance) }}￥</p>
        <p v-if="userInfo.CreatedTime" class="userinfo">创建时间: {{ ToTime(userInfo.CreatedTime) }}</p>
      </div>
    </div>

    <!-- 弹层信息修改 -->
    <PopupLayerCom v-model:visible="showPopup" @close="close">
      <!-- 管理地址 -->
      <manageAddress
        v-if="putCount === 1"
      />
      <!-- 修改地址 -->
      <addressFrom
        v-else-if="putCount === 4"
        :putAddress="putAddress"
      />
      <PutFrom v-else v-model:visible="showPopup" :putCount="putCount" />
    </PopupLayerCom>
  </div>
</template>

<style scoped>
/* ========== 组件一：书本翻开效果 ========== */
.book {
  position: relative;
  border-radius: 2rem;           /* 与卡片圆角一致 */
  width: 450px;
  height: 700px;
  background-color: transparent; /* 背景由内部元素决定 */
  box-shadow: 0px 0px 10px 5px rgba(255, 255, 255, 0.7);
  transform: preserve-3d;
  perspective: 2000px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
}

.cover {
  top: 0;
  left: 0;
  position: absolute;
  background-color: black;        /* 与卡片正面背景一致 */
  width: 100%;
  height: 100%;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.5s;
  transform-origin: 0;
  box-shadow: 0px 0px 10px 5px rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;         /* 纵向排列内部元素 */
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: white;                   /* 文字颜色 */
}

.book:hover .cover {
  transition: all 0.5s;
  transform: rotateY(-80deg);
}

/* 反面内容容器（翻开后显示） */
.back-content {
  width: 100%;
  height: 100%;
  background: black;
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: white;
  box-shadow: 0px 0px 10px 5px rgba(255, 255, 255, 0.7);
}

/* ========== 组件二原有样式（保留布局、颜色、动画，移除翻转相关） ========== */
.card-top {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 10%;
  width: 50%;
  background-color: transparent;
  border: 2px solid black;
  border-top: none;
  border-radius: 0 0 1rem 1rem;
  box-shadow: 0px 0px 10px 5px rgba(255, 255, 255, 0.7);
}

.card-top-para {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.acatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.userName {
  font-size: 40px;
  font-weight: bold;
  color: white;
}

.userinfo {
  font-size: 20px;
  font-weight: 500;
  margin-top: 10px;
  color: white;
}

.icons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-top: 20px;
}

.icons i {
  color: white;
  font-size: 30px;
}

/* 退出按钮样式 */
.boton-elegante {
  padding: 15px 30px;
  border: 2px solid #2c2c2c;
  background-color: #1a1a1a;
  color: #ffffff;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.4s ease;
  outline: none;
  position: relative;
  overflow: hidden;
  font-weight: bold;
}

.boton-elegante::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  transform: scale(0);
  transition: transform 0.5s ease;
}

.boton-elegante:hover::after {
  transform: scale(4);
}

.boton-elegante:hover {
  border-color: #666666;
  background: #292929;
}

/* 头像修改区域 */
.avatar {
  position: relative;
}
.avatar:hover:before {
  content: '修改头像';
  color: white;
  position: absolute;
  width: 100px;
  transition: all 0.5s ease;
  right: -100px;
  top: 40px;
}
.putInput {
  width: 100px;
  height: 100px;
  position: absolute;
  opacity: 0;
}

/* 其余辅助样式 */
.heading {
  color: white;
}
</style>
