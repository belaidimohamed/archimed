from rest_framework import viewsets
from ..models import CapitalCall
from ..serializers import CapitalCallSerializer
from django.http import JsonResponse

class CapitalCallViewSet(viewsets.ModelViewSet):
    queryset = CapitalCall.objects.all()
    serializer_class = CapitalCallSerializer
    
    def list(self, request, *args, **kwargs):
        bills = list(CapitalCall.objects.values('id','investor__name','total_amount','iban','from_company','due_date','status'))
        return JsonResponse(bills, safe=False)
