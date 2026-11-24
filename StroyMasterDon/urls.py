from django.urls import path
from . import views

urlpatterns = [
    path('', views.base),
    path('/dashboard', views.dashboard),
    path('/orders', views.order_list),
]