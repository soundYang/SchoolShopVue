<script setup>
import { strToArr } from '@/unit/StringToArray'
const props = defineProps({
  str: String
})

const arrStr = strToArr(props.str)
</script>

<template>
  <div class="btn-wrapper">
    <button class="btn">
      <svg class="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
        />
      </svg>

      <div class="txt-wrapper">
        <div class="txt-1">
          <span
            class="btn-letter"
            v-for="(item, index) in arrStr"
            :key="index"
            :style="{ '--delay': index }"
          >
            {{ item }}
          </span>
        </div>
        <div class="txt-2">
          <span
            class="btn-letter"
            v-for="(item, index) in arrStr"
            :key="index"
            :style="{ '--delay': index }"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>
.btn-wrapper {
  position: relative;
  display: inline-block;
}

.btn {
  user-select: none;
  display: flex;
  justify-content: center;
  padding: 0.5em 0.7em 0.5em 0.7em;
  font-family: var(--mg-font);
  font-size: 1em;
  font-weight: 600;
  background-color: var(--mg-white);
  border: var(--mg-border);
  border-radius: 0;
  box-shadow: var(--mg-shadow);
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--mg-black);
  letter-spacing: 1px;
}

.btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mg-shadow-hover);
}

.btn:active {
  transform: translate(3px, 3px);
  box-shadow: none;
}

.btn-svg {
  height: 20px;
  margin-right: 0.3rem;
  fill: var(--mg-black);
}

.txt-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.txt-1,
.txt-2 {
  position: absolute;
  word-spacing: -1em;
}

.txt-1 {
  position: static;
}

.txt-2 {
  display: none;
}

.btn-letter {
  display: inline-block;
  color: var(--mg-black);
}
</style>