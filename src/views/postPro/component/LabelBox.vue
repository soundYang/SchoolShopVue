<script setup>
import { ref, inject, computed } from 'vue'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()
const labels = inject('labels')
const proFrom = inject('proFrom')
const close = inject('close')

const selectedLabels = ref({
  mainLabel: { list: [] },
  attributeLabel: { list: [] },
  hotLabel: { list: [] }
})

const labelEntries = computed(() => Object.entries(selectedLabels.value))

const mainActive = ref('')

const totalCount = computed(() => {
  let count = 0
  for (const [, value] of labelEntries.value) {
    count += value.list.length
  }
  return count
})

const isSelected = (label, key) => {
  if (key === 'mainLabel') return mainActive.value === label
  return selectedLabels.value[key].list.includes(label)
}

const toggleLabel = (label, key) => {
  if (key === 'mainLabel') {
    selectedLabels.value.mainLabel.list = [label]
    mainActive.value = label
    return
  }

  const list = selectedLabels.value[key].list
  if (list.includes(label)) {
    list.splice(list.indexOf(label), 1)
    return
  }

  if (totalCount.value >= 4) {
    return showToast('最多添加四个标签')
  }

  list.push(label)
}

const confirmLabel = () => {
  proFrom.value.shopType = []
  for (const [key, value] of labelEntries.value) {
    if (key === 'mainLabel' && value.list.length === 0) {
      return showToast('请选择主标签')
    }
    if (value.list.length > 0) {
      proFrom.value.shopType.push(...value.list)
    }
  }
  close()
}
</script>

<template>
  <form class="form">
    <div class="title">选择标签<br><span>Select Tag</span></div>

    <div v-for="([key, value]) in labelEntries" :key="key">
      <h3>{{ labels[key]?.name }}</h3>
      <ul id="mainLable">
        <li
          v-for="label in labels[key]?.items"
          :key="label"
          :class="{ active: isSelected(label, key) }"
          @click="toggleLabel(label, key)"
        >
          {{ label }}
        </li>
      </ul>
    </div>

    <button class="button-confirm" @click.prevent="confirmLabel">确定</button>
  </form>
</template>

<style scoped>
  .form {
    padding: 20px;
    background: var(--mg-white);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border: var(--mg-border);
    box-shadow: var(--mg-shadow);
  }

  .title {
    color: var(--mg-black);
    font-weight: 900;
    font-size: 20px;
    margin-bottom: 25px;
    font-family: var(--mg-font-display);
  }

  .title span {
    color: var(--mg-black);
    font-weight: 600;
    font-size: 17px;
    font-family: var(--mg-font);
  }

  h3 {
    font-family: var(--mg-font);
    color: var(--mg-black);
    margin-bottom: 8px;
  }

  .input {
    width: 250px;
    height: 40px;
    border: var(--mg-border-light);
    background-color: var(--mg-white);
    box-shadow: var(--mg-shadow-sm);
    font-size: 15px;
    font-weight: 600;
    color: var(--mg-black);
    padding: 5px 10px;
    outline: none;
    font-family: var(--mg-font);
  }

  .input::placeholder {
    color: var(--mg-black);
    opacity: 0.8;
  }

  .input:focus {
    border-color: var(--mg-black);
    box-shadow: var(--mg-shadow-sm);
  }

  .button-confirm {
    margin: 50px auto 0 auto;
    width: 120px;
    height: 40px;
    border: var(--mg-border-light);
    background-color: var(--mg-black);
    box-shadow: var(--mg-shadow-sm);
    font-size: 17px;
    font-weight: 600;
    color: var(--mg-white);
    cursor: pointer;
    font-family: var(--mg-font);
  }

  .button-confirm:hover {
    transform: translate(-2px, -2px);
    box-shadow: var(--mg-shadow);
  }

  .button-confirm:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  ul{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  li {
    font-family: var(--mg-font);
    color: var(--mg-black);
    border: var(--mg-border-light);
    padding: 4px 12px;
    cursor: pointer;
    box-shadow: var(--mg-shadow-sm);
  }

  li:hover {
    transform: translate(-1px, -1px);
    box-shadow: var(--mg-shadow);
  }

  li:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  .active{
    background: var(--mg-black);
    color: var(--mg-white);
  }
</style>
