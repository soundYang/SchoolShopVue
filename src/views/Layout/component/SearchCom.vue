<template>
  <div class="container_chat_bot">
    <div class="container-chat-options">
      <div class="chat">
        <div class="chat-bot">
          <textarea
            id="chat_bot"
            name="chat_bot"
            placeholder="今天的你想要淘点什么"
          ></textarea>
        </div>
        <div class="options">
          <button class="btn-submit">
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
  max-width: 800px;
  width: 100%;
}

.container_chat_bot .container-chat-options {
  position: relative;
  display: flex;
  background: linear-gradient(
    to bottom right,
    #7e7e7e,
    #363636,
    #363636,
    #363636,
    #363636
  );
  border-radius: 16px;
  padding: 1.5px;
  overflow: hidden;

  &::after {
    position: absolute;
    content: "";
    top: -10px;
    left: -10px;
    background: radial-gradient(
      ellipse at center,
      #ffffff,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.1),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0)
    );
    width: 30px;
    height: 30px;
    filter: blur(1px);
  }
}

.container_chat_bot .container-chat-options .chat {
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  width: 100%;
  overflow: hidden;
}

.container_chat_bot .container-chat-options .chat .chat-bot {
  position: relative;
  display: flex;
}

.container_chat_bot .chat .chat-bot textarea {
  background-color: transparent;
  border-radius: 16px;
  border: none;
  width: 100%;
  height: 50px;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 12px;
  font-weight: 400;
  padding: 10px;
  resize: none;
  outline: none;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
    cursor: pointer;
  }

  &::placeholder {
    color: #f3f6fd;
    transition: all 0.3s ease;
  }
  &:focus::placeholder {
    color: #363636;
  }
}

/* 修改 .options 布局，使提交按钮靠右 */
.container_chat_bot .chat .options {
  display: flex;
  justify-content: flex-end;  /* 原为 space-between，现改为右对齐 */
  align-items: flex-end;
  padding: 10px;
}

/* 已删除 .btns-add 相关样式 */

.container_chat_bot .chat .options .btn-submit {
  display: flex;
  padding: 2px;
  background-image: linear-gradient(to top, #292929, #555555, #292929);
  border-radius: 10px;
  box-shadow: inset 0 6px 2px -4px rgba(255, 255, 255, 0.5);
  cursor: pointer;
  border: none;
  outline: none;
  transition: all 0.15s ease;

  & i {
    width: 30px;
    height: 30px;
    padding: 6px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    backdrop-filter: blur(3px);
    color: #8b8b8b;
  }
  & svg {
    transition: all 0.3s ease;
  }
  &:hover svg {
    color: #f3f6fd;
    filter: drop-shadow(0 0 5px #ffffff);
  }

  &:focus svg {
    color: #f3f6fd;
    filter: drop-shadow(0 0 5px #ffffff);
    transform: scale(1.2) rotate(45deg) translateX(-2px) translateY(1px);
  }

  &:active {
    transform: scale(0.92);
  }
}

.container_chat_bot .tags {
  padding: 14px 0;
  display: flex;
  color: #ffffff;
  font-size: 10px;
  gap: 4px;

  & span {
    padding: 4px 8px;
    background-color: #1b1b1b;
    border: 1.5px solid #363636;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
  }
}
</style>