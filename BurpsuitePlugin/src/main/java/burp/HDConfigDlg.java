package burp;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

//https://github.com/c0ny1/sqlmap4burp-plus-plus/blob/master/src/main/java/burp/ConfigDlg.java

public class HDConfigDlg extends JDialog {
    private final JPanel mainPanel = new JPanel();

    private final JLabel lbURL =  new JLabel("HTTPDecrypt WebServer URL:");
    private final JTextField tfURL = new JTextField(30);

    private final JLabel labelResFunc1 = new JLabel("Cus_Req_func 1");
    private final JTextField textEditFunc1 = new JTextField(5);
    private final JTextField textRes1 = new JTextField(30);

    private final JLabel labelResFunc2 = new JLabel("Cus_Req_func 2");
    private final JTextField textEditFunc2 = new JTextField(30);
    private final JTextField textRes2 = new JTextField(30);

    private final JLabel labelResFunc3 = new JLabel("Cus_Req_func 3");
    private final JTextField textEditFunc3 = new JTextField(30);
    private final JTextField  textRes3 = new JTextField(30);

    private final JLabel labelResFunc4 = new JLabel("Cus_Req_func 4");
    private final JTextField textEditFunc4 = new JTextField(30);
    private final JTextField  textRes4 = new JTextField(30);

    private final JLabel labelResFunc5 = new JLabel("Cus_Req_func 5");
    private final JTextField textEditFunc5 = new JTextField(30);
    private final JTextField  textRes5 = new JTextField(30);

    private final JCheckBox jBodyCheckBox = new JCheckBox("Body Auto");

    private final JLabel lbPrompt = new JLabel("Prompt:");

    private final JLabel labelRespFunc1 = new JLabel("Cus_Resp_func 1");
    private final JTextField textEditRespFunc1 = new JTextField(30);
    private final JTextField textResp1 = new JTextField(30);

    private final JLabel labelRespFunc2 = new JLabel("Cus_Resp_func 2");
    private final JTextField textEditRespFunc2 = new JTextField(30);
    private final JTextField textResp2 = new JTextField(30);

    private final JButton btnOK = new JButton("OK");
    private final JButton btnCancel = new JButton("Cancel");
    private final JButton btnTest = new JButton("Test");


    public HDConfigDlg(){
        initGUI();
        initEvent();
        this.setTitle("HTTPDecrypt Config");
    }


    /**
     * 初始化UI
     */
    private void initGUI(){
        String webServerURL = Config.getWebServerURL();
        String reqfunc1 = Config.getReqfunc1();
        String reqfunc2 = Config.getReqfunc2();
        String reqfunc3 = Config.getReqfunc3();
        String reqfunc4 = Config.getReqfunc4();
        String reqfunc5 = Config.getReqfunc5();
        String respfunc1 = Config.getRespfunc1();
        String respfunc2 = Config.getRespfunc2();
        boolean isBodyAuto = Config.isIsBodyAuto();

        mainPanel.setLayout(new GridBagLayout());

        mainPanel.add(lbURL,new GBC(0,0,2,1).setFill(GBC.BOTH).setInsets(10,0,2,0));
        if (webServerURL.equals("")){
            tfURL.setText("http://127.0.0.1:8088/");
        }else{
            tfURL.setText(webServerURL);
        }
        mainPanel.add(tfURL, new GBC(2,0,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(labelResFunc1,new GBC(0,1,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        textEditFunc1.setText(Config.getFuncReqEdit1());
        mainPanel.add(textEditFunc1,new GBC(2,1,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));
        if(!textRes1.equals(""))
            textRes1.setText(reqfunc1);
        mainPanel.add(textRes1,new GBC(3,1,2,1).setFill(GBC.BOTH).setInsets(10,0,2,10));


        jBodyCheckBox.setSelected(isBodyAuto);
        mainPanel.add(jBodyCheckBox,new GBC(5,0,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));
        mainPanel.add(btnTest,new GBC(5,1,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));


        mainPanel.add(labelResFunc2,new GBC(0,2,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        textEditFunc2.setText(Config.getFuncReqEdit2());
        mainPanel.add(textEditFunc2,new GBC(2,2,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));
        if(!textRes2.equals(""))
            textRes2.setText(reqfunc2);
        mainPanel.add(textRes2,new GBC(3,2,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(labelResFunc3,new GBC(0,3,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        textEditFunc3.setText(Config.getFuncReqEdit3());
        mainPanel.add(textEditFunc3,new GBC(2,3,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));
        if(!textRes3.equals(""))
            textRes3.setText(reqfunc3);
        mainPanel.add(textRes3, new GBC(3,3,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(labelResFunc4,new GBC(0,4,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        textEditFunc4.setText(Config.getFuncReqEdit4());
        mainPanel.add(textEditFunc4,new GBC(2,4,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));
        if(!textRes4.equals(""))
            textRes4.setText(reqfunc4);
        mainPanel.add(textRes4, new GBC(3,4,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(labelResFunc5,new GBC(0,5,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        textEditFunc5.setText(Config.getFuncReqEdit5());
        mainPanel.add(textEditFunc5,new GBC(2,5,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));
        if(!textRes5.equals(""))
            textRes5.setText(reqfunc5);
        mainPanel.add(textRes5, new GBC(3,5,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        //响应包
        mainPanel.add(labelRespFunc1,new GBC(0,6,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        textEditRespFunc1.setText(Config.getFuncRespEdit1());
        mainPanel.add(textEditRespFunc1,new GBC(2,6,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));
        if(!textResp1.equals(""))
            textResp1.setText(respfunc1);
        mainPanel.add(textResp1, new GBC(3,6,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(labelRespFunc2,new GBC(0,7,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        textEditRespFunc2.setText(Config.getFuncRespEdit2());
        mainPanel.add(textEditRespFunc2,new GBC(2,7,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));
        if(!textResp2.equals(""))
            textResp2.setText(respfunc2);
        mainPanel.add(textResp2, new GBC(3,7,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(btnOK,new GBC(0,8,1,1).setFill(GBC.BOTH).setInsets(10,10,10,0));
        mainPanel.add(btnCancel,new GBC(1,8,1,1).setFill(GBC.BOTH).setInsets(10,0,10,10));
//        mainPanel.add(btnTest,new GBC(1,5,1,1).setFill(GBC.BOTH).setInsets(10,0,10,10));


        lbPrompt.setText("Notice: The command will be copied to the clipboard. Paste it into Terminal!");
        mainPanel.add(lbPrompt,new GBC(2,8,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        lbPrompt.setForeground(new Color(0,0,255));

        this.setModal(true);
        this.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
        this.add(mainPanel);
        //使配置窗口自动适应控件大小，防止部分控件无法显示
        this.pack();
        //居中显示配置窗口
        Dimension screensize=Toolkit.getDefaultToolkit().getScreenSize();
        this.setBounds(screensize.width/2-this.getWidth()/2,screensize.height/2-this.getHeight()/2,this.getWidth(),this.getHeight());
        BurpExtender.callbacks.customizeUiComponent(this);
    }


    /**
     * 初始化事件
     */
    private void initEvent(){

        btnOK.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Config.setWebServerURL(tfURL.getText().trim());
                Config.setReqfunc1(textRes1.getText().trim());
                Config.setReqfunc2(textRes2.getText().trim());
                Config.setReqfunc3(textRes3.getText().trim());
                Config.setReqfunc4(textRes4.getText().trim());
                Config.setReqfunc5(textRes5.getText().trim());
                Config.setRespfunc1(textResp1.getText().trim());
                Config.setRespfunc2(textResp2.getText().trim());
                Config.setIsBodyAuto(jBodyCheckBox.isSelected());

                Config.setFuncReqEdit1(textEditFunc1.getText().trim());
                Config.setFuncReqEdit2(textEditFunc2.getText().trim());
                Config.setFuncReqEdit3(textEditFunc3.getText().trim());
                Config.setFuncReqEdit4(textEditFunc4.getText().trim());
                Config.setFuncReqEdit5(textEditFunc5.getText().trim());
                Config.setFuncRespEdit1(textEditRespFunc1.getText().trim());
                Config.setFuncRespEdit2(textEditRespFunc2.getText().trim());
                HDConfigDlg.this.dispose();
            }
        });

        btnCancel.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

                HDConfigDlg.this.dispose();
            }
        });
        btnTest.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                BurpExtender.stdout.println(Util.Test());
                HDConfigDlg.this.dispose();
            }
        });


    }

}
