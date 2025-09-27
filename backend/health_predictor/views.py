import os
import joblib
import json
from pathlib import Path
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.http import JsonResponse
from typing import Dict, Any
from .serializers import (
    HealthPredictionInputSerializer, 
    HealthPredictionOutputSerializer,
    DemoProfileSerializer
)
from .models import HealthPrediction, DemoProfile

# Import your ML inference function
from ml_models import inference_utilities


class HealthPredictionView(APIView):
    
    def post(self, request):
        # Validate input data
        serializer = HealthPredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'error': 'Invalid input data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get validated data with proper type checking
            validated_data = serializer.validated_data
            
            # Type guard to ensure we have a dictionary
            if not isinstance(validated_data, dict):
                return Response({
                    'error': 'Invalid data format'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Additional validation to ensure we have the required data
            if not validated_data:
                return Response({
                    'error': 'No input data provided'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Now we can safely assign with type annotation
            input_data: Dict[str, Any] = validated_data
            
            # Validate required fields exist
            required_fields: list[str] = [
                'age', 'sex', 'bp_systolic', 'cholesterol', 'bmi', 
                'smoking', 'alcohol_level', 'exercise_freq', 'sleep_hours', 'stress_score'
            ]
            
            missing_fields: list[str] = [field for field in required_fields if field not in input_data]
            if missing_fields:
                return Response({
                    'error': 'Missing required fields',
                    'missing_fields': missing_fields
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Make prediction using your ML model
            prediction_result = inference_utilities.predict_from_payload(input_data)
            
            # Store prediction in database for analytics
            try:
                HealthPrediction.objects.create(
                    input_data=input_data,
                    prediction_result=prediction_result
                )
            except Exception as db_error:
                # Log database error but don't fail the request
                print(f"Database storage warning: {db_error}")
            
            # Validate output format
            output_serializer = HealthPredictionOutputSerializer(data=prediction_result)
            if output_serializer.is_valid():
                return Response(prediction_result, status=status.HTTP_200_OK)
            else:
                # Return prediction anyway but log the validation error
                print(f"Output validation warning: {output_serializer.errors}")
                return Response(prediction_result, status=status.HTTP_200_OK)
                
        except ValueError as ve:
            # Handle ML model validation errors
            return Response({
                'error': 'Input validation failed',
                'message': str(ve)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            # Handle other prediction errors
            return Response({
                'error': 'Prediction failed',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DemoProfilesView(APIView):
    """
    GET /demo-profiles - Returns predefined demo profiles
    """
    
    def get(self, request):
        try:
            profiles = DemoProfile.objects.filter(is_active=True)
            serializer = DemoProfileSerializer(profiles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            # Fallback to static demo data
            print(f"Database error, using fallback profiles: {e}")
            demo_profiles = self.get_fallback_profiles()
            return Response(demo_profiles, status=status.HTTP_200_OK)
    
    def get_fallback_profiles(self):
        """Fallback demo profiles if database is not set up"""
        return [
            {
                "id": 1,
                "name": "Healthy Tech Worker",
                "description": "30-year-old software developer with good habits",
                "profile_data": {
                    "age": 30,
                    "sex": 1,
                    "bp_systolic": 120,
                    "cholesterol": 180,
                    "bmi": 23.5,
                    "smoking": 0,
                    "alcohol_level": 1,
                    "exercise_freq": 4,
                    "sleep_hours": 7.5,
                    "stress_score": 4
                }
            },
            {
                "id": 2,
                "name": "High-Risk Executive",
                "description": "45-year-old executive with multiple risk factors",
                "profile_data": {
                    "age": 45,
                    "sex": 1,
                    "bp_systolic": 138,
                    "cholesterol": 220,
                    "bmi": 29.4,
                    "smoking": 1,
                    "alcohol_level": 2,
                    "exercise_freq": 1,
                    "sleep_hours": 5.5,
                    "stress_score": 7
                }
            },
            {
                "id": 3,
                "name": "Active Senior",
                "description": "65-year-old retiree maintaining healthy lifestyle",
                "profile_data": {
                    "age": 65,
                    "sex": 0,
                    "bp_systolic": 125,
                    "cholesterol": 190,
                    "bmi": 24.8,
                    "smoking": 0,
                    "alcohol_level": 0,
                    "exercise_freq": 5,
                    "sleep_hours": 8.0,
                    "stress_score": 3
                }
            }
        ]


@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return JsonResponse({
        'status': 'healthy',
        'service': 'Digital Twin Health Predictor API',
        'version': '1.0.0'
    })


@api_view(['GET'])
def api_info(request):
    """API documentation endpoint"""
    return JsonResponse({
        'service': 'Digital Twin Health Predictor',
        'version': '1.0.0',
        'endpoints': {
            'POST /predict': 'Health prediction from lifestyle inputs',
            'GET /demo-profiles': 'Predefined demo user profiles',
            'GET /health': 'Service health check',
            'GET /': 'This API info'
        },
        'input_format': {
            'age': 'int (18-120)',
            'sex': 'int (0=Female, 1=Male)',
            'bp_systolic': 'float (70-250)',
            'cholesterol': 'float (100-500)',
            'bmi': 'float (15-50)',
            'smoking': 'int (0=No, 1=Yes)',
            'alcohol_level': 'int (0-3)',
            'exercise_freq': 'int (0-7 days/week)',
            'sleep_hours': 'float (3-12)',
            'stress_score': 'int (1-10)'
        }
    })