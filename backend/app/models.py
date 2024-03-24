from django.db import models

class Investor(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    amount_invested = models.DecimalField(max_digits=10, decimal_places=2)
    investment_date = models.DateField(auto_now_add=True)    

    def __str__(self):
        return self.name

class Bill(models.Model):
    investor = models.ForeignKey(Investor, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    bill_type = models.CharField(max_length=50)
    date = models.DateField(auto_now_add=True)
    due_date = models.DateField()

    def __str__(self):
        return f"{self.investor.user.username} - {self.bill_type}"

class CapitalCall(models.Model):
    investor = models.ForeignKey(Investor, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    from_company = models.CharField(max_length=100)
    to_person = models.CharField(max_length=100)
    email = models.EmailField()
    status_choices = [
        ('VALIDATED', 'Validated'),
        ('SENT', 'Sent'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
    ]
    status = models.CharField(max_length=10, choices=status_choices, default='VALIDATED')
    def __str__(self):
        return f"Capital Call for {self.investor.user.username}"
