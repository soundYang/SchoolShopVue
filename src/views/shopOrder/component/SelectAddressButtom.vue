<script setup>
defineProps({
  str: {
    type: String,
    default: 'Button'
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button class="button" @click="handleClick">
      <span class="button_lg">
          <span class="button_sl"></span>
          <span class="button_text">{{ str }}</span>
      </span>
  </button>
</template>

<style scoped>
  .button {
    cursor: pointer;
    position: relative;
    padding: 0;
    margin-bottom: 20px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 14px;
    transition: all .15s ease;
    background: none;
    border: none;
    font-family: var(--mg-font);
  }

  .button_lg {
    position: relative;
    display: block;
    padding: 10px 20px;
    color: var(--mg-white);
    background-color: var(--mg-black);
    border: var(--mg-border-light);
    box-shadow: var(--mg-shadow-sm);
  }

  .button_text {
    position: relative;
    font-family: var(--mg-font-mono);
  }

  .button:hover .button_lg {
    transform: translate(-2px, -2px);
    box-shadow: var(--mg-shadow);
  }

  .button:active .button_lg {
    transform: translate(1px, 1px);
    box-shadow: none;
  }
</style>
