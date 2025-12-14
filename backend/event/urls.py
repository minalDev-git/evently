from django.urls import path
from . import views


urlpatterns = [
    # ADMIN VIEW
    path('admin/',views.AdminLoginView.as_view()),
    path('universities/', views.UniversityList.as_view()),
    path('universities/signup/', views.UniversitySignUpView.as_view()),
    path('universities/<int:pk>/', views.UniversityDetail.as_view()),
    path('students/',views.StudentList.as_view()),

    # University VIEW
    path('universities/login/', views.UniversityLoginView.as_view()),
    path('universities/<int:pk>/events/', views.UniversityEventsView.as_view()),
    path('universities/<int:pk>/tickets/', views.UniversityTicketsView.as_view()),
    path('universities/<int:pk>/rsvps/', views.UniversityRSVPsView.as_view()),

    # Student VIEW
    path('students/login/',views.StudentLoginView.as_view()),
    path('students/signup/',views.StudentSignUpView.as_view()),
    path('students/<int:pk>/',views.StudentDetail.as_view()),
    path('students/<int:pk>/events/', views.StudentEventsView.as_view()),
    path('students/<int:pk>/tickets/', views.StudentTicketsView.as_view()),
    path('students/<int:pk>/rsvps/', views.StudentRSVPsView.as_view()),

    # Common VIEW
    path('events/',views.EventList.as_view()),
    path('events/<int:pk>/',views.EventDetail.as_view(), name='event_detail'),
    path('tickets/',views.TicketList.as_view()),
    path('tickets/<int:pk>/',views.TicketDetail.as_view(), name='ticket_detail'),
    path('rsvps/',views.RSVPList.as_view()),
    path('rsvps/<int:pk>/',views.RSVPDetail.as_view(), name='rsvp_detail'),
    
    path('logout/',views.LogoutView.as_view())
]