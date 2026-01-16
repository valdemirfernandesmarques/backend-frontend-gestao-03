<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-3xl">
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">

        <!-- HEADER -->
        <div class="bg-blue-700 text-white p-6 text-center">
          <h1 class="text-2xl font-bold">Ativação do Sistema</h1>
          <p class="text-blue-100 mt-1">
            Crie sua escola e comece sua avaliação gratuita
          </p>
        </div>

        <!-- CONTEÚDO -->
        <div class="p-8">

          <!-- FORMULÁRIO -->
          <form
            v-if="etapa === 1"
            @submit.prevent="ativarConta"
            class="space-y-8"
          >

            <!-- RESPONSÁVEL -->
            <div class="border rounded-xl p-6">
              <h2 class="text-lg font-semibold text-blue-700 mb-4">
                👤 Dados do Responsável
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="label">Nome completo</label>
                  <input v-model="form.nome" type="text" required class="input" />
                </div>

                <div>
                  <label class="label">E-mail</label>
                  <input v-model="form.email" type="email" required class="input" />
                </div>
              </div>
            </div>

            <!-- ESCOLA -->
            <div class="border rounded-xl p-6">
              <h2 class="text-lg font-semibold text-blue-700 mb-4">
                🏫 Dados da Escola
              </h2>

              <div>
                <label class="label">Nome da escola</label>
                <input v-model="form.nomeEscola" type="text" required class="input" />
              </div>
            </div>

            <!-- TERMOS -->
            <div class="border rounded-xl p-6">
              <label class="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" v-model="aceitouTermos" required />
                <span>
                  Li e aceito os
                  <router-link to="/termos" target="_blank" class="text-blue-600 underline mx-1">
                    Termos de Uso
                  </router-link>
                  e a
                  <router-link to="/privacidade" target="_blank" class="text-blue-600 underline mx-1">
                    Política de Privacidade (LGPD)
                  </router-link>
                </span>
              </label>
            </div>

            <!-- BOTÃO -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl"
            >
              {{ loading ? 'Ativando...' : 'Ativar Avaliação Gratuita' }}
            </button>
          </form>

          <!-- SUCESSO -->
          <div v-else class="text-center space-y-6">
            <div class="text-green-600 text-5xl">✅</div>

            <h2 class="text-2xl font-bold">
              Ativação realizada com sucesso!
            </h2>

            <div class="bg-gray-50 border rounded-xl p-6 text-left space-y-2">
              <p><strong>Email:</strong> {{ credenciais.email }}</p>
              <p><strong>Senha:</strong> {{ credenciais.senha }}</p>
            </div>

            <router-link
              to="/login"
              class="inline-block w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl"
            >
              Ir para Login
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'

export default {
  name: 'FormAtivacao',

  data() {
    return {
      etapa: 1,
      loading: false,
      aceitouTermos: false,
      form: {
        nome: '',
        email: '',
        nomeEscola: ''
      },
      credenciais: {
        email: '',
        senha: ''
      }
    }
  },

  methods: {
    async ativarConta() {
      this.loading = true

      try {
        const response = await api.post('/ativacao', this.form)

        this.credenciais = response.data.dadosAcesso
        this.etapa = 2
      } catch (err) {
        console.error('Erro ativação:', err)
        alert('Erro ao realizar ativação. Tente novamente.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
}
.label {
  font-size: 0.875rem;
  color: #4b5563;
}
</style>
