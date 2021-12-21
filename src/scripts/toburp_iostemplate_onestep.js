var {{ methodtag }} = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"]'); 

var {{ methodtag }}_argumentTypes = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].argumentTypes'); 
var {{ methodtag }}_returnType = eval('ObjC.classes.{{ clazz_name }}["{{method_name}}"].returnType'); 

var {{ methodtag }}_sendback = {};

var {{ methodtag }}_args = {};


var {{ methodtag }}_isToBurpArgNum = {{argNum}}+1;
var {{ methodtag }}_modeNum = {{modeNum}};
var {{ methodtag }}_inputStr = '{{inputStr}}';

var requestToBurpYesOrNo_twostep = false;


Interceptor.attach({{ methodtag }}.implementation, {
   onEnter: function (args) {

        var isToBurpArg = new ObjC.Object(args[{{ methodtag }}_isToBurpArgNum]);
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
            send(this.methodinfo  + " The arg value is " + isToBurpArg.class().toString() + "class ----->" + "-se00nood00tooag-");
            if ({{ methodtag }}_inputStr != ''){
                return;
            }
        }
        
        if (({{ methodtag }}_inputStr == '' && {{ methodtag }}_modeNum == 3) || (isToBurpArg_str.containsString_({{ methodtag }}_inputStr.toString()) && {{ methodtag }}_modeNum == 3)) {
            requestToBurpYesOrNo_twostep = true;
        }
        
        // send('enter 请求 方法');
    },
    onLeave: function (retval) {
        // (type)values
        // var RetvalResults = "";
        // if (isObjC(retval)) {
            // RetvalResults = ObjC.Object(retval).toString();
            // console.log('retVal:'+ObjC.Object(retval).$className+ObjC.Object(retval).toString() );
        // }else{
            // RetvalResults = retval.toInt32();
            // console.log('retVal:'+retval.toInt32());
        // }
        // this.ios_hooks_cell['Retval'] = RetvalResults;
        // // send()
        // this.ios_hooks_cell['methodtag'] = "{{ methodtag }}";
        // send(this.methodinfo  + " after Change argument ,Retval is ----->" + RetvalResults + "-se00nood00tooag-");
        // send('leave 请求 方法');
    },
});