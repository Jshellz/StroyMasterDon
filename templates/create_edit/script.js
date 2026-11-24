(function () {
    'use strict';

    // =====================================================
    //  СПРАВОЧНИКИ
    // =====================================================
    const products = [
        { id: 'P-001', name: 'Цемент (портландцемент)', price: 850, sku: 'NB-LN-001' },
        { id: 'P-002', name: 'Гипсокартон (ГКЛ)', price: 1000, sku: 'MN-DL-027' },
        { id: 'P-003', name: 'Шпаклёвка', price: 1000, sku: 'KB-LG-003' },
        { id: 'P-004', name: 'Грунтовка', price: 980, sku: 'MS-LG-004' },
        { id: 'P-005', name: 'Саморезы', price: 50, sku: 'HS-SN-005' },
        { id: 'P-006', name: 'Монтажная пена', price: 750, sku: 'WC-LG-006' },
        { id: 'P-007', name: 'Малярный скотч', price: 300, sku: 'SS-SM-007' },
        { id: 'P-008', name: 'Рулетка строительная', price: 100, sku: 'DK-UC-008' },
        { id: 'P-009', name: 'Краска интерьерная', price: 560, sku: 'CH-ER-009' },
        { id: 'P-010', name: 'Керамическая плитка', price: 1200, sku: 'TB-140-010' },
    ];

    // =====================================================
    //  ДАННЫЕ ЗАКАЗОВ (демо)
    // =====================================================
    const orders = [
        { id: 'ORD-1001', date: '2025-02-10', client: 'ООО «Ромашка»', amount: 24500, status: 'paid' },
        { id: 'ORD-1002', date: '2025-02-11', client: 'ИП Смирнов', amount: 18900, status: 'pending' },
        { id: 'ORD-1003', date: '2025-02-12', client: 'ООО «ТехноСерв»', amount: 57200, status: 'shipped' },
        { id: 'ORD-1004', date: '2025-02-13', client: 'ООО «Альфа-Трейд»', amount: 10350, status: 'paid' },
        { id: 'ORD-1005', date: '2025-02-14', client: 'Иванов И.И.', amount: 7800, status: 'cancelled' },
        { id: 'ORD-1006', date: '2025-02-15', client: 'ООО «СтройМастер»', amount: 32400, status: 'pending' },
        { id: 'ORD-1007', date: '2025-02-16', client: 'Петрова А.С.', amount: 21500, status: 'shipped' },
        { id: 'ORD-1008', date: '2025-02-17', client: 'ООО «Мега-Групп»', amount: 89100, status: 'paid' },
        { id: 'ORD-1009', date: '2025-02-18', client: 'ИП Кузнецов', amount: 14200, status: 'pending' },
        { id: 'ORD-1010', date: '2025-02-19', client: 'ООО «Фреш-Логистик»', amount: 43300, status: 'shipped' },
        { id: 'ORD-1011', date: '2025-02-20', client: 'Сидоров В.В.', amount: 6750, status: 'cancelled' },
        { id: 'ORD-1012', date: '2025-02-21', client: 'ООО «Юг-Строй»', amount: 28100, status: 'paid' },
        { id: 'ORD-1013', date: '2025-02-22', client: 'ИП Михайлов', amount: 19850, status: 'pending' },
        { id: 'ORD-1014', date: '2025-02-23', client: 'ООО «Прометей»', amount: 36400, status: 'shipped' },
        { id: 'ORD-1015', date: '2025-02-24', client: 'ООО «Сибирь-Торг»', amount: 52700, status: 'paid' },
        { id: 'ORD-1016', date: '2025-02-25', client: 'Козлов Д.А.', amount: 11200, status: 'cancelled' },
        { id: 'ORD-1017', date: '2025-02-26', client: 'ООО «Восток-Сервис»', amount: 30900, status: 'pending' },
        { id: 'ORD-1018', date: '2025-02-27', client: 'ООО «Гранит»', amount: 47800, status: 'shipped' },
        { id: 'ORD-1019', date: '2025-02-28', client: 'ИП Фёдоров', amount: 8900, status: 'paid' },
        { id: 'ORD-1020', date: '2025-03-01', client: 'ООО «Стандарт»', amount: 62000, status: 'pending' },
        { id: 'ORD-1021', date: '2025-03-02', client: 'ООО «Альянс»', amount: 15700, status: 'shipped' },
        { id: 'ORD-1022', date: '2025-03-03', client: 'Николаев С.П.', amount: 13400, status: 'cancelled' },
        { id: 'ORD-1023', date: '2025-03-04', client: 'ООО «Регион-Поставка»', amount: 41500, status: 'paid' },
    ];

    // =====================================================
    //  СОСТОЯНИЕ СПИСКА ЗАКАЗОВ
    // =====================================================
    let currentPage = 1;
    const rowsPerPage = 5;

    let filterStatus = 'all';
    let filterDateFrom = '2025-01-01';
    let filterDateTo = '2025-12-31';
    let filterSearch = '';

    // DOM списка
    const tbody = document.getElementById('ordersTableBody');
    const paginationUl = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    const statusSelect = document.getElementById('statusFilter');
    const dateFromInput = document.getElementById('dateFrom');
    const dateToInput = document.getElementById('dateTo');
    const searchInput = document.getElementById('searchOrder');

    // DOM модалки
    const orderModalEl = document.getElementById('orderModal');
    const orderModal = new bootstrap.Modal(orderModalEl);
    const modalTitle = document.getElementById('orderModalLabel');
    const clientSelect = document.getElementById('clientSelect');
    const newClientBtn = document.getElementById('newClientBtn');
    const newClientFields = document.getElementById('newClientFields');
    const newClientName = document.getElementById('newClientName');
    const newClientPhone = document.getElementById('newClientPhone');

    const productSearch = document.getElementById('productSearch');
    const productSuggestions = document.getElementById('productSuggestions');
    const addProductBtn = document.getElementById('addProductBtn');
    const itemsTableBody = document.getElementById('itemsTableBody');
    const itemsEmptyRow = document.getElementById('itemsEmptyRow');
    const orderTotalEl = document.getElementById('orderTotal');

    const saveOrderBtn = document.getElementById('saveOrderBtn');
    const saveAndShipBtn = document.getElementById('saveAndShipBtn');
    const newOrderBtn = document.getElementById('newOrderBtn');

    // Состояние модалки
    let editingOrderId = null;       // null = новый заказ
    let selectedProduct = null;      // выбранный в поиске товар
    let orderItems = [];             // [{ productId, name, price, qty }]

    // =====================================================
    //  УТИЛИТЫ
    // =====================================================
    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function formatMoney(amount) {
        return amount.toLocaleString('ru-RU') + ' ₽';
    }

    function getStatusLabel(status) {
        const map = { paid: 'Оплачен', pending: 'В ожидании', shipped: 'Отправлен', cancelled: 'Отменён' };
        return map[status] || status;
    }

    // =====================================================
    //  СПИСОК ЗАКАЗОВ (как было)
    // =====================================================
    function getFilteredOrders() {
        return orders.filter((order) => {
            if (filterStatus !== 'all' && order.status !== filterStatus) return false;
            if (order.date < filterDateFrom || order.date > filterDateTo) return false;
            if (filterSearch.trim() !== '') {
                const q = filterSearch.trim().toLowerCase();
                if (!order.id.toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }

    function renderTable() {
        const filtered = getFilteredOrders();
        const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * rowsPerPage;
        const end = Math.min(start + rowsPerPage, filtered.length);
        const pageOrders = filtered.slice(start, end);

        if (pageOrders.length === 0) {
            tbody.innerHTML = `
                <tr><td colspan="6" class="text-center py-5 text-secondary">
                    <i class="bi bi-inbox fs-2 d-block mb-2"></i>Заказы не найдены
                </td></tr>`;
        } else {
            tbody.innerHTML = pageOrders.map((order) => `
                <tr>
                    <td class="order-id">${order.id}</td>
                    <td>${formatDate(order.date)}</td>
                    <td>${order.client}</td>
                    <td class="amount">${formatMoney(order.amount)}</td>
                    <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
                    <td>
                        <div class="d-flex flex-wrap gap-1">
                            <button class="btn btn-action btn-view" data-action="view" data-id="${order.id}">
                                <i class="bi bi-eye"></i> Просмотр
                            </button>
                            <button class="btn btn-action btn-edit" data-action="edit" data-id="${order.id}">
                                <i class="bi bi-pencil"></i> Редактировать
                            </button>
                        </div>
                    </td>
                </tr>`).join('');
        }

        const totalCount = filtered.length;
        const from = totalCount === 0 ? 0 : start + 1;
        paginationInfo.textContent = `Показано ${from}–${end} из ${totalCount}`;
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        let html = '';
        html += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>`;

        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);

        if (startPage > 1) {
            html += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                     </li>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
            html += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }

        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>`;

        paginationUl.innerHTML = html;

        paginationUl.querySelectorAll('a.page-link').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.dataset.page, 10);
                if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
                    currentPage = page;
                    renderTable();
                }
            });
        });
    }

    function updateFilters() {
        filterStatus = statusSelect.value;
        filterDateFrom = dateFromInput.value;
        filterDateTo = dateToInput.value;
        filterSearch = searchInput.value;
        currentPage = 1;
        renderTable();
    }

    statusSelect.addEventListener('change', updateFilters);
    dateFromInput.addEventListener('change', updateFilters);
    dateToInput.addEventListener('change', updateFilters);
    searchInput.addEventListener('input', updateFilters);

    // =====================================================
    //  МОДАЛКА: ОТКРЫТИЕ / ЗАКРЫТИЕ
    // =====================================================
    newOrderBtn.addEventListener('click', () => {
        openOrderModal(null);
    });

    // Делегирование клика по «Просмотр» / «Редактировать»
    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const id = btn.dataset.id;
        const action = btn.dataset.action;

        if (action === 'edit') {
            openOrderModal(id);
        } else if (action === 'view') {
            alert(`Просмотр заказа ${id} (демо)`);
        }
    });

    function openOrderModal(orderId) {
        editingOrderId = orderId;

        // Сброс полей
        clientSelect.value = '';
        newClientFields.classList.add('d-none');
        newClientName.value = '';
        newClientPhone.value = '';
        productSearch.value = '';
        productSuggestions.classList.add('d-none');
        selectedProduct = null;
        addProductBtn.disabled = true;

        if (orderId) {
            // Редактирование существующего
            const order = orders.find((o) => o.id === orderId);
            modalTitle.textContent = `Редактирование заказа ${orderId}`;
            if (order) {
                clientSelect.value = order.client;
                // Демо-товары для существующего заказа
                orderItems = [
                    { productId: 'P-001', name: 'Цемент (портландцемент)', price: 1800, qty: 3 },
                    { productId: 'P-003', name: 'Саморезы', price: 50, qty: 10 },
                ];
            }
        } else {
            // Новый заказ
            modalTitle.textContent = 'Новый заказ';
            orderItems = [];
        }

        renderItems();
        updateTotal();
        orderModal.show();
    }

    // =====================================================
    //  БЛОК «КЛИЕНТ»
    // =====================================================
    newClientBtn.addEventListener('click', () => {
        newClientFields.classList.toggle('d-none');
        if (!newClientFields.classList.contains('d-none')) {
            newClientName.focus();
        }
    });

    // =====================================================
    //  БЛОК «ТОВАРЫ»: ПОИСК + ПОДСКАЗКИ
    // =====================================================
    productSearch.addEventListener('input', () => {
        const q = productSearch.value.trim().toLowerCase();
        selectedProduct = null;
        addProductBtn.disabled = true;

        if (q === '') {
            productSuggestions.classList.add('d-none');
            return;
        }

        const matches = products.filter(
            (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        ).slice(0, 6);

        if (matches.length === 0) {
            productSuggestions.innerHTML = `<div class="product-suggestion-item ps-empty">Ничего не найдено</div>`;
        } else {
            productSuggestions.innerHTML = matches.map((p) => `
                <div class="product-suggestion-item" data-product-id="${p.id}">
                    <span>${p.name} <small class="text-secondary">(${p.sku})</small></span>
                    <span class="ps-price">${formatMoney(p.price)}</span>
                </div>`).join('');
        }
        productSuggestions.classList.remove('d-none');
    });

    // Клик по подсказке
    productSuggestions.addEventListener('click', (e) => {
        const item = e.target.closest('.product-suggestion-item');
        if (!item || !item.dataset.productId) return;

        const product = products.find((p) => p.id === item.dataset.productId);
        if (!product) return;

        selectedProduct = product;
        productSearch.value = product.name;
        productSuggestions.classList.add('d-none');
        addProductBtn.disabled = false;
        addProductBtn.focus();
    });

    // Скрытие подсказок при клике вне
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.product-search-wrapper')) {
            productSuggestions.classList.add('d-none');
        }
    });

    // Кнопка «Добавить»
    addProductBtn.addEventListener('click', () => {
        if (!selectedProduct) return;

        const existing = orderItems.find((i) => i.productId === selectedProduct.id);
        if (existing) {
            existing.qty += 1;
        } else {
            orderItems.push({
                productId: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                qty: 1,
            });
        }

        // Сброс поиска
        selectedProduct = null;
        productSearch.value = '';
        addProductBtn.disabled = true;
        productSuggestions.classList.add('d-none');

        renderItems();
        updateTotal();
    });

    // =====================================================
    //  БЛОК «ТОВАРЫ»: ТАБЛИЦА ПОЗИЦИЙ
    // =====================================================
    function renderItems() {
        if (orderItems.length === 0) {
            itemsTableBody.innerHTML = `
                <tr id="itemsEmptyRow">
                    <td colspan="5" class="text-center text-secondary py-4">
                        <i class="bi bi-inbox d-block mb-1 fs-5"></i>
                        Добавьте товары в заказ
                    </td>
                </tr>`;
            return;
        }

        itemsTableBody.innerHTML = orderItems.map((item, idx) => `
            <tr data-index="${idx}">
                <td>${item.name}</td>
                <td class="text-center">
                    <input type="number" class="form-control form-control-sm qty-input"
                           value="${item.qty}" min="1" data-index="${idx}">
                </td>
                <td class="text-end item-price">${formatMoney(item.price)}</td>
                <td class="text-end item-sum">${formatMoney(item.price * item.qty)}</td>
                <td class="text-center">
                    <button type="button" class="btn-remove-item" data-index="${idx}" title="Удалить">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`).join('');

        // Обработчики количества
        itemsTableBody.querySelectorAll('.qty-input').forEach((input) => {
            input.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index, 10);
                let val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) val = 1;
                e.target.value = val;
                orderItems[idx].qty = val;

                // Обновить сумму в строке
                const row = e.target.closest('tr');
                row.querySelector('.item-sum').textContent = formatMoney(orderItems[idx].price * val);
                updateTotal();
            });
        });

        // Обработчики удаления
        itemsTableBody.querySelectorAll('.btn-remove-item').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.dataset.index, 10);
                orderItems.splice(idx, 1);
                renderItems();
                updateTotal();
            });
        });
    }

    // =====================================================
    //  БЛОК «ИТОГО»
    // =====================================================
    function updateTotal() {
        const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
        orderTotalEl.textContent = formatMoney(total);
    }

    // =====================================================
    //  КНОПКИ «СОХРАНИТЬ» / «ОТПРАВИТЬ НА СКЛАД»
    // =====================================================
    function validateOrder() {
        if (!clientSelect.value && !newClientName.value.trim()) {
            alert('Выберите клиента или укажите нового.');
            return false;
        }
        if (orderItems.length === 0) {
            alert('Добавьте хотя бы один товар.');
            return false;
        }
        return true;
    }

    function buildOrder() {
        const clientName = newClientName.value.trim() || clientSelect.value;
        const total = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);

        return {
            id: editingOrderId || `ORD-${Date.now().toString().slice(-4)}`,
            date: new Date().toISOString().slice(0, 10),
            client: clientName,
            amount: total,
            status: 'pending',
            items: orderItems.map((i) => ({ ...i })),
        };
    }

    saveOrderBtn.addEventListener('click', () => {
        if (!validateOrder()) return;
        const order = buildOrder();

        if (editingOrderId) {
            const idx = orders.findIndex((o) => o.id === editingOrderId);
            if (idx !== -1) orders[idx] = order;
        } else {
            orders.unshift(order);
        }

        alert(`Заказ ${order.id} сохранён.`);
        orderModal.hide();
        renderTable();
    });

    saveAndShipBtn.addEventListener('click', () => {
        if (!validateOrder()) return;
        const order = buildOrder();
        order.status = 'shipped';

        if (editingOrderId) {
            const idx = orders.findIndex((o) => o.id === editingOrderId);
            if (idx !== -1) orders[idx] = order;
        } else {
            orders.unshift(order);
        }

        alert(`Заказ ${order.id} сохранён и отправлен на склад.`);
        orderModal.hide();
        renderTable();
    });

    // =====================================================
    //  СТАРТ
    // =====================================================
    renderTable();
})();