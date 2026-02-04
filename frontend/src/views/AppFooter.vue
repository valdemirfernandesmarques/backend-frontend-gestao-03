<template>
  <footer class="global-footer">
    <div class="footer-content">
      
      <div class="footer-spacer"></div>

      <div class="footer-center">
        <p class="brand">© 2026 Gestão em Dança</p>
        <span class="copyright">Todos os direitos reservados.</span>
      </div>

      <div class="footer-right">
        <span class="contact-label">Contato</span>
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=gestaoemdanca@gmail.com" 
          target="_blank"
          class="email-link"
        >
          <i class="fas fa-envelope"></i>
          <span class="email-text">gestaoemdanca@gmail.com</span>
        </a>
      </div>

    </div>
  </footer>
</template>

<script setup>
// Lógica simplificada: o link direto pelo href já resolve o problema de abertura
</script>

<style scoped>
.global-footer {
  background-color: #1a1a1a;
  color: white;
  padding: 20px 0;
  width: 100%;
  border-top: 3px solid #4da6ff;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
}

/* Sistema de 3 colunas para garantir o centro real */
.footer-spacer, .footer-center, .footer-right {
  flex: 1;
}

.footer-center {
  text-align: center;
}

.brand {
  margin: 0;
  font-weight: bold;
}

.copyright {
  font-size: 0.85rem;
  color: #ccc;
}

.footer-right { 
  display: flex; 
  flex-direction: column; 
  align-items: flex-end; 
}

.contact-label { 
  font-size: 0.75rem; 
  text-transform: uppercase; 
  margin-bottom: 5px; 
  color: #4da6ff; 
  font-weight: bold;
}

.email-link {
  color: white !important;
  text-decoration: none !important;
  display: flex !important;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  cursor: pointer !important;
}

.email-link i {
  font-size: 1.1rem;
  color: #4da6ff;
}

.email-link:hover { 
  color: #4da6ff !important; 
}

/* Responsividade */
@media (max-width: 768px) {
  .footer-content { 
    flex-direction: column; 
    text-align: center; 
    gap: 20px; 
    padding: 10px;
  }
  .footer-right { align-items: center; }
  .footer-spacer { display: none; }
}
</style>