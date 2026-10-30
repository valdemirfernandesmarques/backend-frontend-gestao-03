<template>
  <div class="dashboard-container">
    <button class="mobile-menu-toggle" @click="toggleSidebar">
      <i :class="isSidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
    </button>

    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <aside class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <h1>Gestão <span>em</span> Dança</h1>
      </div>

      <ul class="menu">
        <li :class="{ active: $route.path.endsWith('/dashboard') }">
          <router-link to="/super/dashboard" @click="closeSidebar"><i class="fas fa-tachometer-alt"></i> Dashboard</router-link>
        </li>
        <li :class="{ active: $route.path.includes('/alunos') }">
         <!--<router-link to="/super/alunos" @click="closeSidebar"><i class="fas fa-users"></i> Alunos</router-link> -->
        </li>
        <li :class="{ active: $route.path.includes('/turmas') }">
         <!-- <router-link to="/super/turmas" @click="closeSidebar"><i class="fas fa-calendar-alt"></i> Turmas e Agenda</router-link> -->
        </li>
        <li :class="{ active: $route.path.includes('/financeiro') }">
          <router-link to="/super/financeiro" @click="closeSidebar"><i class="fas fa-hand-holding-dollar"></i> Financeiro</router-link>
        </li>
        <li :class="{ active: $route.path.includes('/professores') }">
         <!-- <router-link to="/super/professores" @click="closeSidebar"><i class="fas fa-chalkboard-teacher"></i> Professores</router-link> -->
        </li>
        <li :class="{ active: $route.path.includes('/comunicacao') }">
         <!-- <router-link to="/super/comunicacao" @click="closeSidebar"><i class="fas fa-bullhorn"></i> Comunicação</router-link> -->
        </li>
        <li :class="{ active: $route.path.includes('/relatorios') }">
         <!-- <router-link to="/super/relatorios" @click="closeSidebar"><i class="fas fa-chart-pie"></i> Relatórios</router-link> -->
        </li>
      </ul>

      <div class="sidebar-footer">
       <!-- <router-link to="/super/configuracoes" @click="closeSidebar"><i class="fas fa-cog"></i> Configurações</router-link> -->
        <a href="#" @click.prevent="logout"><i class="fas fa-sign-out-alt"></i> Sair</a>
      </div>
    </aside>

    <main class="main-content">
      <header class="main-header">
        <h2 class="welcome-text">Seja bem-vindo, SUPER_ADMIN!</h2>
        <div class="user-profile">
          <img src="https://i.pravatar.cc/40" alt="Foto do Usuário">
        </div>
      </header>

      <div class="page-content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  router.push("/login");
};
</script>

<style scoped>
/* ESTRUTURA BASE */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #0f172a;
}

/* SIDEBAR (Desktop) */
.sidebar {
  width: 260px;
  background: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 1001;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #334155;
}

.sidebar-header h1 {
  font-size: 1.2rem;
  font-weight: bold;
}

.sidebar-header span {
  color: #ff3c78;
}

.menu {
  flex: 1;
  list-style: none;
  padding: 20px 0;
}

.menu li {
  padding: 2px 20px;
}

.menu li a {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 8px;
  transition: 0.2s;
}

.menu li.active a, .menu li a:hover {
  background: #334155;
  color: #ff3c78;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #334155;
}

.sidebar-footer a {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
  text-decoration: none;
  padding: 10px;
  font-size: 0.9rem;
}

/* CONTEÚDO PRINCIPAL */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Evita quebra de grid */
}

.main-header {
  height: 70px;
  background: #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  border-bottom: 1px solid #334155;
}

.welcome-text {
  color: #fff;
  font-size: 1.1rem;
}

.user-profile img {
  border-radius: 50%;
  border: 2px solid #ff3c78;
}

.page-content {
  padding: 20px;
  overflow-y: auto;
}

/* --- RESPONSIVIDADE (MEDIA QUERIES) --- */

/* Botão Hambúrguer oculto no Desktop */
.mobile-menu-toggle {
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1002;
  background: #ff3c78;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

@media (max-width: 1024px) {
  .mobile-menu-toggle {
    display: block;
  }

  /* Sidebar flutuante no Mobile/Tablet */
  .sidebar {
    position: fixed;
    left: -260px; /* Escondida por padrão */
    top: 0;
    bottom: 0;
  }

  .sidebar.sidebar-open {
    left: 0; /* Desliza para dentro */
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1000;
  }

  .main-header {
    padding-left: 70px; /* Espaço para o botão hambúrguer */
  }

  .welcome-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .welcome-text {
    display: none; /* Esconde texto de boas vindas em celulares muito pequenos */
  }
  
  .main-header {
    justify-content: flex-end;
  }

  .page-content {
    padding: 10px;
  }
}
</style>