import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import AdminEscolaLayout from '../layouts/AdminEscolaLayout.vue'
import SuperAdminLayout from '../layouts/SuperAdminLayout.vue'

// Views públicas
import Login from '../views/Login.vue'
import RecuperarSenha from '../views/RecuperarSenha.vue'
import ResetSenha from '../views/ResetSenha.vue'
import FormAtivacao from '../views/FormAtivacao.vue'
import TermosUso from '../views/TermosUso.vue'
import PoliticaPrivacidade from '../views/PoliticaPrivacidade.vue'

// Views ADMIN_ESCOLA
import AdminEscolaDashboard from '../views/AdminEscolaDashboard.vue'
import Alunos from '../views/Alunos.vue'
import Professor from '../views/Professor.vue'
import Turma from '../views/Turma.vue'
import ProfessorModalidade from '../views/ProfessorModalidade.vue'
import Matricula from '../views/Matricula.vue'
import Mensalidade from '../views/Mensalidade.vue'
import Modalidade from '../views/Modalidade.vue'
import Pagamentos from '../views/Pagamentos.vue'
import Produtos from '../views/Produtos.vue'
import Venda from '../views/Venda.vue'
import VendaItem from '../views/VendaItem.vue'
import Relatorio from '../views/Relatorio.vue'
import Estoque from '../views/Estoque.vue'
import Funcionarios from '../views/Funcionarios.vue'
import Comissao from '../views/Comissao.vue'

// Views SUPER_ADMIN
import SuperAdminDashboard from '../views/SuperAdminDashboard.vue'
import IsencaoTaxa from '../views/IsencaoTaxa.vue'
import DashboardFinanceiro from '../views/DashboardFinanceiro.vue'

// Auth Guard
import { authGuard } from './authGuard.js'

const routes = [
  // 🔹 Rotas Públicas
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },

  // 🔐 Recuperação de senha (rota principal)
  {
    path: '/recuperar-senha',
    name: 'RecuperarSenha',
    component: RecuperarSenha
  },

  // 🔐 Alias para compatibilidade com Login.vue
  {
    path: '/forgot-password',
    redirect: '/recuperar-senha'
  },

  {
    path: '/reset-password/:token',
    name: 'ResetSenha',
    component: ResetSenha
  },

  // 🔹 FORMULÁRIO DE ATIVAÇÃO
  {
    path: '/ativacao',
    name: 'FormAtivacao',
    component: FormAtivacao
  },

  // 🔹 TERMOS E PRIVACIDADE
  {
    path: '/termos',
    name: 'TermosUso',
    component: TermosUso
  },
  {
    path: '/privacidade',
    name: 'PoliticaPrivacidade',
    component: PoliticaPrivacidade
  },

  // 🔹 Rotas ADMIN_ESCOLA
  {
    path: '/escola',
    component: AdminEscolaLayout,
    beforeEnter: authGuard,
    children: [
      { path: '', name: 'EscolaDashboard', component: AdminEscolaDashboard },
      { path: 'alunos', name: 'EscolaAlunos', component: Alunos },
      { path: 'professores', name: 'EscolaProfessores', component: Professor },
      { path: 'turmas', name: 'EscolaTurmas', component: Turma },
      { path: 'professor-modalidade', name: 'EscolaProfessorModalidade', component: ProfessorModalidade },
      { path: 'matriculas', name: 'EscolaMatriculas', component: Matricula },
      { path: 'mensalidades', name: 'EscolaMensalidades', component: Mensalidade },
      { path: 'modalidades', name: 'EscolaModalidades', component: Modalidade },
      { path: 'pagamentos', name: 'EscolaPagamentos', component: Pagamentos },
      { path: 'produtos', name: 'EscolaProdutos', component: Produtos },
      { path: 'vendas', name: 'EscolaVendas', component: Venda },
      { path: 'venda-itens', name: 'EscolaVendaItens', component: VendaItem },
      { path: 'relatorios', name: 'EscolaRelatorios', component: Relatorio },
      { path: 'estoque', name: 'EscolaEstoque', component: Estoque },
      { path: 'funcionarios', name: 'EscolaFuncionarios', component: Funcionarios },
      { path: 'comissoes', name: 'EscolaComissoes', component: Comissao }
    ]
  },

  // 🔹 Rotas SUPER_ADMIN
  {
    path: '/super',
    component: SuperAdminLayout,
    beforeEnter: (to, from, next) => {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')

      if (!token) return next('/login')
      if (role !== 'SUPER_ADMIN') return next('/escola')

      return next()
    },
    children: [
      { path: '', redirect: '/super/dashboard' },
      { path: 'dashboard', name: 'SuperAdminDashboard', component: SuperAdminDashboard },
      { path: 'isencao-taxa', name: 'SuperAdminIsencaoTaxa', component: IsencaoTaxa },
      { path: 'financeiro', name: 'SuperAdminFinanceiro', component: DashboardFinanceiro },
      { path: 'alunos', name: 'SuperAdminAlunos', component: Alunos },
      { path: 'turmas', name: 'SuperAdminTurmas', component: Turma },
      { path: 'relatorios', name: 'SuperAdminRelatorios', component: Relatorio }
    ]
  },

  // 🔹 Fallback
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
