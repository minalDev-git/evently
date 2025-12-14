from decimal import Decimal
from django.db import models

class University(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    logo_url = models.URLField(max_length=200)

    def __str__(self) -> str:
        return self.name
    class Meta:
        ordering = ['name']

class Student(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    university = models.ForeignKey(University, on_delete= models.PROTECT)


class Event(models.Model):
    RSVP_EVENT = 'R'
    PAID_EVENT = 'P'
    EVENT_TYPE = [(RSVP_EVENT,'Unpaid'),(PAID_EVENT,'Paid')]

    PUBLIC_EVENT = 'Pub'
    PRIVATE_EVENT = 'Pri'
    VISIBILITY = [(PUBLIC_EVENT,'Public'),(PRIVATE_EVENT,'Private')]

    id = models.BigAutoField(primary_key=True)
    event_name = models.CharField(max_length=100)
    description = models.TextField()
    venue = models.CharField(max_length=100)
    event_date = models.DateField()
    price = models.DecimalField(max_digits=6,decimal_places=2, default=Decimal(0.00))
    slug = models.SlugField()
    event_type = models.CharField(max_length= 1,choices=EVENT_TYPE, default=RSVP_EVENT)
    form_url = models.URLField(max_length=200)
    image_url = models.URLField(max_length= 200)
    visibility = models.CharField(max_length= 3,choices=VISIBILITY, default=PUBLIC_EVENT)
    university = models.ForeignKey(University, on_delete= models.PROTECT, related_name= 'events')

class Registration(models.Model):
    id = models.BigAutoField(primary_key=True)
    created_at = models.DateField(auto_now_add=True, null=True)
    event = models.ForeignKey(Event,on_delete=models.PROTECT, related_name='registration')
    student = models.ForeignKey(Student,on_delete=models.PROTECT, related_name= 'registration')

    class Meta:
        unique_together = ('event', 'student')

class Ticket(Registration):

    STATUS_PAID = 'T'
    STATUS_PENDING = 'F'
    STATUS = [(STATUS_PAID,'T'),(STATUS_PENDING,'F')]

    status = models.CharField(max_length=1,choices=STATUS, default=STATUS_PENDING)
    stripe_id = models.CharField(max_length=100)
    

class RSVP(Registration):

    STATUS_CONFIRM = 'C'
    STATUS_DENIAL = 'D'
    STATUS = [(STATUS_CONFIRM,'C'),(STATUS_DENIAL,'D')]

    status = models.CharField(max_length=1,choices=STATUS, default=STATUS_DENIAL)
    timestamp = models.TimeField(auto_now_add=True)
    

