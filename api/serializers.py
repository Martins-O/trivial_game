from rest_framework import serializers
from .models import Question, Category, UserProfile, GameRoom

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class QuestionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'correct_answer', 'wrong_answer1', 'wrong_answer2', 'wrong_answer3', 'category', 'difficulty']


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['username', 'total_score']

class GameRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRoom
        fields = ['id', 'name', 'players', 'is_active']
