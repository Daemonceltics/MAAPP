package burp;

public class Config {
    private static final String EXTENDER_NAME = "MAAPPExtender";
    private static final String EXTENDER_VERSION = "1.0";
    private static boolean IS_BODYAUTO = false;
    private static String WebServerURL= "http://127.0.0.1:8088/";
    private static String Reqfunc1 = "tagXXX";
    private static String Reqfunc2 = "tagXXX";
    private static String Reqfunc3 = "tagXXX";
    private static String Reqfunc4 = "tagXXX";
    private static String Reqfunc5 = "tagXXX";

    private static String Respfunc1 = "tagXXX";
    private static String Respfunc2 = "tagXXX";

    private static String funcReqEdit1 = "Rename-function";
    private static String funcReqEdit2 = "Rename-function";
    private static String funcReqEdit3 = "Rename-function";
    private static String funcReqEdit4 = "Rename-function";
    private static String funcReqEdit5 = "Rename-function";

    private static String funcRespEdit1 = "Rename-function";
    private static String funcRespEdit2 = "Rename-function";

    public static void setFuncReqEdit1(String funcReqEdit1) {
        Config.funcReqEdit1 = funcReqEdit1;
    }

    public static void setFuncReqEdit2(String funcReqEdit2) {
        Config.funcReqEdit2 = funcReqEdit2;
    }

    public static void setFuncReqEdit3(String funcReqEdit3) {
        Config.funcReqEdit3 = funcReqEdit3;
    }

    public static void setFuncReqEdit4(String funcReqEdit4) {
        Config.funcReqEdit4 = funcReqEdit4;
    }

    public static void setFuncReqEdit5(String funcReqEdit5) {
        Config.funcReqEdit5 = funcReqEdit5;
    }

    public static void setFuncRespEdit1(String funcRespEdit1) {
        Config.funcRespEdit1 = funcRespEdit1;
    }

    public static void setFuncRespEdit2(String funcRespEdit2) {
        Config.funcRespEdit2 = funcRespEdit2;
    }

    public static String getFuncReqEdit1() {
        return funcReqEdit1;
    }

    public static String getFuncReqEdit2() {
        return funcReqEdit2;
    }

    public static String getFuncReqEdit3() {
        return funcReqEdit3;
    }

    public static String getFuncReqEdit4() {
        return funcReqEdit4;
    }

    public static String getFuncReqEdit5() {
        return funcReqEdit5;
    }

    public static String getFuncRespEdit1() {
        return funcRespEdit1;
    }

    public static String getFuncRespEdit2() {
        return funcRespEdit2;
    }

    public static boolean isIsBodyAuto() {
        return IS_BODYAUTO;
    }

    public static void setIsBodyAuto(boolean IsBodyAuto) {
        IS_BODYAUTO = IsBodyAuto;
    }

    public static String getWebServerURL() {
        return WebServerURL;
    }

    public static void setWebServerURL(String url) {
        WebServerURL = url;
    }

    public static String getReqfunc1() {
        return Reqfunc1;
    }

    public static void setReqfunc1(String methodtag) {
        Reqfunc1 = methodtag;
    }

    public static String getReqfunc2() {
        return Reqfunc2;
    }

    public static void setReqfunc2(String methodtag) {
        Reqfunc2 = methodtag;
    }

    public static String getReqfunc3() {
        return Reqfunc3;
    }

    public static void setReqfunc3(String methodtag) { Reqfunc3 = methodtag; }

    public static String getReqfunc4() {
        return Reqfunc4;
    }

    public static void setReqfunc4(String methodtag) { Reqfunc4 = methodtag; }

    public static String getReqfunc5() {
        return Reqfunc5;
    }

    public static void setReqfunc5(String methodtag) { Reqfunc5 = methodtag; }

    public static String getRespfunc1() {
        return Respfunc1;
    }

    public static void setRespfunc1(String methodtag) {
        Respfunc1 = methodtag;
    }

    public static String getRespfunc2() {
        return Respfunc2;
    }

    public static void setRespfunc2(String methodtag) {
        Respfunc2 = methodtag;
    }



}
