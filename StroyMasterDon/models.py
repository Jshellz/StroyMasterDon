from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class UserProfile(models.Model):
    class Role(models.TextChoices):
        MANAGER = 'manager', 'Менеджер'
        WAREHOUSE = 'warehouse', 'Склад'
        ADMIN = 'admin', 'Администратор'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profile',
        verbose_name='Пользователь',
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MANAGER,
        verbose_name='Роль',
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Статус активности',
    )
    login = models.CharField(
        max_length=120,
        unique=True,
        verbose_name='Логин',
    )

    class Meta:
        db_table = 'users'
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'

    def __str__(self):
        return f'{self.login} ({self.get_role_display()})'


class Client(models.Model):
    class Status(models.TextChoices):
        INDIVIDUAL = 'individual', 'Индивидуальный'
        LEGAL = 'legal', 'Юридический'

    full_name = models.CharField(
        max_length=255,
        verbose_name='Название организации'
    )
    inn = models.CharField(
        max_length=12,
        null=True,
        blank=True,
        verbose_name='ИНН юрлиц'
    )
    phone = models.CharField(
        max_length=20,
        verbose_name='Контактный телефон'
    )
    email = models.EmailField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name='Email'
    )
    delivery_address = models.TextField(
        null=True,
        blank=True,
        verbose_name='Адрес доставки'
    )
    client_type = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.INDIVIDUAL,
        verbose_name='Тип'
    )
    create_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата регистрации'
    )

    class Meta:
        db_table = 'clients'
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'
        ordering = ['-create_at']
        indexes = [
            models.Index(fields=['inn']),
            models.Index(fields=['phone']),
        ]

    def __str__(self):
        return self.full_name


class Category(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Наименование категории'
    )
    description = models.TextField(
        null=True,
        blank=True,
        verbose_name='Описание'
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name='Родительская категория'
    )

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    article = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Артикул (SKU)'
    )
    name = models.CharField(
        max_length=255,
        verbose_name='Наименование'
    )
    description = models.TextField(
        null=True,
        blank=True,
        verbose_name='Описание'
    )
    unit = models.CharField(
        max_length=10,
        default='шт.',
        verbose_name='Единица измерения'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name='Цена за единицу'
    )
    stock_quantity = models.PositiveIntegerField(
        default=0,
        verbose_name='Остаток на складе'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата добавления'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='Категория'
    )

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.article})'


class Order(models.Model):
    class Status(models.TextChoices):
        NEW = 'new', 'Новый'
        CONFIRMED = 'confirmed', 'Подтвержден'
        PAID = 'paid', 'Оплачен'
        SHIPPED = 'shipped', 'Отправлен'
        CANCELLED = 'cancelled', 'Отменен'

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        verbose_name='Статус',
    )
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name='Сумма заказа',
    )
    comment = models.TextField(
        blank=True,
        null=True,
        verbose_name='Комментарий',
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания',
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления',
    )
    client = models.ForeignKey(
        Client,
        on_delete=models.PROTECT,
        related_name='orders',
        verbose_name='Клиент',
    )
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='managed_orders',
        verbose_name='Менеджер',
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']

    def __str__(self):
        return f'Заказ №{self.pk} от {self.created_at:%d.%m.%Y} ({self.get_status_display()})'


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Заказ',
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='order_items',
        verbose_name='Товар',
    )
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        validators=[MinValueValidator(Decimal('0.001'))],
        verbose_name='Количество',
    )
    price_at_order = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Цена на момент заказа',
    )
    total_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        editable=False,
        verbose_name='Сумма по позиции',
    )

    class Meta:
        verbose_name = 'Позиция заказа'
        verbose_name_plural = 'Позиции заказа'

    def save(self, *args, **kwargs):
        self.total_price = (self.quantity * self.price_at_order).quantize(Decimal('0.01'))
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.product} x {self.quantity}'
