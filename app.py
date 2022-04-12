# - * - coding:utf-8 - * -
from src.log import logger
from flask import render_template, request
from collections import OrderedDict
from src.globalenv import genv, app, socketio
from src.socketutil import *
from src.util import *
import logging
import base64
import argparse
import webbrowser

logg = logging.getLogger('werkzeug')
logg.setLevel(logging.ERROR)

@app.route('/')
def hello():
    with open('./src/templates/header.html', encoding='utf-8') as f:
        header_html = f.read()

    with open('./src/templates/home.html', encoding='utf-8') as f:
        home_html = f.read()

    with open('./src/templates/hook.html', encoding='utf-8') as f:
        hook_html = f.read()

    with open('./src/templates/stack.html', encoding='utf-8') as f:
        stack_html = f.read()

    with open('./src/templates/find.html', encoding='utf-8') as f:
        find_html = f.read()

    with open('./src/templates/uidump.html', encoding='utf-8') as f:
        uidump_html = f.read()

    with open('./src/templates/toBurp.html', encoding='utf-8') as f:
        toBurp_html = f.read()

    with open('./src/templates/custom.html', encoding='utf-8') as f:
        custom_html = f.read()

    with open('./src/templates/decoder.html', encoding='utf-8') as f:
        decoder_html = f.read()

    with open('./src/templates/trace.html', encoding='utf-8') as f:
        trace_html = f.read()

    return render_template("index.html", header=header_html, home=home_html, hook=hook_html, stack=stack_html,
                           find=find_html, uidump=uidump_html, toBurp=toBurp_html, custom=custom_html,
                           decoder=decoder_html, trace=trace_html)


@app.route('/call', methods=['POST'])
def call():
    ArgsInfo = request.form.get('argsinfo')
    MethodTag = request.form.get('methodtag')

    if ArgsInfo is None or MethodTag is None:
        return "Arguments Value is None, please check."
    if genv.script is None:
        return "Export Script no load, please check."
    # print(type(request.form.get('argsinfo')))

    try:
        jArgsInfo = json.loads(ArgsInfo, object_pairs_hook=OrderedDict)
        argumentsinfo = jArgsInfo.values()
        # print(request.form)
        method_to_call = getattr(genv.script.exports, MethodTag)(*argumentsinfo)
        # print(method_to_call)
        return method_to_call
    except Exception as e:
        return str(e)


@app.route('/bcall', methods=['POST'])
def bcall():
    # print(request.form)
    ArgsInfo = request.form.get('argsinfo')
    MethodTag = base64.b64decode(request.form.get('methodtag')).decode('utf-8')

    if ArgsInfo is None or MethodTag is None:
        return "Arguments Value is None, please check."
    if genv.script is None:
        return "Export Script no load, please check."

    try:
        jArgsInfo = json.loads(ArgsInfo, object_pairs_hook=OrderedDict)
        argumentsinfo = [base64.b64decode(temp).decode('utf-8') for temp in jArgsInfo.values()]

        logger.info("[*]Burpsuite selected: " + ''.join(argumentsinfo))

        method_to_call = getattr(genv.script.exports, MethodTag)(*argumentsinfo)

        logger.info("[*]Return to burp: " + method_to_call)

        return method_to_call
    except Exception as e:
        return "bcall Error is :" + str(e)


def main():
    parser = argparse.ArgumentParser()
    parser.description = 'MAAPP'
    parser.add_argument("-p", "--FlaskPort", help="Specify the Flask port , default port is 8088")
    # parser.add_argument("-fp", "--FridaPort", help="Specify the Frida port, default port is 27042")
    parser.add_argument("-fp", "--FridaPort", help="Specify the Frida port, default port is 0")
    args = parser.parse_args()
    # print(args)
    host = "127.0.0.1"
    FlaskPort = 8088 if (args.FlaskPort is None) else args.FlaskPort
    FridaPort = 0 if (args.FridaPort is None) else args.FridaPort

    logger.info("MAAPP running at http://127.0.0.1:{}".format(FlaskPort))
    genv.set_device(FridaPort)
    # webbrowser.open("http://127.0.0.1:8088")
    socketio.run(app, host=host, port=FlaskPort, debug=True)

if __name__ == '__main__':
    main()
    # socketio.run(app, debug=True)
    # app.run(debug=True)
