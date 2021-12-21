// toburp_iosChangeRetvalTemplate
var {{ methodtag }} = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"]'); 

var {{ methodtag }}_argumentTypes = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].argumentTypes'); 
var {{ methodtag }}_returnType = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].returnType'); 

var {{ methodtag }}_inputStr = '{{inputStr}}';
var {{ methodtag }}_isReturnDataClass = false;

Interceptor.attach({{ methodtag }}.implementation, {
   onEnter: function (args) {

        this.{{ methodtag }}_sendback = {};
        // console.log({{ methodtag }}_argumentTypes);
        this.argTypes = "(";
        var argCount = ("{{method_name}}".match(/:/g) || []).length;

        if(0 == argCount){
            this.argTypes = "(";
        }

        for (var i = 0; i < argCount; i++) {
            
            if (isObjC(args[i+2])) {
                this.argTypes += (i == 0) ? ObjC.Object(args[i+2]).$className: "," + ObjC.Object(args[i+2]).$className;
            }else{
                this.argTypes += (i == 0) ? {{ methodtag }}_argumentTypes[i+2]: "," + {{ methodtag }}_argumentTypes[i+2];
            }
        }
        this.argTypes += ")";
        // this.{{ methodtag }}_sendback['stack'] = Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).reverse().join("--->");
        // send('enter 返回 方法');
    },
    onLeave: function (retval) {
        var retvaltype = "";

        if (isObjC(retval)) {

            this.methodinfo = "(" + {{ methodtag }}_returnType + ")" + "{{ clazz_name }}['{{method_name}}']";
            if (new ObjC.Object(retval).isKindOfClass_(ObjC.classes.NSDictionary.class())){
                var obj = new ObjC.Object(retval)

                var err = Memory.alloc(0x20);
                var obj_data = ObjC.classes.NSJSONSerialization.dataWithJSONObject_options_error_(obj, 0, err);
                // console.log(obj_data.toString());
                var obj_str = ObjC.classes.NSString.alloc().initWithData_encoding_(obj_data, 4);
                // console.log(obj_str.toString());
                this.{{ methodtag }}_sendback['retval'] = obj_str.toString();

            } else if (new ObjC.Object(retval).isKindOfClass_(ObjC.classes.NSData.class())){
                {{ methodtag }}_isReturnDataClass = true;
                var obj = new ObjC.Object(retval)
                var obj_str = ObjC.classes.NSString.alloc().initWithData_encoding_(obj, 4)
                this.{{ methodtag }}_sendback['retval'] = obj_str.toString();

            } else {
                this.{{ methodtag }}_sendback['retval'] = ObjC.Object(retval).toString();
            }

            
            retvaltype = ObjC.Object(retval).$className;
            // console.log('retVal:'+ObjC.Object(retval).$className+ObjC.Object(retval).toString() );
        }else{
            retvaltype = {{ methodtag }}_returnType;
            this.{{ methodtag }}_sendback['retval']  = retval.toInt32();
            // console.log('retVal:'+retval.toInt32());
        }
        
        var isToBurpArg = new ObjC.Object(retval);
        var isToBurpArg_str = '';

        if (isToBurpArg.isKindOfClass_(ObjC.classes.NSString.class())) {

            // 不做修改 直接判断
            isToBurpArg_str = isToBurpArg;

        } else if (isToBurpArg.isKindOfClass_((ObjC.classes.NSData.class()))) {

            // NSData 转 NSString，再进行判断
            isToBurpArg_str = ObjC.classes.NSString.alloc().initWithData_encoding_(isToBurpArg, 4);

        } else if (isToBurpArg.isKindOfClass_((ObjC.classes.NSDictionary.class()))) {

            // NSDictionary 转 NSStrin，再进行判断
            var err = Memory.alloc(0x20);
            var json_data = ObjC.classes.NSJSONSerialization.dataWithJSONObject_options_error_(isToBurpArg, 0, err);
            isToBurpArg_str = ObjC.classes.NSString.alloc().initWithData_encoding_(json_data, 4);
        } else if (isToBurpArg.isKindOfClass_((ObjC.classes.NSURL.class()))) {

            // NSURL 转 NSString，再进行判断
            isToBurpArg_str = isToBurpArg.absoluteString();

        } else {

            //其他数据类型 直接跳过,不处理。
            send(this.methodinfo  + " The retval value is " + isToBurpArg.class().toString() + "class ----->" + "-se00nood00tooag-");
            if ({{ methodtag }}_inputStr != ''){
                return;
            }
        }

        if ({{ methodtag }}_inputStr == '' || isToBurpArg_str.containsString_({{ methodtag }}_inputStr.toString())) {
        
            this.{{ methodtag }}_sendback['uri'] = "(" + retvaltype + ")" + "{{ clazz_name }}['{{method_name}}']" + this.argTypes;

            this.methodinfo = this.{{ methodtag }}_sendback['uri'];

            var recv_iosdata = "";
            send(JSON.stringify(this.{{ methodtag }}_sendback,null, 4) + signature);
            var op = recv('input', function(value) {
                recv_iosdata = value.payload;
            });
            op.wait();
            var data_info = JSON.parse(recv_iosdata);
            var recv_retval = data_info.retval;

            // if (isObjC(retval) && ObjC.Object(retval).$className == "__NSCFConstantString") {
            if (isObjC(retval) && new ObjC.Object(retval).isKindOfClass_(ObjC.classes.NSString.class())) {

                //修改NSString 类型
                // console.log(i+ ": " +ObjC.Object(args[i+2]).$className);
                var tempstr  = ObjC.classes.NSString.stringWithString_(recv_retval);
                retval.replace(tempstr);
                send(this.methodinfo  + " after Change retval ,Retval is  ----->" + ObjC.Object(retval).toString() + "-se00nood00tooag-");
            }else if ("int" == retvaltype || "bool" == retvaltype) {
                //修改int 与bool
                retval.replace(ptr(recv_retval));
                send(this.methodinfo  + " after Change retval ,Retval is  ----->" + retval.toInt32() + "-se00nood00tooag-");
            }else if (isObjC(retval) && new ObjC.Object(retval).isKindOfClass_(ObjC.classes.NSDictionary.class())) {

                    // 修改字典
                    var err = Memory.alloc(0x20);

                    var json_data = ObjC.classes.NSString.stringWithString_(recv_retval).dataUsingEncoding_(4);
                    var dic = ObjC.classes.NSJSONSerialization.JSONObjectWithData_options_error_(json_data, 4, err);

                    retval.replace(ptr(dic));
                    
                    send(this.methodinfo  + " after Change retval ,Retval is  ----->" + dic + "-se00nood00tooag-");
                    
            }  else if ({{ methodtag }}_isReturnDataClass) {
                {{ methodtag }}_isReturnDataClass = false;
                var json_data = ObjC.classes.NSString.stringWithString_(recv_retval).dataUsingEncoding_(4);
                retval.replace(ptr(json_data));
            } else {
                //其他数据类型 直接跳过,不处理。
                send(this.methodinfo  + " The return value is not modified ----->" + recv_retval + "-se00nood00tooag-");
            }
        }
        // send('leave 返回 方法');
    }
});