from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
from ..models import Bill, Investor
from ..serializers import BillSerializer
from django.http import JsonResponse
from rest_framework.decorators import action
from dateutil.relativedelta import relativedelta

class BillViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing bills.
    """
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

    def create(self, request, *args, **kwargs):
        investor_id = request.data.get('investor')
        bill_type = request.data.get('bill_type')
        due_date = request.data.get('due_date')
        investor = Investor.objects.get(pk=investor_id)
        
        bill = self.create_bill(investor,bill_type,due_date)

        serializer = BillSerializer(bill)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    @action(detail=False, methods=['GET'])
    def generate_bills_automatically(self,request):
        today = datetime.now().date()
        # Generate membership bills once every year
        investors = Investor.objects.all()
        for investor in investors:
            # Check if membership bill already exists for this year
            membership_bills = Bill.objects.filter(investor=investor, bill_type='Membership', due_date__year=today.year)
            if not membership_bills.exists():
                self.create_bill(investor, 'Membership', today)
            
            if investor.billing_type == 'Yearly fees':
                # Check if yearly fees bill already exists for this year
                yearly_fees_bills = Bill.objects.filter(investor=investor, bill_type='Yearly fees', due_date__year=today.year)
                if not yearly_fees_bills.exists():
                    self.create_bill(investor, 'Yearly fees', today)
            
            elif investor.billing_type == 'Upfront fees':
                # Check if upfront fees bill already exists
                upfront_fees_bills = Bill.objects.filter(investor=investor, bill_type='Upfront fees')
                if not upfront_fees_bills.exists():
                    self.create_bill(investor, 'Upfront fees', today)
        return Response(status=status.HTTP_201_CREATED)
        
    def list(self, request, *args, **kwargs):
        bills = list(Bill.objects.values('id','investor__name','amount','bill_type','date','due_date'))
        return JsonResponse(bills, safe=False)

    def create_bill(self, investor, bill_type, due_date):
        amount = FeesCalculation().calculate_bill_amount(investor, bill_type)
        if amount > 0:
            bill = Bill.objects.create(
                investor=investor,
                amount=amount,
                bill_type=bill_type,
                due_date=due_date
            )
            return bill 
        else :
            return Response(status=status.HTTP_200_OK)

    
class FeesCalculation():
    def __init__(self):
        self.fee_percentage = 0.02 # example of fee percentage 2%

    def calculate_bill_amount(self, investor, bill_type):
        if bill_type == 'Membership':
            if investor.amount_invested > 50000:
                amount = 0
            else:
                amount = 3000 
        elif bill_type == 'Upfront fees':
            years = 5
            amount = self.calculate_upfront_fees(investor, years)
        elif bill_type == 'Yearly fees':
            amount = self.calculate_yearly_fees(investor)
        return amount

    def calculate_upfront_fees(self, investor, years):
        upfront_fees = self.fee_percentage * investor.amount_invested * years
        return upfront_fees

    def calculate_yearly_fees(self, investor):
        investment_date = investor.investment_date
        years_since_investment = datetime.now().year - investment_date.year

        if investment_date < datetime(2019, 4, 1).date():
            if years_since_investment == 0:
                amount = (investment_date.timetuple().tm_yday / 365) * self.fee_percentage * investor.amount_invested
            else:
                amount = self.fee_percentage * investor.amount_invested
        else:
            if years_since_investment == 0:
                amount = (investment_date.timetuple().tm_yday / datetime.now().timetuple().tm_yday) * self.fee_percentage * investor.amount_invested
            elif years_since_investment == 1:
                amount = self.fee_percentage * investor.amount_invested
            elif years_since_investment == 2:
                amount = (self.fee_percentage - 0.002) * investor.amount_invested
            elif years_since_investment == 3:
                amount = (self.fee_percentage - 0.005) * investor.amount_invested
            else:
                amount = (self.fee_percentage - 0.01) * investor.amount_invested
        return amount
