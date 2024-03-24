from rest_framework import serializers
from .models import Investor, Bill, CapitalCall

class InvestorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investor
        fields = '__all__'

class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'

class CapitalCallSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapitalCall
        fields = '__all__'
