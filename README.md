## Mobile App API Penetration Platform(MAAPP)

Android/iOS App API penetration tool. Powered by [frida.re](https://www.frida.re), [python3](https://www.python.org)
Modle one:
Call decrypt/encrypt/hash function by burpsuite plugin.
Modle two(Recommand):
Modify request plaintexts before sent to server.

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
