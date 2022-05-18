from spyne import Application, rpc, ServiceBase, Iterable, Integer, Unicode

from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication


class CorsService(ServiceBase):
    origin = '*'


def _on_method_return_object(ctx):
    ctx.transport.resp_headers['Access-Control-Allow-Origin'] = ctx.descriptor.service_class.origin


CorsService.event_manager.add_listener(
    'method_return_object', _on_method_return_object)


class ChatBotService(CorsService):

    @rpc(Unicode, _returns=Iterable(Unicode))
    def get_intent(ctx, mensaje):
        """Docstrings for service methods appear as documentation in the wsdl.
        <b>What fun!</b>

        @param mensaje the message to infer intent
        @return the intent of the message
        """
        yield mensaje

    @rpc(Unicode, _returns=Iterable(Unicode))
    def get_response(ctx, mensaje):
        """Docstrings for service methods appear as documentation in the wsdl.
        <b>What fun!</b>

        @param mensaje the message to infer intent
        @return the intent of the message
        """
        yield mensaje


application = Application([ChatBotService], 'spyne.examples.hello.soap',
                          in_protocol=Soap11(validator='lxml'),
                          out_protocol=Soap11())

wsgi_application = WsgiApplication(application)


if __name__ == '__main__':
    import logging

    from wsgiref.simple_server import make_server

    logging.basicConfig(level=logging.DEBUG)
    logging.getLogger('spyne.protocol.xml').setLevel(logging.DEBUG)

    logging.info("listening to http://127.0.0.1:8000")
    logging.info("wsdl is at: http://localhost:8000/?wsdl")

    server = make_server('localhost', 8000, wsgi_application)
    server.serve_forever()
