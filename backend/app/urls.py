from rest_framework import routers
from rest_framework import routers
from django.urls import include, path
from .views.billing_views import BillViewSet
from .views.investor_views import InvestorViewSet
from .views.capital_call_views import CapitalCallViewSet

router = routers.DefaultRouter()
router.register(r'bill', BillViewSet)
router.register(r'investor', InvestorViewSet)
router.register(r'capitalCall', CapitalCallViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]