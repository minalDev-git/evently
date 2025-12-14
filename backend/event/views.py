from typing import Any, Dict, cast
from django.contrib.auth.models import User
from django.db.models import Count
from rest_framework. generics import CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from event.models import RSVP, Event, Ticket, University, Student,Registration
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from event.serializers import AdminSerializer,EventSerializer, RSVPSerializer, StudentLoginSerializer, StudentSignupSerializer, TicketSerializer, UniversityLoginSerializer, UniversitySerializer, StudentSerializer, UniversitySignupSerializer

# Create your views here.

def get_tokens(obj):
    refresh = RefreshToken()
    refresh['id'] = obj.id
    refresh['name'] = obj.name
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class CreateUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
        })
    
class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"detail": "Invalid credentials"}, status=400)

        refresh = RefreshToken.for_user(user)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
        })


class UniversityLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UniversityLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = cast(Dict[str, Any], serializer.validated_data)
        university: University = validated_data['university']
        tokens = get_tokens(university)

        return Response({
            **tokens,
            "id": university.id,
            "name": university.name,
            "email": university.email,
            "logo_url": university.logo_url
        })


class UniversitySignUpView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            serializer = UniversitySignupSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "University registered successfully", "university": serializer.data},
                    status=status.HTTP_201_CREATED
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UniversityList(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            queryset = University.objects.all()
            serializer = UniversitySerializer(queryset, many = True)
            # retrieved data successfully
            return Response(serializer.data, status= status.HTTP_200_OK)
        except Exception as e:
            # Code crashes or database fails
            return Response(
                {"error": "An internal error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UniversityDetail(APIView):
    permission_classes = [AllowAny]
    def get(self,request,pk):
        try:
            university = University.objects.get(pk = pk)
            serializer = UniversitySerializer(university)
            return Response(serializer.data, status=status.HTTP_200_OK)
                 
        except University.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
    
    def put(self,request,pk):
        try:
            university = University.objects.get(pk = pk)
            # updates existing data with new data from requests's body
            serializer = UniversitySerializer(university, data = request.data) 
            if serializer.is_valid():
                serializer.save()
                # Object updated successfully
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Invalid data provided
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                 
        except University.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
        
    def delete(self,request,pk):
        try:
            university = University.objects.get(pk = pk)
            university.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)         
        except University.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)

class StudentLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = StudentLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = cast(Dict[str, Any], serializer.validated_data)
        student: Student = validated_data['student']
        tokens = get_tokens(student)

        return Response({
            **tokens,
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "university": {
                "id": student.university.id,
                "name": student.university.name,
                "logo_url": student.university.logo_url
            }
        })

class StudentSignUpView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            serializer = StudentSignupSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Student registered successfully", "student": serializer.data},
                    status=status.HTTP_201_CREATED
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": "Internal server error", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        request.session.flush()
        return Response({"message": "Logged out"})


class StudentList(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        try:
            queryset = Student.objects.select_related('university').all()
            serializer = StudentSerializer(queryset, many = True)
            return Response(serializer.data, status= status.HTTP_200_OK)
        except Exception as e:
            # Code crashes or database fails
            return Response(
                {"error": "An internal error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StudentDetail(APIView):
    permission_classes = [AllowAny]
    def get(self,request,pk):
        try:
            student = Student.objects.get(pk = pk)
            serializer = StudentSerializer(student)
            return Response(serializer.data,status=status.HTTP_200_OK)  
        except Student.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
    def put(self,request,pk):
        try:
            student = Student.objects.get(pk = pk)
            serializer = StudentSerializer(student, data = request.data)
            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Student.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
    def delete(self,request,pk):
        try:
            student = Student.objects.get(pk = pk)
            student.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)  
        except Student.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
        
class EventList(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        try:
            queryset = Event.objects.all()
            serializer = EventSerializer(queryset, many = True, context = {'request': request})
            return Response(serializer.data, status= status.HTTP_200_OK)
        except Exception as e:
            # Code crashes or database fails
            return Response(
                {"error": "An internal error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self,request):
        try:
            serializer = EventSerializer(data = request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status= status.HTTP_201_CREATED)                                                     
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Code crashes or database fails
            return Response(
                {"error": "An internal error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UniversityEventsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            events = Event.objects.filter(university_id=pk)
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class UniversityRSVPsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            rsvps = RSVP.objects.filter(event_id = pk)
            serializer = RSVPSerializer(rsvps, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    
class UniversityTicketsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            tickets = Ticket.objects.filter(event_id=pk)
            serializer = TicketSerializer(tickets, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class StudentRSVPsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            rsvps = RSVP.objects.filter(student_id = pk)
            serializer = RSVPSerializer(rsvps, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
class StudentTicketsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            tickets = Ticket.objects.filter(student_id=pk)
            serializer = TicketSerializer(tickets, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)  
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

class StudentEventsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            registrations = Registration.objects.filter(student_id = pk)
            event_ids = registrations.values_list("event_id", flat=True)
            events = Event.objects.filter(id__in=event_ids)
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK) 
        except:
           return Response(status=status.HTTP_404_NOT_FOUND)


class EventDetail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            event = Event.objects.get(pk = pk)
            serializer = EventSerializer(event)
            return Response(serializer.data, status=status.HTTP_200_OK)    
        except Event.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
    def put(self, request, pk):
        try:
            event = Event.objects.get(pk = pk)
            # updates existing data with new data from requests's body
            serializer = EventSerializer(event, data = request.data) 
            if serializer.is_valid():
                serializer.save()
                # Object updated successfully
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Invalid data provided
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)     
        except Event.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
    def delete(self, request, pk):
        try:
            event = Event.objects.get(pk = pk)
            event.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)    
        except Event.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)

class TicketList(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        try:
            queryset = Ticket.objects.annotate(students_count = Count('students')).all()
            serializer = TicketSerializer(queryset, many = True)
            return Response(serializer.data, status= status.HTTP_200_OK)
        except Exception as e:
            # Code crashes or database fails
            return Response(
                {"error": "An internal error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self,request):
        try:
            serializer = TicketSerializer(data = request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status= status.HTTP_201_CREATED)                                                     
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Code crashes or database fails
            return Response(
                {"error": "An internal error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TicketDetail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            ticket = Ticket.objects.get(Ticket.objects.annotate(students_count = Count('students')), pk = pk)
            serializer = TicketSerializer(ticket)
            return Response(serializer.data, status=status.HTTP_200_OK)   
        except Ticket.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
    def put(self, request, pk):
        try:
            ticket = Ticket.objects.get(Ticket.objects.annotate(students_count = Count('students')), pk = pk)
            # updates existing data with new data from requests's body
            serializer = TicketSerializer(ticket, data = request.data) 
            if serializer.is_valid():
                serializer.save()
                # Object updated successfully
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Invalid data provided
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
        except Event.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
    def delete(self, request, pk):
        try:
            ticket = Ticket.objects.get(Ticket.objects.annotate(students_count = Count('students')), pk = pk)
            ticket.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)    
        except Event.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)

class RSVPList(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        try:
            queryset = RSVP.objects.annotate(students_count = Count('students')).all()
            serializer = RSVPSerializer(queryset, many = True)
            return Response(serializer.data, status= status.HTTP_200_OK)
        except Exception as e:
            # Code crashes or database fails
            return Response(
                {"error": "An internal error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self,request):
        try:
            serializer = RSVPSerializer(data = request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status= status.HTTP_201_CREATED)                                                     
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Code crashes or database fails
            return Response(
                {"error": "An internal error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class RSVPDetail(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            rsvp = RSVP.objects.get(RSVP.objects.annotate(students_count = Count('students')), pk = pk)
            serializer = RSVPSerializer(rsvp)
            return Response(serializer.data, status=status.HTTP_200_OK)   
        except Event.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
    def put(self, request, pk):
        try:
            rsvp = RSVP.objects.get(RSVP.objects.annotate(students_count = Count('students')), pk = pk)
             # updates existing data with new data from requests's body
            serializer = RSVPSerializer(rsvp, data = request.data) 
            if serializer.is_valid():
                serializer.save()
                # Object updated successfully
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                # Invalid data provided
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        except Event.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)
    def delete(self, request, pk):
        try:
            rsvp = RSVP.objects.get(RSVP.objects.annotate(students_count = Count('students')), pk = pk)
            rsvp.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)   
        except Event.DoesNotExist:
            # Object not found
            return Response(status= status.HTTP_404_NOT_FOUND)




