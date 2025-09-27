from django.db import models
import json

class HealthPrediction(models.Model):
    """Store prediction history for analytics"""
    timestamp = models.DateTimeField(auto_now_add=True)
    input_data = models.JSONField()
    prediction_result = models.JSONField()
    
    class Meta:
        ordering = ['-timestamp']

class DemoProfile(models.Model):
    """Predefined demo profiles"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    profile_data = models.JSONField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name