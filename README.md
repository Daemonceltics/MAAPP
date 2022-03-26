## Mobile App API Penetration Platform(MAAPP)

MAAPP is an Android/iOS App API penetration tool. Using it penetration tester can be more efficient as it ignores the implementation of various protection functions (e.g. encryption). Powered by [frida.re](https://www.frida.re), [python3](https://www.python.org)
Base on https://github.com/lyxhh/lxhToolHTTPDecrypt/, thanks @lyxhh a lot.

MAAPP support two modes:
- Mode 1:
Call decrypt/encrypt/hash functions directly through the burpsuite plugin.
- Mode 2(Recommand):
Modify plaintext data before eencryption/hash functions processing.
How does mode 1 work?
![](docs/images/mode1.png)
How does mode 2 work?
![](docs/images/maapp.png)

## Note:
Using this tool for penetration testing is not a zero threshold, because whether you choose mode 1 or mode 2 generally requires some reverse engineering, the workload of reverse engineering depends on the effect of "Trace" in the tool, but is very small compared to traditional methods if needed.

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


## Installation and setup
$ pip3 install -r requirements.txt
Burp install extender:
Extender->Add->Select file->Select BurpsuitePlugin/out/artifacts/HTTPDecryptPlugin_jar/HTTPDecryptPlugin.jar
A mobile phone that frida installed connected to the PC

## Usage
usage: app.py [-h] [-p FLASKPORT] [-fp FRIDAPORT]  
$ cd src & python3 app.py  
web server url is http://localhost:8088  (default) 
Open another terminal(It's unnecessary if you use mode one)
$ cd src & python3 tracer.py
Set up burpsuite:
![](docs/images/1.png)
![](docs/images/2.png)
and make sure no socks proxy be used:
![](docs/images/image2021-6-8_18-6-21)
Open http://localhost:8088 on your browser, click refresh PID button
![](docs/images/refresh.png)
Select process you will hacked
![](docs/images/select.png)
Then switch to Trace module(Currently only Android is supported) and start trace
![](docs/images/trace.png)
Operate the App to send network requests，If all goes well you will see a result similar to the figure below. It helps you find the entry point for network data processing quickly. Of course we only need to focus on the module name is CFBundleName, 
![](docs/images/tracestack.png)
(The AppStore in the picture is not the system App Store, it just happens to have the same name)
According to ObjC's selector, we can know that the DTRpcOperation class is a part of the network communication data processing, so we can try to instrument the relevant class as the key function to forward data to burp. So switch toBurp menu, input DTRpcOperation and click the "Confim" button
![](docs/images/selectfunc.png)
Select the target function and click "Add" button to add the function information to "Info", then configure index infomation
![](docs/images/configfunc.png)
"Intercept mode" type 0 and "Keyword" leave it nothing, click "Add/Update Hook Info", your burp will receive the parameters of the function mentioned above, and you can insert a pentesting payload on it
![](docs/images/intercept.png)
The data in the burp is complete and plaintext if you choose a "good" enough function.


## Known issues
1. Memory address hook not supported
2. Android platform has fewer parameter types, usage and testing than iOS platform, and the code may not be robust enough. Supported types of function parameters:
```
Android:String org.json.JSONObject byte[]
iOS:NSString NSDictionary NSData NSURL 
```
3. Repeater and Intruder features in burp are not supported

## LICENCE
MIT
