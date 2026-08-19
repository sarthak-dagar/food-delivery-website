const loadOrders = async () => {
  const res = await fetch('/api/orders/all');
  const orders = await res.json();
  if (!res.ok) {
    alert(orders.message || 'Orders load nahi hue');
    return;
  }

  const body = document.getElementById('ordersBody');
  body.innerHTML = '';

  let total = 0, pending = 0, completed = 0, revenue = 0;

  orders.forEach(order => {
    total++;
    if (order.status === 'pending') pending++;
    if (order.status === 'completed') completed++;
    revenue += parseFloat(order.total.replace('$', ''));

    const itemsHtml = order.items.map(i => `
      <div class="order-item-row">
        <img src="${i.product.image}" alt="">
        <span>${i.product.name} &times; ${i.quantity}</span>
      </div>`).join('');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span class="order-id">#${order.id.slice(-6)}</span></td>
      <td>
        <span class="customer-name">${order.userName}</span><br>
        <span class="customer-email">${order.userEmail}</span>
      </td>
      <td><div class="order-items">${itemsHtml}</div></td>
      <td class="total-cell">${order.total}</td>
      <td class="date-cell">
        ${new Date(order.createdAt).toLocaleDateString()}<br>
        <small>${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
      </td>
      <td>
        <select class="status-select select-${order.status}" data-id="${order.id}">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>`;
    body.appendChild(row);
  });

  document.getElementById('emptyState').style.display = orders.length ? 'none' : 'block';
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statCompleted').textContent = completed;
  document.getElementById('statRevenue').textContent = '$' + revenue.toFixed(2);
};

document.getElementById('ordersBody').addEventListener('change', async (e) => {
  const select = e.target.closest('.status-select');
  if (!select) return;
  const res = await fetch(`/api/orders/${select.dataset.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: select.value })
  });
  const data = await res.json();
  if (res.ok) {
    loadOrders();
  } else {
    alert(data.message || 'Status update nahi hua');
    loadOrders();
  }
});

loadOrders();