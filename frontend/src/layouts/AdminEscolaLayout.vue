<template>
  <div class="dashboard-container">
    <button class="mobile-menu-toggle" @click="toggleSidebar">
      <i :class="isSidebarOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
    </button>

    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <nav class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header" @click="handleLogoClick">
        <div class="logo-upload-container">
          <img v-if="logoUrl" :src="logoUrl" alt="Logotipo da Escola" class="school-logo" />
          <h1 v-else>Gestão <span>em</span> Dança</h1>
          <i class="fas fa-camera upload-icon"></i>
          <input
            type="file"
            ref="logoFileInput"
            @change="handleFileChange"
            accept="image/*"
            style="display: none;"
          />
        </div>
      </div>

      <ul class="menu">
        <li :class="{ active: $route.path === '/escola' }">
          <router-link to="/escola" @click="closeSidebar"><i class="fas fa-tachometer-alt"></i> Dashboard</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/alunos') }">
          <router-link to="/escola/alunos" @click="closeSidebar"><i class="fas fa-users"></i> Alunos</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/turmas') }">
          <router-link to="/escola/turmas" @click="closeSidebar"><i class="fas fa-calendar-alt"></i> Turmas e Agenda</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/matriculas') }">
          <router-link to="/escola/matriculas" @click="closeSidebar"><i class="fas fa-user-plus"></i> Matrículas</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/professores') }">
          <router-link to="/escola/professores" @click="closeSidebar"><i class="fas fa-chalkboard-teacher"></i> Professores</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/funcionarios') }">
          <router-link to="/escola/funcionarios" @click="closeSidebar"><i class="fas fa-users-cog"></i> Funcionários</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/modalidades') }">
          <router-link to="/escola/modalidades" @click="closeSidebar"><i class="fas fa-palette"></i> Modalidades</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/pagamentos') }">
          <router-link to="/escola/pagamentos" @click="closeSidebar"><i class="fas fa-hand-holding-dollar"></i> Financeiro</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/vendas') }">
          <router-link to="/escola/vendas" @click="closeSidebar"><i class="fas fa-store"></i> Vendas</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/comissoes') }">
          <router-link to="/escola/comissoes" @click="closeSidebar"><i class="fas fa-percentage"></i> Comissão</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/mensalidades') }">
          <router-link to="/escola/mensalidades" @click="closeSidebar"><i class="fas fa-calendar-check"></i> Mensalidade</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/relatorios') }">
          <router-link to="/escola/relatorios" @click="closeSidebar"><i class="fas fa-chart-line"></i> Relatório</router-link>
        </li>
      </ul>

      <div class="sidebar-footer">
        <a href="#" @click.prevent="logout"><i class="fas fa-sign-out-alt"></i> Sair</a>
      </div>
    </nav>

    <main class="main-content">
      <header class="main-header">
        <h2 class="welcome-text">Seja bem-vindo(a), {{ userName }}!</h2>
        <div class="user-profile">
          <img v-if="logoUrl" :src="logoUrl" alt="Logo da Escola" class="user-avatar-img" />
          <div v-else class="user-avatar-placeholder">
            <i class="fas fa-user"></i>
          </div>
        </div>
      </header>

      <div class="page-content">
        <router-view></router-view>
      </div>

      <AppFooter />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/api'
import AppFooter from '../views/AppFooter.vue'

const BASE_URL_SERVER = 'https://seu-backend.onrender.com'
const router = useRouter()

const userName = ref(localStorage.getItem('nomeEscola') || 'Escola') 
const logoUrl = ref(null)
const logoFileInput = ref(null)
const isSidebarOpen = ref(false)

const escolaId = ref(localStorage.getItem('escolaId'))

const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }
const closeSidebar = () => { isSidebarOpen.value = false }

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('escolaId')
  router.push('/login')
}

const carregarLogo = async () => {
  try {
    if (!escolaId.value) return
    const response = await api.get(`/escolas/${escolaId.value}`)
    if (response.data.logoUrl) {
      logoUrl.value = `${BASE_URL_SERVER}${response.data.logoUrl}`
    }
  } catch (error) {
    console.error('Erro ao carregar logotipo:', error)
  }
}

const handleLogoClick = () => logoFileInput.value.click()

const handleFileChange = async event => {
  const file = event.target.files[0]
  if (!file || !escolaId.value) return
  const formData = new FormData()
  formData.append('logo', file)
  try {
    const response = await api.put(`/escolas/${escolaId.value}/logo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    logoUrl.value = `${BASE_URL_SERVER}${response.data.logoUrl}`
  } catch (error) {
    console.error('Erro ao fazer upload do logotipo:', error)
  }
}

onMounted(() => carregarLogo())
</script>

<style scoped>
.dashboard-container { display: flex; height: 100vh; background-color: #131129; overflow: hidden; position: relative; }
.sidebar { width: 250px; background-color: #1a202c; color: white; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0; transition: all 0.3s ease; z-index: 1001; }
.sidebar-header { padding: 20px; text-align: center; cursor: pointer; position: relative; }
.logo-upload-container { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.school-logo { max-width: 100%; max-height: 115px; object-fit: contain; margin-bottom: 5px; }
.sidebar-header h1 { font-size: 20px; line-height: 1.2; }
.sidebar-header span { color: #63b3ed; }
.upload-icon { position: absolute; top: 5px; right: 5px; color: #63b3ed; background-color: rgba(255,255,255,0.9); padding: 5px; border-radius: 50%; font-size: 0.8em; opacity: 0; transition: opacity 0.2s; pointer-events: none; }
.sidebar-header:hover .upload-icon { opacity: 1; }
.menu { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex: 1; }
.menu li a { display: flex; align-items: center; padding: 12px 20px; color: #a0aec0; text-decoration: none; transition: 0.2s; gap: 12px; }
.menu li.active a, .menu li a:hover { background-color: #2d3748; color: white; border-left: 4px solid #63b3ed; }
.sidebar-footer { padding: 15px 20px; display: flex; flex-direction: column; border-top: 1px solid #2d3748; gap: 10px; }
.sidebar-footer a { color: #a0aec0; text-decoration: none; font-size: 0.9rem; display: flex; align-items: center; gap: 10px; }
.main-content { flex: 1; background-color: #131129; overflow-y: auto; display: flex; flex-direction: column; min-width: 0; }
.main-header { display: flex; justify-content: space-between; align-items: center; padding: 0 25px; height: 70px; background-color: #131129; border-bottom: 1px solid #2d3748; flex-shrink: 0; }
.welcome-text { color: white; font-size: 1.1rem; margin: 0; }
.user-avatar-img { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #63b3ed; object-fit: cover; }
.user-avatar-placeholder { width: 40px; height: 40px; border-radius: 50%; background-color: #2d3748; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid #63b3ed; }
.page-content { padding: 20px; flex: 1; }
.mobile-menu-toggle { display: none; position: fixed; top: 15px; left: 15px; z-index: 1002; background: #63b3ed; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.4); }

@media (max-width: 1024px) {
  .mobile-menu-toggle { display: block; }
  .sidebar { position: fixed; left: -250px; top: 0; bottom: 0; }
  .sidebar.sidebar-open { left: 0; }
  .sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); z-index: 1000; }
  .main-header { padding-left: 75px; }
  .welcome-text { font-size: 0.9rem; }
}
@media (max-width: 480px) {
  .welcome-text { display: none; }
  .main-header { justify-content: flex-end; }
  .page-content { padding: 10px; }
}
</style>