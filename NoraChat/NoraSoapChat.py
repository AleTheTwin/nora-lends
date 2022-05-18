from ast import Import
from spyne import Application, rpc, ServiceBase, Iterable, Integer, Unicode
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from chatterbot.conversation import Statement

chat=ChatBot("Nora",
        storage_adapter='chatterbot.storage.SQLStorageAdapter',
        database="./db.sqlite3",
        logic_adapters=[
            'chatterbot.logic.BestMatch',
        ],
        preprocessors=[
            'chatterbot.preprocessors.clean_whitespace'
        ]
    )
class NoraMensaje(ServiceBase):
    
        
    @rpc(Unicode,_returns=Iterable(Unicode))
    def get_response(self,entrada):
        print(entrada)
        response = chat.get_response(entrada)
        yield ('Nora:{}'.format(
        response.text
        ))


application = Application([NoraMensaje], 'spyne.norachat',
                          in_protocol=Soap11(validator='lxml'),
                          out_protocol=Soap11())

wsgi_application = WsgiApplication(application)


if __name__ == '__main__':
    import logging

    from wsgiref.simple_server import make_server

    logging.basicConfig(level=logging.DEBUG)
    logging.getLogger('spyne.protocol.xml').setLevel(logging.DEBUG)

    logging.info("listening to http://localhost:8000")
    logging.info("wsdl is at: http://localhost:8000/?wsdl")

    server = make_server('localhost', 8000, wsgi_application)
    server.serve_forever()
