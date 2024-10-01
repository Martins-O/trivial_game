from random import sample

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile, GameRoom, Question, Category
from .serializers import UserProfileSerializer, GameRoomSerializer, QuestionSerializer, CategorySerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    @action(detail=False, methods=['get'])
    def random(self, request):
        count = int(request.query_params.get('count', 10))
        category = request.query_params.get('category')
        difficulty = request.query_params.get('difficulty')

        questions = Question.objects.all()

        if category:
            questions = questions.filter(category__name=category)
        if difficulty:
            questions = questions.filter(difficulty=difficulty)

        if questions.count() < count:
            count = questions.count()

        random_questions = sample(list(questions), count)
        serializer = self.get_serializer(random_questions, many=True)
        return Response(serializer.data)

class LeaderboardView(generics.ListAPIView):
    queryset = UserProfile.objects.order_by('-total_score')[:10]
    serializer_class = UserProfileSerializer

class GameRoomListView(generics.ListCreateAPIView):
    queryset = GameRoom.objects.filter(is_active=True)
    serializer_class = GameRoomSerializer
    permission_classes = [IsAuthenticated]

class GameRoomDetailView(generics.RetrieveAPIView):
    queryset = GameRoom.objects.all()
    serializer_class = GameRoomSerializer
    permission_classes = [IsAuthenticated]