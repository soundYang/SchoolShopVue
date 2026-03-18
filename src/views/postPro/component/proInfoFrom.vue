<script setup>

</script>

<template>
  <div>
    <form class="form">
      <div class="title">商品信息<br><span>Product Information</span></div>
      <input placeholder="商品名称" name="proName" class="input" type="text">
      <input placeholder="商品价格" name="proName" class="input" type="text">
      <input placeholder="商品估值" name="proName" class="input" type="text">
      <input placeholder="商品数量" name="proName" class="input" type="text">
      <textarea placeholder="商品信息" name="proName" class="input proMsg" type="text"></textarea>
      <label class="custom-checkbox">
        <span style="margin-right: 20px;">是否允许为盲盒</span>
        <input name="dummy" type="checkbox">
        <span class="checkmark"></span>
      </label>
    </form>
  </div>
</template>

<style scoped>
/* 表单 */
.form {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --main-color: #323232;
    padding: 20px;
    background: lightgrey;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  .title {
    color: var(--font-color);
    font-weight: 900;
    font-size: 20px;
    margin-bottom: 25px;
  }

  .title span {
    color: var(--font-color-sub);
    font-weight: 600;
    font-size: 17px;
  }

  .input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }

  .input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .input:focus {
    border: 2px solid var(--input-focus);
  }

  .proMsg{
    width: 300px;
  }

/* 单选框样式 */
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
  color: #333;
  transition: color 0.3s;
}

.custom-checkbox input[type="checkbox"] {
  display: none;
}

.custom-checkbox .checkmark {
  width: 24px;
  height: 24px;
  border: 2px solid #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  transition: background-color 0.3s, border-color 0.3s, transform 0.3s;
  transform-style: preserve-3d;
}

.custom-checkbox .checkmark::before {
  content: "\2713";
  font-size: 16px;
  color: transparent;
  transition: color 0.3s, transform 0.3s;
}

.custom-checkbox input[type="checkbox"]:checked + .checkmark {
  background-color: #333;
  border-color: #333;
  transform: scale(1.1) rotateZ(360deg) rotateY(360deg);
}

.custom-checkbox input[type="checkbox"]:checked + .checkmark::before {
  color: #fff;
}

.custom-checkbox:hover {
  color: #666;
}

.custom-checkbox:hover .checkmark {
  border-color: #666;
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.custom-checkbox input[type="checkbox"]:focus + .checkmark {
  box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.2);
  outline: none;
}

.custom-checkbox .checkmark,
.custom-checkbox input[type="checkbox"]:checked + .checkmark {
  transition: background-color 1.3s, border-color 1.3s, color 1.3s, transform 0.3s;
}

</style>
