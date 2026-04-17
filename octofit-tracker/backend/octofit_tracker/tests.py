from django.test import TestCase
from .models import Team, UserProfile, Activity, Workout, Leaderboard
from datetime import date

class TeamModelTest(TestCase):
    def test_create_team(self):
        team = Team.objects.create(name="Test Team", description="A test team")
        self.assertEqual(str(team), "Test Team")

class UserProfileModelTest(TestCase):
    def test_create_userprofile(self):
        team = Team.objects.create(name="Team1")
        user = UserProfile.objects.create(name="Alice", email="alice@example.com", team=team)
        self.assertEqual(str(user), "Alice")

class ActivityModelTest(TestCase):
    def test_create_activity(self):
        team = Team.objects.create(name="Team2")
        user = UserProfile.objects.create(name="Bob", email="bob@example.com", team=team)
        activity = Activity.objects.create(user=user, activity_type="Run", duration_minutes=30, date=date.today())
        self.assertIn("Run", str(activity))

class WorkoutModelTest(TestCase):
    def test_create_workout(self):
        team = Team.objects.create(name="Team3")
        workout = Workout.objects.create(name="Cardio", description="Cardio workout")
        workout.suggested_for.add(team)
        self.assertEqual(str(workout), "Cardio")

class LeaderboardModelTest(TestCase):
    def test_create_leaderboard(self):
        team = Team.objects.create(name="Team4")
        leaderboard = Leaderboard.objects.create(team=team, points=100)
        self.assertIn("Team4", str(leaderboard))
