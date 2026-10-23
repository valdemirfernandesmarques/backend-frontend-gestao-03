<template>
  <aside class="sidebar">
    <div class="logo">
      <h2>SGD</h2>
    </div>
    <nav>
      <ul>
        <!-- Menus SUPER_ADMIN -->
        <li v-if="role === 'SUPER_ADMIN'" :class="{ active: isActive('/super/isencao-taxa') }">
          <router-link to="/super/isencao-taxa">Isenção de Taxa</router-link>
        </li>

        <!-- Menus ADMIN_ESCOLA -->
        <template v-if="role === 'ADMIN_ESCOLA'">
          <li :class="{ active: isActive('/escola') }">
            <router-link to="/escola">Dashboard</router-link>
          </li>
          <li :class="{ active: isActive('/escola/alunos') }">
            <router-link to="/escola/alunos">Alunos</router-link>
          </li>
          <li :class="{ active: isActive('/escola/professores') }">
            <router-link to="/escola/professores">Professor</router-link>
          </li>
          <li :class="{ active: isActive('/escola/turmas') }">
            <router-link to="/escola/turmas">Turma</router-link>
          </li>
          <li :class="{ active: isActive('/escola/professor-modalidade') }">
            <router-link to="/escola/professor-modalidade">Professor/Modalidade</router-link>
          </li>
          <li :class="{ active: isActive('/escola/matriculas') }">
            <router-link to="/escola/matriculas">Matrículas</router-link>
          </li>
          <li :class="{ active: isActive('/escola/mensalidades') }">
            <router-link to="/escola/mensalidades">Mensalidade</router-link>
          </li>
          <li :class="{ active: isActive('/escola/modalidades') }">
            <router-link to="/escola/modalidades">Modalidade</router-link>
          </li>
          <li :class="{ active: isActive('/escola/pagamentos') }">
            <router-link to="/escola/pagamentos">Pagamentos</router-link>
          </li>
          <li :class="{ active: isActive('/escola/produtos') }">
            <router-link to="/escola/produtos">Produtos</router-link>
          </li>
          <li :class="{ active: isActive('/escola/vendas') }">
            <router-link to="/escola/vendas">Vendas</router-link>
          </li>
          <li :class="{ active: isActive('/escola/venda-itens') }">
            <router-link to="/escola/venda-itens">Itens de Venda</router-link>
          </li>
          <li :class="{ active: isActive('/escola/relatorios') }">
            <router-link to="/escola/relatorios">Relatórios</router-link>
          </li>
          <li :class="{ active: isActive('/escola/estoque') }">
            <router-link to="/escola/estoque">Estoque</router-link>
          </li>
          <li :class="{ active: isActive('/escola/funcionarios') }">
            <router-link to="/escola/funcionarios">Funcionários</router-link>
          </li>
          <li :class="{ active: isActive('/escola/comissao') }">
            <router-link to="/escola/comissao">Comissões</router-link>
          </li>
        </template>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      role: localStorage.getItem("role") || ""
    }
  },
  methods: {
    isActive(path) {
      return this.$route.path.startsWith(path)
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #0d124a;
  color: white;
  height: 100vh;
  padding: 20px;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  margin-bottom: 15px;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a:hover {
  color: dodgerblue;
}

nav li.active > a {
  color: dodgerblue;
  font-weight: bold;
}
</style>
