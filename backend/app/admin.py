from django.contrib import admin
from .models import Bill, Investor, CapitalCall
# Register your models here.

admin.site.register(Bill)
admin.site.register(Investor)
admin.site.register(CapitalCall)