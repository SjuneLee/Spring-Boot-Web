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
        </script>
    </head>
</html>