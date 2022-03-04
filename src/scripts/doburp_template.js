var {{ method_var }} = "{{ method_name }}";
var {{ index_var }} = {{ index }};
var {{ clazz_var }} = Java.use("{{ clazz_name }}");
var {{ clazz_var }}_{{ method_var }} = null;

{{ clazz_var }}_{{ method_var }}  = eval('{{ clazz_var }}[{{ method_var }}].overloads[{{ index_var }}]');
doburp_clazz_Thread = Java.use("java.lang.Thread");

{{ clazz_var }}_{{ method_var }}.implementation = function () {
    var method_stack = "";
    method_stack += getCaller();
    // sendback['stack'] = method_stack;
    var arg_type = "";
    var args = arguments;
    var srcargs = {};
    var arg_len = args.length;

    var ret_type = String({{ clazz_var }}_{{ method_var }}.returnType['className']);
    var argumentTypesArr = {{ clazz_var }}_{{ method_var }}.argumentTypes
    for (var index = 0; index < args.length; index++) {
        (0 == index) ? arg_type += (typeof args[index]) : arg_type += ("," + typeof args[index])
    }
    var uri = "(" + ret_type + ")" + "{{ clazz_name }}.{{ method_name }}(" + arg_type + ")";

    if (0 != arg_len) {
        // send(uri + " argument before -> " + JSON.stringify(args) + "-se00nood00tooag-");
        for (var v = 0; v < arg_len; v++) {

            if ("object" == typeof args[v] && "org.json.JSONObject" == argumentTypesArr[v]["className"]) {

                srcargs[v] = args[v].toString();

            } else if (argumentTypesArr[v]["className"] == '[B') {
                const JString = Java.use('java.lang.String');
                const str = JString.$new(args[v]);
                srcargs[v] = str.toString();
                continue
                //判断类型是否是byte Array
                // var byteArr = Java.use("[B");
                // try{
                //     Java.cast(args[v], byteArr)
                //     const JString = Java.use('java.lang.String');
                //     const str = JString.$new(args[v]);
                //     srcargs[v] = str.toString();
                // } catch (error) {
                //     console.error(error);
                //     // continue
                // }
            } else if ("object" == typeof args[v] && "number" == typeof args[v].length()) { //byte Aarray .length()会报错，没有这个属性

                srcargs[v] = JSON.stringify(args[v]);

            } else if ("object" == typeof args[v]) {
                srcargs[v] = String(args[v])
                // console.log("arg is object");
            } else {
                send('-debugscript-' + '444');
                srcargs[v] = args[v];
                // console.log("arg is other type");
            }
        }
        sendback['argument'] = srcargs;
    } else {
        sendback['argument'] = args;
    }

    try {
        if ("void" != ret_type) {
            retval = this[{{ method_var }}].apply(this, arguments);
            if ("org.json.JSONObject" == ret_type) {

            send(uri + " retval   before -> " + retval.toString() + "-se00nood00tooag-");
            sendback["retval"] = retval.toString();

            } else if (ret_type == '[B') {
                const JString = Java.use('java.lang.String');
                const str = JString.$new(retval);
                sendback["retval"] = str.toString();
            } else if ("object" == typeof retval && "number" == typeof retval.length()) {
                send(uri + " retval   before -> " + JSON.stringify(retval) + "-se00nood00tooag-");
                sendback["retval"] = JSON.stringify(retval);
                // console.log("retval is Array");
            } else if ("object" == typeof retval) {
                send(uri + " retval   before -> " + String(retval) + "-se00nood00tooag-");
                sendback["retval"] = String(retval);
                // console.log("retval is object");
            } else {
                send(uri + " retval   before -> " + JSON.stringify(retval) + "-se00nood00tooag-");
                sendback["retval"] = retval;
                // console.log("retval is base type");
            }
        }else {
            retval = undefined;
            sendback["retval"] = String(retval);
            // send(uri + " before -> " + String(retval) + "-se00nood00tooag-");
        }
    } catch (err) { retval = null; console.error(error); console.log("Exception - cannot compute retval.." + JSON.stringify(err)) }

    sendback['uri'] = uri;
    send(JSON.stringify(sendback, null, 4) + signature);

    var op = recv('input', function (value) {
        recv_data = value.payload;
        // console.log("revc: " + recv_data);
    });
    op.wait();

    var data_info = JSON.parse(recv_data);
    var newretval = data_info.retval;
    var recv_arg = data_info.argument;
    // console.log("[*]"+String(newretval) + "[*]:[*]" + JSON.stringify(retval));
    //无参数所以只可能修改返回值
    if (0 == arg_len) {
        if (ret_type == '[B') {
            const JString = Java.use('java.lang.String');
            const str = JString.$new(retval);
            //修改了返回值
            if (newretval != str.toString()) {
                retval = eval(newretval);
            }
        } else if ("object" == typeof retval && "number" == typeof retval.length()) {
            // console.log("Arg0 return is Array");
            if (newretval != JSON.stringify(retval)) {
                retval = eval(newretval);
            }
            send(uri + " retval   after  -> " + JSON.stringify(retval) + "-se00nood00tooag-");
        } else if ("object" == typeof retval) {
            // console.log("Arg0 return is object");
            //对象类型不处理,直接返回。
            send(uri + " retval   after  -> " + String(retval) + "-se00nood00tooag-");
            // return retval
        } else {
            // console.log("Arg0 return base type");
            if (newretval != retval) {
                retval = retval.constructor(newretval);
            }
            send(uri + " retval   after  -> " + JSON.stringify(retval) + "-se00nood00tooag-");
        }
        return retval
    
    } 
    if ("void" == ret_type) {
        //只可能是修改参数
        // send(uri + " before -> " + JSON.stringify(args) + "-se00nood00tooag-");
        for (var i = 0; i < arg_len; i++) {
            if ("object" == typeof args[i] && "org.json.JSONObject" == argumentTypesArr[i]["className"]) {

                var jsonObject = Java.use("org.json.JSONObject");
                var argObj = jsonObject.$new(recv_arg[i]);
                args[i] = eval(argObj);

            } else if (argumentTypesArr[i]["className"] == '[B') {
                const JString = Java.use('java.lang.String');
                const str = JString.$new(recv_arg[i]);
                args[i] = eval(str.getBytes());
            } else if ("object" == typeof args[i] && "number" == typeof args[i].length()) {
                // console.log("Arg is Array");
                args[i] = eval(recv_arg[i]);
            } else if ("object" == typeof args[i]) {
                // console.log("Arg is object");
                //对象类型，不处理直接返回
                continue;
            } else if ("string" == typeof args[i]) {
                //continue;
                a = eval(recv_arg[i]);
                a['ResultType'] = 0;

                args[i] = a;
            } else {
                // console.log("Arg is other type");
                args[i] = args[i].constructor(recv_arg[i]);
            }
        }
        send(uri + " argument after  -> " + JSON.stringify(args) + "-se00nood00tooag-");
        retval = this[{{ method_var }}].apply(this, args);
        return retval;
    } else {
        //有参数且返回值非 void
        if ("org.json.JSONObject" == ret_type && "number" == typeof retval.length()) {
            if (newretval != retval.toString()) {
                // 修改了返回值       
                var jsonObject = Java.use("org.json.JSONObject");
                var argObj = jsonObject.$new(newretval);
                retval = argObj;
                return retval;
            } else {
                // 修改了参数
                for (var i = 0; i < arg_len; i++) {
                    if ("object" == typeof args[i] && "org.json.JSONObject" == argumentTypesArr[i]["className"]) {

                        var jsonObject = Java.use("org.json.JSONObject");
                        var argObj = jsonObject.$new(recv_arg[i]);
                        args[i] = eval(argObj);

                    } else if (argumentTypesArr[i]["className"] == '[B') {
                        const JString = Java.use('java.lang.String');
                        const str = JString.$new(recv_arg[i]);
                        args[i] = eval(str);
                    } else if ("object" == typeof args[i] && "number" == typeof args[i].length) {
                        args[i] = eval(recv_arg[i]);
                    } else if ("object" == typeof args[i]) {
                        continue;
                    } else {
                        args[i] = args[i].constructor(recv_arg[i])
                    }
                }
                retval = this[{{ method_var }}].apply(this, args);
                return retval;
            }
        } else if (ret_type == '[B') {
            const JString = Java.use('java.lang.String');
            const str = JString.$new(retval);
            //修改了返回值
            if (newretval != str.toString()) {
                retval = eval(newretval);
            } else {
                //修改了参数
                for (var i = 0; i < arg_len; i++) {
                    if ("object" == typeof args[i] && "org.json.JSONObject" == argumentTypesArr[i]["className"]) {
                        var jsonObject = Java.use("org.json.JSONObject");
                        var argObj = jsonObject.$new(recv_arg[i]);
                        args[i] = eval(argObj);

                    } else if (argumentTypesArr[i]["className"] == '[B') {
                        const JString = Java.use('java.lang.String');
                        const str = JString.$new(recv_arg[i]);
                        args[i] = eval(str.getBytes());
                    } else if ("object" == typeof args[i] && "number" == typeof args[i].length()) {
                        // console.log("Arg is Array");
                        args[i] = eval(recv_arg[i]);
                    } else if ("object" == typeof args[i]) {
                        // console.log("Arg is object");
                        //对象类型，不处理直接返回
                        continue;
                    } else if ("string" == typeof args[i]) {
                        //continue;
                        a = eval(recv_arg[i]);
                        a['ResultType'] = 0;
                        args[i] = a;
                    } else {
                        // console.log("Arg is other type");
                        args[i] = args[i].constructor(recv_arg[i]);
                    }
                }
                send(uri + " argument after  -> " + JSON.stringify(args) + "-se00nood00tooag-");
                retval = this[{{ method_var }}].apply(this, args);
            }
            return retval;
        } else if ("object" == typeof retval && "number" == typeof retval.length()) {
            if (newretval != JSON.stringify(retval)) {
                retval = eval(newretval);
            } else {
                for (var i = 0; i < arg_len; i++) {
                    if ("object" == typeof args[i] && "org.json.JSONObject" == argumentTypesArr[i]["className"]) {

                        var jsonObject = Java.use("org.json.JSONObject");
                        var argObj = jsonObject.$new(recv_arg[i]);
                        args[i] = eval(argObj);

                    } else if (argumentTypesArr[i]["className"] == '[B') {
                        const JString = Java.use('java.lang.String');
                        const str = JString.$new(recv_arg[i]);
                        args[i] = eval(str.getBytes());
                    } else if ("object" == typeof args[i] && "number" == typeof args[i].length) {
                        args[i] = eval(recv_arg[i]);
                    } else if ("object" == typeof args[i]) {
                        continue;
                    } else {
                        args[i] = args[i].constructor(recv_arg[i])
                    }
                }
                retval = this[{{ method_var }}].apply(this, args);
            }
            send(uri + " argument after  -> " + JSON.stringify(args) + "-se00nood00tooag-");
            send(uri + " retval   after  -> " + JSON.stringify(retval) + "-se00nood00tooag-");
            return retval;
        }else if ("object" == typeof retval) {

            // send(uri + " before -> " + JSON.stringify(args) + "-se00nood00tooag-");
            console.log("ObjectTypeReturnValue");
            for (var i = 0; i < arg_len; i++) {
                if ("object" == typeof args[i] && "org.json.JSONObject" == argumentTypesArr[i]["className"]) {

                    var jsonObject = Java.use("org.json.JSONObject");
                    var argObj = jsonObject.$new(recv_arg[i]);
                    args[i] = eval(argObj);

                } else if (argumentTypesArr[i]["className"] == '[B') {
                    const JString = Java.use('java.lang.String');
                    const str = JString.$new(recv_arg[i]);
                    args[i] = eval(str.getBytes());
                } else if ("object" == typeof args[i] && "number" == typeof args[i].length) {
                    args[i] = eval(recv_arg[i]);
                } else if ("object" == typeof args[i]) {
                    continue;
                } else {
                    args[i] = args[i].constructor(recv_arg[i])
                }
            }
            this[{{ method_var }}].apply(this, args);
            send(uri + " argument after  -> " + JSON.stringify(args) + "-se00nood00tooag-");
            send(uri + " retval   after  -> " + String(retval) + "-se00nood00tooag-");
            return retval;
        } else {
            // console.log("BaseTypeReturnValue");
            if (newretval != retval) {
                retval = retval.constructor(newretval);
            } else {
                for (var i = 0; i < arg_len; i++) {
                    if ("object" == typeof args[i] && "org.json.JSONObject" == argumentTypesArr[i]["className"]) {

                        var jsonObject = Java.use("org.json.JSONObject");
                        var argObj = jsonObject.$new(recv_arg[i]);
                        args[i] = eval(argObj);

                    } else if (argumentTypesArr[i]["className"] == '[B') {
                        const JString = Java.use('java.lang.String');
                        const str = JString.$new(recv_arg[i]);
                        args[i] = eval(str.getBytes());
                    } else if ("object" == typeof args[i] && "number" == typeof args[i].length()) {
                        // console.log("Arg is Array");
                        args[i] = eval(recv_arg[i]);
                    } else if ("object" == typeof args[i]) {
                        // console.log("Arg is object ");
                        continue;
                    } else {
                        // console.log("Arg is basetype");
                        args[i] = args[i].constructor(recv_arg[i])
                    }
                }
                retval = this[{{ method_var }}].apply(this, args);
            }
            send(uri + " argument after  -> " + JSON.stringify(args) + "-se00nood00tooag-");
            send(uri + " retval   after  -> " + JSON.stringify(retval) + "-se00nood00tooag-");
            console.log("+++" + JSON.stringify(retval) + "+++")
            return retval;
        }
    }
};