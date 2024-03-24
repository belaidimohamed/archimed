from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
from ..models import CapitalCall, Investor
from ..serializers import InvestorSerializer,CapitalCallSerializer

class InvestorViewSet(viewsets.ModelViewSet):
    queryset = Investor.objects.all()
    serializer_class = InvestorSerializer

class CapitalCallViewSet(viewsets.ModelViewSet):
    queryset = CapitalCall.objects.all()
    serializer_class = CapitalCallSerializer