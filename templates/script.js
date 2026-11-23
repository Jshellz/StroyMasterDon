(function () {
    'use strict';

    // ---------- Демо-данные ----------
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

    // ---------- Состояние ----------
    let currentPage = 1;
    const rowsPerPage = 5;

    let filterStatus = 'all';
    let filterDateFrom = '2025-01-01';
    let filterDateTo = '2025-12-31';
    let filterSearch = '';

    // ---------- DOM ----------
    const tbody = document.getElementById('ordersTableBody');
    const paginationUl = document.getElementById('pagination');
    const paginationInfo = document.getElementById('paginationInfo');

    const statusSelect = document.getElementById('statusFilter');
    const dateFromInput = document.getElementById('dateFrom');
    const dateToInput = document.getElementById('dateTo');
    const searchInput = document.getElementById('searchOrder');

    // ---------- Утилиты ----------
    function getStatusLabel(status) {
        const map = {
            paid: 'Оплачен',
            pending: 'В ожидании',
            shipped: 'Отправлен',
            cancelled: 'Отменён',
        };
        return map[status] || status;
    }

    function getStatusClass(status) {
        return `status-${status}`;
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    function formatMoney(amount) {
        return amount.toLocaleString('ru-RU') + ' ₽';
    }

    // ---------- Фильтрация ----------
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

    // ---------- Отрисовка таблицы ----------
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
                <tr>
                    <td colspan="6" class="text-center py-5 text-secondary">
                        <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                        Заказы не найдены
                    </td>
                </tr>`;
        } else {
            tbody.innerHTML = pageOrders
                .map(
                    (order) => `
                    <tr>
                        <td class="order-id">${order.id}</td>
                        <td>${formatDate(order.date)}</td>
                        <td>${order.client}</td>
                        <td class="amount">${formatMoney(order.amount)}</td>
                        <td><span class="status-badge ${getStatusClass(order.status)}">${getStatusLabel(order.status)}</span></td>
                        <td>
                            <div class="d-flex flex-wrap gap-1">
                                <button class="btn btn-action btn-view" onclick="alert('Просмотр заказа: ${order.id}')">
                                    <i class="bi bi-eye"></i> Просмотр
                                </button>
                                <button class="btn btn-action btn-edit" onclick="alert('Редактирование заказа: ${order.id}')">
                                    <i class="bi bi-pencil"></i> Редактировать
                                </button>
                            </div>
                        </td>
                    </tr>`
                )
                .join('');
        }

        const totalCount = filtered.length;
        const from = totalCount === 0 ? 0 : start + 1;
        const to = end;
        paginationInfo.textContent = `Показано ${from}–${to} из ${totalCount}`;

        renderPagination(totalPages);
    }

    // ---------- Пагинация ----------
    function renderPagination(totalPages) {
        let html = '';

        // Назад
        html += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Предыдущая">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>`;

        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            html += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) {
                html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
            }
            html += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }

        // Вперёд
        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Следующая">
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

    // ---------- Обновление фильтров ----------
    function updateFilters() {
        filterStatus = statusSelect.value;
        filterDateFrom = dateFromInput.value;
        filterDateTo = dateToInput.value;
        filterSearch = searchInput.value;
        currentPage = 1;
        renderTable();
    }

    // ---------- Слушатели ----------
    statusSelect.addEventListener('change', updateFilters);
    dateFromInput.addEventListener('change', updateFilters);
    dateToInput.addEventListener('change', updateFilters);
    searchInput.addEventListener('input', updateFilters);

    // ---------- Старт ----------
    renderTable();
})();