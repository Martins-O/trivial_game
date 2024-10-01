from django.test import TestCase
from rest_framework.test import APIClient
from .models import Category, Question

class QuestionAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='General Knowledge')
        self.question = Question.objects.create(
            text='What is the capital of France?',
            correct_answer='Paris',
            wrong_answer1='London',
            wrong_answer2='Berlin',
            wrong_answer3='Madrid',
            category=self.category,
            difficulty='easy'
        )

    def test_get_questions(self):
        response = self.client.get('/api/questions/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['text'], 'What is the capital of France?')

    def test_get_random_questions(self):
        response = self.client.get('/api/questions/random/?count=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)