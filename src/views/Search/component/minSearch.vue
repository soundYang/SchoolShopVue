<script setup>
import { inject } from 'vue'

defineProps({
  searchMessage: String
})

const emit = defineEmits(['update:searchMessage'])
const handleInput = e => {
  emit('update:searchMessage', e.target.value)
}

const goSearchPage = inject('goSearchPage')
const putMsg = inject('putMsg')
putMsg()
</script>

<template>
  <div class="container-input">
    <input
      type="text"
      placeholder="Search the internet..."
      name="text"
      class="input"
      maxlength="20"
      :value="searchMessage"
      @input="handleInput"
      @keyup.enter="goSearchPage()"
    />
    <i class="iconfont icon-sousuo"></i>
  </div>
</template>

<style scoped>
.container-input {
  position: relative;
}

.input {
  width: 150px;
  padding: 10px 0px 10px 40px;
  border: var(--mg-border-light);
  transition: all .2s ease-in-out;
  outline: none;
  background: var(--mg-white);
  color: var(--mg-black);
  font-family: var(--mg-font);
}

.container-input i{
  color: var(--mg-black);
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translate(0, -50%);
}

.input:focus {
  width: 250px;
  box-shadow: var(--mg-shadow-sm);
}
</style>
