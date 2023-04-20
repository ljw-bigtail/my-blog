---
title: MD / 插件 语法
publish: false
---

```html [index.html]
<style>
  h2 {
    color: red;
  }
</style>

<div>
  <h2>这是一个 Demo</h2>
  <button id="btn">点击 0</button>
</div>

<script>
  let num = 1
  const btn = document.querySelector('#btn')
  btn.addEventListener('click', e => {
    btn.innerHTML = '点击 ' + num++
  })
</script>
```
