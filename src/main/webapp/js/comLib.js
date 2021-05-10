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
// 로그인 기능 구현 후 다시 체크.
//    comLib.gfn_getUserInfo = function (_key) {
//        ['세션에 사용자 정보를 GET하는 함수'];
//        var val = '';
//        var userInfoStr = sessionStorage['dlUserInfoM_'+location.host];
//        if (userInfoStr == null) {
//            alert('로그인되지 않았습니다. 로그인해주세요.');
//        }
//    }
