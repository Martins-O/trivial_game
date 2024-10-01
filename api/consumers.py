import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GameRoom, Question
from random import choice

class GameRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'game_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data['type']

        if message_type == 'join_game':
            await self.join_game(data['username'])
        elif message_type == 'start_game':
            await self.start_game()
        elif message_type == 'submit_answer':
            await self.submit_answer(data['username'], data['answer'])

    async def join_game(self, username):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'username': username
            }
        )

    async def start_game(self):
        question = await self.get_random_question()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_started',
                'question': question
            }
        )

    async def submit_answer(self, username, answer):
        is_correct = await self.check_answer(answer)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'answer_result',
                'username': username,
                'is_correct': is_correct
            }
        )

    async def user_joined(self, event):
        await self.send(text_data=json.dumps(event))

    async def game_started(self, event):
        await self.send(text_data=json.dumps(event))

    async def answer_result(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def get_random_question(self):
        question = choice(Question.objects.all())
        return {
            'id': question.id,
            'text': question.text,
            'answers': [
                question.correct_answer,
                question.wrong_answer1,
                question.wrong_answer2,
                question.wrong_answer3
            ]
        }

    @database_sync_to_async
    def check_answer(self, answer):
        question = Question.objects.get(id=self.scope['game_room'].current_question.id)
        return answer == question.correct_answer