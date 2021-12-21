# - * - coding:utf-8 - * -
from http.server import HTTPServer, BaseHTTPRequestHandler

ECHO_PORT = 27000

class RequestHandler(BaseHTTPRequestHandler):

    def do_FRIDA(self):
        request_path = self.path

        request_headers = self.headers
        content_length = request_headers.get('content-length')
        length = int(content_length) if content_length else 0

        self.send_response(200)
        self.end_headers()

        self.wfile.write(self.rfile.read(length))


def main():
    print('Listening on localhost:%d' % ECHO_PORT)
    server = HTTPServer(('', ECHO_PORT), RequestHandler)
    server.serve_forever()


if __name__ == "__main__":
    print("[+] Starting echo server on port %d" % ECHO_PORT)
    main()