from rest_framework import serializers
from .models import DemoProfile

class HealthPredictionInputSerializer(serializers.Serializer):
    age = serializers.IntegerField(min_value=18, max_value=120)
    sex = serializers.IntegerField(min_value=0, max_value=1)  # 0=Female, 1=Male
    bp_systolic = serializers.FloatField(min_value=70, max_value=250)
    cholesterol = serializers.FloatField(min_value=100, max_value=500)
    bmi = serializers.FloatField(min_value=15, max_value=50)
    smoking = serializers.IntegerField(min_value=0, max_value=1)
    alcohol_level = serializers.IntegerField(min_value=0, max_value=3)
    exercise_freq = serializers.IntegerField(min_value=0, max_value=7)
    sleep_hours = serializers.FloatField(min_value=3, max_value=12)
    stress_score = serializers.IntegerField(min_value=1, max_value=10)

class HealthPredictionOutputSerializer(serializers.Serializer):
    health_score = serializers.FloatField()
    risks = serializers.DictField()
    trajectory = serializers.ListField(child=serializers.FloatField())
    advice = serializers.ListField(child=serializers.CharField())
    meta = serializers.DictField()

class DemoProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoProfile
        fields = ['id', 'name', 'description', 'profile_data']