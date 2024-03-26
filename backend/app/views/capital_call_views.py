from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
from ..models import CapitalCall, Investor
from ..serializers import InvestorSerializer,CapitalCallSerializer

class CapitalCallViewSet(viewsets.ModelViewSet):
    queryset = CapitalCall.objects.all()
    serializer_class = CapitalCallSerializer