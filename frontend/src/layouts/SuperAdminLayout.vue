<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>Gestão <span>em</span> Dança</h1>
      </div>

      <ul class="menu">
        <li :class="{ active: $route.path.endsWith('/dashboard') }">
          <router-link to="/super/dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</router-link>
        </li>
        <li :class="{ active: $route.path.includes('/alunos') }">
          <router-link to="/super/alunos"><i class="fas fa-users"></i> Alunos</router-link>
        </li>
        <li :class="{ active: $route.path.includes('/turmas') }">
          <router-link to="/super/turmas"><i class="fas fa-calendar-alt"></i> Turmas e Agenda</router-link>
        </li>
        <li :class="{ active: $route.path.includes('/financeiro') }">
          <router-link to="/super/financeiro"><i class="fas fa-hand-holding-dollar"></i> Financeiro</router-link>
        </li>
        <li :class="{ active: $route.path.includes('/professores') }">
          <router-link to="/super/professores"><i class="fas fa-chalkboard-teacher"></i> Professores</router-link>
        </li>
        <li :class="{ active: $route.path.includes('/comunicacao') }">
          <router-link to="/super/comunicacao"><i class="fas fa-bullhorn"></i> Comunicação</router-link>
        </li>
        <li :class="{ active: $route.path.includes('/relatorios') }">
          <router-link to="/super/relatorios"><i class="fas fa-chart-pie"></i> Relatórios</router-link>
        </li>
      </ul>

      <div class="sidebar-footer">
        <router-link to="/super/configuracoes"><i class="fas fa-cog"></i> Configurações</router-link>
        <a href="#" @click.prevent="logout"><i class="fas fa-sign-out-alt"></i> Sair</a>
      </div>
    </aside>

    <main class="main-content">
      <header class="main-header">
        <h2>Seja bem-vindo, SUPER_ADMIN!</h2>
        <div class="user-profile">
          <img src="https://i.pravatar.cc/40" alt="Foto do Usuário">
        </div>
      </header>

      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  router.push("/login");
};
</script>

<style scoped>
/* Estilos que são EXCLUSIVOS e se aplicam APENAS a este componente podem ficar aqui.
   Estilos de layout geral (fundo, cores, menu) devem ficar no arquivo CSS global. */
</style>