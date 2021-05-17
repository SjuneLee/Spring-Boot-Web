var comLib = {
    //통신 속성 정보
    CONTEXT_PATH : "/ui", // Context Path 경로
    SERVICE_URL : "", // Service Url
    DEFAULT_OPTIONS_MODE : "asynchronous", // 기본 통신 모드 ( "asynchronous" / "synchronous")
    DEFAULT_OPTIONS_MEDIATYPE : "application/json", // 기본 미디어 타입
    AYNCTRANMAXCNT : 10,
    ediReq : {
        "common_header": {
            th_trr_tcd:"S",//요청전문
            th_if_tcd:config.TH_IF_TCD,
            th_sys_tcd:config.TH_SYS_TCD,
            guid:"",
            th_dum_tr_tcd:"0",
            th_btn_auth_tcd:"R",
            mda_tcd:"011",//통햡단말(직원) 
            th_tr_id:"",
            th_cont_tr_tcd:"",
            th_qry_c:"",
            onln_user_id:"",
            cont_trkey:[],
            ui_option:{
                "record_count_per_page":"",
                "page_no":"",
                "action":{},
                "in_data":"",
                "out_data":""
            }
        },
        "data": {
        }
    },
    ediRes : {
        "common_header": {
            th_tr_id:"",
            th_cont_tr_tcd:"",
            th_qry_c:"",
            onln_user_id:"",
            cont_trkey:[],
            ui_option:{
            }
        },
        "message": {
            "th_msg_oput_tcd": "", // 메시지 출력유형
            "th_er_msg_tcd": "",   // 메시지 코드분류
            "msg_cod": "",         // 메시지 코드
            "msg_cn":"",           // 메시지 텍스트
            "th_cusr_fild_nm":"",  // 오류 발생시 화면에 커서를 위치할 필드명(서버 프로그램에서 설정)
            "th_warn_msg_yn":""    // 전문헤더경고 메시지 여부 "Y" 경고 , "N" 미경고
        },
        "data":{
        }
    },
    
    // 통신 상태 코드
    MESSAGE_CODE : {
        STATUS_ERROR : "E",
        STATUS_SUCCESS : "S",
        STATUS_WARNING : "W"
    },
    
    // POPUP PARAM KEY
    PPKEY : "popupParamObj",
    PCALLBACK : "callbackFn",
    
    // 공통 코드 저장을 위한 DataList 속성 정보
    dataPrefix : "dlCommonCodeL",
    commonCodeInfo : {
        label : "CMN_COD_NM",
        value : "CMN_COD",
        fieldArr : [ "STND_TRMY_NM", "CMN_COD", "CMN_COD_NM" ]
    },
    
    // Message Box ID 생성을 위한 순번
    MESSAGE_BOX_SEQ : 1,
    
    // 유효성 검사 상태 정보 저장
    valStatus : {
        isValid : true,
        objectType : "", // 유효성 검사를 수행하는 컴포넌트 타입 : gridView, group
        objectName : "",
        columnId : "",
        rowIndex : 0,
        message : ""
    },
    
    // 업무 화면 오픈 Frame Mode 설정("iframe", "wframe")
    FRAME_MODE : "wframe",
    TEST1 : "",
    pagingOpt : ""
}

    comLib.gfn_executeSubmissionEdi = function(__opt) {
        ['전문Submision 통신 함수']
        var opt = JSON.parse(JSON.stringify(__opt));
        if(opt != null && opt.msg_yn != 'N') {
            //comLib.gfn_displayMessage('');
        }
        opt.before  = __opt.before;
        opt.callback = __opt.callback;
        try {
            var preFunc = opt.before;
            if (preFunc != null) {
                var result = preFunc();
                if(result == false) {
                    return;
                }
            }
            var ediJson = comLib._getEdiReq();
            console.log("ediJson: ")
            console.log(ediJson);
            ediJson.common_header.ui_optioni = JSON.parse(JSON.stringify(__opt));
            
            var guid = "CUI"+comLib.gfn_getSystemDate("yyyyMMddHHmmssSSS")+comLib.shuffleRandom(6);
            ediJson.common_header.guid = guid;
            //ediJson.common_header.onln_user_id = comLib.gfn_getUserInfo("EP_NO");
            //ediJson.common_header.onln_user_id = comLib.gfn_getUserInfo("BLNG_DEPT_COD");
            
            //if(__opt.popId != null && __opt.popId != '') {
            //    ediJson.common_header.ui_option.popId = __opt.popId;
            //} else {
            //    ediJson.common_header.ui_option.popId = this.popId;
            //}
            
            //if(this.$p = null) {
            //    ediJson.common_header.ui_option.wframeId = $p.id;
            //} else {
            //    ediJson.common_header.ui_option.wframeId = this.$p.id;
            //}
            ediJson.common_header.ui_option.before = __opt.before;
            ediJson.common_header.ui_option.callback = __opt.callback;
            ediJson.common_header.ui_option.error = __opt.error;
            
            //if(this.$p != null) {
            //    var srcPopup = $p.getParameter("w2xPath");
            //    if(srcPopup != null && srcPopup != '') {
            //        //퀵뷰모드로 실행시 사용되는 코드!!!
            //        var leng = srcPopup.length;
            //        srcPopup = srcPopup.substring(leng-12,leng-4);
            //        var src_str = comLib.gfn_toEightChar(srcPopup);
            //        console.log('th_scr_no1',srcPopup,src_str);
            //        ediJson.common_header.ui_option['src'] = src_str;
            //        ediJson.common_header.th_scr_no = src_str;
            //    } else {
            //        //정식모드로 실행시 사용되는 코드!!!
            //        var srcMain = this.$p.getParameter("value");
            //    }
            //}
            
            if (opt["tx_id"] != null) {
                //계정계
                ediJson.common_header.th_tr_id = opt["tx_id"];
            }else {
                //정보계
                if(opt.action.url != null) {
                    var uLeng = opt.action.url.length;
                    ediJson.common_header.th_tr_id = opt.action.url.substring(uLeng-8,uLeng);
                }else{
                    var uLeng = opt.action.length;
                    ediJson.common_header.th_tr_id = opt.action.substring(uLeng-8,uLeng);
                }
            }
            
            /* 안쓰는 로직으로 추정 */
            //if (ediJson.common_header.ui_option["tx_id"] != null && config.ex_th_scr_no != null && config.ex_th_sc_no[ediJson.common_header.ui_option["tx_id"]] != null) {
            //    ediJson.common_header.th_scr_no = config.ex_th_scr_no[ediJson.common_header.ui_option["tx_id"]];
            //} else if (config.ex_th_scr_no != null && config.ex_th_scr_no[opt.action.url] != null) {
            //    ediJson.common_header.th_scr_no = config.ex_th_scr_no[opt.action.url];
            //}
            
            // 필수입력값 체크
            //if (typeof opt.required != "undefined" && opt.required != "") {
            //    
            //}
            
            //헤더셋팅
            if(opt.header != null) {
                var arr = Object.keys(opt.header);
                for(var i=0;i<arr.length;i++) {
                    ediJson.common_header[arr[i]] = opt.header[arr[i]];
                }
            }
            //auto Paging처리
            if(typeof opt.paging != "undefined") {
                if(opt.paging != null && opt.paging.page_type != null && opt.paging.page_type.toUpperCase() == 'N') {
                    ediJson.common_header.ui_option["record_count_per_page"] = opt.paging.page_size;
                    ediJson.common_header.th_cont_tr_tcd = '1';//처음호출은1, 이후는 3
                    ediJson.common_header.th_qry_c = ediJson.common_header.ui_option["record_count_per_page"];
                } else if (opt.paging != null && opt.paging.page_type != null && opt.paging.page_type.toUpperCase() =='S') {
                    if(typeof opt.paging.grid_id != "undefined"){
                        comLib.pagingOpt = opt;
                        //var grdObj = this.$p.getComponentById(opt.paing.grid_id);
                        grdObj.setAttribute("cont_trkey",[]);
                        var strDataList = grdObj.getDataList();
                        //var grdDataList = $p.getComponentById(strDataList);
                        if(grdDataList == null){
                            alert('그리드에 바인딩된 dataList가 존재하지 않습니다1. id: '+strDataList);
                        }else{
                            grdDataList.reset();
                        }
                        if(typeof grdObj != "undefined"){
                            var checkOverlap = false;
                            
                            var tmpCallback = function(e){
                                setTimeout(function(){
                                    checkOverlap = false;
                                }, 500);
                                
                                if (checkOverlap == true) {
                                    return;
                                }
                                
                                checkOverlap = true;
                                var totalCount = grObj.getAttribute("totalCount");
                                var strDataList = grdObj.getDataList();
                                //var grdDataList = $p.getComponentById(strDataList);
                                
                                var numCurRowCnt = grdDataList.getRowCount();
                                var numCurTotCnt = totalCount;
                                var th_cont_tr_tcd = grdObj.getAttribute("th_cont_tr_tcd");
                                if(th_cont_tr_tcd != '4' && th_cont_tr_tcd != '5') {
                                    // +1로 다음 페이지 지정
                                    var strCurPage = Math.ceil(numCurRowCnt/comLib.pagingOpt.paging.page_size)+1;
                                    ediJson.common_header.ui_opion["page_no"] = strCurPage;
                                    // cont_trkey 연속거래키
                                    ediJson.common_header.ui_option["record_count_per_page"] = comLib.pagingOpt.paging.page_size;
                                    ediJson.common_header.th_qry_c = ediJson.common_header.ui_option["record_count_per_page"];
                                    ediJson.common_header.th_cont_tr_tcd = '3';//처음호출은 0, 이후는 3
                                    ediJson.common_header.cont_trkey = grdObj.getAttribute("cont_trkey");
                                    ediJson.common_header.guid = "CUI"+comLib.gfn_getSysemDate("yyyyMMddHHmmssSSS")+comLib.shuffleRandom(6);
                                    ediJson.common_header.ui_option.process_msg = opt.process_msg;
                                    ediJson.common_header.ui_option["out_data"] = opt.out_data+"|append";
                                    // 기존 submission 호출
                                    //comLib._executeSubmission(ediJson);
                                }
                            }
                            
                            ediJson.common_header.ui_option["page_no"] = 1;
                            ediJson.common_header.ui_option["record_count_per_page"] = comLib.pagingOpt.paging.page_size;
                            ediJson.common_header.th_cont_tr_tcd = '1';//처음호출은1, 이후는 3
                            ediJson.common_header.th_qry_c = ediJson.common_header.ui_option["record_count_per_page"] = comLib.pagingOpt.paging.page_size;
                            ediJson.common_header.cont_trkey = grdObj.getAttribute("cont_trKey");
                            
                            // 그리드뷰 이벤트 생성
                            grdObj.unbind("onscrollend");
                            grdObj.bind("onscrollend" , tmpCallBack );
                            
                            if(typeof opt.paging_button != "undefined") {
                                if(typeof opt.paging_button.btn_search_continue != "undefined") {
                                    //var btn_continue = this.$p.getComponentById(opt.paging_button.btn_search_continue);
                                    var btn_next;
                                    var btn_break;
                                    var ediJson2 = ediJson;
                                    
                                    if(typeof opt.paging_button.bn_search_next != "undefined") {
                                        //btn_next = this.$p.getComponentById(opt.paging_button.btn_search_next);
                                    }
                                    if(typeof opt.paging_button.bn_search_break != "undefined") {
                                        //btn_break = this.$p.getComponentById(opt.paging_button.btn_search_break);
                                    }
                                    
                                    if(typeof btn_continue != "undefined") {
                                        var tmpCallBack2 = function(e){
                                            
                                            btn_continue.setDisabled(true);
                                            
                                            if(typeof btn_next != "undefined") {
                                                btn_next.setDisabled(true);
                                            }
                                            if(typeof btn_break != "undefined") {
                                                btn_break.setDisabled(false);
                                            }
                                            
                                        var totalCount = grObj.getAttribute("totalCount");
                                        var strDataList = grdObj.getDataList();
                                        //var grdDataList = $p.getComponentById(strDataList);
                                        
                                        var numCurRowCnt = grdDataList.getRowCount();
                                        var numCurTotCnt = totalCount;
                                        var th_cont_tr_tcd = grdObj.getAttribute("th_cont_tr_tcd");
                                        if(th_cont_tr_tcd != '4' && th_cont_tr_tcd != '5') {
                                            // +1로 다음 페이지 지정
                                            var strCurPage = Math.ceil(numCurRowCnt/comLib.pagingOpt.paging.page_size)+1;
                                            ediJson2.common_header.ui_opion["page_no"] = strCurPage;
                                            // cont_trkey 연속거래키
                                            ediJson2.common_header.ui_option["record_count_per_page"] = comLib.pagingOpt.paging.page_size;
                                            ediJson2.common_header.th_qry_c = ediJson.common_header.ui_option["record_count_per_page"];
                                            ediJson2.common_header.th_cont_tr_tcd = '3';//처음호출은 0, 이후는 3
                                            ediJson2.common_header.cont_trkey = grdObj.getAttribute("cont_trkey");
                                            ediJson2.common_header.guid = "CUI"+comLib.gfn_getSysemDate("yyyyMMddHHmmssSSS")+comLib.shuffleRandom(6);
                                            ediJson2.common_header.ui_option.process_msg = opt.process_msg;
                                            ediJson2.common_header.ui_option["out_data"] = opt.out_data+"|append";
                                            // 기존 submission 호출
                                            //comLib._executeSubmission(ediJson2);
                                        }
                                    }
                                    
                                    btn_continue.unbind("onclick");
                                    btn_continue.bind("onclick", tmpCallBack2);
                                }
                            }
                        }
                    }
                }
            }else if(opt.paging != null && opt.paging.page_type != null && opt.paging.page_type.toUpperCase() =='P') {
                /* pageList paging */
                //var pageListObj = this.$p.getComponentById(opt.paging.pagelist_id);
                //if(this.$p.getComponentById(opt.paging.pagelist_id) == null){
                //    alert('pageList id : ' +opt.paging.pagelist_id + '가 없습니다. 확인바랍니다.');
                //}
                var scwinObj = this.$p.getcomponetById(opt.paging.pagelist_id).scope_obj.getObj('scwin');
                
                var nowIndex = pageListObj.getSelectedIndex();
                if(nowIndex <1){
                    nowIndex = 1;
                }
                ediJson.common_header.ui_option["page_no"] = nowIndex;
                ediJson.common_header.ui_option["record_count_per_page"] = pageListObj.getPageSize();
                ediJson.common_header.th_qry_c = ediJson.common_header.ui_option["record_count_per_page"];
                
                var tmpCallBack = function(idx) {
                    var procFuncStr = opt.paging["proc_func"];
                    var procFuncArr = procFuncStr.split('.');
                    scwinObj[procFuncArr[1]](idx, 'N');
                }
                
                pageListObj.setPageSize(ediJson.common_header.ui_option["record_count_per_page"]);
                ediJson.common_header.th_qry_c = ediJson.common_header.ui_option["record_count_per_page"];
                pageListObj.unbind("onclick");
                pageListObj.bind("onclick",tmpCallBack);
            }
            //ref 설정
            if (opt.in_data) {
                var tmp = opt.in_data;
                tmp = comLib.gfn_replaceAll(tmp, " ","");
                var arrId1 = tmp.split(",");
                var tmpArr = [];
                for (var i=0; arrId1.length>i; i++) {
                    var arrId2 = arrId1[i].split("=");
                    if (arrId2.length != 2) {
                        this._alert("inData ERROR. ["+opt.in_data+"]");
                        return;
                    }
                    var i2 = arrId2[1].indexOf(":");
                    if(i2 > -1){
                        alert('|(파이프)를 사용하여 플레그를 정의해야합니다. ');
                        return false;
                    }
                    var arrId3  = arrId2[1].split("|");
                    var inFlag = comLib._getSbmReadFlag(arrId3[1]);
                    var dataCollectionObj = null;
                    //dataCollectionObj = this.$p.getComponentById(arrId3[0]);
                    var dataCollectionJson;
                    /*
                    status : R / statusValue : 0 - 초기 상태. (변화없음)
                    status : U / statusValue : 0 - 갱신. (update API 호출 시)
                    status : C / statusValue : 0 - 삽입. (insert API 호출 시)
                    status : D / statusValue : 0 - 삭제. (delete API 호출 시)
                    status : V / statusValue : 0 - 삽입 후 삭제. (insert API 후 delete API 호출)
                    status : E / statusValue : 0 - 제거. (remove API 호출 시)
                    */
                    if ( arrId3.length == 2) {
                        tmpArr.push( {"id":arrId3[0],"key":arrId2[0],"action":inFlag} );
                        if(inFlag == 'modified') {
                            dataCollectionJson = dataCollectionObj.getModifiedJSON({saveRemovedData:false});
                        }else if (inFlag == 'inserted') {
                            dataCollectionJson = dataCollectionObj.getInsertedJSON();
                        }else if (inFlag == 'deleted') {
                            dataCollectionJson = dataCollectionObj.getOnlyDeletedJSON();
                        }else if (inFlag == 'updated') {
                            dataCollectionJson = dataCollectionObj.getUpdatedJSON();
                        }else{
                            dataCollectioinJson = dataCollectionObj.getAllJSON();
                        }
                        if(ediJson.data == null) {
                            ediJson.data = {};
                        }
                        
                        ediJson.data[arrId2[0]] = dataCollectionJson;
                    } else {
                        tmpArr.push( {"id":arrId3[0],"key":arrId2[0]});
                        
                        var dataListOrdataMap; // = dataCollectionObj.getObjectType();
                        if(dataListOrdataMap == 'dataList') {
                            dataCollectionJson = dataCollectionObj.getAllJSON();
                            if(ediJson.data == null || Object.keys(ediJson.data).length == 0){
                                ediJson.data = {};
                            }
                            ediJson.data[arrId2[0]] = dataCollectionJson;
                        }else{
                            //dataCollectionJson = dataCollectionObj.getJson();
                            //if(ediJson.data == null || Object.keys(ediJson.data).length == 0) {
                            //    ediJson.data = JSON.parse(JSON.stringify(dataCollectionJson))
                            //}else{
                            //    var ks  = Object.keys(dataCollectionJson);
                            //    for(var l=0,m=ks.length; l < m; l++){
                            //        var val = dataCollectionJson[ks[l]];
                            //        ediJson.data[ks[l]] = val;
                            //    }
                            //}
                        }
                    }
                }
            }
            
            //target 설정
            if ( opt.out_data) {
                var tmp = opt.out_data;
                tmp = comLib.gfn_replaceAll(tmp, " ", "")
                var arrId1 = tmp.split(",");
                var tmpArr = [];
                for(var i=0; arrId1.length>i;i++){
                    var arrId2 = arrId1[i].split("=");
                    if (arrId2.length != 2) {
                        this._alert("outData ERROR. ["+opt.outData+"]");
                        return;
                    }
                    var arrId3 = arrId2[1].split("|");
                    if(arrId3.length == 2){
                        tmpArr.push({"id":arrId2[0],"key":arrId3[0],"action":arrId3[1]});
                    } else {
                        tmpArr.push( {"id":arrId2[0],"key":arrId3[0]} );
                    }
                    ediJson.common_header.ui_option.target = {};
                    ediJson.common_header.ui_option.target[arrId3[0]] = arrId2[0];
                }
            }
            
            comLib._executeSubmissionJsonp(ediJson);
            }
        } catch(e) {
            alert("comLib.gfn_executeSubmission() 오류2." + e);
        }
        console.log(opt);
    }
    
    comLib._getEdiReq = function(opt) {
        ['전문 통신용 요청객체 가져오기'];
        var str = JSON.stringify(comLib.ediReq);
        return JSON.parse(str);
    }
    
    // 서버의 시간을 가져오는 함수
    comLib.gfn_getSystemDate = function (param,_offset) {
        ['서버의 시스템시간을 가져오는(두번째인자인offset만큼+-가능) 함수'];
        try {
            var pattern = param || "yyyyMMdd";
            var currentDate;
            if(this.$p == null) {
                //currentDate = $p.getCurrentServerDate(pattern);//웹스퀘어 기능
                //alert(currentDate);
                //console.log(currentDate);
            }else {
                //currentDate = this.$p.getCurrentServerDate(pattern);//웹스퀘어 기능
                //alert(3);
                //alert(currentDate);
            }
            if(isNaN(currentDate)) {
                var str = '';
                var date = new Date();
                str += date.getFullYear();
                str += comLib.gfn_toTwoChar(date.getMonth() + 1);
                str += comLib.gfn_toTwoChar(date.getDate());
                str += comLib.gfn_toTwoChar(date.getHours());
                str += comLib.gfn_toTwoChar(date.getMinutes());
                str += comLib.gfn_toTwoChar(date.getSeconds());
                str += date.getMilliseconds();
                return str;
            }
        } catch(e) {
                var str = '';
                var date = new Date();
                str += date.getFullYear();
                str += comLib.gfn_toTwoChar(date.getMonth() + 1);
                str += comLib.gfn_toTwoChar(date.getDate());
                str += comLib.gfn_toTwoChar(date.getHours());
                str += comLib.gfn_toTwoChar(date.getMinutes());
                str += comLib.gfn_toTwoChar(date.getSeconds());
                str += date.getMilliseconds();
                return str;
        }
    }
    
    comLib.gfn_toTwoChar = function(value) {
        ['1자리 숫자를 앞에 0을 붙여 2자리 숫자로 만듬'];
        var tmp = value+'';
        if(tmp.length == 1) {
            tmp = '0'+tmp;
        }
        return tmp;
    }
    
    comLib.shuffleRandom = function(n) {
        ['난수생성'];
        var ar = new Array();
        var temp;
        var rnum;
        
        //전달받은 매개변수 n만큼 배열 생성 ( 1~n )
        for(var i = 1; i <= n; i++) {
            ar.push(i);
        }
        
        //값을 서로 섞기
        for(var i=0; i < ar.length; i++) {
            rnum = Math.floor(Math.random() *n); //난수발생
            temp = ar[i];
            ar[i] = comLib.gfn_toTwoChar(ar[rnum]);
            ar[rnum] = comLib.gfn_toTwoChar(temp);
        }
        return JSON.stringify(ar).replace(/\,|\"|\[|\]/g,'');
    }
    
    comLib.gfn_toEightChar = function(value) {
        ['1자리숫자를 앞에 0을 붙여 8자리 숫자로 만듬'];
        var tmp = value+'';
        if(tmp.length == 1) {
            tmp = '0000000'+tmp;
        } else if (tmp.length == 2) {
            tmp = '000000'+tmp;
        } else if (tmp.length == 3) {
            tmp = '00000'+tmp;
        } else if (tmp.length == 4) {
            tmp = '0000'+tmp;
        } else if (tmp.length == 5) {
            tmp = '000'+tmp;
        } else if (tmp.length == 6) {
            tmp = '00'+tmp;
        } else if (tmp.length == 7) {
            tmp = '0'+tmp;
        }
    }
    
    comLib.gfn_replaceAll = function(str, orgStr, repStr) {
        ['스트링의 replaceAll 작업'];
        str = ""+str;
        return str.split(orgStr).join(repStr);
    }
    /*
     * m,i,u,d input flag가 들어오면 modified,inserted,updated,deleted 로 변환합니다.
     */
    comLib._getSbmReadFlag = function(_flag){
        ['m,i,u,d input flag가 들어오면 modified,inserted,updated,deleted 로 변환하는 함수'];
        if(_flag == null) {
            return '';
        } else{
            _flag = _flag.toUpperCase();
        }
        
        if (_flag == 'M') {
            return "modified";
        }else if (_flag == 'I') {
            return "inserted";
        }else if (_flag == 'D') {
            return "deleted";
        }else if (_flag == 'I') {
            return "updated";
        }else {
            return _flag;
        }
    }
    comLib._executeSubmissionJsonp = function(ediJson){
        var opt = ediJson.common_header.ui_option;
        var sendData = {};
        var _server = "default_server";
        if(opt.action['server'] != null) {
            _server = opt.action['server'];
        }
        var _mode = "asynchronous";
        if(opt.mode != null){
            _mode = opt.mode;
        }
        
        var _process_msg = "거래처리중";
        if(opt.process_msg != null){
            _process_msg = opt.process_msg;
        }
        
        var url = '';
        var initFlag = false;
        var _config = null;
        if(_server == 'default_server') {
//         _config = default_config;
        }else{
            _config = config;
        }
        
        if(typeof opt.action == 'object' && opt.action['url']==null){
            //ediJson.common_header.ui_option.action = _config[_server].domain+ _config[_server].url;
            initFlag = true;
        }else if(typeof opt.action == 'object' && (ediJson.common_headr.cont_trKey == null || ediJson.common_header.cont_trKey.length == 0 )){
            //ediJson.common_header.ui_option.action = _config[_server].domain+ opt.action['url'];
            initFlag = true;
        }
        
        var callbackFunction = ediJson.common_header.ui_option.callback;
        var errorFunction = ediJson.common_header.ui_option.error;
        var actionUrl = null;
        
//        if(initFlag){
//            if(_server == 'default_server'){
//                actionUrl = _config[_server].domain+_config[_server].proxy;
//            }else{
//                actionUrl = ediJson.common_header.ui_option.action;
//            }
//        }else{
//            actionUrl = ediJson.common_header.ui_option.action;
//        }

        var result = JSON.stringify(ediJson);
        //result = result.replace(/rowStatus/g,'row_status');
        
        //actionUrl = actionUrl.replace(/\{tx_id\}/g,ediJson.common_header.th_tr_id);
        var ajaxOpt = {
            action : actionUrl,
            mode:_mode,
            mediatype:"application/json",
            method:"get",
            encoding:"utf-8",
            processMsg:_process_msg,
            requestData:result,
            requestHeader:{},
            beforeAjax:function(e) {},
            success:function(e){
                var result = e.responseJSON;
                callbackFunction(e);
            },
            error:function(e){
                alert('ajax error!'+e);
                errorFunction(e);
            }
        }
        
        if(config.grp_status_class != 'status_local'){
            ajaxOpt['withCredentials'] = true;
        }
        //WebSquare.net.ajax(ajaxOpt);
    }
    
    comLib._executeSubmission = function() {
        
    }
// 로그인 기능 구현 후 다시 체크.
//    comLib.gfn_getUserInfo = function (_key) {
//        ['세션에 사용자 정보를 GET하는 함수'];
//        var val = '';
//        var userInfoStr = sessionStorage['dlUserInfoM_'+location.host];
//        if (userInfoStr == null) {
//            alert('로그인되지 않았습니다. 로그인해주세요.');
//        }
//    }
