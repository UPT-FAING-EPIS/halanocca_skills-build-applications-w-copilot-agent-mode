from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, UserProfileViewSet, ActivityViewSet, WorkoutViewSet, LeaderboardViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view
import os

router = DefaultRouter()
router.register(r'teams', TeamViewSet)
router.register(r'users', UserProfileViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'workouts', WorkoutViewSet)
router.register(r'leaderboard', LeaderboardViewSet)


@api_view(['GET'])
def api_root(request, format=None):
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev/api/"
    else:
        # fallback to localhost for local development
        base_url = "http://localhost:8000/api/"
    return Response({
        'teams': base_url + 'teams/',
        'users': base_url + 'users/',
        'activities': base_url + 'activities/',
        'workouts': base_url + 'workouts/',
        'leaderboard': base_url + 'leaderboard/',
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
]
