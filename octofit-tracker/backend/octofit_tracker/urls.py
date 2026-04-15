from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view
import os

@api_view(['GET'])
def api_root(request, format=None):
    codespace = os.environ.get("CODESPACE_NAME", "localhost")
    base_url = f"https://{codespace}-8000.app.github.dev"

    return Response({
        "teams": f"{base_url}/api/teams/",
        "users": f"{base_url}/api/users/",
        "activities": f"{base_url}/api/activities/",
        "workouts": f"{base_url}/api/workouts/",
        "leaderboard": f"{base_url}/api/leaderboard/",
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root),  # 👈 IMPORTANTE
    path('api/', include('octofit_tracker.api_urls')),
]