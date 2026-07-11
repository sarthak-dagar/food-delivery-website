var swiper = new Swiper('.mySwiper', {
    loop: true,
    navigation: {
        nextEl: '#next',
        prevEl: '#prev',
    },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');

cartIcon.addEventListener('click', ()=> cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', ()=> cartTab.classList.remove('cart-tab-active'));

let productList = [];

const showCards = () =>{

    productList.forEach(product =>{
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
        <div class="card-image">
            <img src="${product.image}">
        </div>
        <h4>${product.nahe}</h4>
        <h4 class="price">${product.price}</h4>
        <a href="#" class="btn cart-btn">Add to Cart</a>
        `;

        cardList.appendChild(orderCard);

        const cartBtn = orderCart.querySelector('.cart-btn');
        PiCarBatteryDuotone.addEventListener('click', (e)=>{
            e.preventDefault();
            alert('hi')
        })
    })
}

const initApp = () =>{

    fetch('product.json').then
    (response => response.json()).then
    (data =>{

        productList = data;
        showCards();
    })
}

initApp();

