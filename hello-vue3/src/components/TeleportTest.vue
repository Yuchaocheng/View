<template>
<!-- disabled后，移动无效，出现在原来位置 :disabled="true" -->
  <teleport :to="to" >
    <div>
      <h1>我是teleport的内容，我能够瞬移，我现在移动到{{to}}下了</h1>
    </div>
  </teleport>
</template>

<script setup>
const to = 'body';
</script>
