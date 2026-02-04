<template>
  <div class="app-main-container">
    <router-view />
    <AppFooter v-if="isPublicRoute" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppFooter from './views/AppFooter.vue';

const route = useRoute();
// Mostra o rodapé do App.vue apenas se não estiver nos layouts complexos
const isPublicRoute = computed(() => {
  const publicPages = ['Login', 'RecuperarSenha', 'ResetSenha', 'FormAtivacao', 'TermosUso', 'PoliticaPrivacidade'];
  return publicPages.includes(route.name);
});
</script>

<style>
.app-main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>