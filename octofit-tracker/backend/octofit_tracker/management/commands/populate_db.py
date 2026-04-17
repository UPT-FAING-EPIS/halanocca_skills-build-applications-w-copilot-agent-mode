from django.core.management.base import BaseCommand
from octofit_tracker.models import Team, UserProfile, Activity, Workout, Leaderboard
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Borrar datos existentes
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        UserProfile.objects.all().delete()
        Team.objects.all().delete()
        Workout.objects.all().delete()

        # Crear equipos
        marvel = Team.objects.create(name='Marvel', description='Equipo Marvel')
        dc = Team.objects.create(name='DC', description='Equipo DC')

        # Crear usuarios superhéroes
        users = [
            UserProfile(name='Spider-Man', email='spiderman@marvel.com', team=marvel, is_superhero=True),
            UserProfile(name='Iron Man', email='ironman@marvel.com', team=marvel, is_superhero=True),
            UserProfile(name='Wonder Woman', email='wonderwoman@dc.com', team=dc, is_superhero=True),
            UserProfile(name='Batman', email='batman@dc.com', team=dc, is_superhero=True),
        ]
        UserProfile.objects.bulk_create(users)

        # Crear actividades
        users = UserProfile.objects.all()
        for user in users:
            Activity.objects.create(user=user, activity_type='Running', duration_minutes=30, date=timezone.now().date())
            Activity.objects.create(user=user, activity_type='Cycling', duration_minutes=45, date=timezone.now().date())

        # Crear workouts
        w1 = Workout.objects.create(name='Cardio Blast', description='Entrenamiento de cardio intenso')
        w2 = Workout.objects.create(name='Strength Power', description='Rutina de fuerza')
        w1.suggested_for.set([marvel, dc])
        w2.suggested_for.set([marvel])

        # Crear leaderboard
        Leaderboard.objects.create(team=marvel, points=100)
        Leaderboard.objects.create(team=dc, points=80)

        self.stdout.write(self.style.SUCCESS('Base de datos poblada con datos de ejemplo.'))
