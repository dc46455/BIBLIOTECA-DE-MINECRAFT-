/**
 * BIBLIOTECA OFICIAL DE MINECRAFT - LÓGICA DE TIENDA Y LECTOR
 */

// ==========================================
// ESTADO GLOBAL
// ==========================================
let books = [];
let cart = [];
let activeCategory = 'ALL';
let searchQuery = '';
let currentSort = 'default';

// Estado del lector
let currentReadingBookId = null;
let currentReadingPageIndex = 0;
let currentFontSize = 1.15; // en rem

// ==========================================
// ELEMENTOS DEL DOM
// ==========================================
const booksGrid = document.getElementById('booksGrid');
const resultsCount = document.getElementById('resultsCount');
const themeSelector = document.getElementById('themeSelector');
const logoReload = document.getElementById('logoReload');
const btnResetData = document.getElementById('btnResetData');

// Carrito de compras
const btnOpenCart = document.getElementById('btnOpenCart');
const cartBadge = document.getElementById('cartBadge');
const cartModal = document.getElementById('cartModal');
const btnCloseCartModal = document.getElementById('btnCloseCartModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartItemsSubtitle = document.getElementById('cartItemsSubtitle');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const btnClearCart = document.getElementById('btnClearCart');
const btnCheckout = document.getElementById('btnCheckout');

// Modal Checkout / Confirmación
const checkoutModal = document.getElementById('checkoutModal');
const checkoutReceipt = document.getElementById('checkoutReceipt');
const btnCloseCheckoutModal = document.getElementById('btnCloseCheckoutModal');

// Modal Lector
const readerModal = document.getElementById('readerModal');
const readerBookTitle = document.getElementById('readerBookTitle');
const readerBookAuthor = document.getElementById('readerBookAuthor');
const readerChapterTitle = document.getElementById('readerChapterTitle');
const readerContentText = document.getElementById('readerContentText');
const readerPageIndicator = document.getElementById('readerPageIndicator');
const readerProgressFill = document.getElementById('readerProgressFill');
const readerBody = document.getElementById('readerBody');
const btnPrevPage = document.getElementById('btnPrevPage');
const btnNextPage = document.getElementById('btnNextPage');
const btnCloseReader = document.getElementById('btnCloseReader');
const btnFontSmaller = document.getElementById('btnFontSmaller');
const btnFontBigger = document.getElementById('btnFontBigger');
const btnToggleReadStatus = document.getElementById('btnToggleReadStatus');
const readStatusIcon = document.getElementById('readStatusIcon');

// Notificaciones Toast
const toastContainer = document.getElementById('toastContainer');

// ==========================================
// INICIALIZACIÓN
// ==========================================
function initApp() {
  const CATALOG_VERSION = 'v5_minecraft_exclusive_4books_cart';
  const savedVersion = localStorage.getItem('library_catalog_ver');
  const savedBooks = localStorage.getItem('library_books_data');

  // Cargar libros: si la versión no coincide, forzar el catálogo exclusivo de los 4 libros
  if (savedBooks && savedVersion === CATALOG_VERSION) {
    try {
      books = JSON.parse(savedBooks);
    } catch (e) {
      books = [...INITIAL_BOOKS];
    }
  } else {
    // Reemplaza por los 4 libros de Minecraft manteniendo estados de lectura o favoritos si ya existían
    let existingMap = {};
    if (savedBooks) {
      try {
        const parsed = JSON.parse(savedBooks);
        parsed.forEach(b => { existingMap[b.id] = b; });
      } catch (e) {}
    }

    books = INITIAL_BOOKS.map(initBook => {
      if (existingMap[initBook.id]) {
        return {
          ...initBook,
          isFavorite: existingMap[initBook.id].isFavorite ?? initBook.isFavorite,
          isRead: existingMap[initBook.id].isRead ?? initBook.isRead,
          currentPage: existingMap[initBook.id].currentPage ?? 1
        };
      }
      return { ...initBook };
    });

    localStorage.setItem('library_catalog_ver', CATALOG_VERSION);
    saveBooks();
  }

  // Cargar carrito de compras guardado
  try {
    const savedCart = localStorage.getItem('minecraft_library_cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    cart = [];
  }

  // Cargar tema guardado (Minecraft por defecto)
  const savedTheme = localStorage.getItem('library_theme') || 'minecraft';
  applyTheme(savedTheme);
  if (themeSelector) themeSelector.value = savedTheme;

  // Renderizar vistas
  updateCartBadge();
  updateStats();
  renderBooks();
  setupEventListeners();
}

function saveBooks() {
  localStorage.setItem('library_books_data', JSON.stringify(books));
}

function saveCart() {
  localStorage.setItem('minecraft_library_cart', JSON.stringify(cart));
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('library_theme', theme);
}

// ==========================================
// CARRITO DE COMPRAS
// ==========================================
function addToCart(bookId, event) {
  if (event) event.stopPropagation();

  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const existingItem = cart.find(item => item.id === bookId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: book.id,
      title: book.title,
      price: book.price || 14.99,
      cover: book.cover,
      category: book.category,
      quantity: 1
    });
  }

  saveCart();
  updateCartBadge();
  updateStats();
  renderBooks(); // Actualiza el botón en la tarjeta del libro

  // Animación del botón del carrito
  if (cartBadge) {
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 250);
  }

  showToast(`🛒 "${book.title}" añadido al carrito`, 'success');
}

function removeFromCart(bookId) {
  const item = cart.find(i => i.id === bookId);
  cart = cart.filter(i => i.id !== bookId);
  saveCart();
  updateCartBadge();
  updateStats();
  renderBooks();
  renderCart();

  if (item) {
    showToast(`Eliminado "${item.title}" del carrito`, 'info');
  }
}

function changeCartQuantity(bookId, delta) {
  const item = cart.find(i => i.id === bookId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(bookId);
    return;
  }

  saveCart();
  updateCartBadge();
  updateStats();
  renderCart();
  renderBooks();
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm('¿Deseas vaciar todos los libros de tu carrito?')) {
    cart = [];
    saveCart();
    updateCartBadge();
    updateStats();
    renderBooks();
    renderCart();
    showToast('El carrito ha sido vaciado.', 'info');
  }
}

function openCart() {
  renderCart();
  cartModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartModal.classList.remove('active');
  document.body.style.overflow = '';
}

function updateCartBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalCount;
  }
}

function renderCart() {
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItemsSubtitle) {
    cartItemsSubtitle.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'libro seleccionado' : 'libros seleccionados'}`;
  }

  if (cartSubtotal) {
    cartSubtotal.textContent = `$${subtotalPrice.toFixed(2)} USD`;
  }

  if (cartTotal) {
    cartTotal.textContent = `$${subtotalPrice.toFixed(2)} USD`;
  }

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty-view">
        <div class="cart-empty-icon">🛒</div>
        <h4>Tu carrito está vacío</h4>
        <p>Añade cualquiera de los libros oficiales de Minecraft para comenzar tu lectura.</p>
        <button class="btn btn-primary" onclick="closeCart()">Ver Catálogo</button>
      </div>
    `;
    if (btnClearCart) btnClearCart.style.display = 'none';
    if (btnCheckout) {
      btnCheckout.disabled = true;
      btnCheckout.style.opacity = '0.5';
      btnCheckout.style.cursor = 'not-allowed';
    }
    return;
  }

  if (btnClearCart) btnClearCart.style.display = 'block';
  if (btnCheckout) {
    btnCheckout.disabled = false;
    btnCheckout.style.opacity = '1';
    btnCheckout.style.cursor = 'pointer';
  }

  cartItemsContainer.innerHTML = cart.map(item => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    return `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" class="cart-item-thumb" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%22%20width=%2250%22%20height=%2270%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%232e7d32%22/></svg>';">
        
        <div class="cart-item-info">
          <div class="cart-item-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</div>
          <div class="cart-item-unit-price">$${item.price.toFixed(2)} c/u</div>
        </div>

        <div class="cart-quantity-controls">
          <button class="btn-qty" onclick="changeCartQuantity('${item.id}', -1)" title="Reducir">－</button>
          <span class="cart-qty-value">${item.quantity}</span>
          <button class="btn-qty" onclick="changeCartQuantity('${item.id}', 1)" title="Aumentar">＋</button>
        </div>

        <div class="cart-item-subtotal">$${itemTotal}</div>

        <button class="btn-remove-item" onclick="removeFromCart('${item.id}')" title="Eliminar del carrito">
          ✕
        </button>
      </div>
    `;
  }).join('');
}

function processCheckout() {
  if (cart.length === 0) {
    showToast('El carrito está vacío.', 'danger');
    return;
  }

  const subtotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Renderizar resumen en el modal de confirmación
  if (checkoutReceipt) {
    const itemsHtml = cart.map(item => `
      <div class="receipt-item-row">
        <span>${escapeHtml(item.title)} (x${item.quantity})</span>
        <span>$${(item.price * item.quantity).toFixed(2)} USD</span>
      </div>
    `).join('');

    checkoutReceipt.innerHTML = `
      ${itemsHtml}
      <div class="receipt-total-row">
        <span>Total Pagado:</span>
        <span>$${subtotalPrice.toFixed(2)} USD</span>
      </div>
    `;
  }

  // Marcar los libros comprados como adquiridos
  closeCart();
  checkoutModal.classList.add('active');

  // Vaciar carrito
  cart = [];
  saveCart();
  updateCartBadge();
  updateStats();
  renderBooks();
  showToast('🎉 ¡Compra completada con éxito!', 'success');
}

function closeCheckoutModal() {
  checkoutModal.classList.remove('active');
  document.body.style.overflow = '';
}

function updateStats() {
  // Las tarjetas de estadísticas fueron removidas de la interfaz
}

// ==========================================
// RENDERIZADO DEL CATÁLOGO
// ==========================================
function getFilteredAndSortedBooks() {
  return [...books];
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderBooks() {
  const filtered = getFilteredAndSortedBooks();

  if (resultsCount) {
    resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'libro disponible' : 'libros disponibles'}`;
  }

  if (filtered.length === 0) {
    booksGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⛏️</div>
        <h3>No se encontraron libros</h3>
        <p>Prueba ajustando el término de búsqueda o selecciona otra categoría.</p>
        <button class="btn btn-primary" onclick="resetFilters()">Mostrar los 4 libros</button>
      </div>
    `;
    return;
  }

  booksGrid.innerHTML = filtered.map(book => {
    const stars = '⭐'.repeat(book.rating || 5);
    const itemInCart = cart.find(i => i.id === book.id);
    const inCartQty = itemInCart ? itemInCart.quantity : 0;

    const coverHtml = `<img src="${escapeHtml(book.cover)}" alt="${escapeHtml(book.title)}" class="book-cover-img" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'book-cover-fallback\\' style=\\'background: linear-gradient(135deg, ${book.coverColor || '#2e7d32'}, #0f172a);\\'><span class=\\'icon\\'>⛏️</span><h4>${escapeHtml(book.title)}</h4></div>';">`;

    return `
      <article class="book-card" data-id="${book.id}">
        <div class="book-cover-wrap">
          ${coverHtml}
          <span class="book-badge-category">${escapeHtml(book.category || 'Minecraft')}</span>
          <button class="book-fav-btn ${book.isFavorite ? 'active' : ''}" 
                  onclick="toggleFavorite('${book.id}', event)" 
                  title="${book.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
            ★
          </button>
          ${book.isRead ? '<span class="book-read-badge">✓ LEÍDO</span>' : ''}
        </div>

        <div class="book-details">
          <h3 class="book-title" title="${escapeHtml(book.title)}">${escapeHtml(book.title)}</h3>
          <div class="book-author">Por ${escapeHtml(book.author)}</div>

          <div class="book-meta">
            <span class="book-stars" title="${book.rating || 5} estrellas">${stars}</span>
            <span>•</span>
            <span>${book.pages} págs</span>
            <span>•</span>
            <span>${book.year}</span>
          </div>

          <div class="book-price-row">
            <span class="book-price">$${(book.price || 14.99).toFixed(2)} USD</span>
            <span class="badge-digital">Digital • Inmediato</span>
          </div>

          <p class="book-synopsis">${escapeHtml(book.synopsis || '')}</p>

          <div class="book-actions-cart">
            <button class="btn-read-sample" onclick="openReader('${book.id}')" title="Leer muestra o contenido completo">
              <span>📖</span> Leer
            </button>
            <button class="btn-add-cart ${inCartQty > 0 ? 'in-cart' : ''}" onclick="addToCart('${book.id}', event)" title="Añadir libro al carrito de compra">
              <span>🛒</span> ${inCartQty > 0 ? `En Carrito (${inCartQty})` : 'Añadir al Carrito'}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function resetFilters() {
  renderBooks();
}

function toggleFavorite(bookId, event) {
  if (event) event.stopPropagation();
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  book.isFavorite = !book.isFavorite;
  saveBooks();
  updateStats();
  renderBooks();
  showToast(book.isFavorite ? `"${book.title}" añadido a Favoritos ⭐` : `Quitado de Favoritos`, 'info');
}

// ==========================================
// LECTOR INTERACTIVO (READER)
// ==========================================
function openReader(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  currentReadingBookId = bookId;

  if (!book.content || !Array.isArray(book.content) || book.content.length === 0) {
    book.content = [
      {
        title: "Lectura Principal",
        text: book.synopsis || "Guía oficial de Minecraft."
      }
    ];
  }

  currentReadingPageIndex = (book.currentPage && book.currentPage <= book.content.length) 
    ? (book.currentPage - 1) 
    : 0;

  updateReaderUI();
  readerModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeReader() {
  if (currentReadingBookId) {
    const book = books.find(b => b.id === currentReadingBookId);
    if (book) {
      book.currentPage = currentReadingPageIndex + 1;
      saveBooks();
    }
  }

  readerModal.classList.remove('active');
  document.body.style.overflow = '';
  currentReadingBookId = null;
}

function updateReaderUI() {
  const book = books.find(b => b.id === currentReadingBookId);
  if (!book || !book.content) return;

  const totalPages = book.content.length;
  const currentPageData = book.content[currentReadingPageIndex] || { title: "Capítulo", text: "" };

  readerBookTitle.textContent = book.title;
  readerBookAuthor.textContent = `Por ${book.author}`;
  readerChapterTitle.textContent = currentPageData.title || `Capítulo ${currentReadingPageIndex + 1}`;

  const paragraphs = (currentPageData.text || '')
    .split('\n\n')
    .map(p => `<p class="reader-text-paragraph">${escapeHtml(p)}</p>`)
    .join('');

  readerContentText.innerHTML = paragraphs;
  readerPageIndicator.textContent = `Capítulo ${currentReadingPageIndex + 1} de ${totalPages}`;
  
  const progressPercent = Math.round(((currentReadingPageIndex + 1) / totalPages) * 100);
  readerProgressFill.style.width = `${progressPercent}%`;

  btnPrevPage.disabled = currentReadingPageIndex === 0;
  btnPrevPage.style.opacity = currentReadingPageIndex === 0 ? '0.4' : '1';

  btnNextPage.disabled = currentReadingPageIndex >= totalPages - 1;
  btnNextPage.style.opacity = (currentReadingPageIndex >= totalPages - 1) ? '0.4' : '1';

  if (book.isRead) {
    btnToggleReadStatus.style.background = 'var(--success)';
    btnToggleReadStatus.style.color = '#ffffff';
    btnToggleReadStatus.innerHTML = '<span>✓</span> Leído';
  } else {
    btnToggleReadStatus.style.background = 'rgba(0,0,0,0.08)';
    btnToggleReadStatus.style.color = 'inherit';
    btnToggleReadStatus.innerHTML = '<span>○</span> Marcar Leído';
  }

  readerBody.scrollTop = 0;
}

function toggleReadStatus() {
  const book = books.find(b => b.id === currentReadingBookId);
  if (!book) return;

  book.isRead = !book.isRead;
  saveBooks();
  updateStats();
  renderBooks();
  updateReaderUI();

  showToast(book.isRead ? '¡Marcado como leído! ✅' : 'Marcado como pendiente de lectura', 'info');
}

function adjustFontSize(delta) {
  currentFontSize = Math.max(0.85, Math.min(1.8, currentFontSize + delta));
  readerBody.style.fontSize = `${currentFontSize}rem`;
}

function setReaderTheme(themeName) {
  const box = document.querySelector('.reader-modal-box');
  if (!box) return;

  if (themeName === 'sepia') {
    box.style.setProperty('--reader-bg', '#fdf6e2');
    box.style.setProperty('--reader-text', '#2c2523');
    box.style.setProperty('--reader-border', '#e2d7be');
  } else if (themeName === 'white') {
    box.style.setProperty('--reader-bg', '#ffffff');
    box.style.setProperty('--reader-text', '#111827');
    box.style.setProperty('--reader-border', '#e5e7eb');
  } else if (themeName === 'night') {
    box.style.setProperty('--reader-bg', '#18191c');
    box.style.setProperty('--reader-text', '#d1d5db');
    box.style.setProperty('--reader-border', '#374151');
  }
}

// ==========================================
// TOAST NOTIFICACIONES
// ==========================================
function showToast(message, type = 'info') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'danger' ? 'danger' : type === 'success' ? 'success' : ''}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// ==========================================
// CONFIGURACIÓN DE LISTENERS
// ==========================================
function setupEventListeners() {


  // Tema
  themeSelector.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });

  // Carrito de compras
  btnOpenCart.addEventListener('click', openCart);
  btnCloseCartModal.addEventListener('click', closeCart);
  if (btnClearCart) btnClearCart.addEventListener('click', clearCart);
  if (btnCheckout) btnCheckout.addEventListener('click', processCheckout);

  // Modal checkout
  if (btnCloseCheckoutModal) btnCloseCheckoutModal.addEventListener('click', closeCheckoutModal);

  // Lector
  btnCloseReader.addEventListener('click', closeReader);
  btnFontSmaller.addEventListener('click', () => adjustFontSize(-0.15));
  btnFontBigger.addEventListener('click', () => adjustFontSize(0.15));
  btnToggleReadStatus.addEventListener('click', toggleReadStatus);

  btnPrevPage.addEventListener('click', () => {
    if (currentReadingPageIndex > 0) {
      currentReadingPageIndex--;
      updateReaderUI();
    }
  });

  btnNextPage.addEventListener('click', () => {
    const book = books.find(b => b.id === currentReadingBookId);
    if (book && book.content && currentReadingPageIndex < book.content.length - 1) {
      currentReadingPageIndex++;
      updateReaderUI();
    }
  });

  // Temas del lector
  const readerThemeBtns = document.querySelectorAll('.reader-theme-btn');
  readerThemeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setReaderTheme(btn.getAttribute('data-readertheme'));
    });
  });

  // Clic fuera para cerrar modales
  window.addEventListener('click', (e) => {
    if (e.target === readerModal) closeReader();
    if (e.target === cartModal) closeCart();
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  // Tecla Escape y flechas
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (readerModal.classList.contains('active')) closeReader();
      if (cartModal.classList.contains('active')) closeCart();
      if (checkoutModal.classList.contains('active')) closeCheckoutModal();
    }
    if (readerModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft' && currentReadingPageIndex > 0) {
        currentReadingPageIndex--;
        updateReaderUI();
      } else if (e.key === 'ArrowRight') {
        const book = books.find(b => b.id === currentReadingBookId);
        if (book && book.content && currentReadingPageIndex < book.content.length - 1) {
          currentReadingPageIndex++;
          updateReaderUI();
        }
      }
    }
  });

  // Logo recargar
  if (logoReload) {
    logoReload.addEventListener('click', resetFilters);
  }

  // Restaurar catálogo predeterminado
  if (btnResetData) {
    btnResetData.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Deseas restaurar la colección oficial de los 4 libros de Minecraft?')) {
        books = [...INITIAL_BOOKS];
        cart = [];
        saveBooks();
        saveCart();
        updateCartBadge();
        updateStats();
        renderBooks();
        showToast('Colección oficial restaurada.', 'info');
      }
    });
  }
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', initApp);
