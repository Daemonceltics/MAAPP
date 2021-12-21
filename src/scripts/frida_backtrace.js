/*
* Get network request backtrace by frida and Xia0 code. 
*/

// Classes and methods cache 
var classes = new Array();
var classesAndMethods = {};

function showObjcStacks(context) {
    var t = Thread.backtrace(context,Backtracer.ACCURATE);
    send("Thread.backtrace:\n\t" + t.map(DebugSymbol.fromAddress).join('\n\t'));
}

// xia0 log
function XLOG(log) {
    send("networkRequestBacktace[*] " + log)
}

// format string with width
function format(str,width){ 
    str = str + ""
    var len = str.length;
    
    if(len > width){
        return str
    }
    
    for(var i = 0; i < width-len; i++){
        str += " "
    }
    return str; 
}

function get_image_vm_slide(modulePath){
    // intptr_t   _dyld_get_image_vmaddr_slide(uint32_t image_index)
    var _dyld_get_image_vmaddr_slide = new NativeFunction(
        Module.findExportByName(null, '_dyld_get_image_vmaddr_slide'),
        'pointer',
        ['uint32']
    );
    // const char*  _dyld_get_image_name(uint32_t image_index) 
    var _dyld_get_image_name = new NativeFunction(
        Module.findExportByName(null, '_dyld_get_image_name'),
        'pointer',
        ['uint32']
    );
    // uint32_t  _dyld_image_count(void)
    var _dyld_image_count = new NativeFunction(
        Module.findExportByName(null, '_dyld_image_count'),
        'uint32',
        []
    );

    var image_count = _dyld_image_count();

    for (var i = 0; i < image_count; i++) {
        var image_name_ptr = _dyld_get_image_name(i)
        var image_silde_ptr = _dyld_get_image_vmaddr_slide(i)
        var image_name = Memory.readUtf8String(image_name_ptr)

        if (image_name == modulePath) {
            //XLOG(Memory.readUtf8String(image_name_ptr) + " slide:"+image_silde_ptr)
            return image_silde_ptr;
        }
        //XLOG(Memory.readUtf8String(image_name_ptr) + "slide:"+image_silde_ptr)
    }

    return 0;
}

function get_all_objc_class(modulePath){
    if(classes.length != 0)
        return classes
    // const char * objc_copyClassNamesForImage(const char *image, unsigned int *outCount)
    var objc_copyClassNamesForImage = new NativeFunction(
        Module.findExportByName(null, 'objc_copyClassNamesForImage'),
        'pointer',
        ['pointer', 'pointer']
    );
    // free
    var free = new NativeFunction(Module.findExportByName(null, 'free'), 'void', ['pointer']);
    
    // if given modulePath nil, default is mainBundle
    if(!modulePath){
        var path = ObjC.classes.NSBundle.mainBundle().executablePath().UTF8String();
    }else{
        var path = modulePath;
    }

    // create args
    var pPath = Memory.allocUtf8String(path);
    var p = Memory.alloc(Process.pointerSize);
    Memory.writeUInt(p, 0);

    var pClasses = objc_copyClassNamesForImage(pPath, p);
    var count = Memory.readUInt(p);
    //var classes = new Array(count);

    for (var i = 0; i < count; i++) {
        var pClassName = Memory.readPointer(pClasses.add(i * Process.pointerSize));
        classes.push(Memory.readUtf8String(pClassName));
    }

    free(pClasses);
    
    // XLOG(classes)
    return classes;
}
    

function get_all_class_methods(classname){
    if(classesAndMethods[classname] != null)
        return classesAndMethods[classname]
    var objc_getClass = new NativeFunction(
        Module.findExportByName(null, 'objc_getClass'),
        'pointer',
        ['pointer']
    );
    var class_copyMethodList = new NativeFunction(
        Module.findExportByName(null, 'class_copyMethodList'),
        'pointer',
        ['pointer', 'pointer']
    );

    var objc_getMetaClass = new NativeFunction(
        Module.findExportByName(null, 'objc_getMetaClass'),
        'pointer',
        ['pointer']
    );
    
    var method_getName = new NativeFunction(
        Module.findExportByName(null, 'method_getName'),
        'pointer',
        ['pointer']
    );
    
    var free = new NativeFunction(Module.findExportByName(null, 'free'), 'void', ['pointer']);
    
    // get objclass and metaclass
    var name = Memory.allocUtf8String(classname);
    var objClass = objc_getClass(name)
    var metaClass = objc_getMetaClass(name)
    
    // get obj class all methods
    var size_ptr = Memory.alloc(Process.pointerSize);
    Memory.writeUInt(size_ptr, 0);
    var pObjMethods = class_copyMethodList(objClass, size_ptr);
    var count = Memory.readUInt(size_ptr);
    
    var allMethods = new Array();
    
    var allObjMethods = new Array();
    
    // get obj class all methods name and IMP
    for (var i = 0; i < count; i++) {
        var curObjMethod = new Array();
        
        var pObjMethodSEL = method_getName(pObjMethods.add(i * Process.pointerSize))
        var pObjMethodName = Memory.readCString(Memory.readPointer(pObjMethodSEL))
        var objMethodIMP = Memory.readPointer(pObjMethodSEL.add(2*Process.pointerSize))
        // XLOG("-["+classname+ " " + pObjMethodName+"]" + ":" + objMethodIMP)
        curObjMethod.push(pObjMethodName)
        curObjMethod.push(objMethodIMP)
        allObjMethods.push(curObjMethod)
    }
    
    var allMetaMethods = new Array();
    
    // get meta class all methods name and IMP
    var pMetaMethods = class_copyMethodList(metaClass, size_ptr);
    var count = Memory.readUInt(size_ptr);
    for (var i = 0; i < count; i++) {
        var curMetaMethod = new Array();
        
        var pMetaMethodSEL = method_getName(pMetaMethods.add(i * Process.pointerSize))
        var pMetaMethodName = Memory.readCString(Memory.readPointer(pMetaMethodSEL))
        var metaMethodIMP = Memory.readPointer(pMetaMethodSEL.add(2*Process.pointerSize))
        //XLOG("+["+classname+ " " + pMetaMethodName+"]" + ":" + metaMethodIMP)
        curMetaMethod.push(pMetaMethodName)
        curMetaMethod.push(metaMethodIMP)
        allMetaMethods.push(curMetaMethod)
    }
    
    allMethods.push(allObjMethods)
    allMethods.push(allMetaMethods)
    
    free(pObjMethods);
    free(pMetaMethods);
    classesAndMethods[classname] = allMethods;
    return allMethods;
}
    
function get_info_form_address(address){
    
    // int dladdr(const void *, Dl_info *);
    
    //typedef struct dl_info {
    //        const char      *dli_fname;     /* Pathname of shared object */
    //        void            *dli_fbase;     /* Base address of shared object */
    //        const char      *dli_sname;     /* Name of nearest symbol */
    //        void            *dli_saddr;     /* Address of nearest symbol */
    //} Dl_info;
    
    var dladdr = new NativeFunction(
        Module.findExportByName(null, 'dladdr'),
        'int',
        ['pointer','pointer']
    );
    
    var dl_info = Memory.alloc(Process.pointerSize*4);

    dladdr(ptr(address),dl_info)

    var dli_fname = Memory.readCString(Memory.readPointer(dl_info))
    var dli_fbase = Memory.readPointer(dl_info.add(Process.pointerSize))
    var dli_sname = Memory.readCString(Memory.readPointer(dl_info.add(Process.pointerSize*2)))
    var dli_saddr = Memory.readPointer(dl_info.add(Process.pointerSize*3))
    
    //XLOG("dli_fname:"+dli_fname)
    //XLOG("dli_fbase:"+dli_fbase)
    //XLOG("dli_sname:"+dli_sname)
    //XLOG("dli_saddr:"+dli_saddr)
    
    var addrInfo = new Array();
    
    addrInfo.push(dli_fname);
    addrInfo.push(dli_fbase);
    addrInfo.push(dli_sname);
    addrInfo.push(dli_saddr);
    
    //XLOG(addrInfo)
    return addrInfo;
}

//Only main module. /var/containers/Bundle/Application/xxx/yyy.app/yyy
function find_symbol_from_address(modulePath, addr){
    var targetAddr = addr
    
    var theDis = 0xffffffffffffffff;
    var tmpDis = 0;
    var theClass = "None"
    var theMethodName = "None"
    var theMethodType = "-"
    var theMethodIMP = 0
    var repeatNum = 0
    var tmpMethod = "None"
    
    var allClassInfo = {}
    //Memory cache
    var allClass = get_all_objc_class(modulePath);
    foundit:for(var i = 0, len = allClass.length; i < len; i++){
        //Memory cache
        var mInfo = get_all_class_methods(allClass[i]);
        var curClassName = allClass[i]
        
        var objms = mInfo[0];
        for(var j = 0, olen = objms.length; j < olen; j++){
            var mname = objms[j][0]
            var mIMP = objms[j][1]
            if(targetAddr >= mIMP){
                var tmpDis = targetAddr-mIMP
                if(tmpDis > 30000){
                    // XLOG("skipThisClass")
                    break;
                }                    
                if(tmpDis < theDis){
                    theDis = tmpDis
                    theClass = curClassName
                    theMethodName = mname
                    theMethodIMP = mIMP
                    theMethodType = "-"              
                }
                // if(theDis < 100){
                //     // XLOG("foundit-"+theClass + "  " + theMethodName);
                //     // break foundit;
                // }
                // XLOG("tmpDis:" + tmpDis + " theDis:"+ theDis);
                // XLOG(theClass + "  " + theMethodName);  
            }
        }

        var metams = mInfo[1];
        for(var k = 0, mlen = metams.length; k < mlen; k++){
            var mname = metams[k][0]
            var mIMP = metams[k][1]
            if(targetAddr >= mIMP){
                var tmpDis = targetAddr-mIMP
                if(tmpDis > 30000){
                    // XLOG("skipThisClass")
                    break;
                }
                // XLOG("2tmpDis:" + tmpDis + " theDis:"+ theDis);
                if(tmpDis < theDis){
                    theDis = tmpDis
                    theClass = curClassName
                    theMethodName = mname
                    theMethodIMP = mIMP
                    theMethodType = "+"
                }
                // if(theDis < 100)
                //     break foundit;
            }
            // XLOG("2: " +theClass + "  " + theMethodName);

        }
        if( tmpMethod != "NoneNone" && tmpMethod == theClass + theMethodName )
            repeatNum +=1;
        else{
            tmpMethod = theClass + theMethodName;
            repeatNum = 0;
        }
        if (repeatNum == 200){
            // XLOG("30 30")
            break foundit;
        }
        // XLOG(theClass + "  " + theMethodName);
    }

    
    var symbol = theMethodType+"["+theClass+" "+theMethodName+"]"

    if(symbol.indexOf(".cxx")!=-1){
        symbol = "maybe C function?"
    }
    
    // if distance > 3000, maybe a c function
    if(theDis > 5000){
        symbol = "maybe C function? symbol:" + symbol
    }
    
    return symbol;
}

function backtrace(onlyMainModule){
    XLOG("================================================xCallStackSymbols==========================================")
    function getExeFileName(modulePath){
        modulePath += ""
        return modulePath.split("/").pop()
    }
    
    var mainPath = ObjC.classes.NSBundle.mainBundle().executablePath().UTF8String();
    
    var threadClass = ObjC.classes.NSThread
    // NSArray<NSString *>
    var addrs = threadClass["+ callStackSymbols"]()
    var addrs = threadClass["+ callStackReturnAddresses"]()
    var count = addrs["- count"]();

    for(var i = 0, len = count; i < len; i++){
        
        var curAddr = addrs["- objectAtIndex:"](i)["- integerValue"]();
        var info = get_info_form_address(curAddr);
        // skip frida call stack
        if(!info[0]){
            continue;
        }
        
        var dl_symbol = info[2]+""
        var curModulePath = info[0]+""
        
        var fileAddr = curAddr-get_image_vm_slide(curModulePath);

        if (onlyMainModule) {
            if (curModulePath == mainPath) {
                var symbol = find_symbol_from_address(curModulePath,curAddr);
            }else{
                var symbol = info[2];
            }
        }else{
            if((!info[2] || dl_symbol.indexOf("redacted")!=-1) && curModulePath.indexOf("libdyld.dylib") == -1){
                var symbol = find_symbol_from_address(curModulePath,curAddr);
            }else{
                var symbol = info[2];
            }
        }

        XLOG(format(i, 4)+format(getExeFileName(info[0]), 20)+"mem:"+format(ptr(curAddr),13)+"file:"+format(ptr(fileAddr),13)+format(symbol,80))
    }
    XLOG("==============================================================================================================")
    return;
}

function fridaBacktrace(context){

    XLOG("================================================Network backtrace==========================================")

    function getExeFileName(modulePath){
        modulePath += ""
        return modulePath.split("/").pop()
    }
    
    var mainPath = ObjC.classes.NSBundle.mainBundle().executablePath().UTF8String();
    var mainModuleName = getExeFileName(mainPath)
    
    var backtrace = Thread.backtrace(context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress)
    for (var i = 0;i < backtrace.length;i ++)
    {
        var curStackFrame = backtrace[i] + ''
        var curSym = curStackFrame.split("!")[1]
        var curAddr = curStackFrame.split("!")[0].split(" ")[0]
        var curModuleName = curStackFrame.split("!")[0].split(" ")[1]

        var info = get_info_form_address(curAddr);
        // skip frida call stack
        if(!info[0]){
            continue;
        }
        
        var dl_symbol = info[2]+""
        var curModulePath = info[0]+""
        var fileAddr = curAddr-get_image_vm_slide(curModulePath);
        
        // is the image in app dir?
        if (curModulePath.indexOf(mainModuleName) != -1 ) {
            //var fileAddr = curAddr-get_image_vm_slide(curModulePath);
            curSym = find_symbol_from_address(curModulePath,curAddr);
        }
        XLOG(format(i, 4)+format(getExeFileName(curModulePath), 20)+"mem:"+format(ptr(curAddr),13)+"file:"+format(ptr(fileAddr),13)+format(curSym,80))
    }
    XLOG("==============================================================================================================")
    return

}




if (ObjC.available) {


/*
非框架使用 NSURLSession
NSURLSession *session = [NSURLSession sharedSession];
+ (NSURLSession *)sessionWithConfiguration:(NSURLSessionConfiguration *)configuration;
+ (NSURLSession *)sessionWithConfiguration:(NSURLSessionConfiguration *)configuration delegate:(nullable id <NSURLSessionDelegate>)delegate delegateQueue:(nullable NSOperationQueue *)queue;

非框架使用 NSURLConnection
- (nullable instancetype)initWithRequest:(NSURLRequest *)request delegate:(nullable id)delegate startImmediately:(BOOL)startImmediately API_DEPRECATED("Use NSURLSession (see NSURLSession.h)", macos(10.5,10.11), ios(2.0,9.0), tvos(9.0,9.0)) API_UNAVAILABLE(watchos);
- (nullable instancetype)initWithRequest:(NSURLRequest *)request delegate:(nullable id)delegate API_DEPRECATED("Use NSURLSession (see NSURLSession.h)", macos(10.3,10.11), ios(2.0,9.0), tvos(9.0,9.0)) API_UNAVAILABLE(watchos);
+ (nullable NSURLConnection*)connectionWithRequest:(NSURLRequest *)request delegate:(nullable id)delegate API_DEPRECATED("Use NSURLSession (see NSURLSession.h)", macos(10.3,10.11), ios(2.0,9.0), tvos(9.0,9.0)) API_UNAVAILABLE(watchos);
*/


// [NSURLSession sharedSession]
    var hook1 = ObjC.classes.NSURLSession["+ sharedSession"];
    Interceptor.attach(hook1.implementation, {
        onLeave: function(retval) {
            XLOG("+[NSURLSession sharedSession]")
            // backtrace(true)
            fridaBacktrace(this.context);
            // showObjcStacks(this.context);
        } 
    });
    var hook2 = ObjC.classes.NSURLSession["+ sessionWithConfiguration:"];
    Interceptor.attach(hook2.implementation, {
        onLeave: function(retval) {
            XLOG("+[NSURLSession sessionWithConfiguration:]")
            // backtrace(true)
            fridaBacktrace(this.context);
            // showObjcStacks(this.context);
        } 
    });
    var hook3 = ObjC.classes.NSURLSession["+ sessionWithConfiguration:delegate:delegateQueue:"];
    Interceptor.attach(hook3.implementation, {
        onLeave: function(retval) {
            XLOG("+[NSURLSession sessionWithConfiguration:delegate:delegateQueue:]")
            // backtrace(true)
            fridaBacktrace(this.context);
            // showObjcStacks(this.context);
        } 
    });
    var hook4 = ObjC.classes.NSURLConnection["- initWithRequest:delegate:startImmediately:"];
    Interceptor.attach(hook4.implementation, {
        onLeave: function(retval) {
            XLOG("-[NSURLConnection initWithRequest:delegate:startImmediately:]")
            // backtrace(true)
            fridaBacktrace(this.context);
            // showObjcStacks(this.context);
        } 
    });
    var hook5 = ObjC.classes.NSURLConnection["- initWithRequest:delegate:"];
    Interceptor.attach(hook5.implementation, {
        onLeave: function(retval) {
            XLOG("-[NSURLConnection initWithRequest:delegate:]")
            // backtrace(true)
            fridaBacktrace(this.context);
            // showObjcStacks(this.context);
        } 
    });
    var hook6 = ObjC.classes.NSURLConnection["+ connectionWithRequest:delegate:"];
    Interceptor.attach(hook6.implementation, {
        onLeave: function(retval) {
            XLOG("+[NSURLConnection connectionWithRequest:delegate:]")
            // backtrace(true)
            fridaBacktrace(this.context);
            // showObjcStacks(this.context);
        } 
    });
    if (ObjC.classes.AFURLConnectionOperation) {
            var hook7 = ObjC.classes.AFURLConnectionOperation["- start"];
            Interceptor.attach(hook7.implementation, {
                onLeave: function(retval) {
                    XLOG("-[AFURLConnectionOperation start]")
                    // backtrace(true)
                    fridaBacktrace(this.context);
                    // showObjcStacks(this.context);
            } 
         });
    }
    if (ObjC.classes.AFURLSessionManager) {
            var hook8 = ObjC.classes.AFURLSessionManager["- init"];
            Interceptor.attach(hook8.implementation, {
                onLeave: function(retval) {
                    XLOG("-[AFURLSessionManager init]")
                    // backtrace(true)
                    fridaBacktrace(this.context);
                    // showObjcStacks(this.context);
                } 
            });
            var hook9 = ObjC.classes.AFURLSessionManager["- initWithSessionConfiguration:"];
            Interceptor.attach(hook9.implementation, {
                onLeave: function(retval) {
                    XLOG("-[AFURLSessionManager initWithSessionConfiguration:]")
                    // backtrace(true)
                    fridaBacktrace(this.context);
                    // showObjcStacks(this.context);
                } 
            });
    }
    if (ObjC.classes.AFHTTPSessionManager) {
            var hook0 = ObjC.classes.AFHTTPSessionManager["- initWithBaseURL:"];
            Interceptor.attach(hook0.implementation, {
                onLeave: function(retval) {
                    XLOG("-[AFHTTPSessionManager initWithBaseURL:]")
                    // backtrace(true)
                    fridaBacktrace(this.context);
                    // showObjcStacks(this.context);
                } 
            });

            if(ObjC.classes.AFHTTPSessionManager["- dataTaskWithHTTPMethod:URLString:parameters:headers:uploadProgress:downloadProgress:success:failure:"]) {

                var hook11 = ObjC.classes.AFHTTPSessionManager["- dataTaskWithHTTPMethod:URLString:parameters:headers:uploadProgress:downloadProgress:success:failure:"];
                Interceptor.attach(hook11.implementation, {
                    onLeave: function(retval) {
                        XLOG("-[AFHTTPSessionManager dataTaskWithHTTPMethod:URLString:parameters:headers:uploadProgress:downloadProgress:success:failure:]")
                        // backtrace(true)
                        fridaBacktrace(this.context);
                        // showObjcStacks(this.context);
                    } 
                });
            } else if (ObjC.classes.AFHTTPSessionManager["- dataTaskWithHTTPMethod:URLString:parameters:uploadProgress:downloadProgress:success:failure:"]){

                var hook11 = ObjC.classes.AFHTTPSessionManager["- dataTaskWithHTTPMethod:URLString:parameters:uploadProgress:downloadProgress:success:failure:"];
                Interceptor.attach(hook11.implementation, {
                    onLeave: function(retval) {
                        XLOG("-[AFHTTPSessionManager dataTaskWithHTTPMethod:URLString:parameters:uploadProgress:downloadProgress:success:failure:]")
                        // backtrace(true)
                        fridaBacktrace(this.context);
                        // showObjcStacks(this.context);
                    } 
                });
            }

    }

} else {
    send("error: Objective-C Runtime is not available!");
}



