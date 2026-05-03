<script setup>
defineProps({
  str: {
    type: String,
    default: 'Button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <div class="box-button" :class="{ 'is-disabled': disabled }" @click="!disabled && handleClick()">
    <div class="button"><span>{{ str }}</span></div>
  </div>
</template>

<style scoped>
  .box-button {
    cursor: pointer;
    width: fit-content;
    border: 4px solid black;
    background-color: gray;
    padding-bottom: 10px;
    transition: 0.1s ease-in-out;
    user-select: none;
  }

  .box-button.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .button {
    background-color: #dddddd;
    border: 4px solid #fff;
    padding: 6px 16px;
  }

  .button span {
    font-size: 1.2em;
    letter-spacing: 1px;
    color: black;
    white-space: nowrap;
  }

  .box-button:active {
    padding: 0;
    margin-bottom: 10px;
    transform: translateY(10px);
  }
</style>
