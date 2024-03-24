from rest_framework import viewsets, status
from rest_framework.response import Response
from datetime import datetime
from ..models import Bill, Investor
from ..serializers import BillSerializer

class BillViewSet(viewsets.ModelViewSet):
    """
    A viewset for managing bills.
    """
    queryset = Bill.objects.all()
    serializer_class = BillSerializer

    def create(self, request, *args, **kwargs):
        investor_id = request.data.get('investor')
        amount = request.data.get('amount')
        bill_type = request.data.get('bill_type')
        due_date = request.data.get('due_date')
        investor = Investor.objects.get(pk=investor_id)
        
        # Calculate bill amount based on bill type
        if bill_type == 'Membership':
            if investor.amount_invested > 50000:
                amount = 0
            else:
                amount = 3000  # Yearly subscription amount

        elif bill_type == 'Upfront fees':
            # Calculate upfront fees
            fee_percentage = 0.10  # Example fee percentage
            years = 5
            upfront_fees = fee_percentage * investor.amount_invested * years
            amount = upfront_fees

        elif bill_type == 'Yearly fees':
            # Calculate yearly fees
            fee_percentage = 0.15  # Example fee percentage
            investment_date = investor.investment_date
            years_since_investment = datetime.now().year - investment_date.year
            if investment_date < datetime(2019, 4, 1):
                if years_since_investment == 0:
                    amount = (investment_date.timetuple().tm_yday / 365) * fee_percentage * investor.amount_invested
                else:
                    amount = fee_percentage * investor.amount_invested
            else:
                if years_since_investment == 0:
                    amount = (investment_date.timetuple().tm_yday / datetime.now().timetuple().tm_yday) * fee_percentage * investor.amount_invested
                elif years_since_investment == 1:
                    amount = fee_percentage * investor.amount_invested
                elif years_since_investment == 2:
                    amount = (fee_percentage - 0.20) * investor.amount_invested
                elif years_since_investment == 3:
                    amount = (fee_percentage - 0.50) * investor.amount_invested
                else:
                    amount = (fee_percentage - 1.0) * investor.amount_invested

        # Create the bill
        bill = Bill.objects.create(
            investor=investor,
            amount=amount,
            bill_type=bill_type,
            due_date=due_date
        )
        serializer = BillSerializer(bill)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

