from django.contrib import admin
from .models import Product, Client, Category, UserProfile, Order, OrderItem

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "article")

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("full_name", "inn", "phone")

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("role", "login")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("status", "total_amount")

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("quantity", "price_at_order", "total_price")