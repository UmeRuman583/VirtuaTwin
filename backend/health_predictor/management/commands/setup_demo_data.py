from django.core.management.base import BaseCommand
from health_predictor.models import DemoProfile

class Command(BaseCommand):
    help = 'Load demo profiles into database'

    def handle(self, *args, **options):
        demo_profiles = [
            {
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
            },
            {
                "name": "College Student",
                "description": "22-year-old student with poor sleep habits",
                "profile_data": {
                    "age": 22,
                    "sex": 0,
                    "bp_systolic": 110,
                    "cholesterol": 160,
                    "bmi": 21.0,
                    "smoking": 0,
                    "alcohol_level": 2,
                    "exercise_freq": 2,
                    "sleep_hours": 5.0,
                    "stress_score": 8
                }
            }
        ]
        
        # Clear existing demo profiles
        DemoProfile.objects.all().delete()
        
        # Create new demo profiles
        for profile_data in demo_profiles:
            profile = DemoProfile.objects.create(**profile_data)
            self.stdout.write(
                self.style.SUCCESS(f'Created demo profile: {profile.name}')
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully loaded {len(demo_profiles)} demo profiles')
        )