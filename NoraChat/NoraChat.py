from dbm.dumb import _Database
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from chatterbot.conversation import Statement

import logging
logging.basicConfig(filename="archivarlog.log",level=logging.DEBUG)

chat=ChatBot("Nora",
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    logic_adapters=[
        {
            'import_path': 'chatterbot.logic.BestMatch',
            'default_response': 'I am sorry, but I do not understand.',
            'maximum_similarity_threshold': 0.90
        }
        
    ],
    preprocessors=[
        'chatterbot.preprocessors.clean_whitespace'
    ]
)
chat.storage
entrenador= ChatterBotCorpusTrainer(chat)
entrenador.train("chatterbot.corpus.spanish")
