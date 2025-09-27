from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_info, name='api_info'),
    path('predict', views.HealthPredictionView.as_view(), name='health_prediction'),
    path('demo-profiles', views.DemoProfilesView.as_view(), name='demo_profiles'),
    path('health', views.health_check, name='health_check'),
]