<template>
  <div class="pdv-wrapper">
    
    <div class="main-content-pdv">
      
      <div class="products-section">
        <h2 class="title-stock"><i class="fas fa-box-open"></i> Produtos em Estoque</h2>

        <div class="category-filter">
            <button 
                v-for="cat in categories" 
                :key="cat.id" 
                class="category-btn" 
                :class="{ active: selectedCategory === cat.id }" 
                @click="selectedCategory = cat.id">
                {{ cat.name }}
            </button>
        </div>
        
        <div class="products-grid">
          <div 
            v-for="produto in filteredProducts" 
            :key="produto.id" 
            class="product-card"
            :class="{ 'out-of-stock': produto.stock <= 0 }"
            @click="addToCart(produto)">
            
            <div class="product-image-wrapper">
              <span v-if="!produto.image">{{ produto.icon || '📦' }}</span>
              <img v-else :src="produto.image" :alt="produto.name">
            </div>
            <div class="product-info">
              <div class="product-name">{{ produto.name }}</div>
              <div class="product-price">R$ {{ produto.price.toFixed(2).replace('.', ',') }}</div>
              <div class="product-stock">Estoque: {{ produto.stock }}</div>
              <div v-if="produto.stock <= 0" class="stock-overlay">ESGOTADO</div>
            </div>

            <div class="product-actions" @click.stop>
                <button class="delete-product-btn" @click="confirmDeleteProduct(produto)">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
          </div>

          <div v-if="products.length === 0" class="loading-message">
              Carregando produtos ou estoque vazio...
          </div>
        </div>

        <div class="admin-panel">
          <h2 class="title-new-product"><i class="fas fa-plus-circle"></i> Cadastrar Novo Produto</h2>
          <div class="admin-form-grid">
            <div class="form-group">
              <label>Nome do Produto</label>
              <input type="text" v-model="newProduct.name" class="form-control" placeholder="Nome do Produto">
            </div>
            <div class="form-group">
              <label>Preço (R$)</label>
              <input type="number" v-model.number="newProduct.price" class="form-control" min="0" step="0.01">
            </div>
            <div class="form-group">
              <label>Estoque Inicial</label>
              <input type="number" v-model.number="newProduct.stock" class="form-control" min="0">
            </div>
            <div class="form-group">
              <label>Categoria</label>
              <select v-model="newProduct.category" class="form-control">
                <option value="" disabled>Selecione uma categoria</option>
                <option v-for="cat in categories.slice(1)" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>
          
          <div class="image-upload-area">
            <div class="upload-preview">
              <img v-if="imagePreview" :src="imagePreview" alt="Preview">
              <i v-else class="fas fa-image"></i>
            </div>
            <div class="upload-controls">
              <input type="file" ref="productImage" @change="onFileChange" accept="image/*" style="display: none;">
              <button class="upload-btn" @click="$refs.productImage.click()"><i class="fas fa-upload"></i> Selecionar Imagem</button>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" @click="clearForm"><i class="fas fa-eraser"></i> Limpar</button>
            <button class="btn btn-primary" @click="addProduct"><i class="fas fa-save"></i> Cadastrar Produto</button>
          </div>
        </div>
      </div>

      <div class="cart-section">
        <h2 class="title-cart"><i class="fas fa-shopping-cart"></i> Carrinho de Vendas</h2>
        
        <div class="cart-items-wrapper">
          <div v-if="cart.length === 0" class="empty-cart-message">Seu carrinho está vazio</div>
          <div v-for="item in cart" :key="item.id" class="cart-item">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-details">
              <div class="item-quantity-controls">
                <button class="quantity-btn minus" @click="decreaseQuantity(item.id)">-</button>
                <span class="quantity-value">{{ item.quantity }}</span>
                <button class="quantity-btn plus" @click="increaseQuantity(item.id)">+</button>
              </div>
              <div class="item-total">R$ {{(item.price * item.quantity).toFixed(2).replace('.', ',')}}</div>
              <button class="remove-item-btn" @click="removeFromCart(item.id)"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span class="summary-label">Subtotal:</span>
            <span class="summary-value">R$ {{ subtotal.toFixed(2).replace('.', ',') }}</span>
          </div>

          <div class="payment-methods">
            <div class="payment-row">
              <button 
                v-for="method in paymentMethods.slice(0, 2)" 
                :key="method.id" 
                :class="['payment-btn', { active: paymentMethod === method.id }]"
                @click="selectPayment(method.id)">
                {{ method.name }}
              </button>
            </div>
            <div class="payment-row">
              <button 
                v-for="method in paymentMethods.slice(2)" 
                :key="method.id" 
                :class="['payment-btn', { active: paymentMethod === method.id }]"
                @click="selectPayment(method.id)">
                {{ method.name }}
              </button>
            </div>
          </div>

          <div class="summary-row total">
            <span class="summary-label">Total:</span>
            <span class="summary-value">R$ {{ subtotal.toFixed(2).replace('.', ',') }}</span>
          </div>

          <div class="action-buttons">
            <button class="btn cancel-btn" @click="cancelSale">
              <i class="fas fa-times"></i> Cancelar
            </button>
            <button class="btn checkout-btn" @click="finalizeSale" :disabled="cart.length === 0 || !paymentMethod">
              <i class="fas fa-check"></i> Finalizar Venda
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="notification" :class="{ show: notification.show, error: notification.error }">
        <i class="fas" :class="notification.error ? 'fa-times-circle' : 'fa-check-circle'"></i>
        <span>{{ notification.message }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
// Removendo a importação da API para SIMULAÇÃO TOTAL e eliminar o erro de carregamento
// import api from '../api/api' 

let nextProductId = 13; 
const selectedCategory = ref('all')
const paymentMethod = ref(null)
const cart = ref([])
const notification = reactive({ show: false, message: '', error: false })

// DADOS DE SIMULAÇÃO (CARREGADOS IMEDIATAMENTE)
const products = ref([
    { id: 1, name: 'Sanduíche Natural', price: 8.50, category: 'food', stock: 15, image: null, icon: '🥪' },
    { id: 2, name: 'Sanduíche de Frango', price: 9.00, category: 'food', stock: 12, image: null, icon: '🍗' },
    { id: 3, name: 'Refrigerante Lata', price: 5.00, category: 'drinks', stock: 30, image: null, icon: '🥤' },
    { id: 4, name: 'Água Mineral', price: 3.50, category: 'drinks', stock: 25, image: null, icon: '💧' },
    { id: 6, name: 'Camiseta Estilosa', price: 35.00, category: 'clothing', stock: 20, image: null, icon: '👕' },
    { id: 7, name: 'Bermuda de Dança', price: 45.00, category: 'clothing', stock: 15, image: null, icon: '🩳' },
    { id: 12, name: 'Boné da Escola', price: 25.00, category: 'accessories', stock: 15, image: null, icon: '🧢' }
]);


const categories = ref([
    { id: 'all', name: 'Todos' },
    { id: 'food', name: 'Alimentação' },
    { id: 'drinks', name: 'Bebidas' },
    { id: 'clothing', name: 'Vestuário' },
    { id: 'accessories', name: 'Acessórios' }
])
const paymentMethods = ref([
    { id: 'pix', name: 'PIX', icon: 'fas fa-qrcode' },
    { id: 'credit', name: 'Crédito', icon: 'fas fa-credit-card' },
    { id: 'debit', name: 'Débito', icon: 'fas fa-credit-card' },
    { id: 'cash', name: 'Dinheiro', icon: 'fas fa-money-bill-wave' }
])

const newProduct = reactive({ id: null, name: '', category: 'food', price: 0, stock: 0, image: '', imageFile: null })
const imagePreview = ref(null)

// --- Lógica de Simulação ---

function loadProducts() {
    // A simulação não precisa de código aqui, pois 'products' já está inicializado.
}

function showNotification(message, isError = false) {
    notification.show = true;
    notification.message = message;
    notification.error = isError;
    setTimeout(() => { notification.show = false }, 3000);
}

function finalizeSale() {
  if(cart.value.length === 0){ showNotification('Carrinho vazio!', true); return }
  if(!paymentMethod.value){ showNotification('Selecione método de pagamento!', true); return }

    // SIMULAÇÃO DE VENDAS: Baixa de estoque e limpeza de carrinho em memória
    cart.value.forEach(item => {
        const productInStock = products.value.find(p => p.id === item.id);
        if (productInStock) {
            productInStock.stock -= item.quantity;
        }
    });

    showNotification('Venda finalizada com sucesso! (Simulação)');
    cart.value = [];
    paymentMethod.value = null;
    loadProducts(); // Atualiza a visualização do estoque
}

function addProduct() {
    if (!newProduct.name || newProduct.price <= 0 || newProduct.stock < 0) {
        showNotification('Preencha todos os campos corretamente!', true);
        return;
    }
    
    // Simulação de cadastro (adiciona à lista em memória)
    const addedProduct = {
        id: nextProductId++,
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        stock: newProduct.stock,
        image: imagePreview.value,
        icon: '📦'
    };
    products.value.push(addedProduct);
    clearForm();
    showNotification('Produto cadastrado (simulado) com sucesso!');
}

// --- Métodos Auxiliares ---

const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') return products.value
    return products.value.filter(p => p.category === selectedCategory.value)
})

const subtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

function addToCart(product) {
    if (product.stock <= 0) return showNotification(`${product.name} está fora de estoque!`, true)
    const existingItem = cart.value.find(item => item.id === product.id);
    const stockProduct = products.value.find(p => p.id === product.id);

    if (existingItem) {
        if (existingItem.quantity < stockProduct.stock) {
            existingItem.quantity++;
            showNotification(`"${product.name}" adicionado ao carrinho!`);
        } else {
            showNotification(`Não há mais "${product.name}" em estoque!`, true);
        }
    } else {
        if (stockProduct.stock > 0) {
            cart.value.push({ ...product, quantity: 1, stock: stockProduct.stock });
            showNotification(`"${product.name}" adicionado ao carrinho!`);
        } else {
            showNotification(`"${product.name}" está fora de estoque!`, true);
        }
    }
}

function increaseQuantity(id) { 
    const item = cart.value.find(i => i.id === id);
    if (item && item.quantity < item.stock) item.quantity++; 
    else if (item) showNotification('Estoque insuficiente!', true);
}

function decreaseQuantity(id) { 
    const itemIndex = cart.value.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        if (cart.value[itemIndex].quantity > 1) {
            cart.value[itemIndex].quantity--; 
        } else {
            const removedItem = cart.value.splice(itemIndex, 1)[0];
            showNotification(`"${removedItem.name}" removido do carrinho.`);
        }
    }
}

function removeFromCart(id) {
    const removedItem = cart.value.find(i => i.id === id);
    cart.value = cart.value.filter(i => i.id !== id);
    showNotification(`"${removedItem.name}" removido do carrinho.`);
}

function selectPayment(method) { paymentMethod.value = method }

function cancelSale() { 
    if(confirm('Tem certeza que deseja cancelar a venda?')) { 
        cart.value = []; 
        paymentMethod.value = null; 
        showNotification('Venda cancelada com sucesso.'); 
    } 
}

function confirmDeleteProduct(product) {
    if (confirm(`Deseja realmente excluir o produto "${product.name}"?`)) {
        products.value = products.value.filter(p => p.id !== product.id);
        showNotification('Produto excluído (simulado) com sucesso!');
    }
}

function clearForm() {
    newProduct.name = ''; newProduct.category = 'food'; newProduct.price = 0; newProduct.stock = 0; newProduct.image = ''; newProduct.imageFile = null; imagePreview.value = null;
}
function onFileChange(e) {
    const file = e.target.files[0];
    if (file) {
        newProduct.imageFile = file; 
        const reader = new FileReader();
        reader.onload = (ev) => { imagePreview.value = ev.target.result; };
        reader.readAsDataURL(file);
    }
}

onMounted(() => {
    loadProducts();
});
</script>

<style scoped>
/* Seu CSS (Mantido e garantindo que o layout funcione) */
:root {
  --primary-color: #8b5cf6; /* Roxa */
  --secondary-color: #ec4899; /* Rosa */
  --background-dark: #1f2937; /* Fundo escuro do menu/painel */
  --card-bg: #374151; /* Fundo dos cards/seções */
  --text-light: #f3f4f6;
  --success: #10b981;
  --danger: #ef4444;
}

/* LAYOUT GERAL */
.pdv-wrapper {
  width: 100%; 
  padding: 0;
}

.main-content-pdv {
  padding: 20px;
  display: flex;
  gap: 20px;
  background-color: #2d3748; 
  min-height: calc(100vh - 80px);
}

/* SEÇÃO DE PRODUTOS E CADASTRO */
.products-section {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title-stock {
    color: var(--secondary-color);
    margin-bottom: 10px;
}
.title-new-product {
    color: var(--secondary-color);
    margin-bottom: 15px;
}

/* GRID DE PRODUTOS */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 5px;
}

.loading-message {
    color: #a0aec0;
    grid-column: 1 / -1;
    text-align: center;
    padding: 30px;
}

.product-card {
  background-color: var(--card-bg);
  color: var(--text-light);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 2px solid var(--secondary-color);
}

.product-image-wrapper {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}
.product-image-wrapper img {
    max-height: 100%;
    max-width: 100%;
    border-radius: 4px;
}
.product-name {
  font-weight: bold;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.product-price {
  color: var(--success);
  font-size: 1.2em;
}
.product-stock {
  font-size: 0.9em;
  color: #9ca3af;
}

/* ESTOQUE ESGOTADO */
.out-of-stock {
    opacity: 0.5;
    cursor: not-allowed;
    position: relative;
}
.stock-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: var(--danger);
    font-size: 1.5em;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}


/* SEÇÃO DE CADASTRO */
.admin-panel {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  color: var(--text-light);
}

.admin-form-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 0.9em;
    color: #a0aec0;
}
.form-control {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #4b5563;
  background-color: #1f2937;
  color: var(--text-light);
}
.image-upload-area {
    display: flex;
    align-items: flex-end;
    gap: 20px;
    margin-bottom: 20px;
    border-top: 1px solid #4b5563;
    padding-top: 20px;
}
.upload-preview {
    width: 60px;
    height: 60px;
    border: 2px dashed #a0aec0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.upload-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 2px;
}
.upload-controls {
    display: flex;
    align-items: center;
}
.upload-btn {
    background-color: var(--primary-color);
    color: white;
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}
.upload-btn:hover {
    background-color: #7c3aed;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #4b5563;
    padding-top: 15px;
}


/* SEÇÃO DO CARRINHO */
.cart-section {
  width: 350px;
  min-width: 350px;
  background-color: var(--card-bg);
  padding: 15px;
  border-radius: 8px;
  color: var(--text-light);
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.title-cart {
    color: var(--secondary-color);
}
.cart-items-wrapper {
    flex-grow: 1;
    overflow-y: auto;
    max-height: 450px;
    padding: 5px;
    margin-bottom: 10px;
}

.empty-cart-message {
  text-align: center;
  padding: 20px 0;
  color: #9ca3af;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #4b5563;
}
.item-name {
    font-weight: bold;
    flex-basis: 40%;
}
.item-details {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-basis: 60%;
    justify-content: flex-end;
}
.item-quantity-controls {
    display: flex;
    align-items: center;
    border: 1px solid #6b7280;
    border-radius: 4px;
}
.quantity-btn {
    background: transparent;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    padding: 4px 8px;
}
.quantity-value {
    padding: 0 5px;
}
.item-total {
    font-weight: bold;
    color: var(--secondary-color);
    min-width: 70px;
    text-align: right;
}
.remove-item-btn {
    background: transparent;
    color: var(--danger);
    border: none;
    cursor: pointer;
    font-size: 0.9em;
}

/* RESUMO E PAGAMENTO */
.cart-summary {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
}
.summary-row.total {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--secondary-color); 
  padding-top: 10px;
  margin-top: 10px;
}
.summary-value {
    font-weight: bold;
}

.payment-methods {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.payment-row {
    display: flex;
    gap: 5px;
    justify-content: space-between;
}

.payment-btn {
  flex-grow: 1;
  padding: 8px 10px;
  border: 1px solid #4b5563;
  background: #374151;
  color: var(--text-light);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.2s, border-color 0.2s;
}

.payment-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  font-weight: bold;
}

.action-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 15px;
}
.btn {
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    flex-grow: 1;
}

.cancel-btn {
  background: var(--danger);
  color: white;
}
.checkout-btn:disabled {
    background: #6b7280;
    cursor: not-allowed;
}

/* Notificação CSS */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1100;
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
}
.notification.show {
  transform: translateX(0);
}
.notification.error {
  background-color: var(--danger);
}
.notification:not(.error) {
  background-color: var(--success);
}
</style>