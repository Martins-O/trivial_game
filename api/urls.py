from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import QuestionViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('leaderboard/', views.LeaderboardView.as_view(), name='leaderboard'),
    path('game-rooms/', views.GameRoomListView.as_view(), name='game-room-list'),
    path('game-rooms/<int:pk>/', views.GameRoomDetailView.as_view(), name='game-room-detail'),
]