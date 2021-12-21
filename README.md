## Mobile App API Penetration Platform(MAAPP)

MAAPP is a Android/iOS App API penetration tool, use it penetration tester can improving efficiency because ignore kinds of protection functions (e.g. encrypt) implemention ,Powered by [frida.re](https://www.frida.re), [python3](https://www.python.org)
Base on https://github.com/lyxhh/lxhToolHTTPDecrypt/, thanks @lyxhh a lot.

MAAPP support two modles:
Modle one:
Calling decrypt/encrypt/hash functions by burpsuite plugin.
Modle two(Recommand):
Modify request plaintexts before encrypt/hash functions.

## Features
* **Cross plarform web GUI!**
* Hook all methods with the given class.
* Find all methods with the given class.
* Print stack information 
* Finds the method based on the given string
* Print all modules(import and export and symbols,RegisterNative)
* UIDump(Monitor Activity,Action...)
* Custom Script
* Print network request stack infomation. 


## Installation
$ pip3 install colorlog flask flask_socketio requests frida-tools


## Usage
usage: app.py [-h] [-p FLASKPORT] [-fp FRIDAPORT]  
$ python3 app.py  
then open http://localhost:8088  (default) 

Debug custom scripts：
```
send('-debugscript-'+'this is log');
```

## LICENCE
MIT
