<template>
  <div class="pdv-container">
    <div class="nav-tabs">
      <button :class="{ active: activeTab === 'venda' }" @click="activeTab = 'venda'">
        <i class="fas fa-cash-register"></i> Ponto de Venda
      </button>
      <button :class="{ active: activeTab === 'historico' }" @click="activeTab = 'historico'">
        <i class="fas fa-history"></i> Histórico de Vendas
      </button>
    </div>

    <div v-if="activeTab === 'venda'" class="tab-content sale-grid">
      <div class="main-column">
        <section class="products-section card">
          <div class="section-header">
            <h2 class="title-purple"><i class="fas fa-box-open"></i> Estoque</h2>
            <div class="search-box">
              <input type="text" v-model="search" placeholder="Pesquisar produto...">
            </div>
          </div>

          <div class="products-grid">
            <div v-for="produto in filteredProducts" :key="produto.id" 
                 class="product-card" :class="{ 'out-of-stock': produto.quantidade <= 0 }"
                 @click="addToCart(produto)">
              <div class="product-badge" v-if="produto.quantidade > 0">{{ produto.quantidade }} un</div>
              <div class="product-image">
                <img v-if="produto.imageUrl" :src="produto.imageUrl" />
                <i v-else class="fas fa-box"></i>
              </div>
              <div class="product-details">
                <span class="p-name">{{ produto.nome }}</span>
                <span class="p-price">R$ {{ formatPrice(produto.preco) }}</span>
              </div>
              <button class="btn-delete-float" @click.stop="confirmDeleteProduct(produto)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </section>

        <section class="admin-panel card">
          <h2 class="title-purple"><i class="fas fa-plus-circle"></i> Novo Produto</h2>
          <div class="form-row">
            <div class="input-group main-input">
              <label>Nome</label>
              <input type="text" v-model="newProduct.nome" placeholder="Ex: Camiseta Escola">
            </div>
            <div class="input-group small-input">
              <label>Preço</label>
              <input type="number" v-model.number="newProduct.preco" step="0.01">
            </div>
            <div class="input-group small-input">
              <label>Qtd</label>
              <input type="number" v-model.number="newProduct.quantidade">
            </div>
            <div class="input-group file-input">
              <label>Foto</label>
              <input type="file" @change="onFileChange" accept="image/*">
            </div>
            <div class="form-actions-inline">
              <button class="btn-primary" @click="addProduct" :disabled="isProcessing">
                <i class="fas fa-save"></i> Salvar
              </button>
            </div>
          </div>
        </section>
      </div>

      <div class="side-column">
        <div class="cart-card card">
          <h2 class="title-purple"><i class="fas fa-shopping-cart"></i> Carrinho</h2>
          <div class="cart-items">
            <div v-if="cart.length === 0" class="empty-cart">Carrinho vazio</div>
            <div v-for="item in cart" :key="item.id" class="cart-item">
              <div class="item-info">
                <span class="item-name">{{ item.nome }}</span>
                <span class="item-subtotal">R$ {{ formatPrice(item.preco * item.quantity) }}</span>
              </div>
              <div class="item-controls">
                <button @click="decreaseQuantity(item.id)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(item.id)">+</button>
                <button class="remove" @click="removeFromCart(item.id)"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
          
          <div class="cart-footer">
            <div class="total-row">
              <span>Total</span>
              <span class="total-value">R$ {{ formatPrice(subtotal) }}</span>
            </div>
            
            <div class="payment-selector">
              <label>Forma de Pagamento:</label>
              <div class="pay-methods">
                <button v-for="m in ['PIX', 'CREDITO', 'DEBITO', 'DINHEIRO']" 
                        :key="m" :class="{ active: paymentMethod === m }"
                        @click="paymentMethod = m">{{ m }}</button>
              </div>
            </div>

            <div class="cart-actions">
                <button class="btn-cancel" @click="cancelSale" :disabled="cart.length === 0 || isProcessing">
                    <i class="fas fa-ban"></i> CANCELAR
                </button>
                <button class="btn-checkout" @click="finalizeSale" 
                        :disabled="cart.length === 0 || !paymentMethod || isProcessing">
                  <i class="fas fa-check-circle"></i> FINALIZAR
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'historico'" class="tab-content history-layout">
      <div class="history-list card">
        <div class="section-header">
            <h2 class="title-purple">Vendas Realizadas</h2>
            <button class="btn-refresh" @click="loadSales"><i class="fas fa-sync"></i> Atualizar</button>
        </div>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data</th>
                        <th>Total</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="venda in sales" :key="venda.id" @click="selectedSale = venda" :class="{ selected: selectedSale?.id === venda.id }">
                        <td>#{{ venda.id }}</td>
                        <td>{{ new Date(venda.createdAt).toLocaleString() }}</td>
                        <td class="text-green">R$ {{ formatPrice(venda.total) }}</td>
                        <td><button class="btn-small">Ver Recibo</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      <div class="receipt-viewer card">
          <div v-if="selectedSale" class="receipt-paper">
              <div class="receipt-head">
                  <i class="fas fa-school logo-receipt"></i>
                  <h3>COMPROVANTE</h3>
                  <p>Venda #{{ selectedSale.id }}</p>
              </div>
              <div class="receipt-body">
                  <div class="r-row" v-for="item in selectedSale.itens" :key="item.id">
                      <span>{{ item.quantidade }}x {{ item.produto?.nome }}</span>
                      <span>R$ {{ formatPrice(item.quantidade * item.precoUnitario) }}</span>
                  </div>
                  <div class="r-divider"></div>
                  <div class="r-total">
                      <span>TOTAL</span>
                      <span>R$ {{ formatPrice(selectedSale.total) }}</span>
                  </div>
                  <p class="r-payment">Pagamento: {{ selectedSale.metodoPagamento }}</p>
              </div>
              <button class="btn-print" @click="printReceipt">Imprimir Recibo</button>
          </div>
          <div v-else class="empty-state">
              <i class="fas fa-file-invoice"></i>
              <p>Selecione uma venda para ver detalhes</p>
          </div>
      </div>
    </div>

    <div class="toast" :class="{ show: notification.show, error: notification.error }">
        {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../api/api'

const activeTab = ref('venda')
const products = ref([])
const sales = ref([])
const cart = ref([])
const search = ref('')
const selectedSale = ref(null)
const paymentMethod = ref(null)
const isProcessing = ref(false)
const notification = reactive({ show: false, message: '', error: false })
const newProduct = reactive({ nome: '', preco: 0, quantidade: 0, imagem: null })

// --- UTILITÁRIOS ---
function formatPrice(val) { return Number(val || 0).toFixed(2).replace('.', ','); }
const subtotal = computed(() => cart.value.reduce((acc, i) => acc + (i.preco * i.quantity), 0))
const filteredProducts = computed(() => products.value.filter(p => p.nome.toLowerCase().includes(search.value.toLowerCase())))

function showNotification(msg, err = false) {
    notification.message = msg;
    notification.error = err;
    notification.show = true;
    setTimeout(() => notification.show = false, 3000);
}

function getImageUrl(filename) {
    if (!filename) return null;
    return `https://seu-backend.onrender.com/uploads/produtos/${filename}`;
}

// --- PRODUTOS ---
async function loadProducts() {
    try {
        const { data } = await api.get('/produtos')
        products.value = data.map(p => ({ ...p, imageUrl: p.imageUrl ? getImageUrl(p.imageUrl) : null }))
    } catch (err) { showNotification('Erro ao carregar estoque', true); }
}

function onFileChange(e) { newProduct.imagem = e.target.files[0]; }

async function addProduct() {
    if (!newProduct.nome || newProduct.preco <= 0) return showNotification('Dados inválidos', true);
    isProcessing.value = true;

    const formData = new FormData();
    formData.append('nome', newProduct.nome);
    formData.append('preco', newProduct.preco);
    formData.append('quantidade', newProduct.quantidade);
    if (newProduct.imagem) formData.append('foto', newProduct.imagem);

    try {
        const { data } = await api.post('/produtos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const produtoCriado = {
            ...data.produto,
            imageUrl: data.produto.imageUrl ? getImageUrl(data.produto.imageUrl) : null
        }
        products.value.push(produtoCriado)
        showNotification('Produto cadastrado!');
        Object.assign(newProduct, { nome:'', preco:0, quantidade:0, imagem:null });
    } catch (err) { 
        showNotification(err.response?.data?.error || 'Erro ao cadastrar', true); 
    } finally { 
        isProcessing.value = false; 
    }
}

async function confirmDeleteProduct(p) {
    if (confirm(`Excluir ${p.nome}?`)) {
        try {
            await api.delete(`/produtos/${p.id}`)
            loadProducts()
            showNotification("Produto removido")
        } catch (e) { showNotification("Erro ao remover", true); }
    }
}

// --- CARRINHO ---
function addToCart(p) {
    if (p.quantidade <= 0) return showNotification('Sem estoque', true);
    const item = cart.value.find(i => i.id === p.id);
    if (item) {
        if (item.quantity < p.quantidade) item.quantity++;
    } else cart.value.push({ ...p, quantity: 1 });
}

function increaseQuantity(id) {
    const item = cart.value.find(i => i.id === id);
    const prod = products.value.find(p => p.id === id);
    if (item && item.quantity < prod.quantidade) item.quantity++;
}

function decreaseQuantity(id) {
    const idx = cart.value.findIndex(i => i.id === id);
    if (cart.value[idx].quantity > 1) cart.value[idx].quantity--;
    else cart.value.splice(idx, 1);
}

function removeFromCart(id) { cart.value = cart.value.filter(i => i.id !== id); }

function cancelSale() {
    if (cart.value.length === 0) return;
    if (confirm("Deseja cancelar esta venda?")) {
        cart.value = [];
        paymentMethod.value = null;
    }
}

// --- VENDAS ---
async function finalizeSale() {
    if (!paymentMethod.value) return showNotification("Selecione o pagamento", true);
    isProcessing.value = true;
    try {
        await api.post('/vendas', {
            itens: cart.value.map(i => ({ produtoId: i.id, quantidade: i.quantity, precoUnitario: i.preco })),
            metodoPagamento: paymentMethod.value
        });
        showNotification('Venda concluída com sucesso!');
        cart.value = []; 
        paymentMethod.value = null;
        loadProducts(); 
        loadSales();
    } catch (err) {
        showNotification('Erro ao processar venda', true);
    } finally {
        isProcessing.value = false;
    }
}

async function loadSales() { 
    try { 
        const { data } = await api.get('/vendas'); 
        sales.value = data; 
    } catch (e) {} 
}

function printReceipt() { window.print(); }

onMounted(() => { 
    loadProducts(); 
    loadSales(); 
});
</script>

<style scoped>
/* BASE */
.pdv-container { background: #0f172a; min-height: 100vh; color: #f8fafc; font-family: 'Inter', sans-serif; }
.card { background: #1e293b; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
.title-purple { color: #a78bfa; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }

/* NAVEGAÇÃO */
.nav-tabs { display: flex; background: #1e293b; padding: 10px 20px; gap: 10px; border-bottom: 2px solid #334155; flex-wrap: wrap; }
.nav-tabs button { background: none; border: none; color: #94a3b8; padding: 12px 24px; cursor: pointer; border-radius: 8px; font-weight: 600; flex: 1; min-width: 150px; }
.nav-tabs button.active { background: #8b5cf6; color: white; }

.tab-content { padding: 20px; }

/* LAYOUT VENDA */
.sale-grid { display: grid; grid-template-columns: 1fr 400px; gap: 20px; align-items: start; }

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; }
.search-box input { background: #334155; border: 1px solid #475569; color: white; padding: 8px 16px; border-radius: 20px; width: 100%; max-width: 200px; outline: none; }

/* PRODUTOS */
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; max-height: 480px; overflow-y: auto; padding: 5px; }
.product-card { background: #334155; border-radius: 10px; padding: 12px; cursor: pointer; position: relative; border: 2px solid transparent; transition: 0.2s; text-align: center; }
.product-card:hover { border-color: #8b5cf6; transform: translateY(-2px); }
.product-image { height: 70px; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
.product-image img { max-height: 100%; border-radius: 4px; }
.p-name { display: block; font-size: 0.85rem; font-weight: 500; margin-top: 8px; }
.p-price { color: #4ade80; font-weight: bold; font-size: 0.95rem; }
.product-badge { position: absolute; top: 6px; left: 6px; background: #8b5cf6; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; }
.btn-delete-float { position: absolute; top: 5px; right: 5px; background: none; border: none; color: #ef4444; cursor: pointer; }

/* NOVO PRODUTO */
.admin-panel { margin-top: 20px; }
.form-row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
.input-group { flex: 1; min-width: 120px; }
.input-group label { display: block; font-size: 0.7rem; color: #94a3b8; margin-bottom: 4px; }
.input-group input { background: #334155; border: 1px solid #475569; color: white; padding: 8px; border-radius: 6px; width: 100%; }
.main-input { flex: 2; min-width: 200px; }
.btn-primary { background: #8b5cf6; color: white; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; }

/* CARRINHO */
.cart-card { min-height: 500px; height: calc(100vh - 125px); display: flex; flex-direction: column; }
.cart-items { flex: 1; overflow-y: auto; }
.cart-item { border-bottom: 1px solid #334155; padding: 12px 0; }
.item-info { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.9rem; }
.item-controls { display: flex; align-items: center; gap: 8px; }
.item-controls button { background: #475569; color: white; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; }
.item-controls .remove { background: #ef4444; margin-left: auto; }
.cart-footer { border-top: 2px solid #334155; padding-top: 15px; }
.total-row { display: flex; justify-content: space-between; font-size: 1.4rem; font-weight: bold; margin-bottom: 15px; color: #4ade80; }
.pay-methods { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin: 10px 0 20px 0; }
.pay-methods button { padding: 8px; background: #334155; border: 1px solid #475569; color: white; border-radius: 6px; cursor: pointer; font-size: 0.75rem; }
.pay-methods button.active { background: #8b5cf6; border-color: #a78bfa; }
.cart-actions { display: grid; grid-template-columns: 1fr 1.5fr; gap: 10px; }
.btn-checkout { background: #22c55e; color: white; padding: 14px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
.btn-cancel { background: #f97316; color: white; padding: 14px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }

/* HISTÓRICO */
.history-layout { display: grid; grid-template-columns: 1fr 380px; gap: 20px; }
.table-responsive { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; min-width: 400px; }
th { text-align: left; padding: 12px; color: #94a3b8; border-bottom: 2px solid #334155; }
td { padding: 12px; border-bottom: 1px solid #334155; }
tr:hover { background: #334155; cursor: pointer; }
.receipt-paper { background: white; color: #1e293b; padding: 25px; border-radius: 4px; font-family: 'Courier New', monospace; }
.receipt-head { text-align: center; border-bottom: 1px dashed #cbd5e1; margin-bottom: 15px; padding-bottom: 10px; }
.r-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px; }
.r-total { display: flex; justify-content: space-between; font-weight: bold; margin-top: 10px; border-top: 1px solid #1e293b; padding-top: 5px; }
.btn-print { width: 100%; margin-top: 15px; padding: 10px; background: #1e293b; color: white; border: none; border-radius: 4px; cursor: pointer; }

/* UTILS */
.toast { position: fixed; bottom: 20px; right: 20px; background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; transform: translateY(150%); transition: 0.3s; z-index: 9999; }
.toast.show { transform: translateY(0); }
.toast.error { background: #ef4444; }

/* --- RESPONSIVIDADE (MEDIA QUERIES) --- */

/* Tablets e Telas Médias (max-width: 1024px) */
@media (max-width: 1024px) {
  .sale-grid {
    grid-template-columns: 1fr; /* Carrinho vai para baixo dos produtos */
  }
  .cart-card {
    height: auto;
    min-height: auto;
  }
  .history-layout {
    grid-template-columns: 1fr; /* Recibo vai para baixo da tabela */
  }
}

/* Celulares (max-width: 640px) */
@media (max-width: 640px) {
  .tab-content { padding: 10px; }
  .nav-tabs { padding: 10px; }
  .nav-tabs button { padding: 10px; font-size: 0.8rem; }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .search-box { width: 100%; }
  .search-box input { max-width: none; }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  }

  .form-row {
    flex-direction: column;
    align-items: stretch;
  }
  .input-group { width: 100%; }

  .cart-actions {
    grid-template-columns: 1fr; /* Botões de ação um abaixo do outro */
  }
  
  .pay-methods {
    grid-template-columns: 1fr 1fr; /* Mantém 2 colunas para botões pequenos */
  }
}

@media print {
    .nav-tabs, .main-column, .cart-card, .btn-print, .btn-refresh { display: none !important; }
    .pdv-container { background: white; }
    .receipt-paper { position: fixed; top: 0; left: 0; width: 100%; }
}
</style>