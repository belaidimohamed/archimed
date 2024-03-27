from django.db import models
from django.core.validators import RegexValidator

# copied from regex 101
IBAN_REGEX = r'^AL\d{10}[0-9A-Z]{16}$|^AD\d{10}[0-9A-Z]{12}$|^AT\d{18}$|^BH\d{2}[A-Z]{4}[0-9A-Z]{14}$|^BE\d{14}$|^BA\d{18}$|^BG\d{2}[A-Z]{4}\d{6}[0-9A-Z]{8}$|^HR\d{19}$|^CY\d{10}[0-9A-Z]{16}$|^CZ\d{22}$|^DK\d{16}$|^FO\d{16}$|^GL\d{16}$|^DO\d{2}[0-9A-Z]{4}\d{20}$|^EE\d{18}$|^FI\d{16}$|^FR\d{12}[0-9A-Z]{11}\d{2}$|^GE\d{2}[A-Z]{2}\d{16}$|^DE\d{20}$|^GI\d{2}[A-Z]{4}[0-9A-Z]{15}$|^GR\d{9}[0-9A-Z]{16}$|^HU\d{26}$|^IS\d{24}$|^IE\d{2}[A-Z]{4}\d{14}$|^IL\d{21}$|^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^[A-Z]{2}\d{5}[0-9A-Z]{13}$|^KW\d{2}[A-Z]{4}22!$|^LV\d{2}[A-Z]{4}[0-9A-Z]{13}$|^LB\d{6}[0-9A-Z]{20}$|^LI\d{7}[0-9A-Z]{12}$|^LT\d{18}$|^LU\d{5}[0-9A-Z]{13}$|^MK\d{5}[0-9A-Z]{10}\d{2}$|^MT\d{2}[A-Z]{4}\d{5}[0-9A-Z]{18}$|^MR13\d{23}$|^MU\d{2}[A-Z]{4}\d{19}[A-Z]{3}$|^MC\d{12}[0-9A-Z]{11}\d{2}$|^ME\d{20}$|^NL\d{2}[A-Z]{4}\d{10}$|^NO\d{13}$|^PL\d{10}[0-9A-Z]{,16}n$|^PT\d{23}$|^RO\d{2}[A-Z]{4}[0-9A-Z]{16}$|^SM\d{2}[A-Z]\d{10}[0-9A-Z]{12}$|^SA\d{4}[0-9A-Z]{18}$|^RS\d{20}$|^SK\d{22}$|^SI\d{17}$|^ES\d{22}$|^SE\d{22}$|^CH\d{7}[0-9A-Z]{12}$|^TN59\d{20}$|^TR\d{7}[0-9A-Z]{17}$|^AE\d{21}$|^GB\d{2}[A-Z]{4}\d{14}$'

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
        regex=IBAN_REGEX,
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
