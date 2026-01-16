<template>
  <div class="dashboard-container">
    <nav class="sidebar">
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
          <router-link to="/escola"><i class="fas fa-tachometer-alt"></i> Dashboard</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/alunos') }">
          <router-link to="/escola/alunos"><i class="fas fa-users"></i> Alunos</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/turmas') }">
          <router-link to="/escola/turmas"><i class="fas fa-calendar-alt"></i> Turmas e Agenda</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/matriculas') }">
          <router-link to="/escola/matriculas"><i class="fas fa-user-plus"></i> Matrículas</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/professores') }">
          <router-link to="/escola/professores"><i class="fas fa-chalkboard-teacher"></i> Professores</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/funcionarios') }">
          <router-link to="/escola/funcionarios"><i class="fas fa-users-cog"></i> Funcionários</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/modalidades') }">
          <router-link to="/escola/modalidades"><i class="fas fa-palette"></i> Modalidades</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/pagamentos') }">
          <router-link to="/escola/pagamentos"><i class="fas fa-hand-holding-dollar"></i> Financeiro</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/vendas') }">
          <router-link to="/escola/vendas"><i class="fas fa-store"></i> Vendas</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/comissoes') }">
          <router-link to="/escola/comissoes"><i class="fas fa-percentage"></i> Comissão</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/mensalidades') }">
          <router-link to="/escola/mensalidades"><i class="fas fa-calendar-check"></i> Mensalidade</router-link>
        </li>
        <li :class="{ active: $route.path.startsWith('/escola/relatorios') }">
          <router-link to="/escola/relatorios"><i class="fas fa-chart-line"></i> Relatório</router-link>
        </li>
      </ul>

      <div class="sidebar-footer">
        <router-link to="#"><i class="fas fa-cog"></i> Configurações</router-link>
        <a href="#" @click.prevent="logout"><i class="fas fa-sign-out-alt"></i> Sair</a>
      </div>
    </nav>

    <main class="main-content">
      <header class="main-header">
        <h2>Seja bem-vinda, {{ userName }}!</h2>
        <div class="user-profile">
          <img src="https://i.pravatar.cc/40" alt="Foto do Usuário" />
        </div>
      </header>

      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/api'

const BASE_URL_SERVER = 'http://localhost:3000'
const router = useRouter()

const userName = ref('Ana')
const logoUrl = ref(null)
const logoFileInput = ref(null)

/* ✅ CORREÇÃO ÚNICA E NECESSÁRIA */
const escolaId = ref(localStorage.getItem('escolaId'))

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
    const response = await api.put(
      `/escolas/${escolaId.value}/logo`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )

    logoUrl.value = `${BASE_URL_SERVER}${response.data.logoUrl}`
  } catch (error) {
    console.error('Erro ao fazer upload do logotipo:', error)
  }
}

onMounted(() => carregarLogo())
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #1a202c;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.logo-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.school-logo {
  max-width: 240px;
  height: 115px;
  object-fit: contain;
  margin-bottom: 5px;
}

.sidebar-header h1 {
  font-size: 20px;
  line-height: 1.2;
}

.sidebar-header span {
  color: #63b3ed;
}

.upload-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #63b3ed;
  background-color: rgba(255,255,255,0.9);
  padding: 5px;
  border-radius: 50%;
  font-size: 0.8em;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.sidebar-header:hover .upload-icon {
  opacity: 1;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li.active {
  background-color: #2d3748;
}

.menu li a {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
}

.menu li a:hover {
  background-color: #2d3748;
}

.sidebar-footer {
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background-color: #f7fafc;
  overflow-y: auto;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
}

.user-profile img {
  border-radius: 50%;
}
</style>
