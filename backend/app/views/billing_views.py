from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
from ..models import Bill, Investor
from ..serializers import BillSerializer
from django.http import JsonResponse

class BillViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing bills.
    """
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    fee_percentage = 0.2  # example of fee percentage

    def create(self, request, *args, **kwargs):
        investor_id = request.data.get('investor')
        bill_type = request.data.get('bill_type')
        due_date = request.data.get('due_date')
        investor = Investor.objects.get(pk=investor_id)
        
        amount = self.calculate_bill_amount(investor, bill_type)

        # Create the bill
        bill = Bill.objects.create(
            investor=investor,
            amount=amount,
            bill_type=bill_type,
            due_date=due_date
        )
        serializer = BillSerializer(bill)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    def generate_bills_automatically(self):
        # Your implementation for automatically generating bills goes here
        print('hi')
        
    def list(self, request, *args, **kwargs):
        bills = list(Bill.objects.values('id','investor__name','amount','bill_type','date','due_date'))
        return JsonResponse(bills, safe=False)


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
                amount = (self.fee_percentage - 0.02) * investor.amount_invested
            elif years_since_investment == 3:
                amount = (self.fee_percentage - 0.05) * investor.amount_invested
            else:
                amount = (self.fee_percentage - 0.10) * investor.amount_invested
        return amount
