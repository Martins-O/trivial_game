from django.contrib.auth.models import User
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    text = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)
    wrong_answer1 = models.CharField(max_length=255)
    wrong_answer2 = models.CharField(max_length=255)
    wrong_answer3 = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='questions')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')

    def __str__(self):
        return self.text

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_score = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

class GameRoom(models.Model):
    name = models.CharField(max_length=100, unique=True)
    players = models.ManyToManyField(User, related_name='game_rooms')
    current_question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name
