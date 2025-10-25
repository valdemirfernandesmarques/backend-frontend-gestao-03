<!-- frontend/src/components/SidebarSuperAdmin.vue -->
<template>
  <nav class="sidebar-super-admin">
    <div class="logo">
      <h2>SUPER ADMIN</h2>
    </div>
    <ul class="menu">
      <li>
        <router-link to="/super/isencao-taxa">Isenção de Taxa</router-link>
      </li>
      <li>
        <router-link to="/super/escolas">Gestão de Escolas</router-link>
      </li>
      <li>
        <router-link to="/super/usuarios">Gestão de Usuários</router-link>
      </li>
      <li>
        <router-link to="/super/modalidades">Gestão de Modalidades</router-link>
      </li>
      <li>
        <router-link to="/super/relatorios">Relatórios</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'SidebarSuperAdmin'
}
</script>

<style scoped>
.sidebar-super-admin {
  width: 220px;
  background-color: #0d124a;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
}

.logo {
  margin-bottom: 30px;
  text-align: center;
}

.logo h2 {
  font-size: 18px;
  font-weight: bold;
}

.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  margin-bottom: 15px;
}

.menu li a {
  color: white;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 12px;
  display: block;
  border-radius: 6px;
  transition: background 0.3s;
}

.menu li a:hover {
  background-color: #1a1f6e;
}
</style>
