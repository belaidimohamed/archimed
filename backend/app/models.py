from django.db import models
from django.core.validators import RegexValidator

class Investor(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    amount_invested = models.FloatField()
    investment_date = models.DateField(auto_now_add=True)    
    billing_type = models.CharField(max_length=100, default="Upfront fees")
    def __str__(self):
        return self.name

class Bill(models.Model):
    investor = models.ForeignKey(Investor, on_delete=models.CASCADE)
    amount = models.FloatField()
    bill_type = models.CharField(max_length=50)
    date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    validated = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.investor.name} - {self.bill_type}"

class CapitalCall(models.Model):
    investor = models.ForeignKey(Investor, on_delete=models.CASCADE)
    total_amount = models.FloatField()
    due_date = models.DateField()
    iban = models.CharField(max_length=34,default='FR7630006000011234567890189', validators=[RegexValidator(
        regex=r'^[A-Z]{2}\d{2}[A-Z\d]{1,30}$',
        message='IBAN must be in the correct format.',
        code='invalid_iban'
    )])
    from_company = models.CharField(max_length=100)
    # We wont need to_person and email , since this model is linked to investor
    status_choices = [
        ('VALIDATED', 'Validated'),
        ('SENT', 'Sent'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
    ]
    status = models.CharField(max_length=10, choices=status_choices, default='VALIDATED')
    def __str__(self):
        return f"Capital Call for {self.investor.user.username}"
