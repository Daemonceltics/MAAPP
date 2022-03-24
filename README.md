## Mobile App API Penetration Platform(MAAPP)

MAAPP is an Android/iOS App API penetration tool. Using it penetration tester can improve efficiency because it ignores kinds of protection functions (e.g. encrypt) implemention. Powered by [frida.re](https://www.frida.re), [python3](https://www.python.org)
Base on https://github.com/lyxhh/lxhToolHTTPDecrypt/, thanks @lyxhh a lot.

MAAPP support two modes:
- Mode one:
Call decrypt/encrypt/hash functions directly through the burpsuite plugin.
- Mode two(Recommand):
Modify plaintext data before eencryption/hash functions processing.


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
$ pip3 install -r requirements.txt


## Usage
usage: app.py [-h] [-p FLASKPORT] [-fp FRIDAPORT]  
$ cd src & python3 app.py  
then open http://localhost:8088  (default) 

Debug custom scripts：
```
send('-debugscript-'+'this is log');
```
## Known issues
1. Memory address hook not support

## LICENCE
MIT
