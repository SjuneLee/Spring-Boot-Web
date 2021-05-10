<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String cRoot = "/ui";
    String w2xPath = request.getParameter("w2xPath");
    if (w2xPath == null) {
    	w2xPath = "/cm/ui/index.xml";
    }
%>
<jsp:useBean id="configData" type="java.lang.String" scope="request"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
        <%
            String gTabName = "";
            if(configData.indexOf("\"TH_SYS_TCD\": \"L\"") > 0)
            	gTabName = "(Local)";
            else if(configData.indexOf("\"TH_SYS_TCD\": \"D\"") > 0)
            	gTabName = "(개발)";
            else if(configData.indexOf("\"TH_SYS_TCD\": \"T\"") > 0)
            	gTabName = "(QA)";
            
            if(configData.indexOf("\"SYS_CD\": \"ACC\"") > 0) {
            	//계정계
        %>
                <title>ATHENA<%=gTabName%></title>
        <%
            }else{
            	//정보계
        %>
                <title>KIWI<%=gTabName%></title>
        <%
            }
        %>
        <script type="text/javascript">
            var _cRoot = '<%=cRoot%>';
            var config = <%=configData%>;
            console.log(config);
            
            function button_onclick() {
                comLib.gfn_executeSubmissionEdi(SBM_SERCH_FAQ1111);
            }
            
//            gfn_executeSubmissionEdi = function(__opt) {
//            var opt = JSON.parse(JSON.stringify(__opt));
//            alert(opt);
//            console.log(opt);
//            }
            
            SBM_SERCH_FAQ1111 = {
                'before' : function() {
                    alert("비포");
                },
                'process_msg' : "조회중입니다....",
                'paging' : "",
                'paging_button' : "",
                'action' :{'server': 'edw_is_server', 'url': '/bs/bsgo9900/pbsq0002'},
                'in_data':"",
                'out_data':"",
                'callback': function(e) {
                    //scwin.fn_request_callback('FAQ3281_cb', e);
                }
            }
        </script>
        <script type="text/javascript" src="./js/comLib.js"></script>
    </head>
    <body>
    <button name="button" onclick="button_onclick();">눌러보세요</button>
    </body>
</html>