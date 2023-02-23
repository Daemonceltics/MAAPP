var {{ methodtag }} = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"]'); 

var {{ methodtag }}_argumentTypes = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].argumentTypes'); 
var {{ methodtag }}_returnType = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].returnType'); 

var {{ methodtag }}_sendback = {};

var {{ methodtag }}_args = {};


var {{ methodtag }}_isToBurpArgNum = (((31{{argNum}}3)-(31{{argNum}}3)%10)%100)/10
var {{ methodtag }}_modeNum = {{modeNum}};
var {{ methodtag }}_inputStr = '{{inputStr}}';
var {{ methodtag }}_isToBurpArgDataClass = false;

var requestToBurpYesOrNo_{{ methodtag }} = false;


Interceptor.attach({{ methodtag }}.implementation, {
   onEnter: function (args) {



        var argTypes = "(";
        var argCount = ("{{method_name}}".match(/:/g) || []).length;
        this.methodinfo = "(" + {{ methodtag }}_returnType + ")" + "{{ clazz_name }}['{{method_name}}']" + argTypes;
        if(0 == argCount){
            argTypes = "(";
            {{ methodtag }}_sendback['argument'] = "";
        }
        if ({{ methodtag }}_isToBurpArgNum==9){
            for (var i = 0; i < argCount; i++) {

                if (isObjC(args[i+2])) {
                    argTypes += (i == 0) ? ObjC.Object(args[i+2]).$className: "," + ObjC.Object(args[i+2]).$className;

                    if (isObjC(args[i+2]) && new ObjC.Object(args[i+2]).isKindOfClass_(ObjC.classes.NSDictionary.class())){
                        
                        var obj = new ObjC.Object(args[i+2]);

                        var err = Memory.alloc(0x20);
                        var obj_data = ObjC.classes.NSJSONSerialization.dataWithJSONObject_options_error_(obj, 0, err);
                        // console.log(obj_data.toString());
                        var obj_str = ObjC.classes.NSString.alloc().initWithData_encoding_(obj_data, 4);
                        // console.log(obj_str.toString());

                        {{ methodtag }}_args[i] = obj_str.toString();

                    } else if (isObjC(args[i+2]) && new ObjC.Object(args[i+2]).isKindOfClass_(ObjC.classes.NSConcreteData.class())){
                        {{ methodtag }}_isToBurpArgDataClass = true;
                        var obj = new ObjC.Object(args[i+2])
                        var obj_str = ObjC.classes.NSString.alloc().initWithData_encoding_(obj, 4)
                        // console.log(obj_str.toString())
                        {{ methodtag }}_args[i] = obj_str.toString();

                    } else {    
                        {{ methodtag }}_args[i] = ObjC.Object(args[i+2]).toString();
                    }

                    
                    
                }else{
                    argTypes += (i == 0) ? {{ methodtag }}_argumentTypes[i+2]: "," + {{ methodtag }}_argumentTypes[i+2];
                    {{ methodtag }}_args[i] = args[i+2].toInt32();
                }
            }
            argTypes += ")";
        
        } else {
            var isToBurpArg = new ObjC.Object(args[{{ methodtag }}_isToBurpArgNum+2]);
            var isToBurpArg_str = '';
            

            // if ({{ methodtag }}_inputStr == '') {
            //     isToBurpArg_str = isToBurpArg;

            // } else 
            if (isToBurpArg.isKindOfClass_(ObjC.classes.NSString.class())) {

                // 不做修改 直接判断
                isToBurpArg_str = isToBurpArg;
                {{ methodtag }}_args[0] = isToBurpArg_str.toString();
            } else if (isToBurpArg.isKindOfClass_((ObjC.classes.NSData.class()))) {

                // NSData 转 NSString，再进行判断
                isToBurpArg_str = ObjC.classes.NSString.alloc().initWithData_encoding_(isToBurpArg, 4);
                {{ methodtag }}_args[0] = isToBurpArg_str.toString();
            } else if (isToBurpArg.isKindOfClass_((ObjC.classes.NSDictionary.class()))) {

                // NSDictionary 转 NSStrin，再进行判断
                var err = Memory.alloc(0x20);
                var json_data = ObjC.classes.NSJSONSerialization.dataWithJSONObject_options_error_(isToBurpArg, 0, err);
                isToBurpArg_str = ObjC.classes.NSString.alloc().initWithData_encoding_(json_data, 4);
                {{ methodtag }}_args[0] = isToBurpArg_str.toString();
            } else if (isToBurpArg.isKindOfClass_((ObjC.classes.NSURL.class()))) {

                // NSURL 转 NSString，再进行判断
                isToBurpArg_str = isToBurpArg.absoluteString();
                {{ methodtag }}_args[0] = isToBurpArg_str.toString();
            } else if (isToBurpArg.isKindOfClass_(ObjC.classes.NSConcreteData.class())){
                {{ methodtag }}_isToBurpArgDataClass = true;
                var obj = isToBurpArg
                var obj_str = ObjC.classes.NSString.alloc().initWithData_encoding_(obj, 4)
                // console.log(obj_str.toString())
                {{ methodtag }}_args[0] = obj_str.toString();
            } else {

                //其他数据类型 直接跳过,不处理。
                send(this.methodinfo  + " The arg value is " + isToBurpArg.class().toString() + "class ----->" + "-se00nood00tooag-");
                {{ methodtag }}_args[0] = "Not support type"
                if ({{ methodtag }}_inputStr != ''){
                    return;
                }
            }
        }
        

        {{ methodtag }}_isToBurpArgDataClass = false;  
        
        if ({{ methodtag }}_inputStr == '' || isToBurpArg_str.containsString_({{ methodtag }}_inputStr.toString())) {
            
            requestToBurpYesOrNo_{{ methodtag }} = true;

            // {{ methodtag }}_sendback['stack'] = Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).reverse().join("--->");
            this.methodinfo = "(" + {{ methodtag }}_returnType + ")" + "{{ clazz_name }}['{{method_name}}']" + argTypes;
            {{ methodtag }}_sendback['uri'] = this.methodinfo;
            // {{ methodtag }}_sendback['argument'] = {{ methodtag }}_args;
            {{ methodtag }}_sendback['argument'] = {{ methodtag }}_args;
            send(JSON.stringify({{ methodtag }}_sendback,null, 4) + signature);
            var recv_iosdata = "";

            var op = recv('input', function(value) {
                recv_iosdata = value.payload;
                // console.log("revc: " + recv_data);
            });


            op.wait();

            

            var data_info = JSON.parse(recv_iosdata);
            var recv_arg = data_info.argument;
            
            if (isObjC(args[{{ methodtag }}_isToBurpArgNum]) && new ObjC.Object(args[{{ methodtag }}_isToBurpArgNum]).isKindOfClass_(ObjC.classes.NSString.class())) {
                //修改 NSString 类型
                // console.log(i+ ": " +ObjC.Object(args[i+2]).$className);
                args[{{ methodtag }}_isToBurpArgNum]  = ObjC.classes.NSString.stringWithString_(recv_arg[0]);
            }else if ("int" == {{ methodtag }}_argumentTypes[{{ methodtag }}_isToBurpArgNum] || "bool" == {{ methodtag }}_argumentTypes[{{ methodtag }}_isToBurpArgNum]) {
                //修改 int 与 bool
                args[{{ methodtag }}_isToBurpArgNum]  = ptr(recv_arg[0]);
            // }else if (isObjC(retval) && new ObjC.Object(retval).isKindOfClass_(ObjC.classes.NSDictionary.class())) {
            }else if (isObjC(args[{{ methodtag }}_isToBurpArgNum]) && new ObjC.Object(args[{{ methodtag }}_isToBurpArgNum]).isKindOfClass_(ObjC.classes.NSDictionary.class())) {
                
                // 修改字典
                var err = Memory.alloc(0x20);

                var json_data = ObjC.classes.NSString.stringWithString_(recv_arg[0]).dataUsingEncoding_(4);
                var dic = ObjC.classes.NSJSONSerialization.JSONObjectWithData_options_error_(json_data, 4, err);

                
                send(this.methodinfo  + " before Change argument is ----->" + new ObjC.Object(args[{{ methodtag }}_isToBurpArgNum]).toString() + "-se00nood00tooag-");
                args[{{ methodtag }}_isToBurpArgNum]  = ptr(dic);
                send(this.methodinfo  + "  after Change argument is ----->" + new ObjC.Object(args[{{ methodtag }}_isToBurpArgNum]).toString() + "-se00nood00tooag-");

            } else if ({{ methodtag }}_isToBurpArgDataClass) {

                var json_data = ObjC.classes.NSString.stringWithString_(recv_arg[0]).dataUsingEncoding_(4);
                args[{{ methodtag }}_isToBurpArgNum]  = ptr(json_data);

            }

            // console.log(recv_iosdata);
            /*
            for (var i = 0; i < argCount; i++) {
                // if (isObjC(args[i+2]) && ObjC.Object(args[i+2]).$className == "__NSCFConstantString") {
                if (isObjC(args[i+2]) && new ObjC.Object(args[i+2]).isKindOfClass_(ObjC.classes.NSString.class())) {
                    //修改 NSString 类型
                    // console.log(i+ ": " +ObjC.Object(args[i+2]).$className);
                    args[i+2]  = ObjC.classes.NSString.stringWithString_(recv_arg[i]);
                }else if ("int" == {{ methodtag }}_argumentTypes[i+2] || "bool" == {{ methodtag }}_argumentTypes[i+2]) {
                    //修改 int 与 bool
                    args[i+2]  = ptr(recv_arg[i]);
                // }else if (isObjC(retval) && new ObjC.Object(retval).isKindOfClass_(ObjC.classes.NSDictionary.class())) {
                }else if (isObjC(args[i+2]) && new ObjC.Object(args[i+2]).isKindOfClass_(ObjC.classes.NSDictionary.class())) {
                    
                    // 修改字典
                    var err = Memory.alloc(0x20);

                    var json_data = ObjC.classes.NSString.stringWithString_(recv_arg[i]).dataUsingEncoding_(4);
                    var dic = ObjC.classes.NSJSONSerialization.JSONObjectWithData_options_error_(json_data, 4, err);

                    
                    send(this.methodinfo  + " before Change argument is ----->" + new ObjC.Object(args[i+2]).toString() + "-se00nood00tooag-");
                    args[i+2]  = ptr(dic);
                    send(this.methodinfo  + "  after Change argument is ----->" + new ObjC.Object(args[i+2]).toString() + "-se00nood00tooag-");

                } else if ({{ methodtag }}_isToBurpArgDataClass && {{ methodtag }}_isToBurpArgNum-2 == i) {

                    var json_data = ObjC.classes.NSString.stringWithString_(recv_arg[i]).dataUsingEncoding_(4);
                    args[i+2]  = ptr(json_data);

                }else {
                    //其他数据类型 直接跳过,不处理。
                    continue;
                }
            }*/
        } else {

        }
        // send('enter 请求 方法');
    },
    onLeave: function (retval) {
        // (type)values

        var RetvalResults = "";
        this.methodinfo = "(" + {{ methodtag }}_returnType + ")" + "{{ clazz_name }}['{{method_name}}']";

        if (isObjC(retval)) {
            RetvalResults = ObjC.Object(retval).toString();
            // console.log('retVal:'+ObjC.Object(retval).$className+ObjC.Object(retval).toString() );
        }else{
            RetvalResults = retval.toInt32();
            // console.log('retVal:'+retval.toInt32());
        }
        // this.ios_hooks_cell['Retval'] = RetvalResults;
        // // send()
        // this.ios_hooks_cell['methodtag'] = "{{ methodtag }}";
        send(this.methodinfo  + " after Change argument ,Retval is ----->" + RetvalResults + "-se00nood00tooag-");
        // send('leave 请求 方法');
    },
});