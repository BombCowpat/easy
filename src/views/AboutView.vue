<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input ref="input" />
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const input = ref(null)

    onMounted(() => {
      input.value.focus()
    })
    return {
      input,
    }
  },
}
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
