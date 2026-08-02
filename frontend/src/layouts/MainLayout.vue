<!-- frontend/src/layouts/MainLayout.vue -->
<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <nav class="sidebar">
      <div class="sidebar-header">
        <h1>Gestão <span>em</span> Dança</h1>
      </div>

      <ul class="menu">
        <li>
          <router-link :to="dashboardRoute">
            <i class="fas fa-tachometer-alt"></i> Dashboard
          </router-link>
        </li>

        <!-- SUPER_ADMIN Menus -->
        <template v-if="isSuperAdmin">
          <li><router-link to="/super/isencao-taxa"><i class="fas fa-percent"></i> Isenção de Taxa</router-link></li>
        </template>

        <!-- ADMIN_ESCOLA Menus -->
        <template v-if="isAdminEscola">
          <li><router-link to="/escola/alunos"><i class="fas fa-users"></i> Alunos</router-link></li>
          <li><router-link to="/escola/professores"><i class="fas fa-chalkboard-teacher"></i> Professores</router-link></li>
          <li><router-link to="/escola/turmas"><i class="fas fa-calendar-alt"></i> Turmas e Agenda</router-link></li>
          <li><router-link to="/escola/pagamentos"><i class="fas fa-hand-holding-dollar"></i> Financeiro</router-link></li>
          <li><router-link to="/escola/produtos"><i class="fas fa-box"></i> Produtos</router-link></li>
          <li><router-link to="/escola/matriculas"><i class="fas fa-user-plus"></i> Matrículas</router-link></li>
        </template>
      </ul>

      <div class="sidebar-footer">
        <router-link :to="configRoute"><i class="fas fa-cog"></i> Configurações</router-link>
        <router-link to="/logout"><i class="fas fa-sign-out-alt"></i> Sair</router-link>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <header class="main-header">
        <h2>Seja bem-vindo, {{ userName }}!</h2>
      </header>

      <section class="main-view">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "MainLayout",
  props: {
    userName: { type: String, default: "Usuário" },
    userRole: { type: String, default: "ADMIN_ESCOLA" }
  },
  computed: {
    isSuperAdmin() { return this.userRole === "SUPER_ADMIN"; },
    isAdminEscola() { return this.userRole === "ADMIN_ESCOLA"; },
    dashboardRoute() { return this.isSuperAdmin ? "/super" : "/escola"; },
    configRoute() { return this.isSuperAdmin ? "/super/config" : "/escola/config"; }
  }
};
</script>

<style scoped>
.dashboard-container { display: flex; height: 100vh; font-family: 'Poppins', sans-serif; background-color: #0d124a; color: white; }
.sidebar { width: 240px; background-color: #141b5a; display: flex; flex-direction: column; justify-content: space-between; }
.sidebar-header { padding: 20px; text-align: center; font-size: 1.5rem; font-weight: bold; color: #fff; }
.menu { list-style: none; padding: 0; margin: 0; flex: 1; }
.menu li { padding: 12px 20px; }
.menu li a { color: white; text-decoration: none; display: flex; align-items: center; }
.menu li a i { margin-right: 10px; }
.menu li a.router-link-active { background-color: #1f2a7a; border-radius: 8px; }
.sidebar-footer { padding: 20px; display: flex; flex-direction: column; }
.main-content { flex: 1; padding: 20px; overflow-y: auto; }
.main-header { margin-bottom: 20px; }
.main-header h2 { font-size: 24px; margin: 0; }
.main-view { display: flex; flex-direction: column; gap: 20px; }
</style>
