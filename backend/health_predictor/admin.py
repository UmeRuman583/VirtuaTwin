from django.contrib import admin
from .models import HealthPrediction, DemoProfile

@admin.register(HealthPrediction)
class HealthPredictionAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'get_age', 'get_health_score', 'get_cardio_risk']
    list_filter = ['timestamp']
    readonly_fields = ['timestamp', 'input_data', 'prediction_result']
    
    def get_age(self, obj):
        return obj.input_data.get('age', 'N/A')
    get_age.short_description = 'Age'
    
    def get_health_score(self, obj):
        return obj.prediction_result.get('health_score', 'N/A')
    get_health_score.short_description = 'Health Score'
    
    def get_cardio_risk(self, obj):
        risks = obj.prediction_result.get('risks', {})
        return f"{risks.get('cardio', 0):.2%}"
    get_cardio_risk.short_description = 'Cardio Risk'

@admin.register(DemoProfile)
class DemoProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'is_active']
    list_filter = ['is_active']
    fields = ['name', 'description', 'profile_data', 'is_active']