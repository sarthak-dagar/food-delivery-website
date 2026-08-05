var swiper = new Swiper('.mySwiper', {
    loop: true,
    navigation: { nextEl: '#next', prevEl: '#prev' },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const hamburgerIcon = document.querySelector('.hamburger i');
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubmit = document.getElementById('authSubmit');
const authName = document.getElementById('authName');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSwitch = document.getElementById('authSwitch');
const orderList = document.getElementById('orderList');
const signInBtn = document.getElementById('signInBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

let token = localStorage.getItem('token');
let userName = localStorage.getItem('userName');
let isSignup = false;
let productList = [];
let cartItems = [];

cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartTab.classList.add('cart-tab-active');
});
closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartTab.classList.remove('cart-tab-active');
});
hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu.classList.toggle('mobile-menu-active');
    hamburgerIcon.classList.toggle('fa-bars');
    hamburgerIcon.classList.toggle('fa-xmark');
});

const api = (url, options = {}) => fetch(url, {
    ...options,
    headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {})
    }
});

const showCards = () => {
    productList.forEach(product => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');
        orderCard.innerHTML = `
        <div class="card-image">
            <img src="${product.image}">
        </div>
        <h4>${product.name}</h4>
        <h4 class="price">${product.price}</h4>
        <a href="#" class="btn card-btn">Add to Cart</a>
        `;
        cardList.appendChild(orderCard);
        orderCard.querySelector('.card-btn').addEventListener('click', (e) => {
            e.preventDefault();
            addToCart(product);
        });
    });
};

const updateTotals = () => {
    let totalPrice = 0;
    let totalQuantity = 0;
    document.querySelectorAll('.item').forEach(item => {
        totalPrice += parseFloat(item.querySelector('.item-total').textContent.replace('$', ''));
        totalQuantity += parseInt(item.querySelector('.quantity-value').textContent);
    });
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    cartValue.textContent = totalQuantity;
};

const addToCart = async (product) => {
    if (!token) {
        alert('Pehle Sign In karo!');
        authModal.classList.add('modal-active');
        return;
    }
    const res = await api('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id, quantity: 1 })
    });
    const data = await res.json();
    if (res.ok) loadCart();
    else alert(data.message || 'Add to cart failed');
};

const renderCart = () => {
    cartList.innerHTML = '';
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('item');
        const price = parseFloat(item.product.price.replace('$', ''));
        cartItem.innerHTML = `
        <div class="item-image"><img src="${item.product.image}"></div>
        <div class="detail">
          <h4>${item.product.name}</h4>
          <h4 class="item-total">$${(price * item.quantity).toFixed(2)}</h4>
        </div>
        <div class="flex">
          <a href="#" class="quantity-btn minus" data-id="${item._id}" data-pid="${item.product._id}">
            <i class="fa-solid fa-minus"></i>
          </a>
          <h4 class="quantity-value">${item.quantity}</h4>
          <a href="#" class="quantity-btn plus" data-id="${item._id}" data-pid="${item.product._id}">
            <i class="fa-solid fa-plus"></i>
          </a>
          <a href="#" class="quantity-btn remove" data-id="${item._id}">
            <i class="fa-solid fa-xmark"></i>
          </a>
        </div>
        `;
        cartList.appendChild(cartItem);
    });

    cartList.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await api('/api/cart', {
                method: 'POST',
                body: JSON.stringify({ productId: btn.dataset.pid, quantity: 1 })
            });
            loadCart();
        });
    });
    cartList.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await api('/api/cart', {
                method: 'POST',
                body: JSON.stringify({ productId: btn.dataset.pid, quantity: -1 })
            });
            loadCart();
        });
    });
    cartList.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await api('/api/cart/' + btn.dataset.id, { method: 'DELETE' });
            loadCart();
        });
    });
    updateTotals();
};

const loadCart = async () => {
    if (!token) { cartList.innerHTML = ''; cartTotal.textContent = '$0.00'; cartValue.textContent = 0; return; }
    const res = await api('/api/cart');
    const data = await res.json();
    if (!res.ok) { alert(data.message); return; }
    cartItems = data.items;
    renderCart();
};


const loadOrders = async () => {
    if (!token || !orderList) return;
    const res = await api('/api/orders');
    const orders = await res.json();
    orderList.innerHTML = orders.length === 0
        ? '<p class="para m-auto text-center">Koi order nahi hai abhi.</p>'
        : orders.map(order => `
            <div class="order-card mt-half">
              <h4>Order #${order._id.slice(-6)}</h4>
              <h4 class="price">${order.total}</h4>
              <p>Status: ${order.status}</p>
              <p>${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>`).join('');
};

checkoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!token) {
        alert('Pehle Sign In karo!');
        authModal.classList.add('modal-active');
        return;
    }
    const res = await api('/api/orders', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
        alert('Order placed! Total: ' + data.total);
        loadCart();
        loadOrders();
    } else {
        alert(data.message);
    }
});

signInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    authModal.classList.add('modal-active');
});

document.getElementById('modalClose').addEventListener('click', () => authModal.classList.remove('modal-active'));
authModal.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.remove('modal-active');
});

authSwitch.addEventListener('click', (e) => {
    e.preventDefault();
    isSignup = !isSignup;
    authTitle.textContent = isSignup ? 'Sign Up' : 'Sign In';
    authSubmit.textContent = isSignup ? 'Sign Up' : 'Sign In';
    authName.style.display = isSignup ? 'block' : 'none';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = { email: authEmail.value, password: authPassword.value };
    if (isSignup) body.name = authName.value;
    const res = await api('/api/auth/' + (isSignup ? 'signup' : 'login'), {
        method: 'POST', body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
        token = data.token;
        userName = data.user.name;
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
        authModal.classList.remove('modal-active');
        signInBtn.textContent = userName;
        loadCart();
        loadOrders();
    } else {
        alert(data.message);
    }
});

const orderNowBtn = document.getElementById('orderNowBtn');
const menuSection = document.getElementById('menuSection');

orderNowBtn.addEventListener('click', (e) => {
    e.preventDefault();
    menuSection.scrollIntoView({ behavior: 'smooth' });
});

const initApp = async () => {
    const res = await fetch('/api/products');
    productList = await res.json();
    showCards();
    if (token && userName) signInBtn.textContent = userName;
    loadCart();
    loadOrders();
};

initApp();
