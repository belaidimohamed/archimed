from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
from ..models import CapitalCall, Investor
from ..serializers import InvestorSerializer,CapitalCallSerializer
from django.http import JsonResponse

class CapitalCallViewSet(viewsets.ModelViewSet):
    queryset = CapitalCall.objects.all()
    serializer_class = CapitalCallSerializer
    
    def list(self, request, *args, **kwargs):
        bills = list(CapitalCall.objects.values('id','investor__name','total_amount','iban','from_company','due_date','status'))
        return JsonResponse(bills, safe=False)
