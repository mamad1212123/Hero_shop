/**
 * Hero Shop - Main Vanilla JavaScript
 * Multi-page state, Cart management, Telegram order link builder,
 * Server IP copy, and Interactive UI controls.
 * Zero-framework, fully compatible with Cloudflare Pages drag-and-drop.
 */

// Server configuration
const SERVER_CONFIG = {
  ip: '185.141.105.216:6784',
  telegramUser: 'HeroShop_Support',
  telegramChannel: 'HeroShop_MC',
  discordInvite: 'https://discord.gg/heroshop'
};

// Available Rank Perks Data for quick viewing / comparisons
const RANK_DATA = {
  'vip': {
    id: 'vip',
    name: '👑 VIP',
    price: 50,
    priceToman: '۵۰,۰۰۰ تومان',
    badge: '👑 VIP',
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    description: 'شروع ماجراجویی حرفه‌ای در سرور',
    colorClass: 'rank-vip',
    icon: 'military_tech',
    perks: [
      'دسترسی به دستور /fly در لابی و کلیم اختصاصی',
      'پرمیشن ست کردن ۲ عدد Home بیشتر',
      'Prefix اختصاصی [VIP] طلایی در چت و تب',
      'کیت روزانه VIP شامل ابزار آرمور آیرون انچنت‌شده',
      'اولویت ورود به سرور در زمان شلوغی',
      'رنگ اختصاصی چت زرد/طلایی'
    ]
  },
  'mvp': {
    id: 'mvp',
    name: '⚡ MVP',
    price: 100,
    priceToman: '۱۰۰,۰۰۰ تومان',
    badge: '⚡ MVP',
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
    description: 'قدرت بالاتر در بتل‌ها و بقا',
    colorClass: 'rank-mvp',
    icon: 'bolt',
    perks: [
      'تمام امکانات و پرمیشن‌های رنک VIP',
      'دسترسی به دستور /feed و /heal با کول‌دان کوتاه',
      'پرمیشن ست کردن ۵ عدد Home',
      'Prefix اختصاصی [MVP] آبی در چت و لیست آنلاین',
      'کیت روزانه دایمند با انچنت‌های سطح ۲',
      'دسترسی به دستور /workbench و /hat در هر مکان',
      'امکان تغییر رنگ Nickname با کدهای رنگی'
    ]
  },
  'elite': {
    id: 'elite',
    name: '💎 ELITE',
    price: 170,
    priceToman: '۱۷۰,۰۰۰ تومان',
    badge: '💎 ELITE',
    badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    description: 'برای بازیکنان نخبه و جنگجویان سرور',
    colorClass: 'rank-elite',
    icon: 'diamond',
    perks: [
      'تمام امکانات رنک‌های VIP و MVP',
      'دسترسی به دستور /enderchest همراه و همیشه در دسترس',
      'پرمیشن ست کردن ۱۰ عدد Home',
      'Prefix اختصاصی [ELITE] بنفش درخشان',
      'کیت اختصاصی ندرایت با محافظت Protection IV',
      'افکت‌های ذره‌ای (Particles) دور کاراکتر هنگام راه رفتن',
      'دسترسی اختصاصی به منطقه VIP و شاپ خصوصی سرور'
    ]
  },
  'legend': {
    id: 'legend',
    name: '🔥 LEGEND',
    price: 300,
    priceToman: '۳۰۰,۰۰۰ تومان',
    badge: '🔥 LEGEND',
    badgeColor: 'text-primary-container bg-primary-container/10 border-primary-container/50',
    description: 'بالاترین مقام و رتبه سلطنتی سرور هیرو شاپ',
    colorClass: 'rank-legend',
    icon: 'workspace_premium',
    perks: [
      'تمام امکانات بی‌نظیر ELITE و سطوح قبلی',
      'بالاترین سطح دسترسی سرور (سقف مجاز پرمیشن‌ها)',
      'تعداد Home نامحدود و دسترسی به پرواز در تمام دنیاها',
      'Prefix اختصاصی و آتشین [LEGEND] با افکت شاین',
      'کیت افسانه‌ای ندرایت مکس + شمشیر آتشین خدایان',
      'تضمین ضد باخت در هنگام مرگ (Keep Inventory فعال)',
      'امکان ساخت و مدیریت فکشن یا کلن با سقف نفرات دوبل',
      'تیکت و پشتیبانی آنی اختصاصی با رول VIP در دیسکورد'
    ]
  }
};

// Cart Management System using localStorage
const CartManager = {
  STORAGE_KEY: 'heroshop_cart_items',
  GAMERTAG_KEY: 'heroshop_user_gamertag',

  getItems() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        // Default initial items as demonstrated in Stitch screen
        { id: 'vip', name: '👑 VIP', price: 50, quantity: 1, icon: 'military_tech' },
        { id: 'legend', name: '🔥 LEGEND', price: 300, quantity: 1, icon: 'bolt' }
      ];
    } catch (e) {
      return [];
    }
  },

  saveItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
    this.updateBadges();
    this.renderDrawer();
  },

  addItem(rankId, customName = null, customPrice = null) {
    const items = this.getItems();
    const rank = RANK_DATA[rankId];
    const name = customName || (rank ? rank.name : rankId);
    const price = customPrice !== null ? customPrice : (rank ? rank.price : 50);
    const icon = rank ? rank.icon : 'star';

    const existingIndex = items.findIndex(item => item.id === rankId);
    if (existingIndex > -1) {
      items[existingIndex].quantity += 1;
    } else {
      items.push({ id: rankId, name, price, quantity: 1, icon });
    }

    this.saveItems(items);
    showToast(`رنک ${name} به سبد خرید اضافه شد!`);
  },

  removeItem(rankId) {
    let items = this.getItems();
    items = items.filter(item => item.id !== rankId);
    this.saveItems(items);
    showToast('آیتم از سبد خرید حذف شد.');
  },

  updateQuantity(rankId, delta) {
    const items = this.getItems();
    const target = items.find(item => item.id === rankId);
    if (target) {
      target.quantity += delta;
      if (target.quantity <= 0) {
        this.removeItem(rankId);
        return;
      }
      this.saveItems(items);
    }
  },

  clearCart() {
    this.saveItems([]);
    showToast('سبد خرید خالی شد.');
  },

  getTotalCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getGamertag() {
    return localStorage.getItem(this.GAMERTAG_KEY) || '';
  },

  setGamertag(tag) {
    localStorage.setItem(this.GAMERTAG_KEY, tag.trim());
    updateUserGamertagDisplay();
  },

  updateBadges() {
    const count = this.getTotalCount();
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(b => {
      b.textContent = count;
      if (count > 0) {
        b.classList.remove('hidden');
        b.classList.add('flex');
      } else {
        b.classList.remove('flex');
        b.classList.add('hidden');
      }
    });
  },

  renderDrawer() {
    const drawerList = document.getElementById('cart-items-list');
    const drawerTotal = document.getElementById('cart-total-price');
    const drawerEmpty = document.getElementById('cart-empty-message');
    const drawerFooter = document.getElementById('cart-drawer-footer');

    if (!drawerList || !drawerTotal) return;

    const items = this.getItems();
    if (items.length === 0) {
      drawerList.innerHTML = '';
      if (drawerEmpty) drawerEmpty.classList.remove('hidden');
      if (drawerFooter) drawerFooter.classList.add('opacity-50', 'pointer-events-none');
      drawerTotal.textContent = '۰ کوین';
      return;
    }

    if (drawerEmpty) drawerEmpty.classList.add('hidden');
    if (drawerFooter) drawerFooter.classList.remove('opacity-50', 'pointer-events-none');

    drawerList.innerHTML = items.map(item => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-high/60 border border-outline-variant/30">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary-container">
            <span class="material-symbols-outlined text-[18px]">${item.icon || 'military_tech'}</span>
          </div>
          <div class="flex flex-col">
            <span class="font-label-md text-label-md text-on-surface font-bold">${item.name}</span>
            <span class="font-label-sm text-label-sm text-primary-container font-mono">💰 ${item.price} کوین</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5 bg-surface-container-lowest rounded-lg p-1">
          <button onclick="CartManager.updateQuantity('${item.id}', -1)" class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container-high active:scale-95 transition-all text-xs font-bold">-</button>
          <span class="w-6 text-center font-mono font-bold text-xs text-on-surface">${item.quantity}</span>
          <button onclick="CartManager.updateQuantity('${item.id}', 1)" class="w-6 h-6 flex items-center justify-center rounded text-on-surface hover:bg-surface-container-high active:scale-95 transition-all text-xs font-bold">+</button>
        </div>
        <button onclick="CartManager.removeItem('${item.id}')" class="text-error hover:text-error/80 p-1 text-xs" title="حذف">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `).join('');

    const total = this.getTotalPrice();
    drawerTotal.textContent = `${total} کوین (${total * 1000} تومان)`;
  }
};

// Global Toast Notification Helper
function showToast(message, isSuccess = true) {
  let toast = document.getElementById('shop-toast');
  let toastText = document.getElementById('toast-message');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'shop-toast';
    toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 transition-all duration-300 transform -translate-y-2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-highest/95 text-primary-container font-label-md text-label-md shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md border border-primary-container/30';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[18px]" id="toast-icon">check_circle</span>
      <span id="toast-message"></span>
    `;
    document.body.appendChild(toast);
    toastText = document.getElementById('toast-message');
  }

  const toastIcon = document.getElementById('toast-icon');
  if (toastIcon) {
    toastIcon.textContent = isSuccess ? 'check_circle' : 'info';
  }

  toastText.textContent = message;
  toast.classList.remove('opacity-0', '-translate-y-2');
  toast.classList.add('opacity-100', 'translate-y-0');

  if (window.toastTimeout) clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', '-translate-y-2');
  }, 2600);
}

// Server IP Copy helper
function copyServerIp() {
  const ip = SERVER_CONFIG.ip;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(ip).then(() => {
      showToast('آدرس آی‌پی سرور کپی شد: ' + ip);
    }).catch(() => {
      promptCopyFallback(ip);
    });
  } else {
    promptCopyFallback(ip);
  }
}

function promptCopyFallback(ip) {
  const tempInput = document.createElement('input');
  tempInput.value = ip;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast('آدرس آی‌پی سرور کپی شد: ' + ip);
}

// Cart Drawer Controls
function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  if (!drawer) return;
  CartManager.renderDrawer();
  
  // Pre-fill gamertag in cart input if stored
  const gamertagInput = document.getElementById('cart-gamertag-input');
  if (gamertagInput) {
    gamertagInput.value = CartManager.getGamertag();
  }

  drawer.classList.remove('translate-x-full');
  if (backdrop) backdrop.classList.remove('hidden', 'opacity-0');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  if (!drawer) return;
  drawer.classList.add('translate-x-full');
  if (backdrop) {
    backdrop.classList.add('opacity-0');
    setTimeout(() => backdrop.classList.add('hidden'), 300);
  }
  document.body.style.overflow = '';
}

// Telegram Order Checkout Function
function checkoutWithTelegram() {
  const items = CartManager.getItems();
  if (items.length === 0) {
    showToast('سبد خرید شما خالی است!', false);
    return;
  }

  const gamertagInput = document.getElementById('cart-gamertag-input');
  let gamertag = gamertagInput ? gamertagInput.value.trim() : CartManager.getGamertag();

  if (!gamertag) {
    showToast('لطفاً نام کاربری (گیم‌تگ ماینکرفت) خود را وارد کنید.', false);
    if (gamertagInput) gamertagInput.focus();
    return;
  }

  CartManager.setGamertag(gamertag);

  const totalCoins = CartManager.getTotalPrice();
  const totalToman = (totalCoins * 1000).toLocaleString('fa-IR');

  const itemsList = items.map(it => `• ${it.name} (تعداد: ${it.quantity}) - ${it.price * it.quantity} کوین`).join('\n');

  const message = `سلام، من می‌خواهم سفارش رنک در سرور هیرو شاپ ثبت کنم:
🎮 گیم‌تگ ماینکرفت: ${gamertag}
🛒 اقلام انتخابی:
${itemsList}
💰 مبلغ کل: ${totalCoins} کوین (${totalToman} تومان)
🌐 آی‌پی سرور: ${SERVER_CONFIG.ip}
لطفاً راهنمایی جهت پرداخت و فعال‌سازی فوری را ارسال فرمایید. تشکر!`;

  const encoded = encodeURIComponent(message);
  const telegramUrl = `https://t.me/${SERVER_CONFIG.telegramUser}?text=${encoded}`;

  window.open(telegramUrl, '_blank');
  showToast('در حال انتقال به تلگرام جهت ثبت سفارش...', true);
}

// Direct Buy Single Item via Telegram
function directBuyTelegram(rankId) {
  const rank = RANK_DATA[rankId];
  if (!rank) return;
  
  let gamertag = CartManager.getGamertag();
  if (!gamertag) {
    gamertag = prompt('لطفاً نام کاربری ماینکرفت (گیم‌تگ) خود را وارد نمایید:') || '';
    if (gamertag.trim()) {
      CartManager.setGamertag(gamertag);
    }
  }

  const message = `سلام، قصد خرید مستقیم رنک زیر را دارم:
👑 رنک انتخابی: ${rank.name}
🎮 گیم‌تگ ماینکرفت: ${gamertag || 'اعلام می‌شود'}
💰 تعرفه: ${rank.price} کوین (${rank.priceToman})
🌐 آی‌پی سرور: ${SERVER_CONFIG.ip}
لطفاً اطلاعات پرداخت و درگاه را ارسال نمایید.`;

  const encoded = encodeURIComponent(message);
  const telegramUrl = `https://t.me/${SERVER_CONFIG.telegramUser}?text=${encoded}`;
  window.open(telegramUrl, '_blank');
}

// Perks Comparison Modal
function openPerksModal(rankId) {
  const rank = RANK_DATA[rankId];
  if (!rank) return;

  let modal = document.getElementById('perks-modal');
  if (!modal) return;

  const modalTitle = document.getElementById('perks-modal-title');
  const modalBadge = document.getElementById('perks-modal-badge');
  const modalDesc = document.getElementById('perks-modal-desc');
  const modalPrice = document.getElementById('perks-modal-price');
  const modalList = document.getElementById('perks-modal-list');
  const modalBuyBtn = document.getElementById('perks-modal-buy-btn');

  if (modalTitle) modalTitle.textContent = rank.name;
  if (modalBadge) {
    modalBadge.textContent = rank.badge;
    modalBadge.className = `px-2 py-0.5 rounded text-xs font-mono font-bold ${rank.badgeColor}`;
  }
  if (modalDesc) modalDesc.textContent = rank.description;
  if (modalPrice) modalPrice.textContent = `${rank.price} کوین (${rank.priceToman})`;

  if (modalList) {
    modalList.innerHTML = rank.perks.map(p => `
      <li class="flex items-start gap-2 text-sm text-on-surface">
        <span class="material-symbols-outlined text-primary-container text-[18px] flex-shrink-0 mt-0.5">verified</span>
        <span>${p}</span>
      </li>
    `).join('');
  }

  if (modalBuyBtn) {
    modalBuyBtn.onclick = () => {
      CartManager.addItem(rank.id);
      closePerksModal();
      openCart();
    };
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePerksModal() {
  const modal = document.getElementById('perks-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// User Gamertag Account Modal
function openAccountModal() {
  const modal = document.getElementById('account-modal');
  if (!modal) return;
  const input = document.getElementById('account-gamertag-input');
  if (input) {
    input.value = CartManager.getGamertag();
  }
  updateUserGamertagDisplay();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAccountModal() {
  const modal = document.getElementById('account-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

function saveAccountGamertag() {
  const input = document.getElementById('account-gamertag-input');
  if (!input) return;
  const tag = input.value.trim();
  if (!tag) {
    showToast('لطفاً نام کاربری را وارد کنید', false);
    return;
  }
  CartManager.setGamertag(tag);
  showToast(`نام کاربری ${tag} ذخیره شد!`);
  closeAccountModal();
}

function updateUserGamertagDisplay() {
  const tag = CartManager.getGamertag();
  const label = document.getElementById('header-gamertag-label');
  const avatar = document.getElementById('header-user-avatar');
  if (label) {
    label.textContent = tag || 'ورود';
  }
  if (avatar && tag) {
    // Show Minecraft skin head using Minotar free avatar API
    avatar.src = `https://minotar.net/avatar/${tag}/32.png`;
    avatar.classList.remove('hidden');
  }
}

// FAQ Accordion Toggle
function toggleFaq(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector('.material-symbols-outlined');
  const isOpen = !content.classList.contains('hidden');

  document.querySelectorAll('#faq-accordion .hidden').forEach(el => {
    if (el !== content) {
      el.classList.add('hidden');
      const otherIcon = el.previousElementSibling?.querySelector('.material-symbols-outlined');
      if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
    }
  });

  if (isOpen) {
    content.classList.add('hidden');
    if (icon) icon.style.transform = 'rotate(0deg)';
  } else {
    content.classList.remove('hidden');
    if (icon) icon.style.transform = 'rotate(180deg)';
  }
}

// Active Nav highlight
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('[data-nav-page]');
  navLinks.forEach(link => {
    const targetPage = link.getAttribute('data-nav-page');
    if (targetPage === currentPath || (currentPath === '' && targetPage === 'index.html')) {
      link.classList.add('text-primary-container', 'font-bold');
      link.classList.remove('text-on-surface-variant');
      const icon = link.querySelector('.material-symbols-outlined');
      if (icon) icon.classList.add('text-primary-container');
    }
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  CartManager.updateBadges();
  updateUserGamertagDisplay();
  initActiveNav();

  // Close modals on clicking backdrop
  document.addEventListener('click', (e) => {
    if (e.target.id === 'cart-drawer-backdrop') {
      closeCart();
    }
    if (e.target.id === 'perks-modal') {
      closePerksModal();
    }
    if (e.target.id === 'account-modal') {
      closeAccountModal();
    }
  });

  // ESC key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closePerksModal();
      closeAccountModal();
    }
  });
});
