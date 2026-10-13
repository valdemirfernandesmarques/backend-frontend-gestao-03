<template>
  <AdminEscolaLayout>
    <div class="escola-page">
      <h1>Cadastro da Escola</h1>

      <form @submit.prevent="submitForm">
        <fieldset>
          <legend>Informações da Escola</legend>
          <div class="form-group">
            <label>Nome da Escola:</label>
            <input v-model="form.nome" placeholder="Nome da escola" required />
          </div>
          <div class="form-group">
            <label>CNPJ:</label>
            <input v-model="form.cnpj" placeholder="00.000.000/0000-00" />
          </div>
          <div class="form-group">
            <label>Telefone:</label>
            <input v-model="form.telefone" placeholder="(00) 00000-0000" />
            <label>Email:</label>
            <input type="email" v-model="form.email" placeholder="email@escola.com" />
          </div>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>
          <div class="form-group">
            <label>CEP:</label>
            <input v-model="form.cep" placeholder="00000-000" @blur="buscarEndereco" />
            <label>Rua:</label>
            <input v-model="form.rua" />
          </div>
          <div class="form-group">
            <label>Número:</label>
            <input v-model="form.numero" />
            <label>Bairro:</label>
            <input v-model="form.bairro" />
          </div>
          <div class="form-group">
            <label>Cidade:</label>
            <input v-model="form.cidade" />
            <label>Estado:</label>
            <select v-model="form.estado">
              <option value="">Selecione</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="SC">Santa Catarina</option>
              <option value="PR">Paraná</option>
              <option value="RS">Rio Grande do Sul</option>
            </select>
          </div>
        </fieldset>

        <div class="form-buttons">
          <button type="reset" @click="resetForm">Cancelar</button>
          <button type="submit">Salvar Escola</button>
        </div>
      </form>
    </div>
  </AdminEscolaLayout>
</template>

<script>
import AdminEscolaLayout from '../layouts/AdminEscolaLayout.vue'
import { ref } from 'vue'
// Alterado de 'axios' para a nossa instância configurada
import api from '@/api/api'

export default {
  name: 'Escola',
  components: { AdminEscolaLayout },
  setup() {
    const form = ref({
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: ''
    })

    const submitForm = async () => {
      try {
        // Agora usando 'api' que já tem o link do Render e o Token automático
        await api.post('/escolas', form.value)
        alert('Escola cadastrada com sucesso!')
        resetForm()
      } catch (err) {
        console.error('Erro ao salvar escola:', err)
        alert('Erro ao salvar escola. Verifique se o servidor está online.')
      }
    }

    const resetForm = () => {
      form.value = {
        nome: '',
        cnpj: '',
        telefone: '',
        email: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: ''
      }
    }

    const buscarEndereco = async () => {
      if (!form.value.cep) return
      const cep = form.value.cep.replace(/\D/g, '')
      if (cep.length !== 8) return
      try {
        // Mantido fetch direto para o ViaCEP (API externa pública)
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await res.json()
        if (!data.erro) {
          form.value.rua = data.logradouro || ''
          form.value.bairro = data.bairro || ''
          form.value.cidade = data.localidade || ''
          form.value.estado = data.uf || ''
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err)
      }
    }

    return { form, submitForm, resetForm, buscarEndereco }
  }
}
</script>

<style scoped>
.escola-page {
  padding: 20px;
}

button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #ff69b4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  opacity: 0.8;
  transform: scale(1.02);
}

fieldset {
  border: 1px solid #444;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

legend {
  color: #ff69b4;
  font-weight: bold;
  padding: 0 10px;
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group label {
  flex: 1 1 150px;
  min-width: 150px;
  color: #f0f0f0;
}

.form-group input,
.form-group select {
  flex: 2 1 300px;
  padding: 8px;
  border: 1px solid #333;
  background-color: #2a2a40;
  color: #fff;
  border-radius: 5px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}
</style>