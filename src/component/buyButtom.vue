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
    border: var(--mg-border);
    background-color: var(--mg-gray-dark);
    padding-bottom: 8px;
    transition: 0.1s ease-in-out;
    user-select: none;
    box-shadow: var(--mg-shadow);
  }

  .box-button.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .button {
    background-color: var(--mg-white);
    border: var(--mg-border-light);
    padding: 8px 20px;
  }

  .button span {
    font-size: 1.2em;
    font-family: var(--mg-font);
    font-weight: 600;
    letter-spacing: 1px;
    color: var(--mg-black);
    white-space: nowrap;
    text-transform: uppercase;
  }

  .box-button:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--mg-shadow-hover);
  }

  .box-button:active {
    padding-bottom: 0;
    margin-bottom: 8px;
    transform: translate(2px, 2px);
    box-shadow: var(--mg-shadow-sm);
  }

  [data-device="mobile"] .box-button {
    padding-bottom: 4px;
  }

  [data-device="mobile"] .button {
    padding: 4px 12px;
    border-width: 2px;
  }

  [data-device="mobile"] .button span {
    font-size: 1em;
  }
</style>
