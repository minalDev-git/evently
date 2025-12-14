# from decimal import Decimal
from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.hashers import make_password,check_password
from event.models import University, Student, Event, Registration, RSVP, Ticket

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','password']
        extra_kwargs = {"password": {"write_only": True}}
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UniversityLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            university = University.objects.get(email=attrs['email'])
        except University.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not check_password(attrs['password'], university.password):
            raise serializers.ValidationError("Invalid email or password")
        
        attrs['university'] = university
        return attrs
    
class UniversitySignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'email', 'password', 'logo_url']
        extra_kwargs = {"password": {"write_only": True}}
        password = serializers.CharField(write_only=True, required=True, min_length=8)

    def validate_email(self, value):
        if University.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return University.objects.create(**validated_data)
    
class StudentLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            student = Student.objects.get(email=attrs['email'])
        except Student.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not check_password(attrs['password'], student.password):
            raise serializers.ValidationError("Invalid email or password")
        
        attrs['student'] = student
        return attrs
    
class StudentSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'password', 'university']
        extra_kwargs = {"password": {"write_only": True}}
        password = serializers.CharField(write_only=True, required=True, min_length=8)

    def validate_email(self, value):
        if Student.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return Student.objects.create(**validated_data)
    
class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name','email','password','logo_url','total_events','total_rsvps','total_tickets']
        read_only_fields = ['id']
        extra_kwargs = {"password": {"write_only": True}}
    
    total_events = serializers.SerializerMethodField()
    total_rsvps = serializers.SerializerMethodField()
    total_tickets = serializers.SerializerMethodField()
    
    def get_total_tickets(self, obj):
        return Ticket.objects.filter(event__university=obj).count()

    def get_total_rsvps(self, obj):
        return RSVP.objects.filter(event__university=obj).count()

    def get_total_events(self, obj):
        return Event.objects.filter(university=obj).count()

    
    def create(self, validated_data):
        # Hash the password before saving
        validated_data['password'] = make_password(validated_data['password'])
        return University.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Hash new password if updated
        password = validated_data.get('password', None)
        if password:
            instance.password = make_password(password)
            instance.name = validated_data.get('name', instance.name)
            instance.email = validated_data.get('email', instance.email)
            instance.logo_url = validated_data.get('logo_url', instance.logo_url)
            instance.save()
            return instance


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name','email','password','university','ticket_count','rsvp_count']
        read_only_fields = ['id']
        extra_kwargs = {"password": {"write_only": True}}
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all())
    ticket_count = serializers.SerializerMethodField()
    rsvp_count = serializers.SerializerMethodField()
    uni_events = serializers.SerializerMethodField()
    
    def get_ticket_count(self,obj):
        return Ticket.objects.filter(student=obj).count()
    
    def get_rsvp_count(self,obj):
        return RSVP.objects.filter(student=obj).count()

    def create(self, validated_data):
        # Hash the password before saving
        validated_data['password'] = make_password(validated_data['password'])
        return Student.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Hash new password if updated
        password = validated_data.get('password', None)
        if password:
            instance.password = make_password(password)
            instance.name = validated_data.get('name', instance.name)
            instance.email = validated_data.get('email', instance.email)
            instance.university = validated_data.get('university', instance.university)
            instance.save()
            return instance

# ModelSerializer allows to map this serializer class to our models so that we don't have to define the fields at 2 places
class EventSerializer(serializers.ModelSerializer):
    tickets_sold = serializers.SerializerMethodField()
    total_rsvps = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id','event_name','description','venue','event_date','price','slug',
            'event_type','form_url','image_url','visibility','university',
            'tickets_sold','total_rsvps'
        ]

    def get_tickets_sold(self, obj):
        return Ticket.objects.filter(event=obj, status=Ticket.STATUS_PAID).count()

    def get_total_rsvps(self, obj):
        return RSVP.objects.filter(event=obj, status=RSVP.STATUS_CONFIRM).count()
    
    def create(self, validated_data):
        event = Event(**validated_data)
        event.save()
        return event

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['status','stripe_id','event','student']
        read_only_fields = ['id']
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all())
    event = serializers.HyperlinkedRelatedField(queryset = Event.objects.all(), view_name = 'event_detail')
    student = serializers.PrimaryKeyRelatedField(queryset = Student.objects.all())
    

    def create(self, validated_data):
        ticket = Ticket(**validated_data)
        ticket.save()
        return ticket

class RSVPSerializer(serializers.ModelSerializer):
    class Meta:
        model = RSVP
        fields = ['status','timestamp','event','student']
        read_only_fields = ['id']
    university = serializers.PrimaryKeyRelatedField(queryset=University.objects.all())
    student = serializers.PrimaryKeyRelatedField(queryset = Student.objects.all())
    event = serializers.HyperlinkedRelatedField(queryset = Event.objects.all(), view_name = 'event_detail')

    def create(self, validated_data):
        rsvp = RSVP(**validated_data)
        rsvp.save()
        return rsvp