<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const router = useRouter()

const searchMessage = ref('')

const goSearchPage = () => {
  if(searchMessage.value.trim() === '') {
    return showToast('请输入搜索内容')
  }

  router.push({
    path: '/search',
    query: {
      key: searchMessage.value
    }
  })
}
</script>

<template>
  <div class="container_chat_bot">
    <div class="container-chat-options">
      <div class="chat">
        <div class="chat-bot">
          <textarea
            id="chat_bot"
            name="chat_bot"
            placeholder="今天的你想要淘点什么"
            v-model="searchMessage"
            @keyup.enter="goSearchPage"
          ></textarea>
        </div>
        <div class="options">
          <button @click="goSearchPage" class="btn-submit">
            <i>
              <svg viewBox="0 0 512 512">
                <path
                  fill="currentColor"
                  d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05"
                ></path>
              </svg>
            </i>
          </button>
        </div>
      </div>
    </div>
    <div class="tags">
      <span>每日推荐</span>
      <span>爆款产品</span>
      <span>盲盒</span>
    </div>
  </div>
</template>

<style>
.container_chat_bot {
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: 100%;
}

.container_chat_bot .container-chat-options {
  position: relative;
  display: flex;
  background: var(--mg-white);
  border: var(--mg-border);
  box-shadow: var(--mg-shadow);
  padding: 2px;
  overflow: hidden;
}

.container_chat_bot .container-chat-options .chat {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: var(--mg-white);
  width: 100%;
  overflow: hidden;
  gap: 8px;
}

.container_chat_bot .container-chat-options .chat .chat-bot {
  position: relative;
  display: flex;
  flex: 1;
}

.container_chat_bot .chat .chat-bot textarea {
  background-color: var(--mg-white);
  border: none;
  width: 100%;
  height: 50px;
  color: var(--mg-black);
  font-family: var(--mg-font);
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  resize: none;
  outline: none;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--mg-gray-dark);
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--mg-black);
    cursor: pointer;
  }

  &::placeholder {
    color: var(--mg-gray-dark);
    font-weight: 400;
    transition: all 0.3s ease;
  }
  &:focus::placeholder {
    color: transparent;
  }
}

.container_chat_bot .chat .options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 4px 10px 4px 0;
}

.container_chat_bot .chat .options .btn-submit {
  display: flex;
  padding: 0;
  background: var(--mg-black);
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.15s ease;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;

  & i {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mg-white);
  }
  & svg {
    transition: all 0.15s ease;
  }
  &:hover {
    background: var(--mg-white);
    border: var(--mg-border-light);
  }
  &:hover svg {
    color: var(--mg-black);
  }
}

.container_chat_bot .tags {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.container_chat_bot .tags span {
  font-family: var(--mg-font);
  font-size: 13px;
  font-weight: 600;
  color: var(--mg-black);
  border: var(--mg-border-light);
  padding: 4px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.container_chat_bot .tags span:hover {
  background: var(--mg-black);
  color: var(--mg-white);
}

[data-device="mobile"] .container_chat_bot .chat .chat-bot textarea {
  height: 40px;
  font-size: 12px;
  padding: 8px 12px;
}
[data-device="mobile"] .container_chat_bot .chat .options .btn-submit {
  width: 32px;
  height: 32px;
}
[data-device="mobile"] .container_chat_bot .tags {
  gap: 8px;
}
[data-device="mobile"] .container_chat_bot .tags span {
  font-size: 11px;
  padding: 3px 10px;
}
</style>
