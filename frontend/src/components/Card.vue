<template>
  <div class="card">
    <h2>{{ title }}</h2>
    <p v-if="value !== undefined" class="number">{{ value }}</p>
    <slot></slot>
    <span v-if="description">{{ description }}</span>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: String,
    value: [String, Number],
    description: String
  }
}
</script>

<style scoped>
.card {
  background: #141b5a;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.4);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0px 8px 20px rgba(0,0,0,0.6);
}

.card h2 {
  font-size: 16px;
  margin-bottom: 10px;
}

.card .number {
  font-size: 28px;
  font-weight: bold;
  margin: 10px 0;
}

.card span {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: #ddd;
}
</style>
