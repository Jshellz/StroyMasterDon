from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Order

@login_required
def order_list(request):
    orders = Order.objects.all().select_related('client', 'manager').order_by('-created_at')
    context = {'orders': orders}
    return render(request, 'orders/order_list.html', context)

