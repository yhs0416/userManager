(function($, window) {

  /**
	 * this variable, GW,keeps variables and objects of Groupware.
	 */
	window.GW = {
	   /** 모듈에서만 사용하는 객체를 저장하는 프러퍼티 */
	   LOCAL : {
	       // 이 프러퍼티에 모듈 객체를 저장한다.
	       // 새로운 모듈을 호출하는 경우에는 이 변수의 객체를 모두 삭제한다
	   },
	   
	   /** LOCAL 프러퍼티 안의 모든 객체 삭제. 메모리 청소 */
	   deleteLocal: function() {
	      if(this.LOCAL) {
	         delete this["LOCAL"];  // 메모리에서 LOCAL 프러퍼티 지움
	      }
	      this.LOCAL = {};
	   },
	   
	   /** LOCAL 객체 안에 객체가 있는지 확인 */
	   findLocalObject: function(name) {
	     if(this.LOCAL[name]) {
	        return this.LOCAL[name];
	     }else {
	       // 존재하지 않으면 null을 반환
	        return null;
	     }
	   },
	   /** LOCAL 객체에 모듈 객체를 추가한다.
	      name : 객체 이름
	      obj : 객체
	   */
	   addLocal: function(name, obj) {
	      // 자바스크립트에서 false인 것: undefined, null, 0, -0, NaN,  ""
	      if(!this.LOCAL) {
	          this.LOCAL = {};
	      }

	      //var objName = Object.keys({obj})[0];  // 객체의 이름을 구하기 위해 서 {}에 객체를 담고 Object.keys()를 사용
	      // 그러나 위의 방법은 사용하지 못함. obj는 obj로 이름이 반환뇜
	      //alert("objName:" + objName);
	      this.LOCAL[name] = obj; // 객체의 이름으로 객체를 저장
	      //alert("==>" + name);
	   }
	}

})(jQuery, window);


(function($) {
	/**
	 * HTML5 history 상태 변경시 이벤트, ie10이상에서 사용
	 * 
	 */
	$(window).on('popstate', function (e) {
        if (e.originalEvent.state) {
        	naon.history.popstate(e.originalEvent.state);
        }
    });

	/*
	 * @deprecated
	 * 중복된 history를 생성하는 버그,특정상황에서만 쓸수있는 제약 조건,제한된 히스토리 저장 갯수 문제가 있어서 필요한 페이지만 별도로 구현
		$(window).hashchange(function(evt){
			naon.http.history.hashChange(evt);
		}).unload(function(evt){
			naon.http.history.historyLocalSave();
		}).load(function(){
			naon.http.history.restoreLocalSave();
			if (naon.http.history.state.length > 0) {
				naon.http.history.state[naon.http.history.state.length - 1].restore = true;
				location.hash = naon.http.history.state[naon.http.history.state.length - 1].hash;
			}
		});
	*/

    /**
     * Javascript가 로드된후 javascript를 호출해야 한다. 자바스크립트가 로드될 때까지 기다린후 화면제어
     * 로직을 처리하는 스크립트의 init 함수를 호출한다.
     */
    var ScriptInvoker = function(scriptName)  {
        /** 실행할 스크립트 객체명    */
        this.scriptName = scriptName;
        /** timeout 이벤트의 참조 변수 */
        this.timeVar   =  'undefined';
        /** 객체에 전달할 데이터 값 */
        this.attrValue =  'undefined';
        /** 객체에 생성할 데이터 */
        this.attrName;
        /**
         * script에 전달할 데이터를 설정합니다.
         * @param attrName  변수명
         * @param attrValue 데이터, Object, string, int 아무거나
         */
        this.setAttribute = function(attrName, attrValue) {
            this.attrName   = attrName;
            this.attrValue  = attrValue;
        };
        /**
         * script의 init를 호출합니다.
         */
        this.invoke = function() {
            var self = this;
            this.timeVar = setTimeout(function() {
                var func = (window[self.scriptName])? window[self.scriptName]: window.GW.LOCAL[self.scriptName];
                if(func) {
                    if(self.attrName) {
                        func[self.attrName] = self.attrValue;
                    }
                    func.init();
                    self.clearTime();
                }else {
                    self.invoke();
                }
            });
        };
        /**
         * 타입아웃을 해제
         */
        this.clearTime = function() {
            clearTimeout(this.timeVar);
        };
    };




    //var naon = (function() {

       /**
        * 나온 패키지
        */
        var naon = function() {
            //return new naon.fn.init();
        };
//
//        naon.fn = naon.prototype = {
//            init : function() {
//                return this;
//            }
//        };

        // ---------------------------------------------------------------------- String Section
        /**
         * 문자열 처리 클래스
         */
        naon.string = {
        		
        	/**
             * 배열 split 구분자
            */
        	sep : [",", "|", "▒", "▤", "▩", "＾", "｜", "＆"],
            
        	/**
             * 패딩문자로 문자열을 채웁니다. Oracle LPAD 함수를 생각하면 됩니다.
             *
             * <pre>
             *
             * 다음은 문자열을 padding하는 예제입니다.
             *
             * var src = "111";
             * var paddedStr = naon.string.lpad(src, 10, '0');
             *
             * paddedStr의 값은 다음과 같습니다.
             *
             * '0000000111'
             *
             * </pre>
             *
             * @param src 원본문자열
             * @param length 문자열의 제한 길이
             * @param pad 채울 문자
             * @returns
             *      패딩된 문자열
             */
            lpad : function(src, length, pad) {
                if (!this.hasText(src))
                    return "";

                var buffer = [];
                for ( var i = 0; i < length - src.length; i++) {
                    buffer.push(pad);
                }
                src = buffer.join("") + src;
                return src.substring(0, length);
            },
            /**
             * 패딩문자로 문자열을 채웁니다. Oracle RPAD 함수를 생각하면 됩니다.
             *
             * <pre>
             *
             * 다음은 문자열을 padding하는 예제입니다.
             *
             * var src = "111";
             * var paddedStr = naon.string.rpad(src, 10, '0');
             *
             * paddedStr의 값은 다음과 같습니다.
             *
             * '1110000000'
             *
             * </pre>
             *
             * @param src 원본문자열
             * @param length 문자열의 제한 길이
             * @param pad 채울 문자
             * @returns
             *      패딩된 문자열
             */
            rpad : function(src, length, pad) {
                if (!this.hasText(src))
                    return "";

                var buffer = [];
                for ( var i = 0; i < length - src.length; i++) {
                    buffer.push(pad);
                }
                src = src + buffer.join("");
                return src.substring(0, length);
            },
            /**
             * 문자열의 앞뒤를 공백을 제거합니다. 오라클의 trim을 생각하면 됩니다.
             * <pre>
             * 다음은 trim을 사용하는 예제입니다.
             *
             * var src = "abcde   ";
             * var trimedString = naon.sring.trim(src);
             *
             * trimedString의 값은 다음과 같습니다.
             *
             *  'abcde'
             *
             * </pre>
             * @param str  문자열
             *      트림된 문자열
             */
            trim : function(str) {
            	str = str.toString();
            	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            },
            /**
             * 공백을 제외한 문자열을 가지고 있는지 확인합니다.
             * @param str 체크할 문자열
             * @return
             *      true : 문자열의 길이가 > 0 이면 , 그밖에 false
             */
            hasText : function(str) {
                if (!str)
                    return false;
                str = this.trim(str);
                if (str == "")
                    return false;
                return true;
            },
            /**
             * 주어진 문자열이 null 이나 "" 인지 확인
             * @param 비교할 문자열
             * @return
             * 		true : null 이나 "", , 그밖에 false
             */
            isEmpty : function(str) {
                return (str == null || str == "") ? true: false;
            },

            /**
             * 주어진 문자열이 null 이나 "" 인지 확인
             * @param 비교할 문자열
             * @return
             * 		false : null 이나 "", , 그밖에 true
             */
            isNotEmpty : function(str) {
                return (str == null || str == "") ? false: true;
            },


            /**
             * 주어진 문자열이 null 혹은 "" 혹은 undefined 인지 확인
             * @param 비교할 문자열
             * @return
             * 		true : null 이나 "", , 그밖에 false
             */
            isBlank : function(str) {
                return (str == null || str == "" || str == "undefined") ? true: false;
            },

            /**
             * 주어진 문자열이 null 혹은 "" 혹은 undefined 인지 확인
             * @param 비교할 문자열
             * @return
             * 		false : null 이나 "", , 그밖에 true
             */
            isNotBlank : function(str) {
                return (str == null || str == "" || str == "undefined") ? false: true;
            },
            
            /**
             * 주어진 문자열이 json 문자열인지 확인
             * @param 비교할 문자열
             * @return false , true
             */
            isJsonString : function(str) {
            	if(str == null || str == "" || str == undefined){
            		return false;
            	}else if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
            			replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            			replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            		return true;
            	}
                return false;
            },

            /**
             * 문자열이 널이면 널스트링("")을 반환
             * @param str 원본문자열
             * @returns
             *      변환된 문자열
             */
            nvls : function(str) {
                if (!str)
                    return "";
                else
                    return str;
            },

            /**
             * Oracle의 decode 참조. "1,한글,2,영어,기타" 와 같은 문자열을 decodeString
             * 에 설정하고 expr1에 '2' 값을 설정하면  "영어"를 반환합니다. 주어진 값이
             * 없으면 마지막 기타를 반환합니다.
             *
             *
             * <pre>
             * 다음은 decode를 사용하는 예제입니다.
             *
             * var  deStr = "1,사과,2,배,감자";
             * var  decodedString = naon.string.decode("2", deStr);
             *
             * decodeStgring의 값은  "배"가 됩니다.
             *
             *
             * </pre>
             *
             * @param expr1 찾을 문자열
             * @param decodeString 해석할 문자열
             *  @return 검색된 결과 문자열
             */
            decode : function(expr1, decodeString) {
                decodeString = this.trim(decodeString);
                var strs = decodeString.split(',');
                return this.decode_internal(expr1, strs);
            },
            /**
             * decode의 내부에서 사용합니다. 실제의 decode 처리를 합니다.
             * @param expr1  디코드할 문자열
             * @param exprs 디코드 값
             * @returns
             *      결과 값
             */
            decode_internal : function(expr1, exprs) {
                var i = 0;
                var hasElseValue = false;
                var isMatch = false;
                var expr = this.nvls(expr1);

                hasElseValue = (exprs.length % 2) == 1 ? true : false;
                for (i = 0; i < exprs.length; i++) {
                    if ((i % 2) == 0 && expr == exprs[i])
                        return exprs[i + 1];
                    i++;
                }// for

                if (!isMatch && hasElseValue)
                    rv = exprs[exprs.length - 1];
                return rv;
            },
            /**
             * 문자열을 치환합니다.
             *
             * <pre>
             *
             * var src = "Once or twice";
             * var replacedStr = naon.string.replace(src, "twice");
             *
             * replacedStr의 값은 다음과 같습니다.
             *
             * "Once or "
             *
             * </pre>
             *
             * @param str 원본문자열
             * @param findStr 찾을 문자열
             * @param replaceStr 치환할 문자열
             *
             */
            replace : function(str, findStr, replaceStr) {
                if (!str)
                    return str;
                return str.replace(new RegExp(findStr, "g"), replaceStr);
            },
            
            /** 정규식 패턴 사용안하는 버전. */
            replaceStr : function(str, findStr, replaceStr) {
                if (!str)
                    return str;
                return str.split(findStr).join(replaceStr);
            },

            /**
             * textarea에 입력된 문자열을 div등에 표시할 때 적절히 값을 치환합니다.
             * @param 처리할 문자열
             * @return 치환된 문자열
             */
            replaceTextarea : function(str) {
                if (!str){
                	return str;
                }
                str = str.replace(new RegExp("/\r|\n", "gi"), "<br/>");
                str = str.replace(new RegExp(" ", "gi"), "&nbsp;");
                
                return str;
            },
            /**
             * 문자열의끝에서 주어진 길이만큼 분리합니다.
             *
             * <pre>
             *
             * var src = "123456789";
             * var rightedString = naon.string.right(src, 5);
             *
             * 결과는 다음과 같습니다.
             *
             * "56789"
             *
             * </pre>
             *
             * @param str 원본 문자열
             * @param length 길이
             * @returns
             * 		 변환된 문자열
             */
            right : function(str, length) {
                if (!str)
                    return "";
                return (str.length >= length) ? str.substring(str.length - length) : str;
            },
            /**
             * 문자열의 시작부분을 잘라냅니다.
             *
             * <pre>
             *
             * var src = "123456789":
             * var leftedString = naon.string.left(src, 5);
             *
             * 결과는 다음과 같습니다.
             *
             *
             * "12345"
             *
             * </pre>
             *
             * @param str  원본 문자열
             * @param length  길이
             * @returns
             * 		변환된 문자열
             */
            left : function(str, length) {
                if (!str)
                    return "";
                return str.length >= length ? str.substring(0, length) : str;
            },
            /**
             * 날자형식으로 변환합니다.
             *
             * <pre>
             * var str = "20120101";
             * var formatedStr = naon.string.formatDate(str, '/');
             *
             * 결과는 다음과 같습니다.
             * "2012/01/01"
             *
             * </pre>
             *
             * @param str  원본 문자열
             * @param ch  구분자
             * @returns
             *      변환된 문자열
             */
            formatDate : function(str, ch) {
                if (str == null)
                    return "";
                if (str.length < 5)
                    return str;
                else if (str.length > 4 && str.length < 7) {
                    return this.left(str, 4) + ch + str.substring(4);
                } else {
                    return this.left(str, 4) + ch + str.substring(4, 6) + ch + str.substring(6);
                }
            },
            /**
             * 주민번호 형식으로 변환합니다.(750123-21111111)
             *
             * <pre>
             *
             * var str = "7501232111111";
             * var formatedStr = naon.string.formatResidentId(str);
             *
             * 결과는 다음과 같습니다.
             *
             * "750123-2111111"
             *
             *
             * </pre>
             * @param str 문자열
             * @returns
             * 		변환된 문자열
             */
            formatResidentId : function(str) {
                if (str == null)
                    return "";
                str = this.replace(str, "-", "");
                if (str.length < 7)
                    return str;
                return this.left(str, 6) + "-" + str.substring(6);
            },
            /**
             *  우편번호 형식으로 문자열을 변환합니다.
             *
             *  <pre>
             *
             *  var str = "132123";
             *  var formatedStr = naon.string.formatZipCode(str);
             *
             *  결과는 다음과 같습니다.
             *
             *  "132-123"
             *
             *  </pre>
             *
             * @param str 원본 문자열
             * @returns
             * 		변환된 문자열
             */
            formatZipCode : function(str) {
                if (str == null)
                    return "";
                str = this.replace(str, "-", "");
                if (str.length < 4)
                    return str;
                return this.left(str, 3) + "-" + str.substring(3);
            },

            /**
             * 입력된 숫자형식의 문자열에 콤마를 넣습니다.
             *
             * <pre>
             *
             * var str = "123123";
             * var formatedStr = naopn.string.formatComma(str);
             *
             * 결과는 다음과 같습니다.
             *
             * "123,123"
             *
             * </pre>
             *
             * @param str 원본 문자열
             * @returns
             * 		변환된 문자열
             */
            formatComma : function(str) {
                str += '';
                x = str.split('.');
                x1 = x[0];
                x2 = x.length > 1 ? '.' + x[1] : '';
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + ',' + '$2');
                }
                return x1 + x2;
            },
            /**
             * 전화번호 형식으로 변환합니다
             *
             * <pre>
             * var str = "023030101";
             * var formatedStr = naon.string.formatTelephone(str);
             *
             * 결과는 다음과 같습니다.
             *
             * "02-303-0101";
             * </pre>
             *
             * @param str 원본  문자열
             * @returns
             * 		변환된 문자열
             */
            formatTelephone : function(str) {
                if (!str)
                    return "";
                if (str.length < 3)
                    return str;
                else if (str.length >= 3 & str.length < 5) {
                    return str.replace(/(^0(?:2|[0-9]{2}))([0-9]+$)/, "$1-$2");
                } else if (str.length >= 5 & str.length < 8) {
                    return str.replace(/(^0(?:2|[0-9]{2}))([0-9]{3,4})([0-9]+$)/, "$1-$2-$3");
                }
                //            	else {
                //            		return str.replace(/(^0(?:2|[0-9]{2}))([0-9]+)([0-9]{4}$)/, "$1-$2-$3");
                //            	}
            },
            /**
             * 문자열이 통화형식(123,222.22) 형식인지 확인합니다.
             * @param str 문자열
             * @returns
             * 		형식이 맞으년 true, 아니면 false
             */
            isCurrency : function(str) {
                return !str.match(/[^0-9,\.]{1,}/);
            },
            /**
             * 문자열이 정수형(1234455)인지 확인하빈다.
             * @param str 문자열
             * @returns
             * 		형식이 맞으년 true, 아니면 false
             */
            isInteger : function(str) {
                return !str.match(/[^0-9]{1,}/);
            },
            /**
             * 문자열이 정수형과 대쉬(-)만 있는지 체크
             * @param str 문자열
             * @returns
             *    형식이 맞으년 true, 아니면 false
             */
            isNumberDash : function(str) {
                return !str.match(/[^0-9\-]{1,}/);
            },
            /**
             * 바이트로 환산한 문자열의 길이값 반환
             *
             * <pre>
             *
             * var str = "한글a";
             * var len = naonb.string.getBytesLength(str);
             *
             * 결과는 7 입니다.
             * 오라클 기준으로 한글은 3byte 로 계산 되었습니다.
             *
             * </pre>
             *
             * @param str 문자열
             * @returns
             * 		integer : 문자열 길이
             */
            getBytesLength : function(str) {
            	if(this.isBlank(str)) return str;
            	
                str_len = str.length;
                byte_cnt = 0;
                if (str_len != escape(str).length) {
                    for (i = 0; i < str_len; i++) {
                        byte_cnt++;
                        if (this.isUnicode(str.charAt(i))) {
                            byte_cnt = byte_cnt + 2;
                        }
                    }
                } else
                    byte_cnt = str_len;
                return byte_cnt;
            },
            /**
             * 입력받은 글자 byte길이로 자르기
             * */
            getBytesCut :  function(str, len) {
            	var l = 0;
            	for (var i=0; i<str.length; i++) {
            	       l += (str.charCodeAt(i) > 128) ? 2 : 1;
            	       if (l > len) return str.substring(0,i);
            	}
            	return str;
        	},
        	/**
             * 입력받은 글자 byte길이로 자르기
             * */
            getBytesCutAsUTF8 :  function(str, len) {
            	var l = 0;
            	for (var i=0; i<str.length; i++) {
            	       l += (str.charCodeAt(i) > 128) ? 3 : 1;
            	       if (l > len) return str.substring(0,i);
            	}
            	return str;
        	},
            	

            /**
             * 문자가 유니코드인지 확인
             * @param chr 문자
             * @returns {Boolean}
             * 		true 유니코드, false 유니코드 아님
             */
            isUnicode : function(chr) {
                return (escape(chr).length == 6);
            },
        	
        	formatDashPhoneNumber : function(num, type){
        		if(!num) return;
        		
        		var formatNum = '';
    		    
        		num = num.replace(/[^0-9]/g,'');
        		
    		    if(num.length==11){
    		        if(type==0){
    		            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
    		        }else{
    		            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    		        }
    		    }else if(num.length==8){
    		        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
    		    }else{
    		        if(num.indexOf('02')==0){
    		        	if(num.length == 9){
    		        		formatNum = num.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
    		        	}else if(num.length == 10){
    		        		formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    		        	}
    		        }else{
    		            if(type==0){
    		                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
    		            }else{
    		                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    		            }
    		        }
    		    }
    		    return formatNum;
        	}
        };

    	/**
    	 * 다국어 처리 클래스
    	 */
    	naon.i18n = {
    		/**
    		 * 다국어 처리시 인자가 있는 경우 치환
    		 *
    		 *
    		 */
    		msgFormat : function() {
    			var arg = arguments;
    			if (arg.length == 0)
    				return '';
    			if (arg.length == 1)
    				return arg[0];

    			var fn = function(w, g) {
    				if (isNaN(g))
    					return '';
    				var idx = parseInt(g) + 1;
    				if (idx >= arg.length)
    					return '';
    				return arg[parseInt(g) + 1];
    			};
    			return arg[0].replace(/\{([0-9]*)\}/g, fn);
    		},

            /**
             * 설정 파일에서 언어셋을 읽어 다국어 UI를 구성
             * @param i18nDivId 다국어 UI가 들어갈 DivId
             * @param i18nColName 다국어 컬럼명
             * @param alwaysEn 조직관리의 경우 Y, 기타 N
             * @param uiStyle 'simple이면 한줄형태로 나옴. 그외 여러줄형태로.
             *
             * 설정파일
             * #언어셋
             * langSet=한국어$ko*English$en*日本語$ja*中國語$zh
             * #기본언어
             * defaultLang=ko
             *
             * <div class="lang" id=”divDeptName”>
             * </div>
             *
             * naon.i18n. formatI18nUI(“divDeptName”,”deptName”) 호츌후
             *
             * <div class="lang" id=”divDeptName”>
             * <dl>
             * 	<dt>한국어<span class="req">*</span></dt>
             * 	<dd><input id="deptName_ko" name="deptName_ko" type="text" data-lang="KO" class="input_txt"></dd>
             * </dl>
             * <dl>
             * 	<dt>English</dt>
             * 	<dd><input id="deptName_en" name="deptName_en"  type="text" data-lang="EN" class="input_txt"></dd>
             * </dl>
             * <dl>
             * 	<dt>日本語</dt>
             * 	<dd><input id="deptName_ja" name="deptName_ja"  type="text" data-lang="JA" class="input_txt"></dd>
             * </dl>
             * <dl>
             * 	<dt>中國語</dt>
             * 	<dd><input id="deptName_zh" name="deptName_zh"  type="text" data-lang="ZH" class="input_txt"></dd>
             * </dl>
             * </div>
             *
             * naon.i18n. formatI18nUI(“divDeptName”,”deptName”, 'N', 'simple') 호츌후
             * <div class="lang" id=”divDeptName”>
             *	<input name="deptName_ko" type="text" placeholder="한국어*" class="input_txt">
             *	<input name="deptName_en" type="text" placeholder="English" class="input_txt">
             *
             * uiStyle 이 hide 일 경우 아래와 같은 이벤트 추가 필요.
             * $("#" + pageObj.prefix + "_lang button").on("click", function() {
             *		if($(this).closest('.lang').hasClass('lang_open')) {
             *			$(this).closest('.lang').removeClass('lang_open');
             *		}
             *		else {
             *			$(this).closest('.lang').addClass('lang_open');
             *		}
             *	});
             * </div>
             *
             */
			formatI18nUI : function(i18nDivId,i18nColName,alwaysEn,uiStyle) {
				var template = "";
				switch(uiStyle) {
				case 'simple' : template = this.getSimpleI18nTmplt(); break;
				case 'hide' : template = this.getHideI18nTmplt(); break;
				case 'hidePlaceHolder' : template = this.getHideI18nPlaceHolderTmplt(); break;
				default : template = this.getI18nTmplt(); break;
				}
				var langSetArr = this.getLangSetArr();
				var isMultiLingual = (langSetArr.length > 1); 
				if (alwaysEn == "Y" && !this.existsEn) {
					
					var existEn = false;
					
					//이미 영문이 있을경우 추가하지 않는다.
					$.map(langSetArr, function(value, key) {
						if(value.langCd == 'en'){
							existEn = true;
						} 
					});
					
					if(!existEn){
						langSetArr.push({
							langName: 'English',
							langCd: 'en',
							defaultLang: false
						});
					}
				}
				
				var html = Mustache.to_html(template, {keyPrefix: i18nColName + '_', langSet: langSetArr, isMultiLingual : isMultiLingual});
				$('#'+i18nDivId).html(html);
			},
			/** 한줄형태의 다국어 템플릿 */
			getSimpleI18nTmplt: function() {
				if (!this.simpleI18nTmplt) {
					this.simpleI18nTmplt = '{{#langSet}}\r\n' +
						'<input id="{{keyPrefix}}{{langCd}}" name="{{keyPrefix}}{{langCd}}" type="text" placeholder="{{langName}}{{#defaultLang}}*{{/defaultLang}}" data-lang="{{langCd}}" title="{{langName}}" class="input_txt">\r\n' +
						'{{/langSet}}';
				}
				return this.simpleI18nTmplt;
			},
			/** 다국어 템플릿 */
			getI18nTmplt: function() {
				if (!this.i18nTmplt) {
					this.i18nTmplt = "{{#langSet}}<dl>\r\n" +
						"<dt>{{langName}}{{#defaultLang}}<span class=\"req\">*</span>{{/defaultLang}}</dt>\r\n" +
						"<dd><input id=\"{{keyPrefix}}{{langCd}}\" name=\"{{keyPrefix}}{{langCd}}\" data-lang=\"{{langCd}}\" type=\"text\" class=\"input_txt\"></dd>\r\n" +
		 				"</dl>{{/langSet}}";
				}
				return this.i18nTmplt;
			},
			/** 대표언어 외의 언어입력란은 숨김처리한 템플릿 */
			getHideI18nTmplt : function() {
				if (!this.hideI18nTmplt) {
					this.hideI18nTmplt = 
						"{{#langSet}}{{#defaultLang}}" +
						"<dl>" +
						"	<dt>{{langName}}<span class=\"req\">*</span></dt>" +
						"	<dd>" +
						"		<input id=\"{{keyPrefix}}{{langCd}}\" name=\"{{keyPrefix}}{{langCd}}\" data-lang=\"{{langCd}}\" type=\"text\" class=\"input_txt\" value=\"\">" +
						"		{{#isMultiLingual}}<button type=\"button\" title=\""+common_text_multiLinguale /** 다국어 입력 */+"\" class=\"btn btn_lang\"><span class=\"ico_lang\">"+common_text_multiLinguale /** 다국어 입력 */+"</span></button>{{/isMultiLingual}}" +
						"	</dd>" +
						"</dl>" +
						"{{/defaultLang}}{{/langSet}}" +
	
						"<div class=\"lang_more\">" +
						"{{#langSet}}{{^defaultLang}}" +
						"	<dl>" +
						"		<dt>{{langName}}</dt>" +
						"		<dd><input id=\"{{keyPrefix}}{{langCd}}\" name=\"{{keyPrefix}}{{langCd}}\" data-lang=\"{{langCd}}\" type=\"text\" class=\"input_txt\" value=\"\"></dd>" +
						"	</dl>" +
						"{{/defaultLang}}{{/langSet}}" +
						"</div>";
				}
				return this.hideI18nTmplt;
			},
			/** 대표언어 외의 언어입력란은 숨김처리 후 언어명 placeholder로 넣은 템플릿 */
			getHideI18nPlaceHolderTmplt : function() {
				if (!this.hideI18nPlaceHolderTmplt) {
					this.hideI18nPlaceHolderTmplt = 
						"{{#langSet}}{{#defaultLang}}" +
						"<dl>" +
						"	<dt><span class=\"req\">*</span></dt>" +
						"	<dd>" +
						"		<input id=\"{{keyPrefix}}{{langCd}}\" name=\"{{keyPrefix}}{{langCd}}\" title=\"{{langName}}\" data-lang=\"{{langCd}}\" type=\"text\" class=\"input_txt\" placeholder=\"{{langName}} *\" value=\"\">" +
						"		{{#isMultiLingual}}<button type=\"button\" title=\""+common_text_multiLinguale /** 다국어 입력 */+"\" class=\"btn btn_lang\"><span class=\"ico_lang\">"+common_text_multiLinguale /** 다국어 입력 */+"</span></button>{{/isMultiLingual}}" +
						"	</dd>" +
						"</dl>" +
						"{{/defaultLang}}{{/langSet}}" +
	
						"<div class=\"lang_more\">" +
						"{{#langSet}}{{^defaultLang}}" +
						"	<dl>" +
						"		<dt></dt>" +
						"		<dd><input id=\"{{keyPrefix}}{{langCd}}\" name=\"{{keyPrefix}}{{langCd}}\" title=\"{{langName}}\" data-lang=\"{{langCd}}\" type=\"text\" class=\"input_txt\" placeholder=\"{{langName}}\" value=\"\"></dd>" +
						"	</dl>" +
						"{{/defaultLang}}{{/langSet}}" +
						"</div>";
				}
				return this.hideI18nPlaceHolderTmplt;
			},
			/** 언어셋 배열을 반환한다.
			 *  @keyPrefix key prefix
			 */
			getLangSetArr : function() {
				if (!this.langSetArr) {
					this.langSetArr = $.map(frameworkProperties.langSet.split("*"), function(value, key) {
						var lang = value.split("$");
						var langSet = {
								langName: lang[0],
								langCd: lang[1],
								defaultLang: frameworkProperties.defaultLang == lang[1]
							};
						if(lang[1] === 'en') {
							naon.i18n.existsEn = true;
						}
						return langSet;
					});
				}
				return this.langSetArr;
			}
		};



        // ------------------------------------------------------------------------------- invoker
        /**
         * Javscript 함수 실행
         */
        naon.invoker = {
                /**
                 * Javascript가 로드될 때 까지 기다린후 javascript object가 유효하면 script의
                 * init function을 호출한다. 화면개발가이드 참조하세요.
                 * @param scriptName  javascript 객체이름
                 * @param varName  객체에 추가할 변수이름
                 * @param jsonStr 객체에 담을 변수, Object or primitive type
                 */
                invoke : function(scriptName, varName, jsonStr) {
                    var invoker = new ScriptInvoker(scriptName);
                    invoker.setAttribute(varName, jsonStr);
                    invoker.invoke();
                }
        };




        // ------------------------------------------------------------------------------- doc

        // javascript two patterns 

        //<\s*script[^><]*src=".*[^>]">\s*<\/\s*script\s*>
        
        
        
        
        
        /**
         * document 처리
         */
        naon.doc =  {

        		/**
        		 * jQuery의 append, html과 동작이 같아서 jQuery를 그대로 쓰려고 함. 
        		 * 다만, title, meta는 제거함. 
        		 */
        		getHtml: function(htmlRes) {
        			var result = "";
        			
        			if(htmlRes && (typeof htmlRes == "string") ){
        				var re = /<\s*meta[^<>]*>/ig;
            			result = htmlRes.replace(re, "");
            			re = /<\s*title\s*>[^<>]*<\s*\/title\s*>/ig;
            			result = result.replace(re, ""); 
        			}
        			
        			return result; 
        		},
                /**
                 * html을 파싱하여 script 파일과, css 파일은 헤더에 추가하고 나머지는
                 * 다시 html을 만들어 되돌린다.
                 * HTML을 분해하여 HEAD에 javascript, css 를 추가한다.

                 */
//                getHtml : function(htmlRes) {
//                    var targetHead =  document.getElementsByTagName("HEAD")[0];
//                    // import javascript
//                    // src 속성이 있는 자바스크립트를 분리
//                    var re = /<\s*script[^><]*src="*(.*[\w\.\s/])"*>\s*<\/\s*script\s*>/ig
//                    var r;
//                    while(r = re.exec(htmlRes)) {
//                        var scriptStr = r[0].toString();
//                        var scriptElement = document.createElement('script')
//                        var scriptElement =   targetHead.appendChild(document.createElement('script'));
//                        scriptElement.type = 'text/javascript';
//                        scriptElement.src = naon.string.replace(r[1].toString(),"/","\/")  + "?_=" + new Date().getTime();
//                        targetHead.appendChild(scriptElement);
//                    }// while
//                    
//                    
//                    
//                    // import style  User style
//                    // href 속성이 있는 외부 스타일 시트를 불러온다.
//                    var re2 = /<link\s*[^<>]*href=\s*"?([\w\s\./]*)"?\s*[^<>]*\s*>/ig
//                    //var re = new RegExp(regexpStr1);  //Create regular expression object.
//                    var r2;
//                    while(r2 = re2.exec(htmlRes)) {
//                        var linkStr = r2[0].toString();
//
//                        //var linkElement=targetHead.appendChild(document.createElement('link'));
//                        var linkElement= document.createElement('link');
//                        linkElement.type = 'text/css';
//                        linkElement.rel = "StyleSheet";
//                        linkElement.href = naon.string.replace(r2[1].toString(),"/","\/") + "?_=" + new Date().getTime();
//                        targetHead.appendChild(linkElement);
//                    }
//                    
//                    
//                    
//                    // body
//                    var sHtml = "";
//                    var regexpStr3 = /<body[^>]*?>/im
//                    re = new RegExp(regexpStr3);  //Create regular expression object.
//                    r = re.exec(htmlRes);
//                    if(r != null){
//                        var sInBody = RegExp.rightContext;
//                        regexpStr3 = /<\/body>/im
//                        re = new RegExp(regexpStr3);  //Create regular expression object.
//                        r = re.exec(sInBody);
//                        sHtml = RegExp.leftContext;
//                    }
//                    //var nHtml = "<html><head>" + sScript + "</head><body>" + sHtml + "</body>";
//
//                    //$("#" + divId).html(sHtml+sScript);
//                    //document.getElementById(divId).insertAdjacentHTML("beforeEnd", sHtml+sScript);
//
//                    var replRe = /<\s*script[^><]*src="*.*[\w\.\s/]"*>\s*<\/\s*script\s*>/;
//                    var retStr =  sHtml.replace(replRe, "");
//                    return retStr; 
//                    
//                },
                writeOuterHtml:function(htmlRes, divId) {
                     var nHtml = naon.doc.getHtml(htmlRes);
                     $("#" + divId).outerHTML(nHtml);
                },
                /**
                 * HTML을 분해하여 HEAD에 javascript, css 를 추가한다.
                 */
                writeHtml : function(htmlRes, divId) {
                    var nHtml = naon.doc.getHtml(htmlRes);
                    $("#" + divId).empty().html(nHtml);

                }// writeHtml
        };




        // ----------------------------------------------------------------------// Util Section
        /**
         * Utility 객체
         */
        naon.util = {
            /**
             *  date Input에서 부적절한 값이 입력된 상태에서 focus를 잃는 경우 올바른 값으로 치환해줌.
             *  dateInput요소를 파라미터로 받아 이벤트를 등록하여 처리.
             *
             * 유효한 값 범위는 아래와 같습니다.
             *  year : 1901 ~ 9999
             *  month : 01 ~ 12
             *  day : 01 ~ 해당 연,월에 맞는 마지막 일자
             *
             * 변환되는 경우
             *  0000-00-00 -> 1901-01-01
             *  2021-99-99 -> 2021-12-31
             */
            validDateInput : function(dateInput){
                $(dateInput).blur(function(){
                    // 사용자가 아무것도 입력하지 않은 상태에서 다른곳으로 넘어가면 아무것도 하지 않음
                    var dateValue = $(this).val();
                    if(naon.string.isEmpty(dateValue) || dateValue == '    -  -  '){
                        return ;
                    }

                    var dateDatas = dateValue.split('-');

                    // 연, 월, 일으로 나뉘지 않는경우 아무것도 하지않음
                    if(dateDatas.length != 3){
                        return ;
                    }

                    var year = dateDatas[0].trim();
                    var month = dateDatas[1] == '  ' ? '01' : naon.string.rpad(dateDatas[1].trim(), 2, '0');
                    var day = dateDatas[2] == '  ' ? '01' : naon.string.rpad(dateDatas[2].trim(), 2, '0');

                    if(year <= 1900){
                        year = '1901';
                    }

                    if(month == '00'){
                        month = '01';
                    }
                    else if(month > 12){
                        month = '12';
                    }

                    var lastDay = naon.util.daysInMonth(month, year);
                    if(day == '00'){
                        day = '01';
                    }
                    else if(day > lastDay){
                        day = lastDay;
                    }

                    $(this).val(year+'-'+month+'-'+day);
                });
            },

        	/**
        	 * 조직도 사용자 사진 표시를 위한 함수로 사용자 사진이 없으면 @tmp_man.jpg 경로를 반환함.
        	 */
        	userImgFullPath: function(img) {
        		if(img){
        			return frameworkProperties.context + '/service/file/fileView?fileUrl=' +  img.replace('\\', '/');
        		} else {
        			return frameworkProperties.image_server+'/resources/common/img/@tmp_man.jpg';
        		}
        	},
        	/**
        	 * 조직도 사용자 사진 표시를 위한 함수로 모바일 공통 조직도에서 사용. 사용자 사진이 없으면
        	 * 빈 문자열("")을 반환함.
        	 */
        	userImgFullPath2: function(img) {
        		if(img) {
        		return frameworkProperties.context + '/service/file/fileView?fileUrl=' +  img;
        		}
        		return "";
        	},

            /**
             * 최소값을 반환한다.
             * <pre>
             *
             * var a = 10;
             * var b = 20;
             * var c = naon.util.min(a, b);
             *
             * c의 값은  10 이다.
             *
             * </pre>
             *
             * @param val1  값 1
             * @param val2  값 2
             */
            min : function(val1, val2) {
                if (val1 < val2)
                    return val1;
                else
                    return val2;
            },
            /**
             * 입력값에 최소값을 반환한다.
             *
             * <pre>
             * var a = 10;
             * var b = 20;
             * var c = naon.util.max(a,b );
             *
             * 결과값은 20  이다.
             *
             * </pre>
             * @param val1   값 1
             * @param val2   값 2
             */
            max : function(val1, val2) {
                if (val1 < val2)
                    return val2;
                else
                    return val1;
            },
            /**
             *
             * 숫자값을 반올림한다.
             * TODO : 테스트하고 주석처리할 것
             *
             * @param num
             * @param dec
             */
            max : function(num, dec) {
                var temp = naon.util.decToDigit(dec);
                num = num * temp;
                num = Math.round(num);
                num = num / temp;
                return num;
            },
            decToDigit : function(dec) {
                var temp = 1;
                if (dec >= 1) {
                    for ( var i = 0; i < dec; i++) {
                        temp = temp * 10;
                    }
                } else if (dec < 1) {
                    for ( var i = dec; i < 0; i++) {
                        temp = temp / 10;
                    }
                }
                return temp;
            },


            /**
             * 컬렉션이 비어있는지 확인한다.
             *
             * @param collection 배열
             */
            isEmpty : function(collection) {
                if (!collection)
                    return true;
                if (collection.length == 0)
                    return true;
                return false;
            },

            /**
             * 날자객체를 문자열로 되돌립니다.
             *
             * @date    날자 객체
             * @concatChar 연결문자
             */
            getDateString : function(date, concatChar) {
                return date.getFullYear() + concatChar
                        + naon.string.lpad("" + (date.getMonth() + 1), 2, '0') + concatChar
                        + naon.string.lpad("" + date.getDate(), 2, '0') ;
            },


            /**
             * 날자를 yyyyMMdd 형식으로 되돌린다.
             * 예)  20121010
             *
             */
            getStringFromDate : function(date) {
                var today = date;
                var year  = today.getFullYear();
                var month = today.getMonth() + 1;
                var date  = today.getDate();
                return year.toString() + naon.string.lpad(month.toString(), 2, '0')
                        +  naon.string.lpad(date.toString(), 2, '0');
            },
            cloneDate : function(date) {
                return new Date(date.getTime());
            },
            /**
             * 날자를 더하거나 뺀다.
             *
             * @date  Date Object
             * @field  1. Year, 2. Month, 3. date
             * @val 음수값(-)이 들어오면 이전, 양수값이 들어오면 이후
             *
             */
            addDate : function(date, field, val) {
                if(field == 1) {
                    date.setFullYear( date.getFullYear() + val);
                }else if(field == 2) {
                    date.setMonth(date.getMonth() +  val);
                }else if(field == 3) {
                    date.setDate(date.getDate() + val);
                }
                return date;
            },
            /**
             * 입력된 문자열이 날자 타입이 맞는지 확인한다.
             * @param dateStr 날자 문자열
             *
             */
            validateDate : function(dateStr) {
                dateStr = naon.string.replace(dateStr, "-", "");

                var month = parseInt(dateStr.substring(4,6), 10);
                var year  = parseInt(naon.string.left(dateStr, 4), 10);
                var date  = parseInt(naon.string.right(dateStr, 2), 10);

                if(year < 1970) {
                    return false;
                }

                if(month < 1 || month > 12) {
                    return false;
                }

                if(date < 1 || date > 31) {
                    return false;
                }else {
                    var days = naon.util.daysInMonth(month, year) ;
                    //alert(days);
                    if(date > days) {
                       return false;
                    }
                }
                return true;
            },
            setTime : function(date, hour, minute, second) {
                date.setHours(hour);
                date.setMinutes(minute);
                date.setSeconds(second);
                return date;
            },
            /**
             * 해당 년월의 마지막 일자를 구한다.
             * @param month  월
             * @param year  년
             * @returns
             *      마지막 일자
             */
            daysInMonth: function(month, year) {
                var dd = new Date(year, month, 0);
                return dd.getDate();
            },

            /**
             * GET으로 전달받은 인자와 값을 JSON으로 반환
             *
             * Ex)
             * http://www.example.com/?me=myValue&name2=SomeOtherValue
             *
             * {
    		 *	"me"    : "myValue",
    		 *	"name2" : "SomeOtherValue"
    		 *  }
    		 *
    		 *  var first = naon.util.getUrlVars()["me"];
    		 *
    		 *
             *
             */
            getUrlVars : function() {
                var vars = [], hash;
                var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
                for(var i = 0; i < hashes.length; i++)
                {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
                return vars;
            },

            /**
             *  조건에 맞는 조직 스트링을 만든다.
             *  Ex)naon.util.cnvOrgString("나온소프트",1) --> (나온소프트)
             *
             *
             *  @param str 조직명
             *  @param type 조직유형
             *     1 : (회사명)
             *     2 : {부서명}
             *     3 : 사원은 별도의 규칙
             *     4 : #직위명#
             *     5 : $직책명$
             *     6 : !직무명!
             *     7 : %사용자 그룹명%
             *
             */
            cnvOrgString : function(str,type) {
            	var ret = null;

            	switch (parseInt(type)) {
            		case 1 : // 회사
            			ret = "(" + str + ")";
            			break;
            		case 2 : // 부서
            			ret = "{" + str + "}";
            			break;
            		case 4 : // 직위
            			ret = "#" + str + "#";
            			break;
            		case 5 : // 직책
            			ret = "$" + str + "$";
            			break;
            		case 6 : // 직무
            			ret = "!" + str + "!";
            			break;
            		case 7 : // 사용자그룹
            			ret = "%" + str + "%";
            			break;
            	    default :  ret = str;
        			    break;
            	}

            	return ret;
            },
            /**
             * 페이지가 모두 로드되어있는걸 체크하고 다시 리사이징 한다.
             */
            setResizeIframe : function(iframeId, targetId) {

            	var check = window.setInterval(function(){
            		if (naon.util.isImgLoaded()){
            			naon.util.resizeIframe(iframeId, targetId);
            			window.clearInterval(check);
            		}
            	},50);
            },
            /**
             * 해당 아이프레임을 리사이징 한다.
             * 아이프레임의 하단 내용에서 페이지가 로드될때 실행해야 한다.
             *
             */
            resizeIframe : function(iframeId, targetId) {
            	var body = document.body;

            	var height;
            	var width;

            	if(targetId) {
            		height = document.getElementById(targetId).scrollHeight;
            		width = document.getElementById(targetId).scrollWidth;

            	} else {
            		// TODO : 브라우저에 맞게 계산하는 로직 필요
            		// firefox height
            		if (navigator.userAgent.toLowerCase().indexOf('gecko') > -1 ) {
            			height = window.document.documentElement.scrollHeight;
            			if (height < body.scrollHeight) {
            				height = body.scrollHeight;
            			}
            			width = window.document.documentElement.scrollWidth;

            			if (width < body.scrollWidth) {
            				width = body.scrollWidth;
            			}

            		} else {
            			height = body.scrollHeight;
            			width = body.scrollWidth;

            		}

            	}


            	if(!iframeId ) {
            		if(!parent) {
            			alert("부모창이 존재하지 않습니다.");
            			return;
            		}


            		// id를 몰라도 자동으로 찾아서 설정할 수 있는 방법이 없을까
            		var url = location.href;

            		var iframes = parent.document.getElementsByTagName("iframe");

            		for (var i = 0; i < iframes.length; i++) {
            			// id파라미터가 없다면 현재 페이지와 부모창의 iframe중 src경로가 같은 경우에 해당 id가 맞는거라고 처리
            			if(iframes[i].src == url) {
            				iframeId = iframes[i].id;
            				break;
            			}
            		}
            	}


            	var iframe = parent.document.getElementById(iframeId);

            	if (!iframe) {
            		alert("iframe을 찾을 수 없습니다.");
            		return;
            	}

            	if(height > 0) {
            		iframe.height = height + "px";
            	}
            	if(width > 0) {
            		iframe.width = width + "px";
            	}
            },
            /**
             * 페이지의 이미지가 모두 로딩이 완료 했는지 체크한다.
             */
            isImgLoaded : function() {
            	var imgs = document.getElementsByTagName("img");

            	for (var i = 0; i < imgs.length; i++) {
            		if (!imgs[i].complete) {
            			if (navigator.userAgent.indexOf('MSIE') > -1) {
            				if(imgs[i].readyState == "uninitialized") {
            					continue;
            				}
            			}
            			return false;
            		}
            	}

            	return true;
            },
            /**
             * iframe영역만 프린트한다.
             */
            printIframe : function(iframeId) {
            	frames[iframeId].focus();
            	frames[iframeId].print();
            },
            /** dummy function */
            dummy : function() {
                // not used
            },
            cleanXSSByBlockingTag : function(value) {
    			if(value != '') {
    				value = naon.string.replace(value, "<" , "&lt;");
    				value = naon.string.replace(value, ">" , "&gt;");
    				value = naon.string.replace(value, "\"" , "&quot;");
    				//value = naon.string.replace(value, "," , "."); //57155 이름명에 쉼표들어가는 오류수정
    				//value = naon.string.replace(value, " ", "&nbsp;");
    				value = naon.string.replace(value, "," , "&#44;"); 
    			}
    			return value;
    		},
    		/**
    		 *
    		 */
    		strNumToFileSize : function(num, fixed) {
    			var ret = "";
    			var bias = 1024;
    			num = parseInt(num,10);
    			if (num < bias) {
    				ret = num.toFixed(fixed) + "Byte";
    			} else if (num >= bias && num < (bias * bias)) {
    				ret = (num / bias).toFixed(fixed) + "KB";
    			} else if (num >= (bias * bias) && num < (bias * bias * bias)) {
    				ret = (num / (bias * bias)).toFixed(fixed) + "MB";
    			} else if (num >= (bias * bias * bias) && num < (bias * bias * bias * bias)) {
    				ret = (num / (bias * bias * bias)).toFixed(fixed) + "GB";
    			} else if (num >= (bias * bias * bias * bias) && num < (bias * bias * bias * bias * bias)) {
    				ret = (num / (bias * bias * bias * bias)).toFixed(fixed) + "TB";
    			} else if (num >= (bias * bias * bias * bias * bias) && num < (bias * bias * bias * bias * bias * bias)) {
    				ret = (num / (bias * bias * bias * bias * bias)).toFixed(fixed) + "PB";
    			}

    			return ret;
    		},
    		strNumToSize : function(num, fixed) {
    			var ret = "";
    			var bias = 1024;

    			if (num < bias) {
    				ret = num.toFixed(fixed) + "Byte";
    			} else if (num >= bias && num < (bias * bias)) {
    				ret = (num / bias).toFixed(fixed) + "KB";
    			} else if (num >= (bias * bias) && num < (bias * bias * bias)) {
    				ret = (num / (bias * bias)).toFixed(fixed) + "MB";
    			} else if (num >= (bias * bias * bias) && num < (bias * bias * bias * bias)) {
    				ret = (num / (bias * bias * bias)).toFixed(fixed) + "GB";
    			} else if (num >= (bias * bias * bias * bias) && num < (bias * bias * bias * bias * bias)) {
    				ret = (num / (bias * bias * bias * bias)).toFixed(fixed) + "TB";
    			} else if (num >= (bias * bias * bias * bias * bias) && num < (bias * bias * bias * bias * bias * bias)) {
    				ret = (num / (bias * bias * bias * bias * bias)).toFixed(fixed) + "PB";
    			}

    			return ret;
    		},
    		/**
    		 * 확장자 체크
    		 * @param val 체크할 확장자명
    		 * @param limitExtArr 허용된 확장자 배열
    		 */
    		chkExt : function (val,limitExtArr) {
    		    var len = limitExtArr.length;
    		    for (var i=0; i < len; i++) {
    		        if (limitExtArr[i] == val) return true;
    		    }
    		    return false;
    		},

    		/**
    		 * ie버전을 반환.
    		 * ie가 아니면 -1반환.
    		 */
			ieVersion: function(){
				if(typeof this.ieVer != 'undefined') {
					
					return this.ieVer;
				}
				var rv = -1;
				if (navigator.appName == 'Microsoft Internet Explorer')
				{
					var ua = navigator.userAgent;
					var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
					if (re.exec(ua) != null) {
						rv= parseFloat( RegExp.$1 );
					}
				} else if (navigator.appName == 'Netscape') {
					var ua = navigator.userAgent;
					var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
					if (re.exec(ua) != null) {
						rv = parseFloat( RegExp.$1 );
					}
				}
				this.ieVer = rv;

				return rv;
			},
			
			/**
			 * 글로벌타임 기준의 시간을 가져온다
			 * */
			globalTime : function(date){
				var timeDiff = -loginConfig.timeDiff; // 글로벌타임 적용
				var today = new Date(date.getTime() + (1000*60*60) * timeDiff);
				return today;
			},
			
			/**
			 * 글로벌타임의 서버 기준의 시간을 가져온다  
			 * 
			 * */			
			globalTimeToServer : function(date){
				var timeDiff = loginConfig.timeDiff; // 글로벌타임 적용
				var today = new Date(date.getTime() + (1000*60*60) * timeDiff);
				return today;
			},
					
			/**
			 * 나온브라우저 여부를 반환한다.(웹메신저 브라우저)
			 * */
			isNaonWebBrowser : function(){
				if(/NaonBrowser/.test(navigator.userAgent)) return true;
				return false;
			},
			
			/**
			 * 문자열 파일정보 parser 후 배열로 변환한다.
			 * */
			fileStrToFileInfo: function(fileInfoStr){
				if(!fileInfoStr){
					return null;
				}else{
					var fileList = [];
					var fileInfoArr = fileInfoStr.split('｜');
					$.each(fileInfoArr,function(i, fileStr){
						var fileStrArr = fileStr.split('＾');
						if(fileStrArr.length != 3) {
							return;
						}

						var fileUrl = fileStrArr[2];
						var urlArr = fileUrl.split('/');
						var fileName = urlArr[urlArr.length-1];
						fileUrl = fileUrl.replace("/"+fileName,'');

						fileList.push({
							realFileName: fileStrArr[0],
							localFileName: fileName,
							fileSize: Number(fileStrArr[1]),
							fileUrl: fileUrl,
							cud: 0
						});
					});
					
					return fileList;
				}
			},
			/** 중복제거 배열 반환. */
			uniqueArray: function(a) {
				var len = a.length
				var out = [];
				if(len>0) {
					var seen = {};
					for(var i = 0,j = 0; i < len; i++) {
						var item = a[i];
						if(seen[item] !== 1) {
							seen[item] = 1;
							out[j++] = item;
						}
					}
				}
				return out;
			},
			
		 	// 모바일 url 접속 여부
		 	isMobileUrl : function() {
		       	 var dns = document.location.href; //<-- 현재 URL 얻어온다
		    	 var arrDns = dns.split("//"); //<-- // 구분자로 짤라와서
		    	 //현재 도메인
		    	 var _nowDomain = arrDns[1].substring(0,arrDns[1].indexOf("/")); //<-- 뒤에부터 다음 / 까지 가져온다 
		    	 
		    	 return _nowDomain == frameworkProperties.mobileDomain
		 	},
			/** port체크. */
			getUrl : function(){
				var getUrl = ''
				if(window.location.port != 80){
					getUrl = window.location.host;
				}else{
					getUrl = window.location.hostname;
				}
				return getUrl;
 			},
 			/** 문자에 색상을 부여해서 반환. */
 			stringToColorCode: function(str) {
 				var hash = 0;
 				for (var i = 0; i < str.length; i++) {
 					hash = str.charCodeAt(i) + ((hash << 5) - hash);
 				}
 				var color = '#';
 				for (var i = 0; i < 3; i++) {
 					var value = (hash >> (i * 8)) & 0xFF;
 					value = 0|(1<<8) + value + (256 - value) * 30 / 100;
 					color += ('00' + value.toString(16)).substr(-2);
 				};
 				return color;
 			},
 			/** 문자에 해당하는 색상 css명을 반환. */
 			stringToColor: function(str) {
				var hash = 0;
				for (var i = 0; i < str.length; i++) {
					hash = str.charCodeAt(i) + ((hash << 5) - hash);
				}
				var num = (Math.abs(hash)%7) +1;
				return 'thmb_' + num;
 			},
 			/** 이름의 첫글자를 반환. */
 			firstCharOfName: function(name) {
 				if(!name) return ' ';
				return (name.replace(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g,'').replace(/[\u200B-\u200D\uFEFF]/, '') || name || ' ').charAt(0);
 			},
 			/** 특정날짜와 비교해서 같은 부분 제거해서 반환. */
 			shortenDateTime: function(date, today) {
 				var dn= date.length, tn = today.length;
 				if(dn > tn+1) {
 					if(date.substring(0, tn) == today) {
 						return date.substring(tn+1);
 					} else {
 						if(date.substring(0, 4) == today.substring(0, 4)) {
 							return date.substring(5);
 						} else {
 							return date;
 						}
 					}
 				}
 				return date;
 			},
 			
 			/** 특정날짜와 비교해서 같은 부분 제거해서 반환. */
 			shortDateFormatTime: function(date, today) {
 				var dn= date.length, tn = today.length;
 				if(dn > tn+1) {
 					if(date.substring(0, tn) == today) {
 						return date.substring(tn+1);
 					} else {
 						if(date.substring(0, 4) == today.substring(0, 4)) {
 							return date.substring(5,tn);
 						} else {
 							return date.substring(0,tn);
 						}
 					}
 				}
 				return date;
 			}
		 	
        };

        // -------------------------------------------------------------------------- JSON Section
        /**
         * JSON 처리
         */
        naon.json = {
            /**
             * 데이타 객체를 쿼리스트링으로 변환합니다.
             *
             * <pre>
             *
             * var json = { name : "kim", age : 10 };
             * var str = naon.json.toQueryString(json);
             *
             * 결과값은 다음과 같다.
             *
             * "&name=kim&age=10"
             *
             * </pre>
             * @param dataObject 데이타 객체
             */
            toQueryString : function(dataObject) {
                var result = "";
                for ( var prop in dataObject) {
                    result += "&" + prop + "=" + dataObject[prop];
                }//for
                return result;
            },
            /**
             *
             * JSON 객체를 문자열로 변환한다.
             *
             * <pre>
             *
             * var jsonObject = new Object();
             * jsonObject.name = "kim";
             * jsonObject.age = 10;
             *
             * var convertedString = naon.json.getJSONString(jsonObject);
             *
             * 결과값은 다음과 같다.
             *
             * {name:"kim", age : 10 }
             *
             * </pre>
             *
             *  @param object
             */
            getJSONString : function(object) {
            	//return $.toJSON(object);
                return JSON.stringify(object);  // 객체를 JSON 문자열로 반환 
            },
            /** dummy function */
            dummy : function() {
                // not used
            }
        };

        // -------------------------------------------------------------------------- HTTP Section
        naon.http = {

            /**
             *    AJAX 통신 함수, jQuery의 $.ajax() 함수의 래핑 함수입니다.  호출방법은 아래와 같습니다.
             *
             *   var options = {
             *            url : "/inc/guide/guideUserList",
             *            sendDataType : "json", // default
             *            contentType:"application/json", 
             *            dataType : "html",
             *            target : document.body, // loading bar 표시위치
             *            type : "post",
             *            success : function(htmlRes, statusText) {
             *                    naon.doc.writeHtml(htmlRes, "userListDiv");
             *            }// success
             *   }; // optionsuide
             *
             *   naon.http.ajax(options);
             *
             *   자세한 사용방법은 화면개발가이드를 참조하세요.
             *
             *
             *    호출할때 파라미터로 넘기는 파라미터는 { } 표기법을 사용하여 넘기면 됩니다. 파라미터는 jQuery의
             * 파라미터 이름을 사용하고 추가적으로 정의된 파라미터가 존재합니다. 아래는 파라미터에 대한 설명입니다.
             *
             *    acceepts
             *       어떤 응답을 보낼지 서버에게 알리기 위해 Request Header에 보내는 content type이다.
             *       accetps setting의 수정이 필요하면, $.ajaxSetup()을 메소드를 사용한다.
             *    async
             *       디폴트로, 모든 요청은 비동기로 보내진다. 디폴트로 true 값이 설정된다.  동기식 요청을 보내고
             *       싶으면 false 값을 설정한다.  Cross-domain 요청과 dataType:"jsonp" 요청은 동기식을 지원하지
             *       않는다.
             *
             *    beforeSend(jqXHR, settings)
             *        요청전 callback function은 그것이 전송되기 전에  jqXHR을 수정할 수 있다.
             *    cache
             *        기본값은 true 이다. dataType 'script'와  'jsonp'을 위해서는 false을 설정한다.  false로
             *        설정하면 브라우져는 cache를 하지 않는다.
             *    complete(jqXHR, textStatus)
             *        요청이 완료되었을 때 실행되는 함수이다. success와 error callback들이 실행된 이후에 실행
             *        된다. textStatus에 전달되는 값은 다음과 같다.
             *        "success", "notmodified", "error", "timeout", "abort", or "parsererror"
             *
             *    contents
             *        string/정규식 쌍의 map이다. 이것은 jQuery가 response을 그것에 주어진 content type으로 파싱
             *        하는 방법을 결정한다.
             *    contentType
             *        데이터가 서버로 전송될 때 content-type이 사용된다.  기본값은 "application/x-www-form-urlencoded"
             *        인 데, 그것은 대부분의 경우에 좋다. 데이터는 항상 UTF-8 charset을 사용해서 서버로 전송된다.
             *        적절히 서버에서 decode 해야 한다.
             *        
             *        서버에 queryString이 아닌 JSON 문자열을 그대로 보내고 싶은 경우에는 
             *        application/json으로 설정한다. 
             *    context
             *        설명을 나중에 추가
             *    converters
             *       기본값 : {"* text": window.String, "text html": true, "text json": jQuery.parseJSON, "text xml": jQuery.parseXML}
             *       응답의 값을 변경하기 위한 함수를 반환한다.
             *
             *    crossDomain
             *       생략
             *    data
             *       서버로 전송될 데이터.
             *    dataFilter(data, type)
             *        생략.
             *    dataType (※주의 : $.ajax에서 사용하는 option을 제어할수는 없다.)
             *       서버로 부터 되돌려 받을 데이터 타입. 값이 정해지지 않으면 MIME 타입을 이용한다.
             *       다음의 값을 사용할 수 있다. xml,"html","script","json","jsonp""text", "file"
             *    error(jqXHR, textStatus, errorThrown)
             *       요청이 실패하면 호출되는 함수이다. textStatus에 허용되는 값은 null을 포함하여
             *       "timeout", "error", "abort", "parsererror" 이다. HTTP error가 발생하면 errorThrown은
             *       HTTP의 문자열 상태값 "Not Found", "Internal Server Error" 와 같은 값을 받는다.
             *    global
             *       생략.
             *    headers
             *        key/value 쌍의 맵. 요청과 함께 서버로 보내진다.  beforeSend 함수가 호출되기 전에 설정된다.
             *    ifModified
             *        생략
             *    isLocal
             *        생략
             *    jsonp
             *        jsonp 요청에서 jsonp callback function 이름을 오버라이드 한다.  추가적인 설명 필요 .
             *    jsonpCallback
             *        JSONP 요청에 대한 callback function 이름을 명시한다.
             *    mimeType
             *        XHR mime thype을 오버라이드 할 mime type.
             *    password
             *        HTTP access authentication 요청에서 사용되는 패스워드.
             *    processData
             *        생략.
             *    scriptCharset
             *        생략.
             *    statusCode
             *        numeric HTTP code들의 맵이다.
             *
             *        $.ajax({
             *            statusCode: {
             *               404: function() {
             *                    alert('page not found');
             *               }
             *           }
             *        });
             *
             *    success(data, textStatus, jqXHR)
             *       요청이 성공했을 때 호출되는 함수이다.
             *    timeout
             *       요청에 대한 타임아웃을 밀리세컨드로 설정한다.
             *    traditional
             *       생략.
             *    type
             *        디폴트는 GET이다.  POST 또는 GET으로 설정. 다른 메소드인  PUT , DELETE도 여기서 사용될 수
             *        있다.
             *    url
             *        요청을 보낼 URL.
             *    username
             *        HTTTP access authentication 요청에서 사용할 사용자 이름.
             *    xhr
             *       XMLHttpRequest 객체를 생성할 콜백.
             *    xhrFields
             *       생략.
             *    target
             *       로딩이미지가 표시될 영역이 될 요소를 정의한다. document.body 처럼 요소를 직접써도 되고,
             *       jQuery의 selector를 사용할 수 있다.  예를들어 .contents 는  class=".contents" 가 적용된
             *       요소를 선택한다.
             *    errorProcType
             *       에러 처리 방법. 에러가 발생하면 alert로 띄울지 아니면 html을 되돌릴지를 결정한다. 사용자
             *       정의 callback에는 별도로 처리하고 시스템에서 처리하는 방법을 명시.
             *
             *       시험중.
             *
             */
            ajax : function(opts) {
                // default options
                var settings = {
                    url : "",
                    target : document.body,
                    errorProcType : "alert", // 에러처리 방식 alert, html
                    data : {}, // 요청 데이터
                    success : function() {
                    }, // 응답성공시 실행할 함수
                    error : function(xhr, statusText) {
                       //alert($.toJSON(xhr));

                    }, // 에러발생시 실행할 함수
                    dataType : "json",                 //  응답데이터 유형  json, xml, html, script, json, jsonp, text, file
                    type : "post",                       // 전송방법 기본값  post, (get/post),  
                    sendDataType : "undefined",
                    contentType : "undefined",     //default: application/x-www-form-urlencoded;charset=UTF-8
                                                           // contentType="application/json"인 경우에는 type:"post"로 설정해야 함.
                    blind : false, // '잠시만 기다려 주세요' 표시 유무, 기본은 보여 줌.  커스텀 옵션
                    modal : false, //반투명한 검은색 레이어 표시
                    scriptCashe: true,
                    showLoadingImg : true //로딩 이미지 표시 유무
                };

                // history에 해당 값 추가
                /*if(opts.history && opts.url && opts.url.indexOf("insert") == -1 && opts.url.indexOf("update") == -1) {
                	naon.history.addHistory(opts);
                }*/

                $.extend(settings, opts);

//                if(settings.contentType!="undefined"){
//                	settings.url = frameworkProperties.context + naon.string.trim(settings.url);
//                }else

                // 서버 프레임워크에서 에러발생시 처리방법을 결정하기 위해 _REQ_DATA_TYPE_  에
                // dataType을 값을 설정함.
                // 서버에서 useWrappedObject가 true인 경우에는 ResponseData.class를 사용하여 오류정보를 반환함.
                // 브라우져에서 REQ_DATA_TYPE, USE_WRAPPED_OBJECT의 값을 전달하면 
                // 에러처리에 대한 공통 로직을 사용할 수 있음.
                // jquery plugin 중에서 dynatree 혹은 다른 plugin에서 자체적으로 ajax 통신을 하는 경우에는
                // 이 두개의 파라미터 값이 없으므로 에러처리 공통 로직을 사용하지 않음. 
                if (settings.url.search(/^http[s]?\:\/\//) == -1) {
                    settings.url = frameworkProperties.context + naon.string.trim(settings.url);
                }

                //settings.url +=  "&ajax=true";
                //alert(settings.url);
                //alert(settings.async);

                
                // make the request data.
                // setttings.data == "object"이면 JSON 객체임.  JSON객체를 문자열로 변환해야 함.   JSON.stringify를 사용하는 것으로 통일
                // JSON 객체는 문자열로 변환하여야 함.   naon.json.getJSONString() 함수를 사용함.
                // 나머지는 변환하지 않고 $.ajax()에 넘겨 줌.
             
                var sendData;
                if(settings.contentType!="undefined"){
                    sendData = (typeof settings.data == "object")  ? naon.json.getJSONString(settings.data) : settings.data;
                } else if (settings.sendDataType == "json") {
                    sendData = (typeof settings.data == "object")  ? naon.json.getJSONString(settings.data) : settings.data;
                    sendData = "__REQ_JSON_OBJECT__=" + encodeURIComponent(sendData);
                } else {
                    sendData = settings.data;
                }
                
                // make the default timeout value.
                var timeoutValue = (settings.timeout) ? settings.timeout : 60000; // default 10초
                // make a loading image
                var ctime = new Date().getTime();
                var randomVal = Math.floor(Math.random() * 100) + 1;
                var divId = "DIV" + ctime + "_" + randomVal;

                //####### file download의 경우 #############
                if (settings.dataType == 'file') {
                	
                	// 안드로이드 일 경우 httpMethod를 'get'으로 변환, 아닐 경우 setting.type을 따라간다.
                	var userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
                	var httpMethod = userAgent.indexOf('android') !== -1 ? 'get' : settings.type; 
                	
                	if (opts.url.search(/^http[s]?\:\/\//) == -1) {
                        opts.url = frameworkProperties.context + opts.url;
                    }
                	
                    var fileDwReq = $.fileDownload(opts.url,
                    	{
                    		data: sendData,
                    		httpMethod: httpMethod,
                    		prepareCallback: function(){
                    			if(opts.prepare){
                    				opts.prepare();
                    			}
                    		},
                    		successCallback: function (url) {
                    			if (opts.success) {
                    				opts.success();
                    			}
                    		},
                    		failCallback: function (html, url) {
                    			if (opts.error) {
                    				opts.error();
                    			}
                    			if (opts.errorMsg) {
                    				opts.errorMsg($(html).text());
                    			}
                    		},
                    	failMessageHtml: common_naonjs_message_download // 다운로드에 실패했습니다.
                    	}
                    );
                    return fileDwReq;
                }
                //####### download가 아닌 경우 #############
                var options = {
                    url : settings.url, // 요청URL
                    async : settings.async, // 동기식
                    data : sendData,
                    headers: settings.headers,
                    // -------------------------------------------------------------beforeSend
                    beforeSend : function(xhr) {
                    	if(settings.beforeSend) {
                    		settings.beforeSend(xhr);
                    	}
                    	var target = (typeof settings.target == "string") ? $(settings.target).get(0) : settings.target;
                    	
                    	if($(target).length == 0){
                        	target = document.body;
                        }
                    	
                    	
                    	xhr.setRequestHeader("naonAjax",settings.dataType); //서버에서 ajax통신중 발생하는 오류를 인식하기 위해
                        // before sending a request, display the loading image.                       
                        var newDiv = document.createElement("div");
                        newDiv.id = divId;
                        
                        $(target).append(newDiv);                                         
                        $("#" + divId).addClass("loading_lyr");                                                
                        
                        var html = "";
                        if(settings.blind){
                        	html = "<div class=\"msg_box\">"	
           					 + "  <span>" +  common_naonjs_message_wait + "</span>" // 잠시만 기다려 주세요
           			         + "</div>"
           			         + "<div class=\"blind\"></div>";
                        }else if(settings.modal){
                        	html = "<div class=\"blind\"></div>";
                        }else if(settings.showLoadingImg){
                        	html = "<div class=\"img_box\"><span>" +  common_naonjs_message_wait + "</span></div>";
                        }
                        
                        $("#" + divId).append(html);
                                                                     
                        /*var target = (typeof settings.target == "string") ? $(settings.target).get(
                                0) : settings.target;
                        var rect = naon.ui.getBounds(target);
                        var offset = $(target).offset();
                        
                        $("#" + divId).css("visibility", "visible");
                        $("#" + divId).css("top", offset.top);
                        $("#" + divId).css("left", offset.left);
                        $("#" + divId).css("position", "absolute");
                        // added by
                        $("#" + divId).css("width", rect.width);
                        $("#" + divId).css("height", rect.height);
                        $("#" + divId).css("text-align", "center");
                        // TODO : 이미지 경로?
                        $("#" + divId).css(
                                {
                                    backgroundImage : "url('"+frameworkProperties.context +"/resources/biz/common/img/loading.gif')",
                                    backgroundRepeat : "no-repeat",
                                    backgroundPosition : "50% 50%"
                                });*/                        
                    }, // the end of beforeSend
                    // ------------------------------------------------------------- success
                    success : function(responseData, statusText) {
                	    
                        $("#" + divId).remove(); // delete the loading image.
                        
                        if (!responseData) {
                            return;
                        }// 응답데이타가 없다면 아무것도 하지 않음. 어떻게 하지?

                        var resObject = responseData;

                        if(resObject.encrypt){
                        	resObject = JSON.parse(Base64Encoder.decode(Base64Encoder.decode(Base64Encoder.decode(resObject.encrypt.replace(SHA256('naonSen'),'').replace(SHA256('naonEen'),'')))));
                        }
                        
                        //server framework에서 반환하는 구조확인
                        if (resObject.responseCode) {
                        	if (parseInt(resObject.responseCode) == 0) {
                        		if (settings.success) {
                        			//메뉴 이동이 전체화면 로드로 변경하였기 때문에 exception처리를 제외한다.
                        			settings.success(resObject, statusText);
                                }
                            } else if (parseInt(resObject.responseCode) == 999) { //세션없다면
                            		
                            	var goUrl = "";
                            	if(naon.util.isMobileUrl()) {
                            		if(navigator.userAgent.indexOf('mobileApps') > 0){
                            			goUrl = frameworkProperties.context +"/common/error/mobileJwtError.jsp?errCode=999";
                            		}else{
                            			goUrl = frameworkProperties.context +"/common/error/mobileLoginFail.jsp";                            			
                            		}
                            	} else{
                            		goUrl = frameworkProperties.context +"/common/error/loginFail.jsp";
                            	}
                                	
                            	if(opener){
                            		document.location.href = goUrl;
                            	}else if(parent){
                            		parent.document.location.href = goUrl;
                            	}else{
                            		document.location.href = goUrl;
                            	}
                                	
                            	return;
                            	//BaseMultiActionController => @ExceptionHandler 를 거쳐서 여기로 옴
                            } else if (parseInt(resObject.responseCode) <= 900 && parseInt(resObject.responseCode) >= 600) { //커스텀 에러 처리
                            	var param = "";
                            	var goUrl = "";
                            	if(resObject.responseText.indexOf("|")>-1){
                            		goUrl = frameworkProperties.context +"/common/error/"+resObject.responseText.split("|")[0]+".jsp"+resObject.responseText.split("|")[1];
                            	}else{
                            		goUrl = frameworkProperties.context +"/common/error/"+resObject.responseText+".jsp"+param;
                            	} 
                                	
                            	if(opener){
                            		document.location.href = goUrl;
                            	}else if(parent){
                            		parent.document.location.href = goUrl;
                            	}else{
                            		document.location.href = goUrl;
                            	}
                                	
                            	return;
                            } else if (parseInt(resObject.responseCode) == 500) {
                            	if (settings.errorProcType == "alert") {
                            		//alert("시스템 오류입니다.\n" + resObject.systemError);    // TODO :다국어 처리 필요
                            		if(naon.util.isMobileUrl()) { //모바일 페이지라면
                            			location.replace(frameworkProperties.context +"/common/error/mobileError.jsp");
                            		} else{
                            			naon.ui.showAjaxError(resObject);
                            			settings.error(resObject, statusText);
                            		}
                            	} else if(settings.errorProcType == "error"){	// ajax error function call
                            		settings.error(resObject, statusText);
                            	}
                            }  else if (parseInt(resObject.responseCode) == 9999){
                            	if (settings.errorProcType == "alert") {
                            		if(naon.util.isMobileUrl()) { //모바일 페이지라면
                            			location.replace(frameworkProperties.context +"/common/error/mobileError.jsp?responseText=" + encodeURIComponent(resObject.responseText.replace(/(<br>|<br\/>|<br \/>)/g, '')));
                            		} else{
                            			naon.ui.showAjaxError2(resObject);
                            			settings.error(resObject, statusText);
                            		}
                            	} else if(settings.errorProcType == "error"){	// ajax error function call
                            		settings.error(resObject, statusText);
                            	}
                            } else {
                            	if (settings.errorProcType == "alert") {
                            		if(naon.util.isMobileUrl()) { //모바일 페이지라면
                            			location.replace(frameworkProperties.context +"/common/error/mobileError.jsp?responseText=" + encodeURIComponent(resObject.responseText));
                            		} else{
                            			naon.ui.showAjaxError(resObject);
                            			settings.error(resObject, statusText);
                            		}
                            	} else if(settings.errorProcType == "error"){	// ajax error function call
                            		settings.error(resObject, statusText);
                            	}
                            }
                        }else {
                        	//메뉴 이동이 전체화면 로드로 변경하였기 때문에 exception처리를 제외한다.
                        	settings.success(responseData, statusText); // callback 함수 직접 호출
                        }
                    },
                    // 통신오류
                    error : function(xhr, statusText) {

                    	$("#" + divId).remove();
                    	
                    	//ajax 호출중 페이지 이동시 오류창 표시안해야 됨 (리턴값: status값 0,statusText값이 error),호출취소시 오류표시 안함.
                    	if(xhr.readyState == 0 && xhr.status == 0 && (statusText == 'error' || statusText == 'abort' )){
                    		return;
                    	}

                        if (settings.error) {
                            if (settings.errorProcType == "alert") {
                                //alert("statusText=====::::=" + statusText);


                                //alert("xhr.status=" + xhr.status);


                                var errCode = xhr.status;
                                var errMsg = "";
                                // TODO : 다국어 처리
                                
                                alert(errCode);
                                
                                switch (xhr.status) {
                                //문제점 : 서버 접속이 안될 경우와 ajax호출중 페이지 이동시 동일한 응답(status:0)이 오므로 메세지 처리가 불가능
                                //case 0:
                                //    errMsg = "서버에 접속할 수 없습니다."; 
                                //    break;
                                case 404:
                                    errMsg =  common_naonjs_message_404; // "요청하신 페이지를 찾을 수 없습니다.";
                                    break;
                                case 500:
                                    errMsg =  common_naonjs_message_500; //  "서버에서 오류가 발생했습니다.";
                                    break;
                                case 408:
                                    errMsg =  common_naonjs_message_408; //   "서버로 부터 응답이 없습니다(Timeout).";
                                    break;
                                default:
                                    errMsg =  common_naonjs_message_unknown;  //   "알수없는 오류가 발생했습니다.";
                                    break;
                                }
                                
                                switch (xhr.statusText) {
                                case 'timeout':
                                	errMsg = common_naonjs_message_timeout; //    "지정된 응답 시간을 초과했습니다. ("+timeoutValue/1000+"초)";
                                	break;
                                }
                                
                                var resObject = {
                                    reqURL : settings.url,
                                    responseCode : errCode,
                                    responseText : errMsg,
                                    systemError : '수신된 서버의 오류 메시지가 없습니다.'
                                };

                                if(naon.util.isMobileUrl()) { //모바일 페이지라면
                                	location.replace(frameworkProperties.context +"/common/error/mobileError.jsp");
                            	} else{
                            		naon.ui.showAjaxError(resObject);
                                    settings.error(xhr, statusText);
                            	}                      
                            } else if(settings.errorProcType == "error"){	// ajax error function call
                        		settings.error(resObject, statusText);
                        	}
                        }
                    },
                    type : settings.type, // POST / GET
                    timeout : timeoutValue,
                    complete : function(xhr) {
                        // 호출이 안되는 이유는???
                    }
                };


                //alert("url=" + settings.url);
                if(settings.contentType!="undefined"){
                	var addOption = {"contentType":settings.contentType};
                	$.extend(options,addOption);
                }
                
                if(settings.complete){
                	var addOption = {"complete":settings.complete};
                	$.extend(options,addOption);
                }
                
                $.ajaxPrefilter("script", function (s, o, jqXHR) {
                	s.cache = settings.scriptCashe;
                });

                return $.ajax(options);
            },
            /**
             * ajax에 대한 history를 관리한다.
             * @deprecated
             */
            history : {
            	state : [],
            	/**
            	 * 신규 히스토리를 추가한다.
            	 */
            	addHistory : function(opts) {
            		this.makeHash(opts);
        			location.hash = opts.hash;
        			// 맥시멈 히스토리 숫자는 50으로 제한한다.
        			if (this.state.length >= 50) {
        				this.state.shift();
        			}
        			if (opts.data) {
        				// parameter data call by address 방지
        				opts.data = $.extend({}, opts.data);
        			}
        			this.state.push(opts);
            	},
            	/**
            	 * 주소내 hash url이 변경될시 동작하는 이벤트
            	 */
            	hashChange : function(evt) {
            		// 히스토리 내에서 데이터 검색
            		if (evt && (!location.hash || location.hash == "#")) {
            			evt.preventDefault();
            		}

            		var opts = this.findHistory(location.hash);
            		// TODO : 새로고침인경우 히스토리를 찾아낼 수 있는 로직 필요
            		if (opts && (opts.restore || (opts.hash != this.state[this.state.length - 1].hash))) {
            			opts.history = false; // 무한루프 방지
            			opts.restore = false;
            			this.moveLastOrder(opts);

            			// 다이얼로그 열려있으면 모두 닫음
            			try{
            				$(".ui-dialog .ui-dialog-content").dialog("close");
            			} catch(e) {
            				//console.info("닫다가 에러났어요" + e.message);
            			}

            			naon.http.ajax(opts);

            			var ifName = opts.callName;
            			if (!ifName) {
            				var ifNameArr = opts.url.split("/");
            				ifName = ifNameArr[ifNameArr.length - 1];
            			}

            			var param = {type : ifName, data : opts, evt : evt};
            			// 사용자 커스터마이징 이벤트 호출
            			ObserverControl.notifyObservers(param);
            		}
            	},
            	/**
            	 * 히스토리를 구분할 키를 생성한다.
            	 */
            	makeHash : function(opts) {
            		var hash = "#" + encodeURIComponent(opts.url) + "!" + Date.now();
            		opts.hash = hash;
            	},
            	/**
            	 * 모든 히스토리를 초기화한다.
            	 */
            	removeHistory : function() {
            		this.state = [];
            	},
            	/**
            	 * 히스토리 오브젝트를 찾아서 리턴한다.
            	 */
            	findHistory : function(hashCode) {
            		for (var i = 0; i < this.state.length; i ++) {
            			if (this.state[i].hash == hashCode) {
            				return this.state[i];
            			}
            		}
            	},
            	/**
            	 * 히스토리를 쿠키 및 스토리지에 저장해놓는다
            	 */
            	historyLocalSave : function() {
            		var stateList = [];
            		for (var i = 0; i < this.state.length; i++) {
            			var state = this.state[i];
            			// function string으로 치환 해서 저장
            			state.success = this.state[i].success.toString();
            			stateList.push(state);
            		}
            		if (typeof(Storage) !== "undefined") {
            			// html5 localStorage 저장
            			sessionStorage.state = JSON.stringify(stateList);
            		} else {
            			// cookie 저장
            			// cookie max size가 4kb여서 history 데이터가 잘릴 가능성이 매우 큼.
            			naon.http.setCookie("state", JSON.stringify(stateList));
            		}
            	},
            	/**
            	 * 스토리지 및 쿠키에 저장되있는 히스토리 정보를 복원시킨다.
            	 */
            	restoreLocalSave : function() {
            		var stateList = [];

            		if (typeof(Storage) !== "undefined") {
            			// html5 localStorage 저장
            			if(sessionStorage.state){
            				stateList = JSON.parse(sessionStorage.state);
            			}
            		} else {
            			// cookie
            			stateList = JSON.parse(naon.http.getCookie("state"));
            		}

            		for (var i = 0; i < stateList.length; i++) {
            			// function string을 다시 function으로 변환
            			eval("stateList[" + i + "].success = " + stateList[i].success);
            		}

            		naon.http.history.state = stateList;
            	},
            	/**
            	 * 현재 히스토리 오브젝트를 맨 마지막 순위로 변경시킨다. 로직 재호출 방지용.
            	 */
            	moveLastOrder : function(opts) {
            		for (var i = 0; i < this.state.length; i ++) {
            			if (this.state[i].hash == opts.hash) {
            				this.state.splice(i, 1);
            				this.state.push(opts);
            			}
            		}
            	}
            },
            /**
             * cookie 값을 설정한다.
             *
             * <pre>
             *
             * 1) 쿠키값만 설정할 경우
             *     naon.http.setCookie('myCookie", 1111);
             *
             * 2) 쿠키값 및 만료일을 설정할 경우
             *
             *     var expDate = new Date();
             *     // 현재시간 + 1일로 만료시간 설정
             *     expDate.setTime(ExpDate.getTime() * 1000 * 60 * 60 * 24);
             *     naon.http.setCookie('myCookie', 1111, expDate);
             *
             * </pre>
             *
             * @param name     쿠키이름
             * @param value    쿠키값
             * @param expries  쿠키설정무효화 시간(생략가능)
             *                  millisecond 이므로 계산하기 쉽게 1000을 곱하면 됨.
             *                  (하루는 24시간) * (1시간은 60분) * (1분은 60초) * (밀리세컨 1000)
             *                  1) 1시간을 설정
             *                      1 * 60 * 60 * 1000
             *                  2) 하루를 설정
             *                      24 * 60 * 60 * 1000
             *
             * @param path     쿠키경로(생략가능)
             *                  문서의 경로명 설정. 설정하지 않으면 현재 Cookie를 보내는 문서의
             *                  URL 상의 경로(도메인 명 제외)
             * @param domain   도메인(생략가능)
             *                 웹 서버의 도메인 설정. 설정하지 않으면 Cookie를 보내는 문서가 속한
             *                 도메인 명으로 설정된다.
             * @param secure   보안여부(생략가능)
             *                 HTTPS Server와 같은 Secure server에서 Cookie를 보낼대 이 값을 설정
             */
            setCookie : function(name, value, expires, path, domain, secure) {
                // Set-Cookie 구조
                // name=value;expires=date;path=path domain=domain_name;secure
                // example>
                //
                // set time, it's in milliseconds
                var today = new Date();
                today.setTime(today.getTime());

                /*
                 if the expires variable is set, make the correct
                 expires time, the current script below will set
                 it for x number of days, to make it for hours,
                 delete * 24, for minutes, delete * 60 * 24
                 */
                if (expires) {
                    expires = expires * 1000 * 60 * 60 * 24;
                } else {
                	expires = 365 * 1000 * 60 * 60 * 24;
                }
                var expires_date = new Date(today.getTime() + (expires));

                document.cookie = name + "=" + escape(value)
                        + ((expires) ? ";expires=" + expires_date.toGMTString() : "")
                        + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "")
                        + ((secure) ? ";secure" : "");
            },
            /**
             * 쿠키값을 읽어 옵니다.
             *
             *  @param cookieName 쿠키의 이름
             */
            getCookie : function(cookieName) {
                var i, x, y;
                var cookies = document.cookie.split(";");

                for (i = 0; i < cookies.length; i++) {
                    x = cookies[i].substr(0, cookies[i].indexOf("="));
                    y = cookies[i].substr(cookies[i].indexOf("=") + 1);
                    x = x.replace(/^\s+|\s+$/g, "");
                    if (x == cookieName) {
                        return unescape(y);
                    }
                }
            },
            /**
             * 쿠키값을 제거합니다.
             *
             *  @param name 쿠키의 이름
             *  @param path 경로 (생략가능)
             *  @param domain 도메인(생략가능)
             */
            deleteCookie : function(name, path, domain) {
                if (naon.http.getCookie(name))
                    document.cookie = name + "=" + ((path) ? ";path=" + path : "")
                            + ((domain) ? ";domain=" + domain : "")
                            + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
            },

            /** dummy function */
            dummy : function() {
                // not used
            }
        };
        
        // ----------------------------------------------------------------------- History Section
        /**
         * History 처리
         * 
         * HTML5에서 지원하는 pushState(추가), replaceState(변경)등을 사용하여 history 이동을 구현함,ie10 이상에서만 지원가능함
         */
        naon.history = {
        		/**
        		 * 히스토리 추가
        		 */
        		pushState: function(data, title, url){
        			if(typeof(history.pushState) == 'function'){
                        history.pushState(data, title, url);
        			}
            	},
            	
            	/**
            	 * 히스토리 변경
            	 */
            	replaceState: function(data, title, url){
            		if(typeof(history.replaceState) == 'function'){
            			history.replaceState(data, title, url);
            		}
            	},
            	
            	/**
            	 * 히스토리 이동
            	 */
            	popstate: function(state){
            		if(state.callBackFun){
            			try {
            				var f = eval(state.callBackFun);
                				f(state.data);
						} catch (e) {
							if(window.console){
								console.dir("Naon History Popstate Exception :"+ e);
							}
						}
            		}
            		
            	},
            	
            	/**
            	 *  state = {
				 *		callBackFun: "GwMainMenu.fn.goPage",
			     *	    data: {
			     *				....
			     *		}
				 *	 }
            	 *   
            	 */
            	pushHistory: function(state){
            		if(state && state.callBackFun){
            			var params = this.makeParam();
            			
//            			if(!(/\?\at=/).test(location.href)){
//            				naon.history.replaceState(null, null, params);
//            			}
//            			
            			this.pushState(state, null, params);
            		}
            		
            	},
            	
                makeParam: function(){
                	//return window.HomGwMainSub2 ? "?at="+encodeURIComponent(Base64Encoder.encode(HomGwMainSub2.param.menuId)) : null;
                	var param =  (window.GwMainMenu && window.GwMainMenu.menuId) ? "#at="+encodeURIComponent(Base64Encoder.encode(window.GwMainMenu.menuId)) : null;

                    if(window.GwMainMenu && window.GwMainMenu.gapParam){
                        param = window.GwMainMenu.gapParam + param;
                    }
                	
                	return param; 
                }
        };

        // ----------------------------------------------------------------------- Data Section
        /**
         * HTML Form 처리
         */
        naon.data = {

            /**
             * 입력된 JSON 객체의 값을 html element에 채웁니다.
             *
             * <pre>
             *
             * HTML Form의 input 요소를 다음과 같이 작성했다. 언더스코어(_) 까지는 namespace로 사용
             * 하는 접두사이다.  실제의 객체의 필드는 userId 라고 생각하면 된다.
             *
             * <input type="text" name="UserInfo_userId" value="" />
             * <input type="text" name="UserInfo_userName" value="" />
             *
             *
             *  서버로 부터 응답으로 받은 JSON은  다음과 같다.
             *  { userId : "happy", userName: "Kim " }
             *
             *  이것을 이용하여 form의 요소에 값을 채우는 방법은 다음과 같다.
             *
             *  naon.data.setForm(json, "UserInfo_");
             *
             *  필드 이름과 같은 이름의 폼 요소를 찾아서 값을 설정한다.
             *
             * </pre>
             *
             *  @param jsonObj   JSON  객체
             *  @param namespace  이름이 충돌되지 않도록 Domain Class의 필드앞에 붙인 접두사.
             *  @param baseJqObject 특정 jquery object하위만 찾을 때 지정하며 지정하지 않으면 문서전체탐색.
             */
            setForm : function(jsonObj, namespace, baseJqObject) {
                this.setFormRecursive("", jsonObj, namespace, baseJqObject);
            },
            /**
             * setForm의 내부적인 함수 입니다.
             *
             * @para`"m parentElementName  부모객체의 이름
             * @param jsonObj   json 객체
             * @param namespace  이름공간
             * @param baseJqObject 탐색을 시작할 jquery object
             */
            setFormRecursive : function(parentElementName, jsonObj, namespace, baseJqObject) {
                //alert('ok');
                var prefix = (parentElementName == "") ? "" : parentElementName + ".";
                for ( var key in jsonObj) {
                    //var srchKey = prefix + key;
                    var srchKey = prefix + namespace + key;
                    //var eArr = $("*[data-name='" + srchKey + "']");  // html element 검색
                    var eArr = $("*[name='" + srchKey + "']", baseJqObject); // html element 검색
                    if (!eArr)
                        continue; //  엘리먼트가 없으면 skip
                    var propValue = jsonObj[key];
                    if(!propValue)
                        continue;
                    var e = eArr[0];
                    if (typeof propValue == "object") {
                        // 배열
                        if (propValue.constructor.toString().indexOf("Array") > -1) {
                            // 배열일 경우에는 checkbox, select multiple 처리
                            if (!e)
                                continue;
                            if (e.type == "checkbox") {
                                for ( var j = 0; j < eArr.length; j++) {
                                    eArr[j].checked = false; // initialize
                                }
                                for ( var i = 0; i < propValue.length; i++) {
                                    for ( var j = 0; j < eArr.length; j++) {
                                        if (propValue[i] == eArr[j].value) {
                                            eArr[j].checked = true;
                                        }
                                    }// for j
                                }//for i
                            } else if (e.type == "select-multiple") {
                                for ( var i = 0; i < e.options.length; i++) {
                                    var opt = e.options[i];
                                    opt.selected = false;
                                }
                                for ( var i = 0; i < e.options.length; i++) {
                                    var opt = e.options[i];
                                    for ( var j = 0; j < propValue.length; j++) {
                                        if (propValue[j] == opt.value) {
                                            opt.selected = true;
                                        }
                                    }
                                }// for
                            }
                        } else {
                            // JSON Object
                            //this.setFormRecursive(prefix + key, propValue);
                            this.setFormRecursive(prefix + key, propValue, namespace, baseJqObject);
                        }
                    } else {

                        if (!e) {
                            continue;
                        } // element가 없으면 skip
                        if (e.type) {
                            if (e.type == "text") {
                                if ($(e).hasClass("comma")) {
                                    e.value = naon.string.formatComma(propValue);
                                } else if ($(e).hasClass("residentId")) {
                                    e.value = naon.string.formatResidentId(propValue);
                                } else if ($(e).hasClass("telephone")) {
                                    e.value = naon.string.formatTelephone(propValue);
                                } else if ($(e).hasClass("zipcode")) {
                                    e.value = naon.string.formatZipCode(propValue);
                                } else {
                                    e.value = propValue;
                                }
                            } else if (e.type == "hidden" || e.type == "password"
                                    || e.type == "textarea") {
                                e.value = propValue;
                            } else if (e.type == "checkbox") {
                                for ( var i = 0; i < eArr.length; i++) {
                                    eArr[i].checked = false;
                                    if (eArr[i].value == propValue) {
                                        eArr[i].checked = true;
                                    }
                                }// for
                            } else if (e.type == "radio") {
                                for ( var i = 0; i < eArr.length; i++) {
                                    eArr[i].checked = false;
                                    if (eArr[i].value == propValue) {
                                        eArr[i].checked = true;
                                        break;
                                    }
                                }// for
                            } else if (e.type == "select-one") {
                                for ( var i = 0; i < e.options.length; i++) {
                                    var opt = e.options[i];
                                    opt.selected = false;
                                    if (opt.value == propValue) {
                                        opt.selected = true;
                                        break;
                                    }
                                }// for
                            } else if (e.type == "select-multiple") {
                                for ( var i = 0; i < e.options.length; i++) {
                                    var opt = e.options[i];
                                    opt.selected = false;
                                    if (opt.value == jo) {
                                        opt.selected = true;
                                    }
                                }// for
                            }
                        } else {
                            //
                            e.innerHTML = propValue;
                        }
                    }
                }// for
            },
            setJSONMember : function(rootObject, e) {
                //                var dataName = $(e).attr('data-name');
                var dataName = $(e).attr('name');
                //alert(dataName);
                if(!dataName) return;

                if (/* 객체안의 객체 */dataName.indexOf(".") > 0) {
                    var names = dataName.split(".");
                    var jsonMember = null;

                    for ( var i = 0; i < names.length - 1; i++) {
                        if (i == 0) {
                            if (!rootObject[names[i]])
                                rootObject[names[i]] = {};
                            jsonMember = rootObject[names[i]];
                        } else {
                            if (!jsonMember[names[i]])
                                jsonMember[names[i]] = {};
                            jsonMember = jsonMember[names[i]];
                        }
                    }// for
                    if (e.type) {
                        naon.data.setJSONMemberByValue(jsonMember, names[names.length - 1], e);
                    } else {
                        jsonMember[names[names.length - 1]] = $(e).html();
                    }

                } else {
                    // e : form element
                    if (e.type) {
                        naon.data.setJSONMemberByValue(rootObject, dataName, e);
                    } else {
                        rootObject[dataName] = $(e).html();
                    }
                }
                return rootObject;
            },
            /** JSON 객체의 속성값을 채운다. */
            setJSONMemberByValue : function(fld /* { } --> 즉, JSON Object */, name, e) {

                // fld[name]은  object.field와 같은 의미.
                switch (e.type) {
                case "radio":
                    if (e.checked) {
                        fld[name] = e.value;
                    }
                    break;
                case "select-multiple":
                    fld[name] = [];
                    var arr = fld[name];
                    for ( var j = 0; j < e.options.length; j++) {
                        if (e.options[j].selected) {
                            arr.push(e.options[j].value);
                        }
                    }// for
                    break;
                case "select-one":
                    fld[name] = e.options[e.selectedIndex].value;
                    break;
                case "checkbox":
                    //var  dataName = $(e).attr('data-name');
                    var dataName = $(e).attr('name');
                    //var  ele = $('*[data-name='  + dataName +  ']');
                    var ele = $('*[name=' + dataName.replace(/\./g, '\\.') + ']');
                    if (ele.length == 1) {// Checkbox 가 1개인경우 객체로 생성
                        if (e.checked) {
                            fld[name] = e.value;
                        } else {
                        	//Checkbox 값이 Y/N이면 언체크시 다른값으로 생성 
                        	if(e.value === 'Y'){ 
                        		fld[name] = 'N'; 
                        	}else if(e.value === 'N'){
                        		fld[name] = 'Y';
                        	}else{
                        		fld[name] = '';
                        	}
                        }
                        break;
                    }
                    // Array
                    if (!fld[name])
                        fld[name] = [];
                    var chkbox = fld[name];
                    if (e.checked) {
                        chkbox.push(e.value);
                    }

                    break;
                case "text":
                case "hidden":
                case "password":
                	// Array
                    if (!fld[name])
                    	fld[name] = e.value;
                    else if($.type(fld[name]) == 'array')
                    	fld[name].push(e.value);
                    else
                    	fld[name] = [fld[name], e.value];
                    
                    break;
                case "textarea":
                    //fld[name] = naon.string.replace(e.value, "\r\n", "\\n");
                    fld[name] = e.value;
                    break;
                }
            },
            /**
             * HTML FORM으로부터 JSON 생성한다.
             *
             * <pre>
             *
             * var jsonObj = naon.data.createJSONFromForm("form1");
             *
             *
             * </pre>
             *
             * @param formName HTML FORM이름
             * @returns
             *      JSON Object
             */
            createJSONFromForm : function(formName) {
                var model = {};
                //var eArr = $("*[data-name]");
                //var eArr = $("form[name=" + formName + "]" + " *[name]");
                //var eArr = $("form[name=" + formName + "] :input").not("[type=image],[type=submit], [type=button]");
                var eArr = $("form[name=" + formName + "]").find(":input , textarea").not("[type=image],[type=submit], [type=button]");
                if (!eArr)
                    return;
                for ( var i = 0; i < eArr.length; i++) {
                    naon.data.setJSONMember(model, eArr[i]);
                }// for
                return model;
            },
            /**
             * HTML ID으로부터 JSON 생성한다.
             *
             * <pre>
             *
             * var jsonObj = naon.data.createJSONFromForm("form1");
             *
             *
             * </pre>
             *
             * @param 제이쿼리 오브젝트
             * @returns
             *      JSON Object
             */
            createJSONFromJqObj : function(JqObj) {
                var model = {};
                var eArr = JqObj.find(":input , textarea").not("[type=image],[type=submit], [type=button]");
                if (!eArr)
                    return;
                for ( var i = 0; i < eArr.length; i++) {
                    naon.data.setJSONMember(model, eArr[i]);
                }// for
                return model;
            },
            /**
             * HTML FORM으로부터  JSON을 생성.  createJSONFromForm과 같은 JSON 객체를 되돌리지만
             * 폼 요소간의 이름충돌을 방지하기 위해서 접두사를 사용했으면 접두사를 제거하고 원래의
             * 도메인 객체의 필드명을 만들기 위해서 사용한다.
             *
             * @param formName  form 이름
             * @param strToRemove 제거할 문자
             * @returns
             *      JSON Object
             */
            createJSON : function(formName, strToRemove) {
                var jsonStr = naon.data.createJSONString(formName, strToRemove);
                return  window["eval"]("(" + jsonStr + ")");
            },
            
            /**
             * JQEURY OBJECT 으로부터 JSON생성. 
             *
             * @param formName 폼이름
             * @param strToRemove 제거할 문자
             * @returns
             */
            createJSONObj : function(JqObj, strToRemove) {
                var jsonObj = naon.data.createJSONFromJqObj(JqObj);
                var jsonStr =  naon.json.getJSONString(jsonObj);
                return  window["eval"]("(" + naon.string.replace(jsonStr, strToRemove , "") + ")");
            },
            
            /**
             * HTML FORM으로부터 JSON 문자열을 생성. createJSONFromForm과 같은 JSON 객체를 되돌리지만
             * 폼 요소간의 이름충돌을 방지하기 위해서 접두사를 사용했으면 접두사를 제거하고 원래의
             * 도메인 객체의 필드명을 만들기 위해서 사용한다.
             *
             * @param formName 폼이름
             * @param strToRemove 제거할 문자
             * @returns
             */
            createJSONString : function(formName, strToRemove) {
                var jsonObj = naon.data.createJSONFromForm(formName);
                var jsonStr =  naon.json.getJSONString(jsonObj);
                return  naon.string.replace(jsonStr, strToRemove , "");
            },

            /**
             * form element의 option 값을 가지고 옵션이 선택이 되도록
             *
             * @param selector jQuery selector
             * @param optionValue  option 태그와 비교할 값
             */
            setSelect : function(selector, optionValue) {
                $(selector).each(function() {
                    if (this.value == optionValue) {
                        this.selected = true;
                    } else {
                        this.selected = false;
                    }
                });
            },
            /**
             * multiple 속성을 가진 select 옵션 선택하게 만들기
             * @param selector jQuery selector
             * @parma checkValues :  [] 형태의 값
             */
            setSelectMultiple : function(selector, optionValues) {
                $(selector).each(function() {
                    for ( var i = 0; i < optionValues.length; i++) {
                        if (optionValues[i] === this.value) {
                            this.selected = true;
                        }
                    }
                });
            },
            /**
             * input=radio 의 값 설정합니다.
             *
             * @param selector jQuery selector
             * @param radioVlalue 비교할 값
             */
            setRadio : function(selector, radioValue) {
                $(selector).each(function() {
                    if (this.value == radioValue) {
                        this.checked = true;
                    } else {
                        this.checked = false;
                    }
                });
            },
            /** checkbox  값 설정합니다.
             * @param selector jQuery selector
             * @parma checkValues :  [] 형태의 값
             */
            setCheckbox : function(selector, checkValues) {
                $(selector).each(function() {
                    this.checked = false;
                });
                $(selector).each(function() {
                    for ( var i = 0; i < checkValues.length; i++) {
                        if (this.value == checkValues[i]) {
                            this.checked = true;
                        }
                    }
                });
            },
            /** dummy function */
            dummy : function() {
                // not used
            }
        };

        // ----------------------------------------------------------------------- naon.ui section
        /**
         * 화면처리
         */
        naon.ui = {
            /**
             *  modal dialog를  표시한다. jquery.ui.dialog 를 참조한다. 다른 점이 있다면
             *  selector를 옵션에 추가적으로 정의한다. naon.js 내부에서만 사용한다.
             *  { selector :"#dialog-modal" }
             *  @parma opt  json object, jquery.ui.dialog의 option 참조
             */
            showModal : function(opts) {
                var opts2 = $.extend({}, opts, {
                    modal : true
                });
                return $(opts.selector).dialog(opts2);
            },
            /**
             * dialog를 표시한다. naon.js 내부적으로만 사용함
             * @param opts 모달창 옵션
             */
            showDialog : function(opts) {
                return $(opts.selector).dialog(opts);
            },
			/** dialog를 띄운다. 
			 * @param option 옵션
			 */
			openDialog: function(option) {
				var id = option.id || option.page,
					layer = $('#' + id),
					isNew = false;

				if (layer.length == 0 || layer.is(':empty')) {
					layer = $('<div id="' + id + '" title="' + option.title + '" ' + (option.cls ? ('class="' + option.cls + '"') : '') + '></div>').appendTo(document.body);

					option.dialogOption.close = function() {
						if(option.closeNotifyName) {
							ObserverControl.notifyObservers({type: option.closeNotifyName});
						}
						if(option.cleanPopup) {
							$(this).dialog('destroy').remove();
						}
					}
					if(!option.dialogOption.drag) {
						option.dialogOption.drag = function(e, ui) {
							var pos = ui.position;
							if(pos.top < 0) {
								pos.top = 0;
							}
							if(pos.left < 0) {
								pos.left = 0;
							}
						};
					}
					layer.dialog(option.dialogOption);
					isNew = true;
				}

				layer.off('confirm');
				layer.off('close');

				if(option.callback) {
					layer.on('confirm', option.callback);
				}
				
				if(option.close) {
					layer.on('close', option.close);
				}
				
				layer.data('userData', option.userData || null);

				if(isNew || option.cleanPopup) {
					naon.http.ajax({
						url : option.url + option.page,
						data : option.data,
						sendDataType : option.sendDataType || 'string',
						dataType : 'html',
						useWrappedObject : false,
						target : document.body,
						type : 'post',
						success : function(htmlRes, statusText) {
							naon.doc.writeHtml(htmlRes, id);
							openDialog(id);
						}
					});
				} else {
					if(option.notifyName) {
						ObserverControl.notifyObservers({
							type: option.notifyName,
							data: option.data
						});
					}
					openDialog(id);
				}
			},
            /**
             * naon.js에서만 사용하는 에러표시 창.
             */
            showAjaxError : function(opts) {


                var ctime = new Date().getTime();
                var randomVal = Math.floor(Math.random() * 100) + 1;
                var divId = "DIV" + ctime + "_" + randomVal;

                // deprecated 
                var html = "<table  style='border:1px black solid;border-collapse:collapse'>"
                        + "<tr>" + "<td style='border:1px black solid;'>에러코드</td>"
                        + "<td style='border:1px black solid;'>" + opts.responseCode + "</td>"
                        + "</tr>" + "<tr>" + "<td style='border:1px black solid;'>에러메시지</td>"
                        + "<td>" + opts.responseText + "</td>" + "</tr>" + "<tr>"
                        + "<td style='border:1px black solid;'>시스템오류메시지</td>"
                        + "<td style='border:1px black solid;'>" + opts.systemError + "</td>"
                        + "</tr>" + "</table>";

                var errMsg  =opts.responseText;
                var errCode =  common_naonjs_message_syserr;   // "시스템 오류가 발생하였습니다.";
                var titleMsg = common_org_error;	// 에러 
                if( opts.responseCode == 500) {
                   errCode = common_naonjs_message_syserr;   // "시스템 오류가 발생하였습니다.";
                   errMsg =  common_naonjs_message_inquire;   // "자세한 사항은 시스템 관리자에게 문의하세요";
                } else {
                    errCode = common_naonjs_message_notice + "(" + common_naonjs_message_code + ":" + opts.responseCode  + ")"; //errCode = "알림(코드:" + opts.responseCode  + ")";
                    errMsg = opts.responseText;
                    titleMsg = common_naonjs_message_notice;	// 알림
                }

               
                html = ""
                +  "<div class=\"system_msg_box\" style=\"width:auto; height:338px; margin:0;\">     "
                +  "    <div class=\"img_side\"><img src=\"" + frameworkProperties.image_server + "/resources/common/img/img_alert.png\" alt=\"\"></div>                                                       "
                +  "    <div class=\"txt_side\">  "
                +  "            <div class=\"tit\">      "
                +  "                    <strong>" +  errCode + "</strong> "
                +  "            </div> "
                +  "            <div class=\"desc\">   ";
                
                if(errMsg != "NO_AJAX_LOGIN") {
				    html += errMsg;
				}
				html+=  "      <!- Put a system error message here. but hide it. -->  ";
				html+=  "<!-- ";
				html+=  opts.systemError;
				html+= " --!>";
				html+=  "            </div>   ";
				html+=  "            <div class=\"btn_box\">";
				html+=  "                <!-- put a button to contain an action here !-->    ";
				html+=  "            </div>";
				if(errMsg == "NO_AJAX_LOGIN") {
				    html+="<div class='desc' style='text-align:center;'>";
				    html+=common_text_moveLoginPage;
				    html+="</div>";
				    html+="<div class='btn_box'>";
				    html+="       <a href='#' onclick='javascript: window.location.href=\""+frameworkProperties.context+"\"' class='btn'><span>"+common_button_confirm+"</span></a>";
				    html+="</div>";
				}
				html+=  "    </div> ";
				html+=  "</div> ";
				html+=  "</div> ";
				html+=  "</div> ";
                
                
//                +  errMsg
//                +  "      <!- Put a system error message here. but hide it. -->  "
//                +  "<!-- "
//                +  opts.systemError
//                + " --!>"
//                +  "            </div>   "
//                +  "            <div class=\"btn_box\">"
//                +  "                <!-- put a button to contain an action here !-->    "
//                +  "            </div>"
//                +  "    </div> "
//                +  "</div> "
					                                
                
                var newDiv = document.createElement("div");
                newDiv.id = divId;
                //newDiv.className = "iefix_dialog";
                document.body.appendChild(newDiv);
                $("#" + divId).html(html);

                var defaultSettings = {
                    selector : "#" + divId,
                    dialogClass: "",
                    minHeight : 400,
                    width : 650,
                    modal : false,
                    show : "slide",
                    title : titleMsg,
                    close : function(){
	                    if(errMsg == "NO_AJAX_LOGIN") {
					    	window.location.href=frameworkProperties.context;
						}
					}
                };
                this.showModal(defaultSettings);
            },
            showAjaxError2 : function(opts) {


                var ctime = new Date().getTime();
                var randomVal = Math.floor(Math.random() * 100) + 1;
                var divId = "DIV" + ctime + "_" + randomVal;

                // deprecated 
                var html = "<table  style='border:1px black solid;border-collapse:collapse'>"
                        + "<tr>" + "<td style='border:1px black solid;'>에러코드</td>"
                        + "<td style='border:1px black solid;'>" + opts.responseCode + "</td>"
                        + "</tr>" + "<tr>" + "<td style='border:1px black solid;'>에러메시지</td>"
                        + "<td>" + opts.responseText + "</td>" + "</tr>" + "<tr>"
                        + "<td style='border:1px black solid;'>시스템오류메시지</td>"
                        + "<td style='border:1px black solid;'>" + opts.systemError + "</td>"
                        + "</tr>" + "</table>";

                var errMsg  =opts.responseText;
                var errCode =  common_naonjs_message_syserr;   // "시스템 오류가 발생하였습니다.";
                var titleMsg = common_org_error;	// 에러 
                if( opts.responseCode == 500) {
                   errCode = common_naonjs_message_syserr;   // "시스템 오류가 발생하였습니다.";
                   errMsg =  common_naonjs_message_inquire;   // "자세한 사항은 시스템 관리자에게 문의하세요";
                } else {
                    errCode = common_naonjs_message_notice + "(" + common_naonjs_message_code + ":" + opts.responseCode  + ")"; //errCode = "알림(코드:" + opts.responseCode  + ")";
                    errMsg = opts.responseText;
                    titleMsg = common_naonjs_message_notice;	// 알림
                }

               
                html = ""
                +  "<div class=\"system_msg_box\" style=\"width:auto; height:338px; margin:0;\">     "
                +  "    <div class=\"img_side\"><img src=\"" + frameworkProperties.image_server + "/resources/common/img/img_alert.png\" alt=\"\"></div>                                                       "
                +  "    <div class=\"txt_side\">  "
                +  "            <div class=\"desc\">   ";
                
                if(errMsg != "NO_AJAX_LOGIN") {
				    html += errMsg;
				}
				html+=  "      <!- Put a system error message here. but hide it. -->  ";
				html+=  "<!-- ";
				html+=  opts.systemError;
				html+= " --!>";
				html+=  "            </div>   ";
				html+=  "            <div class=\"btn_box\">";
				html+=  "                <!-- put a button to contain an action here !-->    ";
				html+=  "            </div>";
				if(errMsg == "NO_AJAX_LOGIN") {
				    html+="<div class='desc' style='text-align:center;'>";
				    html+=common_text_moveLoginPage;
				    html+="</div>";
				    html+="<div class='btn_box'>";
				    html+="       <a href='#' onclick='javascript: window.location.href=\""+frameworkProperties.context+"\"' class='btn'><span>"+common_button_confirm+"</span></a>";
				    html+="</div>";
				}
				html+=  "    </div> ";
				html+=  "</div> ";
				html+=  "</div> ";
				html+=  "</div> ";
                
                
//                +  errMsg
//                +  "      <!- Put a system error message here. but hide it. -->  "
//                +  "<!-- "
//                +  opts.systemError
//                + " --!>"
//                +  "            </div>   "
//                +  "            <div class=\"btn_box\">"
//                +  "                <!-- put a button to contain an action here !-->    "
//                +  "            </div>"
//                +  "    </div> "
//                +  "</div> "
					                                
                
                var newDiv = document.createElement("div");
                newDiv.id = divId;
                //newDiv.className = "iefix_dialog";
                document.body.appendChild(newDiv);
                $("#" + divId).html(html);

                var defaultSettings = {
                    selector : "#" + divId,
                    dialogClass: "",
                    minHeight : 400,
                    width : 650,
                    modal : false,
                    show : "slide",
                    title : titleMsg,
                    close : function(){
	                    if(errMsg == "NO_AJAX_LOGIN") {
					    	window.location.href=frameworkProperties.context;
						}
					}
                };
                this.showModal(defaultSettings);
            },
            /**
             * 이미지를 마우스 오버/아웃시 스왑합니다.
             *
             * @param src jQuery selector
             * @param overImage  mouse over 시 표시할 이미지 경로
             * @param outImage  mouse out 시 표시할 이미지 경로
             */
            swapImage : function(src, overImage, outImage) {
                $(src).mouseover(function() {
                    this.src = overImage;
                }).mouseout(function() {
                    this.src = outImage;
                })
            },
            /**
             * iframe을 구한다. cross browser 지원
             * @param iframeId  iframe's ID
             * @return
             *      iframe 요소.
             */
            getIframe : function(iframeId) {
                return document.getElementById(iframeId).contentWindow || document.frames[iframeId];
            },

            /**
             *  팝업윈도우를 중앙에 위치시키기 위한 좌표 계산
             *  <pre>
             *  var dimension = naon.ui.getCenterXY(448,366);
             *  window.open(url,'postalCode','width=448,height=366,top=' + dimension.Y + ',left=' + dimension.X);
             *  </pre>
             *
             *  @param w  팝업창의 width
             *  @param h  팝업창의 height
             *  @return   좌표객체 (.X : 좌측위치, .Y : 위쪽 위치 )
             *
             */
            getCenterXY : function(w, h) {
                var dimension = {};
                dimension.X = (screen.availWidth / 2) - (w / 2);
                dimension.Y = (screen.availHeight / 2) - (h / 2) - 40;
                return dimension;
            },
            /**
             * 태그의 좌표와 width, height를 반환
             * @param selector 요소 selector
             */
            getBounds : function(selector) {
                // 일단 jquery를 사용하는 것으로 바꿈.  검증 필요.
                /* var ret = { left:0, top:0, width:0,height:0 };
                if(document.getBoxObjectFor) {
                    var box = document.getBoxObjectFor(tag);
                    ret.left = box.x;
                    ret.top = box.y;
                    ret.width = box.width;
                    ret.height = box.height;
                } else if(tag.getBoundingClientRect)  { // IE, FF3
                    var rect = tag.getBoundingClientRect();
                    ret.left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
                    ret.top  = rect.top + (document.documentElement.scrollTop || document.body.scrollTop);
                    ret.width = rect.right - rect.left;
                    ret.height = rect.bottom - rect.top;
                }
                 */
                // 좀더 검증을 해 봐야 함.
                var ret = {
                    left : $(selector).offset().left,
                    top : $(selector).offset().top,
                    height : $(selector).outerHeight(),
                    width : $(selector).outerWidth()
                }
                return ret;
            },
            /**
             * div를 이벤트가 발생한 엘리먼트의 아래에 표시합니다.
             *
             * Example)
             *  Html codes:
             *     <input type="text" id="test" value="" />
             *
             *     <div id="layer1">Contents here </div>
             *
             *  Javascript Codes:
             *     $("#test").click(function() {
             *          naon.ui.showLayer("layer1", this);
             *     });
             *
             * @param  selector : selector. a div shows  below this targer element.
             * @param  source      : event source element
             */
            showLayer : function(selector, source) {
                //var position = $(source).position();
                var offset = $(source).offset();
                var height = $(source).outerHeight();
                var width = $(source).outerWidth();

                return $(selector).css("left", offset.left).css("top", offset.top + height).css(
                        "position", "absolute").css("visibility", "visible");
            },
            hello : function() {
                alert('hello');
            },

            /**
             * 위치 변경 레이어에서 항목을 선택 했을 때 li 태그에 색을 변경 한다.
             *
             * Exzmple)
             * 	Javascript Codes:
             * 		$('#test > li').click(function(event){naon.ui.selectItem(event, $('#test'))});
             * @param e 이벤트 객체
             * @param ulObj ul 태그 객체
             */
            selectItem : function(e, ulObj){
            	$(ulObj).children().each(function(index){
            		$(this).removeClass('ui-sortable-helper');
            		$(this).removeClass('active');
            	});
            	$(e.target).addClass('ui-sortable-helper');
            	$(e.target).addClass('active');
            },
            /**
             * 선택한 항목에 위치를 아래로 한칸 이동 시킨다.
             *
             * Exzmple)
             * 	Javascript Codes:
             * 		$('#test').click(function(){naon.ui.itemMoveDown($('#test'));});
             * @param ulObj ul 태그 객체
             */
            itemMoveDown : function(ulObj){
            	var current = $(ulObj).children('.active');
            	current.next().after(current);
            	var scrollPos = (current.outerHeight() ? current.outerHeight() : 0) * (current.index()? current.index() : 0);
            	$(ulObj).parent().scrollTop(scrollPos);
            },
            /**
             * 선택한 항목에 위치를 위로 한칸 이동 시킨다.
             *
             * Exzmple)
             * 	Javascript Codes:
             * 		$('#test').click(function(){naon.ui.itemMoveUp($('#test'));});
             * @param ulObj ul 태그 객체
             */
            itemMoveUp : function(ulObj){
            	var current = $(ulObj).children('.active');
            	current.prev().before(current);
            	var scrollPos = (current.outerHeight() ? current.outerHeight() : 0) * (current.index()? current.index() : 0);
            	$(ulObj).parent().scrollTop(scrollPos);
            },
            /**
             * 선택한 항목에 위치를 맨 위로 이동 시킨다.
             *
             * Exzmple)
             * 	Javascript Codes:
             * 		$('#test').click(function(){naon.ui.itemMoveTop($('#test'));});
             * @param ulObj ul 태그 객체
             */
            itemMoveTop : function(ulObj){
            	var firstEl = $(ulObj).children().first();
            	var current = $(ulObj).children('.active');
            	if(!firstEl.hasClass('active')) firstEl.before(current);
            	var scrollPos = (current.outerHeight() ? current.outerHeight() : 0) * (current.index()? current.index() : 0);
            	$(ulObj).parent().scrollTop(scrollPos);
            },
            /**
             * 선택한 항목에 위치를 맨 아래로 이동 시킨다.
             *
             * Exzmple)
             * 	Javascript Codes:
             * 		$('#test').click(function(){naon.ui.itemMoveBottom($('#test'));});
             * @param ulObj ul 태그 객체
             */
            itemMoveBottom : function(ulObj){
            	var lastEl = $(ulObj).children().last();
            	var current = $(ulObj).children('.active');
            	if(!lastEl.hasClass('active')) lastEl.after(current);
            	var scrollPos = (current.outerHeight() ? current.outerHeight() : 0) * (current.index()? current.index() : 0);
            	$(ulObj).parent().scrollTop(scrollPos);
            },

        	contents : {
        		appendContents: function(contents, targetId, callbackAfterLoad) {
        			var $trgtBox = $('#' + targetId),
        				$contBox = $('<div class="_editor_conts">' + contents + '</div>');

        			if(!$trgtBox.hasClass('editor_content') && !$trgtBox.parent().hasClass('editor_content')) {
        				$trgtBox.addClass('editor_content');
        			}
        			$contBox.appendTo($trgtBox);
        			if (callbackAfterLoad) {
    					callbackAfterLoad($contBox);
    				}
        		},
        		appendContentsIframe: function(contents, targetId, callbackAfterLoad) {
        			var that = this;
        			$('<iframe name="contentsFrame" src="' + frameworkProperties.context + '/jsp/framework/editor/contentsView.jsp" marginwidth="0" marginheight="0" frameBorder="0" width="100%" height="100px" scrolling="auto" class="_editor_conts"></iframe>')
        			.load(function() {
        				var $iframe = $(this);
        				try {
	        				var frameBody = $iframe.contents().find('body');
	        				var doc = this.contentDocument || this.contentWindow.document;
	        				frameBody
	        				.append(contents)
	        				.find('img')
	        				.load(function() {
	        					$iframe.css({/*width: that.getDocWidth(doc),*/ height: that.getDocHeight(doc) + 18});
	        				});
	        				$iframe.css({/*width: that.getDocWidth(doc),*/ height: that.getDocHeight(doc) + 18});
	
	        				if (callbackAfterLoad) {
	        					callbackAfterLoad(frameBody);
	        				}
        				} catch(e) {}
        			}).appendTo($('#' + targetId));
        		},
        		getDocHeight: function (doc) {
        			var db = doc.body, de = doc.documentElement;
        			var mMax = Math.max(
            				Math.max(db.scrollHeight, de.scrollHeight),
            				Math.max(db.offsetHeight, de.offsetHeight),
            				Math.max(db.clientHeight, de.clientHeight)
            			); 
        			return mMax;
        		},
        		getDocWidth: function (doc) {
        			var db = doc.body, de = doc.documentElement;
        			return Math.max(
        				Math.max(db.scrollWidth, de.scrollWidth),
        				Math.max(db.offsetWidth, de.offsetWidth),
        				Math.max(db.clientWidth, de.clientWidth)
        			);
        		}
        	},

			/** 로그인사용자의 테마및 배경을 띄운다.
			 * 
			 * @param showBg 배경이미지를 보여줄지 여부 - 메모나 스페이스등 배경이 필요할때 사용.
			 *
			 */
			loadUserSkinTheme: function(showBg) {
				if(loginUserInfo && loginUserInfo.gwSkinTheme){
					$(document.body).addClass('gw_theme'+ loginUserInfo.gwSkinTheme);
				} else {
					$(document.body).addClass('gw_theme4');
				}
				if(showBg) {
					this.displayPageBg();
				}
			},

			/** 로그인사용자의 테마색상을 띄운다. */
			loadUserSkinColor: function() {
				if(loginUserInfo && loginUserInfo.gwSkinColor){
					$(document.body).addClass('gw_color'+loginUserInfo.gwSkinColor);
				} else {
					$(document.body).addClass('gw_color1');
				}
				this.loadUserSubTheme();
			},
			
			/** 로그인사용자의 서브테마를 적용한다. */
 			loadUserSubTheme : function(){
 				if(loginUserInfo && loginUserInfo.gwSubTheme){
 					if(!$(document.body).hasClass('gw_subtheme'+loginUserInfo.gwSubTheme)) $(document.body).addClass('gw_subtheme'+loginUserInfo.gwSubTheme);
 				}
 			},

			/** 로그인사용자의 배경화면화면을 표시한다. */
			displayPageBg: function() {
				if(loginUserInfo == null) {
					$(document.body).addClass('gw_bg1');
				}else if(loginUserInfo.gwBgType == '0'){
					//사용지정 이미지 적용.
					if(loginUserInfo.personCfgImage) {
						naon.ui.setCustomImageByBg(loginUserInfo.personCfgImage);
					} else {
						$(document.body).addClass('gw_bg1');
					}
				}else {
					//기본배경이미지 적용.
					$(document.body).addClass('gw_bg'+ (loginUserInfo.gwBgType || '1'));
				}
			},

			setCustomImageByBg : function(cfgImg){
				if(typeof HomGwMain == 'undefined') return false;
				
				var rp = null, bp = null, css;
				// 반복
				switch (cfgImg.reptType) {
				case '2': rp = 'repeat'; break;
				case '3': rp = 'repeat-x'; break;
				case '4': rp = 'repeat-y'; break;
				default:  rp = 'no-repeat';
				}
				// 위치
				if(cfgImg.locType == '1'){
					bp = '50% 50%';
				}else{
					bp = cfgImg.leftLoc+'% '+cfgImg.upperLoc+'%';
				}

				css = {
					'background-image' : 'url('+frameworkProperties.context+'/inc/file/fileView?fileUrl='+encodeURIComponent(cfgImg.fileUrl) +'&fileName='+cfgImg.localFileName+')',
					'background-repeat': rp,
					'background-position': bp
				}
				// 위치 고정
				if(cfgImg.locFixedYn == 'Y'){
					css['background-attachment'] = 'fixed';
				}else{
					css['background-attachment'] = '';
				}
				// 화면에 맞춤
				if(cfgImg.scrnFitYn == 'Y'){
					css['background-size'] = 'cover';
					css['-webkit-background-size'] = 'cover';
					css['-moz-background-size'] = 'cover';
					css['-o-background-size'] = 'cover';
				}
				
				$('.portal_container').css(css);
			},
			/** jquery event 사용하지 못하는 경우. */
			addEvent: function (obj, evType, fn){
				if (obj.addEventListener){
					obj.addEventListener(evType, fn, false);
					return true;
				} else if (obj.attachEvent){
					var r = obj.attachEvent('on'+evType, fn);
					return r;
				} else {
					return false;
				}
			},
			
			//사이드메뉴 접고 펴기
			toggleSnb: function(){
				if($('#layout_wrap').hasClass('hide_snb')) {
					$('#layout_wrap').removeClass('hide_snb');
				} else  {
					$('#layout_wrap').addClass('hide_snb');
				}
			},

			//기본
			snbWidthDef: function(){
				$('#layout_wrap').addClass('snb_w_def');
				$('#layout_wrap').removeClass('snb_w_med');
				$('#layout_wrap').removeClass('snb_w_lar');
			},

			//넓게
			snbWidthMed: function(){
				$('#layout_wrap').removeClass('snb_w_def');
				$('#layout_wrap').addClass('snb_w_med');
				$('#layout_wrap').removeClass('snb_w_lar');
			},

			//더 넓게
			snbWidthLar: function(){
				$('#layout_wrap').removeClass('snb_w_def');
				$('#layout_wrap').removeClass('snb_w_med');
				$('#layout_wrap').addClass('snb_w_lar');
			},
			
			/**
			 * 그룹웨어 alert dialog를 띄우는 함수이다.
			 * opt  = {
			 * 		message - 화면에 표시 할 메세지 예) "제목은 100자를 넘길 수 없습니다.<br/> 제목을 다시 입력해 주세요."
			 * 		alertType : 알림 유형 - 경고(W), 안내(G) 기본값 G
			 * 		callback - 확인 버튼을 클릭 한 후 실행 할 함수 예) function(){$('#title').focus();}
			 * 		
			 * }
			 */
			alert : function(opt){
				
				if(naon.util.isMobileUrl()) {//모바일 page에서는 alert 으로 처리
	           		 alert(opt.message);
	           		 if(opt.callback) opt.callback();
	           		 return;
	           	}
				
				var tmpHtml = '<div id="naon-cmm-alert" title="'+common_label_message277/*알림*/+'">'
									+'	<div class="system_alert_box alert_'+(opt.alertType == 'W' ? 'warning' : 'guide' )+'">'
									+'		<div class="alert_img"></div>'
									+'		<div class="alert_cont">'
									+ (opt.message ? naon.string.replace(opt.message, '\n', '<br/>') : '')
									+'		</div>'
									+'		<div class="btn_area">'
									+'			<button id="naon-cmm-alert-confirm" type="button" class="abtn '+(opt.alertType == 'W' ? 'abtn_dan' : 'abtn_pri' )+'"><i class="ico ico_check"></i> '+common_button_confirm/*확인*/+'</button>'
									+'		</div>'
									+'	</div>'
									+'</div>';
				var $div = $(tmpHtml);
				var $body = $(window.document.body);
				var callback = opt.callback;
				var $targetType = opt.targetType;
				
				if(window.parent && $targetType != 'msgr'){
					var parent = window.parent;
					
					while(parent !== parent.parent){
						parent = parent.parent;
					}
					$body = $(parent.document.body);
					
					//새 탭을 호출하는 경우  alert를 띄우기 위한 처리.(ex. forumHomeFrame.jsp)
					if(window.parent.frames["bodyFrame"]){
						$body=$(window.parent.frames["bodyFrame"].document.body);
					}
				}
				
				if($body.find('#naon-cmm-alert').length > 0) return;
				
				$body.append($div);
				
				$div.dialog({
					dialogClass: "system_alert_lyr system_warning",
					autoOpen: true,
					modal: true,
					resizable: false,
					show: { effect: "blind", duration: 300 },
					hide: "fade",
					width: $targetType == 'msgr'? "300px" : "400px",
					position: {using : function(){
						try {
							var left;
							if($targetType == 'msgr'){
								left = ($body.width()-$(this).width())/2;
							}else{
								left = ($body.width()/2)-($(this).width()/2);
							}
							$(this).css('left', left+'px');
							//$(this).css('top', top+'px');
							//var top = $body.height()/2-100;
						} catch (e) {
							$(this).css('left', '50px');
						}
						$(this).css('top', '30px');
					}},
					open : function(event, ui){
						naon.ui.activeXViewer.toggle(true);
						if($(this).closest('.ui-effects-wrapper').length > 0){
							$(this).closest('.ui-effects-wrapper').next().css('z-index', $(this).parent().css('z-index')-1);
						}else{
							$(this).parent().next().css('z-index', $(this).parent().css('z-index')-1);
						}
					},
					close : function(){
						naon.ui.activeXViewer.toggle(false);
						$(this).dialog('destroy');
						$(this).remove();
						if(callback) callback();
					}
				});
				
				$div.find('#naon-cmm-alert-confirm').on('click', function(){$div.dialog('close');});
			},
			
			/**
			 * 그룹웨어 confirm dialog를 띄우는 함수이다.
			 * opt  = {
			 * 		message - 화면에 표시 할 메세지 예) 예) "제목은 100자를 넘길 수 없습니다.<br/> 제목을 다시 입력해 주세요."
			 * 		alertType : 알림 유형 - 경고(W), 안내(G) 기본값 G
			 * 		confirmCallback - 확인 버튼을 클릭 한 후 실행 할 함수 예) function(){Sample.fn.formSubmit();}
			 *     cancelCallback - 취소 버튼을 클릭 한 후 실행 할 함수 예) function(){$('#title').focus();}
			 * 		confirmBtnName - 확인버튼명
			 *		cancelBtnName - 취소버튼명
			 *      htmltype : 확인 레이어 UI 유형 - defult(기본), type1(결재형), type2(보고서형), type2(선택형)
			 * }
			 */
			confirm : function(opt){
				var tmpHtml = {

						defult : '<div id="naon-cmm-confirm" title="'+common_label_message277/*알림*/+'">'
						+'	<div class="system_alert_box alert_'+(opt.alertType == 'W' ? 'warning' : 'guide' )+'">'
						+'		<div class="alert_img"></div>'
						+'		<div class="alert_cont">'
						+ (opt.message ? naon.string.replace(opt.message, '\n', '<br/>') : '')
						+'		</div>'
						+'		<div class="btn_area">'
						+'			<button id="naon-cmm-confirm-ok" type="button" class="abtn '+(opt.alertType == 'W' ? 'abtn_dan' : 'abtn_pri' )+'"><i class="ico ico_check"></i> '+(opt.confirmBtnName || common_button_confirm/*확인*/)+'</button>'
						+'			<button id="naon-cmm-confirm-cancel" type="button" class="abtn">'+(opt.cancelBtnName || common_button_cancel/*취소*/)+'</button>'
						+'		</div>'
						+'	</div>'
						+'</div>',
						
						type1 : '<div id="system_alert_lyr" title="'+common_text_eapConfirm/*상신 확인*/+'" class="system_alert_lyr">'
						+'	<div class="system_alert_box alert_guide app_confirm">'
						+'		<div class="alert_img">'
						+'			<svg class="doc" width="68" height="84"><path class="base" d="M68 82a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h64a2 2 0 0 1 2 2v80z"/>'
						+'			<path class="paper" d="M4 8h60v70H4z"/><path class="clip1" d="M40 5h-3a3 3 0 1 0-6 0h-3c-6 0-6 4-6 4h24s0-4-6-4zm-6 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>'
						+'			<path class="clip2" d="M24 11h20a2 2 0 0 0 2-2H22a2 2 0 0 0 2 2z"/></svg>'
						+'			<svg class="eapp_cont" width="47" height="52"><path class="tbl" d="M0 0h47v52H0z"/><path class="tbl_line line1" d="M0 9h47v2H0z"/>'
						+'			<path class="tbl_line line2" d="M0 41h47v2H0z"/><path class="tbl_line line3" d="M37 0h2v9h-2z"/><path class="tbl_line line4" d="M29 0h2v9h-2z"/><path class="line line1" d="M6 17h35v2H6z"/>'
						+'			<path class="line line2" d="M6 22h21v2H6z"/><path class="line line3" d="M6 27h27v2H6z"/><path class="line line4" d="M29 34h12v2H29z"/></svg>'
						//+'			<svg class="doc_cover" width="68" height="84" viewBox="0 0 68 84"><path class="cover" d="M66 0H53a2 2 0 0 0-2 2v8a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v80a2 2 0 0 0 2 2h64a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>'
						//+'			<path class="tag" d="M19 63h31v9H19z"/></svg>'
						+'		</div>'
						+'		<div class="alert_cont">' 
						+ (opt.message ? naon.string.replace(opt.message, '\n', '<br/>') : '') 
						+'		</div>'
						+'		<div class="btn_area">'
						+'			<button id="naon-cmm-confirm-ok" type="button" class="abtn '+(opt.alertType == 'W' ? 'abtn_dan' : 'abtn_pri' )+'"><i class="ico ico_check"></i> '+(opt.confirmBtnName || common_button_confirm/*확인*/)+'</button>'
						+'			<button id="naon-cmm-confirm-cancel" type="button" class="abtn">'+(opt.cancelBtnName || common_button_cancel/*취소*/)+'</button>'
						+'		</div>'
						+'	</div>'
						+'</div>',
						
						type2 : '<div id="system_alert_lyr" title="'+common_text_workConfirm/*보고 확인*/+'" class="system_alert_lyr">'
						+'	<div class="system_alert_box alert_guide rpt_confirm">'
						+'		<div class="alert_img">'
						+'			<svg class="doc" width="68" height="84"><path class="base" d="M68 82a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h64a2 2 0 0 1 2 2v80z"/><path class="paper" d="M4 8h60v70H4z"/>'
						+'			<path class="clip1" d="M40 5h-3a3 3 0 1 0-6 0h-3c-6 0-6 4-6 4h24s0-4-6-4zm-6 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/><path class="clip2" d="M24 11h20a2 2 0 0 0 2-2H22a2 2 0 0 0 2 2z"/></svg>'
						+'			<svg class="doc_cont" width="36" height="42"><path class="line line_1" d="M0 0h36v2H0z"/><path class="line line_2" d="M4 34h28v2H4z"/><path class="line line_3" d="M0 40h36v2H0z"/><path class="gra gra_1" d="M7 19h5v9H7z"/>'
						+' 			<path class="gra gra_2" d="M15 12h5v16h-5z"/><path class="gra gra_3" d="M23 15h5v13h-5z"/></svg>'
						//+'			<svg class="doc_cover" width="68" height="84" viewBox="0 0 68 84"><path class="cover" d="M66 0H53a2 2 0 0 0-2 2v8a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v80a2 2 0 0 0 2 2h64a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>'
						//+'			<path class="tag" d="M19 63h31v9H19z"/></svg>'
						+'		</div>'
						+'		<div class="alert_cont">'
						+ (opt.message ? naon.string.replace(opt.message, '\n', '<br/>') : '')  
						+'		</div>'
						+'		<div class="btn_area">'
						+'			<button id="naon-cmm-confirm-ok" type="button" class="abtn '+(opt.alertType == 'W' ? 'abtn_dan' : 'abtn_pri' )+'"><i class="ico ico_check"></i> '+(opt.confirmBtnName || common_button_confirm/*확인*/)+'</button>'
						+'			<button id="naon-cmm-confirm-cancel" type="button" class="abtn">'+(opt.cancelBtnName || common_button_cancel/*취소*/)+'</button>'
						+'		</div>'
						+'	</div>'
						+'</div>',

                        type3 : '<div id="naon-cmm-confirm" title="'+common_label_message277/*알림*/+'">'
                        +'	<div class="system_alert_box alert_'+(opt.alertType == 'W' ? 'warning' : 'guide' )+'">'
                        +'		<div class="alert_img"></div>'
                        +'		<div class="alert_cont">'
                        + (opt.message ? naon.string.replace(opt.message, '\n', '<br/>') : '')
                        +'		</div>'
                        +'		<div style="text-align:center; margin-bottom: 30px;">'
                        +'		    <input type="radio" name="chk_info" value="y">' + (common_radio_y)
                        +'		    <input type="radio" style="margin-left: 30px" name="chk_info" checked value="n">' + (common_radio_n)
                        +'		</div>'
                        +'		<div class="btn_area">'
                        +'			<button id="naon-cmm-confirm-ok" type="button" class="abtn '+(opt.alertType == 'W' ? 'abtn_dan' : 'abtn_pri' )+'"><i class="ico ico_check"></i> '+(opt.confirmBtnName || common_button_confirm/*확인*/)+'</button>'
                        +'			<button id="naon-cmm-confirm-cancel" type="button" class="abtn">'+(opt.cancelBtnName || common_button_cancel/*취소*/)+'</button>'
                        +'		</div>'
                        +'	</div>'
                        +'</div>'
						
				};
				
				var html = tmpHtml['defult'];
				
				if(opt.htmltype){
					html = tmpHtml[opt.htmltype];
				}
				var $div = $(html);
				var $body = $(window.document.body);
				var confirmCallback = opt.confirmCallback;
				var cancelCallback = opt.cancelCallback;
				var $targetType = opt.targetType;

				var callback = function(){};
				if(window.parent && $targetType != 'msgr'){
					var parent = window.parent;
					
					while(parent !== parent.parent){
						parent = parent.parent;
					}
					$body = $(parent.document.body);
					
					//새 탭을 호출하는 경우  confirm dialog를 띄우기 위한 처리.(ex. forumHomeFrame.jsp)
					if(window.parent.frames["bodyFrame"]){
						$body=$(window.parent.frames["bodyFrame"].document.body);
					}
				}

				if($body.find('#naon-cmm-confirm').length > 0) return;
				
				$body.append($div);

				$div.dialog({
					dialogClass: "system_alert_lyr system_warning",
					autoOpen: true,
					modal: true,
					resizable: false,
					show: ( opt.htmltype ? 'fade' : { effect: "blind", duration: 300 }),
					hide: "fade",
					width: $targetType == 'msgr'? "300px" : "500px",
					position: {using : function(){
						try {
							var left;
							if($targetType == 'msgr'){
								left = ($body.width()-$(this).width())/2;
							}else{
								left = ($body.width()/2)-($(this).width()/2);
							}
							$(this).css('left', left+'px');
							//$(this).css('top', top+'px');
							//var top = $body.height()/2-100;
						} catch (e) {
							$(this).css('left', '50px');
						}
						$(this).css('top', '30px');
					}},
					open : function(event, ui){
						naon.ui.activeXViewer.toggle(true);
						if($(this).closest('.ui-effects-wrapper').length > 0){
							$(this).closest('.ui-effects-wrapper').next().css('z-index', $(this).parent().css('z-index')-1);
						}else{
							$(this).parent().next().css('z-index', $(this).parent().css('z-index')-1);
						}
					},
					close : function(){
						naon.ui.activeXViewer.toggle(false);
						$(this).dialog('destroy');
						$(this).remove();
						callback(radioValue);
					}
				});

                var radioValue;
                $div.find('#naon-cmm-confirm-ok').on('click', function(){
                    //라디오버튼 값 체크
                    radioValue = $("input:radio[name='chk_info']:checked").val();

					if(confirmCallback) callback = confirmCallback;
					$div.dialog('close');
				});
				
				$div.find('#naon-cmm-confirm-cancel').on('click', function(){
					if(cancelCallback) callback = cancelCallback;
					$div.dialog('close');
				});

			},
			
			/**
			 *  그룹웨어 alert 및 confirm 사용시 actvieX 로 인하여 레이어창이 뒤로 숨는 문제를 해결하기 
			 *  위하여 추가함
			 */
            activeXViewer : {
            	callPdfViewerCnt : 0, //pdf viewer 호출체크
            	callHwpViewerCnt : 0, //hwp viewer 호출체크
            	
				toggle : function(isVisible){
					this.pdfViewer(isVisible);
					this.hwpViewer(isVisible);
				},
				
				/**
				 * PDF 액티브x 
				 */
				pdfViewer : function(isVisible){
					if(naon.util.ieVersion() == '11'){
						var $pdfViewer = $(window.document.body).find('embed[class="_pdfViewer"]');
						if($pdfViewer.length > 0){
							var viewerTemp = '<div class="pdf_viewer _pdfBlind" style="height:780px;"><div class="guide_txt">'+naon.i18n.msgFormat(common_text_canNotBeInqured)+'</div></div>';
							var $pdfBlind = $pdfViewer.siblings('._pdfBlind');
							
							if(typeof(isVisible) === "undefined"){
								isVisible = pdfViewer.is(':visible');
							}
							
							if(isVisible){
								$pdfViewer.hide();
								if($pdfBlind.length > 0){
									$pdfBlind.show();
								}else{
									$(viewerTemp).insertAfter($pdfViewer);
								}
								this.callPdfViewerCnt ++; 
							}else{
								if(this.callPdfViewerCnt < 2){
									$pdfViewer.show();
									if($pdfBlind.length > 0){
										$pdfBlind.hide();
									}
									this.callPdfViewerCnt = 0;
								}else{
								   this.callPdfViewerCnt --;
								}
								
							}
						}
					}
				},
				
				/**
				 * PDF 액티브x 실형
				 */
				hwpViewer : function(isVisible){
					var $hwpCtrl = $(window.document.body).find('object[id="HwpCtrl"]');
					if($hwpCtrl.length > 0){
						var viewerTemp = '<div class="hwp_object _hwpBlind" style="height:780px;"><table class="hwp_tbl"><tbody>'
							     +'<tr><td class="hwp_t"><div class="hwp_tl"><div class="hwp_tr"></div></div></td></tr>'
							     +'<tr><td class="hwp_m"><div class="hwp_ml"><div class="hwp_mr"><div class="guide_txt">'+naon.i18n.msgFormat(common_text_canNotBeInqured)+'</div></div></div></td></tr>'
							     +'<tr><td class="hwp_b"><div class="hwp_bl"><div class="hwp_br"></div></div></td></tr></tbody></table></div>';
						var $hwpBlind = $hwpCtrl.siblings('._hwpBlind');
						
						if(typeof(isVisible) === "undefined"){
							isVisible = $hwpCtrl.is(':visible');
						}
						
						if(isVisible){
							$hwpCtrl.hide();
							if($hwpBlind.length > 0){
								$hwpBlind.show();
							}else{
								$(viewerTemp).insertAfter($hwpCtrl);
							}
							this.callHwpViewerCnt ++; 
						}else{
							if(this.callHwpViewerCnt < 2){
								$hwpCtrl.show();
								if($hwpBlind.length > 0){
									$hwpBlind.hide();
								}
								this.callHwpViewerCnt = 0;
							}else{
								this.callHwpViewerCnt --;
							}
							
						}
						
					}
				},
			},
			
			/**
			 * 그룹웨어 스크롤 영역의 class 명이 ('division_view_scroll'과 'doc_view_scroll') 일때 스크롤시 Top 버튼이 생기고,
			 * 클릭시 맨위로 스크롤이 이동도되록 처리 
			 *
			 * target : view_scroll 영역의 element 또는 element id
			 * 
			 */
			applyViewScrollTop : function(target){
				var target = (typeof target == "string") ? $(target).get(0) : target;
				
				if($(target).length == 0) return;
				
				if($(target).closest('body').hasClass("gw_sub")){
					
					if($("#wksMain_btnPageTop").length > 0){
						$("#wksMain_btnPageTop").parent().parent().removeClass("show_top");
						
						var $pageTopBtn = $("#wksMain_btnPageTop");
						
						if($pageTopBtn){
							var top = 1;
						 	$(target).off().on("scroll", function (event) {
								var pt = $(this).scrollTop();
								if (pt > top) {
									$pageTopBtn.parent().parent().addClass('show_top');
								} else {
									$pageTopBtn.parent().parent().removeClass('show_top');
								}
							});
						 	
						 	$pageTopBtn.click(function(){
					 			$(target).animate({scrollTop:0}, 'fast');
						 	});		
						}
						
					}else{
						$(target).parent().removeClass("show_top");
						
						if($(target).find(".page_top_lyr").length > 0){
							var top = 1;
						 	$(target).off().on("scroll", function (event) {
								var pt = $(this).scrollTop();
								if (pt > top) {
									$(target).parent().addClass('show_top');
								} else {
									$(target).parent().removeClass('show_top');
								}
							});
						 	
						 	$(target).find('.page_top_lyr .page_top').off().click(function(){
					 			$(target).animate({scrollTop:0}, 'fast');
						 	});						
						}		
					}									
				}
			},
			
			applyViewScrollTopForPopup : function(target){
				var target = (typeof target == "string") ? $(target).get(0) : target;
				
				if($(target).length == 0) return;
				
				if($(target).closest('body').hasClass("gw7_popup_body")){
					$(target).parent().removeClass("show_top");
					
					if($(target).find(".page_top_lyr").length > 0){
						var top = 1;
					 	$(target).off().on("scroll", function (event) {
					 		var pt = $(this).scrollTop();
							if (pt > top) {
								$(target).parents('body').addClass('show_top');
							} else {
								$(target).parents('body').removeClass('show_top');
							}
						});
					 	
					 	$(target).find('.page_top_lyr .page_top').off().click(function(){
				 			$(target).animate({scrollTop:0}, 'fast');
					 	});						
					}
				}
			}
        };





        // ---------------------------------------------------------------------------------- Paging
        /**
         * 페이지 목록을 처리하는 클래스.
         */
        naon.paging =  {

                //    처음    이전    (1) 2 3 4 5 6 7 8 9 10   다음   마지막
                //    First   Prev    Select                   Next    Last
                options : {
                    divId: "paging",
                    pageObject: "",
                    funcName: "",    // 링크 클릭시 호출할 함수 이름
                    pageNo : 1,        // 현재 선택된 페이지 번호
                    listBlock : 10,    // 목록의 출력 갯수
                    pageBlock: 10,     // 페이지 목록의 수
                    totalCount:0,      // 전체 데이터 행의 수
                    tempNo:0,
                    showImage: true    // 이미지 표시여부( default : true)
                },



                /**
                 * 페이지의 항목 목록의 시작번호를 구한다.
                 * @pageNo  페이지 번호
                 * @listBlock 페이지에 출력할 목록 번호
                 */

                getStartNum : function(pageNo, listBlock) {
                    return (pageNo * listBlock) - listBlock + 1;
                },// getStartNum
                /** 전체 페이지 수 */
                getTotalPageCnt : function(options) {

                    var t = options.totalCount / options.listBlock;
                    var i = Math.floor(t);
                    if(options.totalCount % options.listBlock  > 0) {
                        i++;
                    }
                    return i;
                },
                /**
                 * @deprecated naon.string로 이동함
                 */
                isEmpty : function(str) {
                    return (str == null || str == "") ? true: false;
                },
                getNavigator : function(settings, flag) {

                    var opts = $.extend(naon.paging.options, settings);
                    var html = "";
                    // pageBlockNo은 0 부터 시작
                    // page block은  "1 2 3 4 5 6 7 8 9 10"과 같이 표시할 페이지 목록의 갯수를 묶는 단위로
                    // 10개씩 페이지 블럭을 묶으면  전체 페이지가 13개라고 하면 2대의 page block이 생긴다.
                    // 첫번째 페이지 블럭은 0, 그다음은 1이다.
                    //
                    var totalPageCnt = naon.paging.getTotalPageCnt(opts);         // 전체 페이지수
                    var pageBlockNo = Math.floor(opts.pageNo / opts.pageBlock);   // 선택페이지의 블럭 번호
                    var lastPageBlockNo = Math.floor( totalPageCnt / opts.pageBlock); // 마지막 페이지블럭 번호
                    
                    if(opts.pageNo % opts.pageBlock == 0) pageBlockNo = pageBlockNo - 1;
                    
                    if(flag == 2){ //메일 편지지 관리에서 사용
                    	html = "<ul>";
                    	var liPrev = '<li><a class="page_prev"  href="javascript:{{funcName}}({{pageNo}});" ><span class="hide">Prev</span></a></li>';
                    	var liNext = '<li><a class="page_next"  href="javascript:{{funcName}}({{pageNo}});" ><span class="hide">Next</span></a></li>';
                    	
                    	var prevPage = 0;
                    	if(opts.pageNo <= 1){
                    		prevPage = 1;
                    	}else{
                    		prevPage = opts.pageNo-1;
                    	}                    	
                    	var formatData = {
                                funcName  : opts.funcName,
                                pageNo    : prevPage
                            };                    
                        html +=  Mustache.to_html(liPrev, formatData);
                        
                        var nextPage = 0;
                    	if(opts.pageNo >= totalPageCnt){
                    		nextPage = totalPageCnt;
                    	}else{
                    		nextPage = opts.pageNo+1;
                    	}
                    	var formatData = {
                                funcName  : opts.funcName,
                                pageNo    : nextPage
                            };
                    	html +=  Mustache.to_html(liNext, formatData);
                    	html += "</ul>";
                    } else if(flag == 3){ //모바일 용
	                    var liPrev       = '<a  href="javascript:void(0);" onclick="javascript:{{funcName}}({{pageNo}}); return false;"><span class="prev">{{displayNm}}</span></a>';
	                    var liActivePage = ' <a href="javascript:void(0);" class="on">{{pageNo}}</a>';
	                    var liPage       = ' <a href="javascript:void(0);" onclick="javascript:{{funcName}}({{pageNo}}); return false;">{{pageNo}}</a>';
	                    var liNext       = ' <a href="javascript:void(0);" onclick="javascript:{{funcName}}({{pageNo}}); return false;"><span class="next">{{displayNm}}</span></a>';
	
	                    // 이전
	                    if(!opts.autoHideAdjacent || pageBlockNo > 0 ){
	
	                       var prevPageBlock = pageBlockNo -1;  // 이전 페이지 블럭
	                       var prevPageNo    = prevPageBlock *  opts.pageBlock + 1; // 이전 페이지 블럭의 첫 페이지
	                       if(prevPageNo < 1) prevPageNo = 1;
	                          var formatData = {
	                                    funcName  : opts.funcName,
	                                    pageNo    : prevPageNo,
	                                    displayNm : opts.prevDisplayNm  == undefined ? "Prev" : opts.prevDisplayNm 
	                                };
	                          //html += $.format(liPrev, formatData);
	                          html +=  Mustache.to_html(liPrev, formatData);
	                    }//

	                    // 페이지 영역
	                    for(var i= pageBlockNo * opts.pageBlock +1; i <= pageBlockNo * opts.pageBlock + opts.pageBlock; i++) {
	                        if(i > totalPageCnt) break;
	                        if(i == opts.pageNo) {
	                            var formatData = {
	                                    pageNo : i
	                                };
	                            //html += $.format(liActivePage, formatData);
	                            html +=  Mustache.to_html(liActivePage, formatData);
	                        }else {
	                            var formatData = {
	                                    funcName  : opts.funcName,
	                                    pageNo    : i
	                                };
	                            //html += $.format(liPage, formatData);
	                            html +=  Mustache.to_html(liPage, formatData);
	                        }
	                    }// for
	
	
	                    // 다음
	                    if(!opts.autoHideAdjacent ||   pageBlockNo < lastPageBlockNo ) {
	                    	var nextPageBlockNo = pageBlockNo + 1;	                        
	                    	var nextPageNo = (nextPageBlockNo * opts.pageBlock) + 1;
	                   	                    	
	                        if(totalPageCnt == 0){
	                        	nextPageNo = 1;
	                        }else if(nextPageNo > totalPageCnt) {
	                            nextPageNo = totalPageCnt;
	                        }
	
	                            var formatData = {
	                                    funcName  : opts.funcName,
	                                    pageNo    : nextPageNo,
	                                    displayNm : opts.nextDisplayNm == undefined ? "Next" : opts.nextDisplayNm              
	                                };
	                                //html += $.format(liNext, formatData);
	                                html +=  Mustache.to_html(liNext, formatData);
	                    }// 다음
	
                    } else {
	                    var liFirst      = '<li><a class="page_frst" href="javascript:void(0);" onclick="javascript:{{funcName}}({{pageNo}}); return false;"><span class="hide">First</span></a></li>';
	                    var liPrev       = '<li><a class="page_prev"  href="javascript:void(0);" onclick="javascript:{{funcName}}({{pageNo}}); return false;"><span class="hide">Prev</span></a></li>';
	                    var liActivePage = '<li class="active"><span>{{pageNo}}</span></li>';
	                    var liPage       = '<li><a href="javascript:void(0);" onclick="javascript:{{funcName}}({{pageNo}}); return false;">{{pageNo}}</a></li>';
	                    var liNext       = '<li><a class="page_next"  href="javascript:void(0);" onclick="javascript:{{funcName}}({{pageNo}}); return false;"><span class="hide">Next</span></a></li>';
	                    var liLast       = '<li><a class="page_last"  href="javascript:void(0);" onclick="javascript:{{funcName}}({{pageNo}}); return false;"><span class="hide">Last</span></a></li>';
	
	                    html = "<ul>";
	                    // 처음
	                    if(!opts.autoHideAdjacent || pageBlockNo > 0)  {
	                        var formatData = {
	                                    funcName  : opts.funcName,
	                                    pageNo    : 1
	                                };
	                            //html +=  $.format(liFirst, formatData);
	                            html +=  Mustache.to_html(liFirst, formatData);
	                    }// autoHideAdjacent
	
	
	
	                    // 이전
	                    if(!opts.autoHideAdjacent || pageBlockNo > 0 ){
	
	                       var prevPageBlock = pageBlockNo -1  // 이전 페이지 블럭
	                       var prevPageNo    = prevPageBlock *  opts.pageBlock + 1; // 이전 페이지 블럭의 첫 페이지
	                       if(prevPageNo < 1) prevPageNo = 1;
	                          var formatData = {
	                                    funcName  : opts.funcName,
	                                    pageNo    : prevPageNo
	                                };
	                          //html += $.format(liPrev, formatData);
	                          html +=  Mustache.to_html(liPrev, formatData);
	                    }//

	                    // 페이지 영역
	                    for(var i= pageBlockNo * opts.pageBlock +1; i <= pageBlockNo * opts.pageBlock + opts.pageBlock; i++) {
	                        if(i > totalPageCnt) break;
	                        if(i == opts.pageNo) {
	                            var formatData = {
	                                    pageNo : i
	                                };
	                            //html += $.format(liActivePage, formatData);
	                            html +=  Mustache.to_html(liActivePage, formatData);
	                        }else {
	                            var formatData = {
	                                    funcName  : opts.funcName,
	                                    pageNo    : i
	                                };
	                            //html += $.format(liPage, formatData);
	                            html +=  Mustache.to_html(liPage, formatData);
	                        }
	                    }// for
	
	
	                    // 다음
	                    if(!opts.autoHideAdjacent ||   pageBlockNo < lastPageBlockNo ) {
	                    	var nextPageBlockNo = pageBlockNo + 1;	                        
	                    	var nextPageNo = (nextPageBlockNo * opts.pageBlock) + 1;
	                   	                    	
	                        if(totalPageCnt == 0){
	                        	nextPageNo = 1;
	                        }else if(nextPageNo > totalPageCnt) {
	                            nextPageNo = totalPageCnt;
	                        }
	
	                            var formatData = {
	                                    funcName  : opts.funcName,
	                                    pageNo    : nextPageNo
	                                };
	                                //html += $.format(liNext, formatData);
	                                html +=  Mustache.to_html(liNext, formatData);
	                    }// 다음
	
	
	                    // 마지막
	                    if(!opts.autoHideAdjacent || ( pageBlockNo < lastPageBlockNo)) {
	
	                        var totalCnt = naon.paging.getTotalPageCnt(opts);
	                        var formatData = {
	                                    funcName  : opts.funcName,
	                                    pageNo    : opts.totalCount>0?naon.paging.getTotalPageCnt(opts):1
	                                };
	                            //html += $.format(liLast, formatData);
	                            html +=  Mustache.to_html(liLast, formatData);
	                    }// 마지막
	
	                    html += "</ul>";
                    }

              /*
                    var pagingDiv = '<div id="{divId:s}" class="pagination">{navi:s}</div>';
                    var fmtData = {
                        navi       : html,
                        divId      :   opts.divId
                    }
                    return   $.format(pagingDiv, fmtData);
                    */
                    return  html;

                },// getNavigator
                /**
                 * 다음 페이지 번호를 구한다.
                 * @param settings
                 */
                getNextPageNo : function(settings) {

                    var opts = $.extend(naon.paging.options, settings);
                    var totalPageCnt = naon.paging.getTotalPageCnt(opts);         // 전체 페이지수
                    var data = {};
                	var nextPage = 0;
                	if(opts.pageNo >= totalPageCnt){
                		nextPage = totalPageCnt;
                	}else{
                		nextPage = opts.pageNo+1;
                	}
                	
                	data.nextPage = nextPage;
                	data.lastPage = opts.totalCount>0?totalPageCnt:1;
                	return data;
                }
        };

		// ------------------------------------------------------------------------ openUi
		/**
		 * 공개된 ui를 제공하는 클래스.
		 */
		naon.openUi = {
			/** 게시판 글등록 팝업. */
			brdAtclRegPopup: function(data) {
				this.callPopup(data, 'brdAtclRegPopup', '/view/board/article/brdAtclRegPopup', 830, 700, 1, 1, 0, 0, 1);
			},

			/** 메일등록 팝업. */
			emlMailRegPopup: function(data) {
				this.callPopup(data, 'emlMailRegPopup', '/view/eml/emlMailRegPopup', 950, 720, 1, 1, 0, 0, 1);
			},
			/**쪽지등록 팝업. */
			notNoteRegPopup: function(data) {
				var that = this;
				 // 발송자의 쪽지용량 체크처리 
				var options = {
						url : '/service/not/selectUserQuotaInfo',
						type : 'post',
						success : function(res, statusText) {
							var userSize = Number(res.data.user_quota); //사용자 할당량
							var useSize = Number(res.data.user_useSize); //사용량
							if(useSize>=userSize){
								naon.ui.alert({
		 							message : common_space_not_enough 
		 						});
		 						return false;
							}else{
								that.callPopup(data, 'notNoteRegPopup', '/view/not/notNoteRegPopup', 990, 600, 1, 1, 0, 0, 1);
							}
						}
				};
				naon.http.ajax(options);
			},
			/**일정등록 팝업. */
			scdScheduleRegPopup: function(data) {
				this.callPopup(data, 'scdScheduleRegPopup', '/view/schedule/sche/scdInsertSchedulePopup', 830, 700, 1);
			},
			/**포틀릿추가 팝업**/
			ptlMyPortletRegPopup: function(data) {
				this.callPopup(data, 'ptlMyPortletRegPopup', '/view/myPortlet/ptlMyPortletRegPopup', 500, 440, 1);
			},
			/**그룹웨어 알림 팝업**/
			homGwPushPopup: function(data) {
				var date = new Date();
				this.callPopup(data, 'homGwPushPopup'+date.getTime(), '/view/home/homGwPushPopup', 350, 190, 0, 0, 0, 0, 0);
			},
			/** 설문 등록 팝업**/
			surSurveyRegPopup: function(data) {
				this.callPopup(data, 'surSurveyRegPopup', '/view/sur/surveyWritePopup', 990, 750, 1, 1, 0, 0, 1);
			},
			/** 자원 등록 팝업**/
			resReserveRegPopup: function(data) {
				this.callPopup(data, 'resReserveRegPopup', '/view/reservation/resInsertDetailPopup', 904, 850, 1);
			},
			/** 
			 * 즐겨찾기 레이어 팝업 param 정보
			 * 
			 * 호출 예제 
			 * $("#bookmakrAddBtn").click(function(){
				param={
						bookmarkTitle: "즐겨찾기명",
						bookmarkUrl : "즐겨찾기 Url", (URL 값으로 중복 체크하기때문에 URL은 유일한 값이 되어야한다.) 
						bookmarkTarget : "_blank" (_blank : 새창 , subBody : 본문 , popup: 팝업 )
						linkSystemId : "1001" (해당 모듈의 TGRT_SYS_ID 값)
					}
					naon.openUi.loadMbkDialog(param);
				})
			 * 
			 */
			loadMbkDialog : function(param){
				var $mbkAddDialog = $('<div id="bookmarkDialog"></div>').appendTo(document.body);
				$mbkAddDialog.load(
						frameworkProperties.context+"/inc/myBookmark/mbkBookmarkLyr?bookmarkTarget="
						+param.bookmarkTarget+"&bookmarkTitle="+encodeURIComponent(param.bookmarkTitle)+"&bookmarkUrl=" 
						+ encodeURIComponent(param.bookmarkUrl)+"&linkSystemId="+param.linkSystemId).dialog({
							title : common_title_addBookmark,
				    		autoOpen: true,
				    		resizable : false,
				    		show: "fade",
				    		hide: "fade",
                            modal: true,
				    		position : {my: "top", at: "top", of: window},
				    		width : "380",
				    		close : function(){
				    			$(this).dialog('destroy');
				    			$(this).remove();
				    		}
						});
			},
			/** 업무관리 등록 팝업 **/
			worWorkRegPopup: function(data){
				this.callPopup(data, 'worWorkRegPopup', '/view/work/box/worWorkBoxSelectPopup', 882, 565, 1, 1, 0, 0, 1);
			},
			/** 결재 작성 팝업 
			 *  intrlck = {
			 *	     trgtId : 'AW149545267114825972779', //결재업무코드
			 *	     cdVal : 'ATN' //결재연동업무 코드
			 *	 };
			 * **/
			appDocRegPopup: function(intrlck, data, callback){
				var messageFun = function(){
					naon.ui.alert({
						message : common_alert_noAppIntrlckWork, /*결재 연동 업무가 존재하지 않습니다.*/
						callback : function(){
						}
					});
				}
				
				if(!intrlck || !intrlck.trgtId){
					messageFun();
					return false;
				}
				
				var me = this;
				var options = {
						url : '/service/app/eapp/work/selectIntrlckCode',
						data : JSON.stringify(intrlck),
						contentType : 'application/json',
						dataType : 'json',
						useWrappedObject : true,
						target : document.body,
						type : 'post',
						success : function(res, statusText) {
							if(res.data.length > 0){
								if(res.data[0].sysType=='G'){
									me.gapDocRegPopup(res.data[0].cdVal, data);
									if(callback) callback();
								}else{
									me.eapDocRegPopup(res.data[0].cdVal, data);
									if(callback) callback();
								}
							}else{
								messageFun();
							}
						}
				};
				naon.http.ajax(options);
			},
			
			/** 결재 작성 팝업 
			 *  intrlckCd : 결재연동업무 코드
			 * **/
			appDocRegCdPopup: function(intrlckCd, data){
				if(frameworkProperties.appSys == 'G'){
					this.gapDocRegPopup(intrlckCd, data);
				}else{
					this.eapDocRegPopup(intrlckCd, data);
				}
			},
			
			/** 기업결재 작성 팝업 **/
			eapDocRegPopup: function(intrlckCd, data){
				if(loginUserInfo.mobileAppLoginYn == 'Y'|| naon.util.isMobileUrl() || naon.isMobile.any()){
					var param = $.extend(data || {}, {'action': 'eapDocReg', 'pageName': 'eapDocReg', 'regDeptId': loginUserInfo.deptId, "intrlckCd" : intrlckCd, 'data': encodeURIComponent($.toJSON({"action" : {"appMode" : "WF","intrlckCd" : intrlckCd || 'none'}}))});
					var url = '/ekp/moblmain/moapp/eapp/eapMain';
					url = url + (url.indexOf('?') == -1 ? '?' : '&') + $.param(param);
					
					window.open(url);
				}else{
					var param = $.extend(data || {}, {'pageName': 'eapDocReg', '_DATA_': encodeURIComponent($.toJSON({"action" : {"appMode" : "WF","intrlckCd" : intrlckCd || 'none'}}))});
					naon.openUi.callPopup(param,'pop_eapDocReg', '/view/app/eapp/document/eapDocPopup', 1000, 800, 1, 1, 0, 0, 1);
				}
			},
			
			/** 공공결재 작성 팝업 **/
			gapDocRegPopup: function(intrlckCd, data){
				var param = $.extend(data || {}, {'pageName': 'gapDocReg', '_DATA_': encodeURIComponent($.toJSON({"intrlckCd" : intrlckCd || 'none'}))});
				var url = '/view/app/gapp/gapInterlockAppReg';
				
				if ("W" == frameworkProperties.gapHwpType) {	// 웹한글 기안기 사용.
					url += '?frameurl=' + frameworkProperties.context + frameworkProperties.webHwpPageUrl;
				}
				naon.openUi.callPopup(param,'pop_eapDocReg', url, 1350, 950, 1, 1, 0, 0, 1);
			},
			
			/** popup을 호출. */
			callPopup: function(data, popName, url, w, h, s, c, t, l, r) {
				var f= this.buildFormData('openUi_callForm', data);
				$.popupWindow({
					windowURL: 'about:blank',
					windowName: popName,
					width: w,
					height: h,
					centerScreen: c === undefined ? 1 : c,
					scrollbars: s,
					top: t,
					left: l,
					resizable: r || 0
				});

				f[0].target = popName;
				
				if (url.search(/^http[s]?\:\/\//) == -1) {
                    f[0].action = frameworkProperties.context+url;
	            }else{
	            	f[0].action = url;
	            }
				
				f[0].submit();
				f.remove();
			},
			buildFormData: function(formName, data, target) {
				var f = $('#' + formName),
					iArr= [],
					name = null;
	
				if (!f.length) {
					f = $('<form id="' + formName + '" name="'+formName+'" method="post" onsubmit="return false;"/>');
					f.appendTo(target ? $('#' + target) : document.body);
				}
	
				if(data) {
					if($.isArray(data)) {
						$.each(data, function(i, item) {
							if(item.type == 'html') {
								iArr.push('<textarea name="'+item.name+'" style="width:1;height:1;display:none">'+(item.value || '')+'</textarea>');
							} else {
								iArr.push('<input type="hidden" name="'+item.name+'" value="' +(item.value || '')+ '"/>');
							}
						});
					} else {
						for (name in data) {
							if(data.hasOwnProperty(name)){
								iArr.push('<input type="hidden" name="'+name+'" value="' +(data[name] || '')+ '"/>');
							}
						}
					}
				}
				f.html(iArr.join(''));
				return f;
			},
			popupByInterface: function(options){
				if(loginUserInfo.mobileAppLoginYn=='Y'){
					var url = options.url;
					if(options.data) {
						url = url + (url.indexOf('?') == -1 ? '?' : '&') + $.param(options.data);
					}
					/*if(naon.isMobile.Android()){
						window.JSInterface.openAdressbookPage(encodeURIComponent(url));
					} else if(naon.isMobile.IOS()){
						window.location = "jscall://openAdressbookPage?url="+encodeURIComponent(encodeURIComponent(url));
					}*/
					window.open(url);
				} else if(options.data) {
					var f = this.buildFormData(options.formId, options.data);
					window.open('', options.target);
					f[0].target = options.target;
					f[0].action = options.url;
					f[0].submit();
					if(options.cleanForm) {
						f.empty();
					}
				} else {
					window.open(options.url);
				}
			},
			closeByInterface: function() {
				if(loginUserInfo.mobileAppLoginYn=='Y'){
					if(naon.isMobile.Android()){
						if(typeof window.JSInterface.adressbookClose != "undefined"){
							window.JSInterface.adressbookClose();
						} else {
							window.close();
						}
					} else if (naon.isMobile.IOS()) {
						if(window.location = "jscall://adressbookClose" != "undefined"){
							window.location = "jscall://adressbookClose";
						}else{
							window.close();
						}
					}
				} else {
					window.close();
				}
			},
			preview: {
				open: function(file) {
					naon.openUi.preview.initData(file);
				},
				able: function(f) {
					if(frameworkProperties.imageConvertUseYn != 'Y' || !loginUserInfo)  return false;
					if(!this.previewCfg) {
						this.loadCfg();
					}
					if(!this.previewCfg.allowExtsn || !f) {
						return false;
					}
					var fileExtsn = (typeof f === 'string') ? f : f.fileExtsn;
					if(!fileExtsn) {
						return false;
					}
					return fileExtsn && $.inArray(fileExtsn.toLowerCase(), this.previewCfg.allowExtsnArr) != -1;
				},
				loadCfg: function() {
					var me = this;
					naon.http.ajax({
						url : '/service/config/selectFilePreview',
						async: false,
						success : function(res) {
							me.previewCfg = res.data || {};
							var allowExtsnArr = null;
							if(me.previewCfg.allowExtsn) {
								allowExtsnArr = me.previewCfg.allowExtsn.split(';');
							}
							me.previewCfg.allowExtsnArr = allowExtsnArr || [];
						}
					});
				},
				hasMoblDownAuth: function(fileInfo) {
					if(frameworkProperties.imageConvertUseYn != 'Y')  return true;
					if(!this.previewCfg) {
						this.loadCfg();
					}
					//모든 사용자 허용
					if(this.previewCfg.downAuthSetupSe == 'A' || loginUserInfo.supervisor) {
						return true;
					}
					
					//미리보기 불가능한 파일만 다운로드 가능 옵션일 경우, 미리보기 불가능한 파일인 경우 true반환
					else if (this.previewCfg.downAuthSetupSe == 'I' && fileInfo &&
							-1 == $.inArray(fileInfo.fileExtsn, this.previewCfg.allowExtsnArr)) {
						return true;
					}
					if(!this.downCfg) {
						var me = this;
						naon.http.ajax({
							url : '/service/config/selectMyDownAuth',
							async: false,
							success : function(res) {
								me.downCfg = res.data || {};
							}
						});
					}
					return this.downCfg.fileDownAuthYn == 'Y';
				},
				initData : function(file){
					//이파피루스 PDF변환 솔루션 streamDocsVu! 제품일 경우
					if(frameworkProperties.imageConvertProduct && frameworkProperties.imageConvertProduct.toLowerCase().indexOf('epapyrus_streamdocsvu') > -1) {
						naon.custom.epapyrusPreviewOpen(file);
						return;
					}
					var options = {
							url : '/service/openapi/IF_GWER_018_svrTimeEncrpt',
							type : 'post',
							dataType : "text",
							success : function(res, statusText) {
								var date = JSON.parse(res);
								var cryptDt = date.cryptDt;
								var downloadPath = frameworkProperties.serverUrl + frameworkProperties.context+'/service/openapi/IF_GWER_016_downloadPreviewFile?'
								+ encodeURI('realFileName='+ file.realFileName 
								+'&fileName='+ (file.localFileName||file.fileName) 
								+'&fileUrl='+ file.fileUrl 
								+'&userId=' + loginUserInfo.userId
								+'&dateTimeStr='+ encodeURIComponent(cryptDt));
								var fileExt = file.realFileName.substring(file.realFileName.lastIndexOf('.')+1, file.realFileName.length).toLowerCase();
								var pageUrl;
								var data;
								var url;
								
								/**
								 * WINDOWS 서버일경우
								 */
								if('SAT_WINDOWS' == frameworkProperties.imageConvertProduct){
									convertUrl = frameworkProperties.imageConvertServer	+ "/?url="+downloadPath 
												+ "&ext="+fileExt 
												+ "&page=[PAGE]&size=1920*1080&type=jpg&webid=SATINFO&signcode=";
			
									switch (fileExt) {
									case 'zip':
										pageUrl = '/mzview_scroll.php'; 
										break;
									case 'xls': case 'xlsx' :
										pageUrl = '/mxview_scroll.php'; 
										break;
									default : 
										pageUrl = '/mview_scroll.php';
										break;
									}
									
									url = frameworkProperties.imageConvertUIServer + pageUrl;
									data = {
											FEXT: fileExt,
											FURL: convertUrl,
											FFILENAME: file.realFileName,
											FENCRYPT: 0,
											mobileAppLoginYn: loginUserInfo.mobileAppLoginYn	
									}
								}else if('SAT_LINUX' == frameworkProperties.imageConvertProduct){
									pageUrl = '/docugate/viewer/document/docviewer.do';
									url = frameworkProperties.imageConvertServer + pageUrl;
									data = {
											fileext: fileExt,
											filepath: downloadPath,
											filename: file.realFileName,
											viewerselect: 'image',
											mobileAppLoginYn: loginUserInfo.mobileAppLoginYn
									};
								}
								
								previewData = {
									formId : 'openUi_previewForm',
									url : url,
									target : 'file_preview_pop',
									data : data,
									cleanForm : true
								}
								naon.openUi.popupByInterface(previewData);
							}
					};
					naon.http.ajax(options);
				}
			},
			fOpen: {
				ws: {},
				isWsConnected: false,
				isWsWaiting: false,
				unAbleExtList: ['asp','php','aspx','jsp','js','jspf','html','htm','cgi','perl','pl','smw'],//파일열기 지원하지 않는 확장자
				ableExtList: ['xls','xlsx','ppt','pptx','doc','docx','hwp'],//파일열기 후 수정 가능한 확장자
				/** 웹소켓 연결*/
				connect: function(callbackFunc){
					if((!$.isEmptyObject(this.ws) && this.isWsConnected) || this.isWsWaiting){
						return false;
					}
					
					//웹소켓이 연결되면 툴박스 설치된 것으로 간주함
					var deferred = $.Deferred();
					var that = this;
					var url = "ws://127.0.0.1:19002";
					if(frameworkProperties.ngwProtocol == 'https://'){
						url = "wss://127.0.0.1:19002";
					}
					
					try {
						var ws = new WebSocket(url);
					} catch (e) {
						console.log("########### WebSocket Error ####### :" + e);
						return false;
					}
					
					this.isWsWaiting = true;

					ws.onopen = function( evt ) {
						that.ws = ws;
						that.isWsConnected = true;
						that.isWsWaiting = false;
						deferred.resolve({code: '0'});
						if(callbackFunc) callbackFunc();
					};
					
					ws.onclose = function( evt ) {
						that.isWsConnected = false;
						that.isWsWaiting = false;
						deferred.resolve({code: '1'});
			        };
			        
			        ws.onmessage = function( evt ){
			        	var wsData = JSON.parse(evt.data);
			        	if(wsData && wsData.gwUUID){
			        		var gwUUid = wsData.gwUUID;
			        		var errMsg = wsData.data[0].error;
			        		if(errMsg){
			        			if(errMsg == 'failToUpload'){
			        				//업로드 실패
			        				that.ws['wsFileData_'+gwUUid] = {code: '1', data: wsData.data[0]};
			        				that.isWsWaiting = false;
			        			}
			        		}else{
			        			//업로드 성공
			        			that.ws['wsFileData_'+gwUUid] = {code: '0', data: wsData.data[0]};
			        			that.isWsWaiting = false;
			        		}
			        	}
			        };
			        
			        return deferred.promise();
				},
			    /** 파일열기에 사용할 파일을 서버에서 다운로드하고 열도록 요청*/
			    open: function(file, uuid) {
					//파일 열기를 수행할 파일 다운로드 경로
			    	var fileName = (file.localFileName||file.fileName);
			    	var that = this;
			    	var fileUrl = file.fileUrl.replace(/\\/gi,'/');
			    	
			    	if(!window.Promise) {
			    		$.getScript(frameworkProperties.context + '/resources/lib/promis/es6-promise.auto.min.js?t=' + frameworkProperties.jsVer);
			    	}
			    
			    	//서버 시간을 암호화해서 함께 보냄. 서버에서 파일 다운로드시 검사.
					var options = {
							url : '/service/openapi/IF_GWER_018_svrTimeEncrpt',
							type : 'post',
							dataType : "text",
							success : function(res, statusText) {
								
								var data = JSON.parse(res);
								var cryptDt = data.cryptDt;
								var path = frameworkProperties.serverUrl + frameworkProperties.context+'/service/openapi/IF_GWER_017_downloadFile?'+ 'realFileName='+
								encodeURIComponent(file.realFileName) +'&fileName='+ fileName +'&fileUrl='+ fileUrl+'&dateTimeStr='+encodeURIComponent(cryptDt);
								
								//툴박스에서 파일 열기시 필요한 데이터 포맷
								var param = {
										cmd: "office",
										lang: loginUserInfo.langCd,
										data: {
											mode: "M",
											gwUUID : uuid,
											svrFileName: fileName,//서버에 저장된 파일명
											realFileName: file.realFileName,//사용자가 지정한 파일명
											download: path,
											upload: "",
											module: '',
											uploadType: '',
											jwt: "json web token data"
										},
										extends: {
											count: 0,
											data: []
										}
								};
								
								that.send(JSON.stringify(param));
							}
					};
					naon.http.ajax(options);
				},
				/** 수정한 파일을 서버에 임시저장하도록 웹소켓 정보 전송*/
				apply: function(file, uuid, module){
					var fileName = (file.localFileName||file.fileName);
			    	var that = this;
			    	var userInfo = loginUserInfo;
			    	var path =  frameworkProperties.serverUrl + frameworkProperties.context+'/service/openapi/IF_GWER_019_uploadTempFile?module='+module+'&cmpId='+userInfo.cmpId;
					
					//툴박스에서 파일 열기시 필요한 데이터 포맷
					var param = {
							cmd: "office",
							lang: loginUserInfo.langCd,
							data: {
								mode: "U",
								gwUUID : uuid,
								svrFileName: fileName,//서버에 저장된 파일명
								realFileName: file.realFileName,//사용자가 지정한 파일명
								upload: path,
								module: module,
								uploadType: 'file',
								jwt: "json web token data"
							},
							extends: {
								count: 0,
								data: []
							}
					};
					
					that.send(JSON.stringify(param));
			    },
			    /** 파일 업로드가 완료되었는지 웹소켓으로 확인요청*/
			    chkUpload: function(file, gwUUid, callback){
			    	var that = this;
			    	var fileName = (file.localFileName||file.fileName);
			    	
			    	//툴박스에서 파일 열기시 필요한 데이터 포맷
					var param = {
							cmd: "cbUploadCompleted",
							lang: loginUserInfo.langCd,
							data: {
								gwUUID : gwUUid,
								fileName: fileName//서버에 저장된 파일명
							},
							extends: {
								count: 0,
								data: []
							}
					};
					
					var sendData = JSON.stringify(param);
					that.send(sendData);
					
					$.when(
							that.chkUploadDone(sendData, gwUUid)
						).then(function(d){
							if(d.timer){
								//응답 받은 후에는 타이머 객제 삭제
								clearInterval(d.timer);
							}
							if(d.data){
								if(callback){
									callback(d.data);
								}
							}
						});
			    },
			    /** 웹소켓의 응답을 5분간 검사. 첨부파일 체크 시간을 1초로 10회 체크후 3초로 체크*/
			    chkUploadDone: function(sendData, gwUUid){
			    	var that = this;
			    	var totalTime=1000;
			    	var gap = 1000;
			    	var cmpr = 0;
			    	return new Promise(function(resolve, reject){
			    		var data;
			    		
			    		//응답까지 최대 5분동안 검사
			    		var it = setInterval(function(){
			    			if(totalTime<300000){
			    				data = that.ws['wsFileData_'+gwUUid]; 
			    				if(data && data.error != 'fileNotFound'){
			    					//fileNotFound : 파일찾지 못함. 파일 생성중일 수 있음.
			    					resolve($.extend(data, {timer: it}));
			    				}else{
			    					that.send(sendData);
			    				}
			    			}
			    			
			    			if(cmpr < 10) gap = 1000;
			    			else gap = 3000;
			    			
			    			cmpr++;
			    			totalTime+=gap;
			    		}, gap);
			    	});
			    },
			    /** 웹소켓으로 데이터 전송*/
			    send: function(param){
			    	if(!this.isWsConnected){
						$.when(
							this.connect()
						).done(function(d){
							if(d.code == '0'){
								naon.openUi.fOpen.ws.send(param);
							}else{
								naon.ui.alert({
			                        message: common_alert_toolboxNotExist/*툴박스가 설치되지 않았습니다.\n설치후 다시 로그인 하세요.*/,
			                    });
							}
						});
					}else{
						this.ws.send(param);
					}
			    },
			    //
			    /** 웹소켓 데이터로 보낼 시간형식 포맷(MMddHHmmss) */
			    getStringFmWs: function(date){
			    	var month = date.getMonth() + 1;
			    	var dt  = date.getDate();
			    	var hour = date.getHours();
			    	var min = date.getMinutes();
			    	var sec = date.getSeconds();
			    	return naon.string.lpad(month.toString(), 2, '0')  +  naon.string.lpad(dt.toString(), 2, '0') +  naon.string.lpad(hour.toString(), 2, '0')
                    +  naon.string.lpad(min.toString(), 2, '0') +  naon.string.lpad(sec.toString(), 2, '0');
			    }
			}
		},

		/**page 표시여부에 따라 처리할 수 있도록.*/
		naon.pageVisibility = {
			bind: function() {
				if(this.binded) {
					return;
				}
				this.binded = true;
				var doc = document, hidden, vschange;

				if ((hidden = "hidden") in doc) {
					vschange = "visibilitychange";
				}else if ((hidden = "mozHidden") in doc) {
					vschange = "mozvisibilitychange";
				} else if ((hidden = "webkitHidden") in doc) {
					vschange = "webkitvisibilitychange";
				} else if ((hidden = "msHidden") in doc) {
					vschange = "msvisibilitychange";
				}

				if(vschange) {
					this.hidden = hidden;

					naon.ui.addEvent(document, vschange, $.proxy(this.onPageVisibilityChg, this));
				}
			},
			/** 페이지가 숨겨지거나 보여질 때 처리할 이벤트함수를 option파라미터에 넘김.
			 *  naon.pageVisibility.on({
			 *    onPageVisible: 페이지가 보여질때 처리함수,
			 *    onPageHidden: 페이지가 숨겨질때 처리함수
			 * });
			 * */
			on: function(option) {
				var $doc = $(document);
				this.bind();
				if(option.onPageVisible) {$doc.on('naon.page.visible', option.onPageVisible);}
				if(option.onPageHidden) {$doc.on('naon.page.hidden', option.onPageHidden);}
			},
			
			/**
			 * 이벤트 호출을 일시 중지한다.
			 */
			pause: function() {
				this.isPause = true;
			},
			
			/**
			 * 이벤트 호출을 재개한다.
			 */
			resume: function() {
				this.isPause = false;
			},
			
			onPageVisibilityChg: function() {
			
				if(this.isPause){
					return;
				}
				
				if(document[this.hidden]) {
					$(document).trigger('naon.page.hidden');
					if(this.debugMode) {
						console.log('>>>>> onPageHidden ' + new Date());
					}
				} else {
					$(document).trigger('naon.page.visible');
					if(this.debugMode) {
						console.log('<<<<< onPageVisible ' + new Date());
					}
				}
			},
			isPageVisible: function() {
				if(this.hidden && document[this.hidden]) {
					return false;
				} else {
					return true;
				}
			}
		};

        // ----------------------------------------------------------------------- Sample Object
        naon.hello = {
            aa : function() {
                alert('aaa');
                naon.hello.bb();
            },
            bb : function() {
                alert('bb');
            }
        }

//        return naon;
//    })();

        //Expose naon to the global object
    window.naon = naon;

})(jQuery);






/**
 * window에 속한 객체로 LayoutManager를 사용할 경우 화면 제어 클래스가 이미 로드되어 있는지 확인하기
 * 위해서 사용한다. 메인화면에서 VIEW 화면을 다시 로드할지를 체크하기 위한 용도로 사용한다. VIEW는
 * 화면에 로드될 때 자신을 등록한다. init function에 ViewController의 enroll 함수를 호출하여 등록
 * 한다.
 *
 * var ArticleView = {
 *    name : "ArticleView",
 *    init : function() {
 *           ViewController.enroll(ArticleView.name);
 *    }
 *
 * };
 *
 *
 * 메인 클래스에서  ViewController의 exists 함수를 호출하여 ArticleView를 다시 로드할지를 결정한다.
 *
 * if(ViewController.exists("ArticelView")) {
 *     return;   // ArticleView가 존재하면 다시 로드할 필요가 없어서  return 처리한다.
 * }
 *
 *
 */
var ViewController = {
     /** 현재 VIEW의 클래스 명 */
     currentViewClass : "",
     /**
      * VIEW 화면에서 자신을 등록할 때 사용한다.
      * @param viewClassName  제어로직의 클래스명
      */
     enroll: function(viewClassName) {
        if(ViewController.currentViewClass != "" && ViewController.currentViewClass != viewClassName) {
            window[ViewController.currentViewClass] = null;
        }
        ViewController.currentViewClass = viewClassName;
     },

     /**
      * 해당 제어로직 클래스가 등록이 되어 있는지 확인한다.
      * @param viewClassName  제어로직 클래스 명
      * @return
      *     true : 이미 로드되어 있음
      *     false: 로드되어 있지 않음.
      *
      */
     exists : function(viewClassName) {
         return (ViewController.currentViewClass == viewClassName) ? true: false;
     }
};








/**
 *   관찰자 객체에게 변경사항을 통지하는 역할을 합니다.  obervers 필드에 관찰자(Observer)를 가지고
 *   있고, View에서 notifyObservers 함수를 호출하면 순환하면서 관찰자의 update 메서드를 호출합니다.
 *   관찰자는 update 함수를 구현해야 합니다.
 *
 *   이 객체는 Observer Pattern의 응용입니다.  Observer Pattern에서는 관찰자와 Subject가 있습니다.
 *   주체(Subject)는 이 객체가 해당됩니다.  Subject는 Observer를 담고 있고, 어떤 객체에서 Subect에게
 *   변경을 통지하면, Subject가 Observer의 update 메서드를 호출하여 변경사항을 적용하도록 합니다.
 *
 *    관찰자(Observer)가 되는 객체는 update 함수를 반드시 구현해야 합니다. update 함수에는 관찰정보
 *    가 전달됨니다. 이것은 JSON 객체입니다. 이 객체의  첫번째 필드는 관찰정보에 대한 구분값으로
 *    type이며 이 타입을 이용하여 처리 방법을 분기합니다. 두번째 인자는 전달할 데이터입니다.
 *
 *    아래는 Observer 구현체의 예입니다. param.type의 값이 USER_INF_CHASNGED이면 변경사항을 처리하는
 *    코드 입니다. init 함수에서 ObserverControl에 자기 자신을 등록합니다.
 *
 *    var  ConcreteObjserver = {
 *         init : function( )  {
 *              ObserverControl.addObserver(this);
 *         },
 *         fn : {
 *             update : function(param) {
 *                 if(param.type = "USER_INFO_CHANGED") {
 *                    doSomthing();
 *                 }
 *             }
 *         }
 *     };
 *
 *
 *    아래의 코드는 ObserverControl에게 변경사항을 전달하는 코드입니다. 변경사항이 발생했을 때 다른
 *    Observer들에게 변경사항을 통지하도록 하는 예제 입니다.
 *
 *    var OtherLogicObject = {
 *
 *        fn :  {
 *           selectUser : function(pUserId) {
 *                var options = { type : "USER_INFO_CHANGED", data : { userId : pUserId}};
 *                ObserverControl.notifyObservers(options);
 *           }
 *        }
 *    }
 *
 *
 *   @author Sanghyun, Kim(sanghyun@naonsoft.com)
 */
var ObserverControl = {
    /**
     * Observer Collection
     */
    observers : [],
    /**
     * 옵져버를 등록합니다.
     * @param observer 관찰자
     */
    addObserver : function(observer) {
        // 동일한 객체가 여러개 등록되는 현상을 방지
        if(!ObserverControl.containsObserver(observer)) {
            ObserverControl.observers.push(observer);
        }else {
        	var observerIndex = ObserverControl.indexOf(observer);

        	// 현재 저장되어있는 옵저버를 새로 날라온 파라미터로 교체함(테스트 코드)
        	ObserverControl.observers[observerIndex] = observer;
        	/*

        	if(!!window[observer.name]) {
        		window[observer.name] = observer;
        	}*/
        }

        //test code
        /*
        if(observer.fn) $.extend(observer, observer.fn);

        if(observer.init) observer.init();
        if(obsever.beforeBind) observer.beforeBind();
        if(obsever.bind) observer.bind();
        if(observer.afterBind) observer.afterBind();
         */
    },
    /**
     * 관찰자를 삭제합니다.
     * @param observer 관찰자
     */
    deleteObserver : function(observer) {
        var tempObservers = [];
        for ( var i = 0; i < ObserverControl.observers.length; i++) {
            // argument에 전달된 observer를 제외하고 모아놓고 다시
        	var obj = ObserverControl.observers[i];
            if(!ObserverControl.equals(obj, observer)) {
                tempObservers.push(obj);
            }
        }
        ObserverControl.observers = tempObservers;
        // 로드되어있는 스크립트를 지움
        window[observer.name] = null;
    },
    /**
     * 관찰자에게 변경정보를 통지합니다. 변경정보는 JSON을 작성합니다.  VIEW 객체가 이 함수를 호출
     * 하는 코드는 아래와 같습니다.
     *
     *  var options  = { type:"USER_INFO_CHANGE", data : { userId: "appletree", userDept:"1022" }};
     *  ObserverControl.notifyObservers(options);
     *
     * @param param 통지할 정보, JSON Object
     */
    notifyObservers : function(param) {
        for ( var i = 0; i < ObserverControl.observers.length; i++) {
            var obj = ObserverControl.observers[i];
            if(obj.fn && obj.fn.update) obj.fn.update(param);
        }// for
    },
    /**
     * 관찰자에게 변경정보를 통지합니다. 변경정보는 JSON을 작성합니다.  VIEW 객체가 이 함수를 호출
     * 하는 코드는 아래와 같습니다.
     *
     *  var options  = { type:"USER_INFO_CHANGE", data : { userId: "appletree", userDept:"1022" }};
     *  ObserverControl.notifyObservers(options);
     *
     * @param param 통지할 정보, JSON Object
     */
    opennerNotifyObservers : function(param){
    	var len = 0;
    	if(opener){
    		//웹메신저에서 쪽지,메일 팝업 호출후 도메인이 다르기 때문에 방어코드(try, catch)
    		try{
	    		if(opener.ObserverControl){
	    			len = opener.ObserverControl.observers.length;
	    		}
    		}catch(e){
    			console.log(e.message);
    		};
    	}
    	for ( var i = 0; i < len; i++) {
            var obj = opener.ObserverControl.observers[i];
            if(obj.fn && obj.fn.update) obj.fn.update(param);
        }// for
    },
    /**
     * Observer array 에서 이미 등록된 동일한 객체가 있는지 판단한다
     * @param observer
     * @returns {Boolean}
     */
    containsObserver : function(observer) {
        for(var i = 0; i < ObserverControl.observers.length; i++) {
            var obj = ObserverControl.observers[i];

            if(ObserverControl.equals(obj, observer)) {
                return true;
            }
        }
        return false;
    },
    /**
     * Observer array에서 해당 observer가 몇번째 위치에 속해있는지 판단한다.
     */
    indexOf : function(observer) {
        for(var i = 0; i < ObserverControl.observers.length; i++) {
            var obj = ObserverControl.observers[i];

            if(ObserverControl.equals(obj, observer)) {
                return i;
            }
        }
        return -1;
    },
    /**
     * Page Object 2개가 동일한 Object인지 비교한다.
     * @param obj1
     * @param obj2
     * @returns {Boolean}
     */
    equals : function(obj1, obj2){
        /*
        for(var i in obj1) {
            if(obj1.hasOwnProperty(i)) {
                if (!obj2.hasOwnProperty(i)) return false;
                if (obj1[i] != obj2[i]) return false;
            }
        }
        for(var i in obj2) {
            if(obj2.hasOwnProperty(i)) {
                if (!obj1.hasOwnProperty(i)) return false;
                if (obj1[i] != obj2[i]) return false;
            }
        }
        return true;
        */
        // 펑션은 연산자로 동일여부를 비교할 수 없어 그냥 다음과 같은 방식으로 비교하였음
        /*
        if(obj1.name == obj2.name && obj1.mode == obj2.mode && obj1.menu == obj2.menu) {
            return true;
        } else {
            return false;
        }
        */
        if(obj1.name == obj2.name) {
           return true;
        }
        return false;
    }
};


//---------------------------------------------------------------------------------- Validation
(function( $ ){


 /**
  * HTMLT FORM 요소를 검증하기 위한 객체이다.
  */
 naon.validation =  {


         checkPattern : function(node) {
             var patternStr = $(node).attr("pattern");
             if(!patternStr) return true;

             var nodeVal = $(node).val();
             if(!nodeVal) return true;

             var reg = new RegExp(patternStr);
             var testRes = reg.test(nodeVal);
             if(!testRes) {
                 var msg = $(node).data("validation-pattern-message");
                 if(msg) { 
                	 if(naon.util.isMobileUrl()) {
                		 alert(msg);
                	 }else{
                		 naon.ui.alert({
                			 message : msg,
                			 callback : function(){$(node).focus();}
                		 });
                	 }
                 }else{
                	 $(node).focus();
                 }
                 return false;
             }
             return testRes;

         },  // checkPattern
         checkNumber: function(node) {

             if($(node).data("validation-type") != "number") return true;

             var nodeVal = $(node).val();
             if(!nodeVal) return true;

             if(!naon.string.isCurrency(nodeVal)) {
                 var msg = $(node).data("validation-number-message");
                 if(msg) { 
                	 if(naon.util.isMobileUrl()) {
                		 alert(msg);
                	 }else{
                		 naon.ui.alert({
          					message : msg,
          					callback : function(){$(node).focus();}
          				});
                	 }
                 }else{
                	 $(node).focus();
                 }
                 return false;
             }
             nodeVal = nodeVal.replace(new RegExp(",", "g"), "");
             var thisMin = $(node).attr("min");
             if(thisMin) {
                 var fMin = parseFloat(thisMin);
                 var fVal = parseFloat(nodeVal);
                 if(fVal < fMin) {
                     var msg = $(node).data("validation-min-message");
                     if(msg) { 
                    	 if(naon.util.isMobileUrl()) {
                    		 alert(msg);
                    	 }else{
                    		 naon.ui.alert({
                    			 message : msg,
                    			 callback : function(){$(node).focus();}
                    		 });
                    	 }
                     }else{
                    	 $(node).focus();
                     }
                     return false;
                 }
             } // thisMin
             var thisMax = $(node).attr("max");
             if(thisMax) {
                 var fMax = parseFloat(thisMax);
                 var fVal = parseFloat(nodeVal);
                 if(fVal > fMax) {
                     var msg = $(node).data("validation-max-message");
                     if(msg) { 
                    	 if(naon.util.isMobileUrl()) {
                    		 alert(msg);
                    	 }else{
                    		 naon.ui.alert({
                    			 message : msg,
                    			 callback : function(){$(node).focus();}
                    		 });
                    	 }
                     }else{
                    	 $(node).focus();
                     }
                     return false;
                 }
             }// thisMax

             return true;

         }, // checkNumber
         checkURL: function(node) {

             if($(node).data("validation-type") == "url") {
                 var filter = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                 var nodeVal = $(node).val();
                 if(!nodeVal) return true;
                 if(!filter.test(nodeVal)) {
                     var msg = $(node).data("validation-url-message");
                     if(msg) { 
                    	 if(naon.util.isMobileUrl()) {
                    		 alert(msg);
                    	 }else{
                    		 naon.ui.alert({
                    			 message : msg,
                    			 callback : function(){$(node).focus();}
                    		 });
                    	 }
                     }else{
                    	 $(node).focus();
                     }
                     return false;
                 }
                 return true;
             }
             return true;

         }, // checkURL

         checkEmail: function(node) {
             if($(node).data("validation-type") != "email") return true;

             var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
             var nodeVal = $(node).val();
             if(!nodeVal) return true;
             if(!filter.test(nodeVal)) {
                 var msg = $(node).data("validation-email-message");
                 if(msg) { 
                	 if(naon.util.isMobileUrl()) {
                		 alert(msg);
                	 }else{
                		 naon.ui.alert({
                			 message : msg,
                			 callback : function(){$(node).focus();}
                		 });
                	 }
                 }else{
                	 $(node).focus();
                 }
                 return false;
             }

             return true;

         }, // checkEmail
         match : function(node) {
             var matchTarget = $(node).data("validation-match-match");
             if(!matchTarget)  return true;

             if($(node).attr("type") == "text"){

                 if(!$(matchTarget)) return true;

                 var targetVal =  $(matchTarget).val();
                 if(!targetVal) {
                     var msg = $(node).data("validation-match-message");
                     if(msg) { 
                    	 if(naon.util.isMobileUrl()) {
                    		 alert(msg);
                    	 }else{
                    		 naon.ui.alert({
                    			 message : msg,
                    			 callback : function(){$(node).focus();}
                    		 });
                    	 }
                     }else{
                    	 $(node).focus();
                     }
                     return false;
                 }else {
                     if(targetVal == $(node).val()) {
                         return true;
                     }
                     var msg = $(node).data("validation-match-message");
                     if(msg) { 
                    	 if(naon.util.isMobileUrl()) {
                    		 alert(msg);
                    	 }else{
                    		 naon.ui.alert({
                    			 message : msg,
                    			 callback : function(){$(node).focus();}
                    		 });
                    	 }
                     }else{
                    	 $(node).focus();
                     }
                     return false;
                 }
             } // type == text
             return true;
         },
         
         checkPeriod : function(node) {
        	 if($(node).data("validation-type") != "date") return true;
        	 
        	 var filter = "\D";
        	 var nodeVal = $(node).val();
        	 if(!nodeVal) return true;
        	 nodeVal = nodeVal.replace(new RegExp(filter, "g"), '');
        	 
        	 var thisMin = $(node).attr("min").replace(new RegExp(filter, "g"), '');
        	 if(thisMin) {
        		 var IMin = parseInt(thisMin,10);
        		 var IVal = parseInt(nodeVal,10);
        		 if(IVal < IMin) {
        			 var msg = $(node).data("validation-min-message");
        			 if(msg) {
        				 if(naon.util.isMobileUrl()) {
        					 alert(msg);
        				 }else{
        					 naon.ui.alert({
        						 message : msg,
        						 callback : function(){$(node).focus();}
        					 });
        				 }
                     }else{
                    	 $(node).focus();
                     }
        			 return false;
        		 }
        	 } // thisMin
        	 
        	 var thisMax = $(node).attr("max").replace(new RegExp(filter, "g"), '');
        	 if(thisMax) {
        		 var IMax = parseInt(thisMax,10);
        		 var IVal = parseInt(nodeVal,10);
        		 if(IVal > IMax) {
        			 var msg = $(node).data("validation-max-message");
        			 if(msg) { 
        				 if(naon.util.isMobileUrl()) {
        					 alert(msg);
        				 }else{
        					 naon.ui.alert({
        						 message : msg,
        						 callback : function(){$(node).focus();}
        					 });
        				 }
                     }else{
                    	 $(node).focus();
                     }
        			 return false;
        		 }
        	 }// thisMax
        	 
        	 return true;
         },
         /**
          * HTML FORM의 input 요소의 값을 검증한다. 이 함수는 폼 요소를 서버로 전송하기 전에
          * 폼 요소에 정의되어 있는 속성값을 기준으로 폼 요소의 입력값을 검증한다.  오류가 있으면
          * alert창을 표시하고 false를 리턴한다. true이면 서버로 전송하면 된다.
          *
          * 아래의 코드는 모든 INPUT 요소를 검증한다. 오류가 있으면  더이상 진행하지 않도록 작성되
          * 었다.
          *
          *    if(!naon.validation.validate(":input") {
          *       return;
          *    }
          *
          *
          *  폼 요소에 사용할 속성값은 다음과 같다.
          *
          *  1. 필수값 체크
          *     required   : 이 속성이 기술되면 필수 값이다.
          *     data-validation-required-message : 필수값이 없을 때 표시되는 메시지
          *
          *     예)
          *         <input type="text" id="userId"
          *              required
          *              data-validation-required-messagege="ID 값이 필요합니다."
          *          />
          *
          *  2. 날자 입력값 체크
          *     data-validation-type : date
          *     data-validation-date-message : 입력값이 없을 때 나타내는 메시지
          *
          *     예)
          *
          *        <input type="text" id="registDate"
          *               required
          *               data-validation-required-message="등록일은 필수 값입니다."
          *               data-validation-type="date"
          *               data-validation-date-message="입력값이 잘못 되었습니다." />
          *
          *  3. 두 요소의 값이 일치하는지 체크(Match)
          *      data-validation-match-match : 비교할 요소의 아이디
          *      data-validation-match-message : 입력값이 서로 다를 때 표시할 메시지
          *
          *              <spring:message code="input.label.password1" text="패스워드1" />
          *              <input type="text" id="ErrorStat_password1"
          *                 required
          *                 data-validation-required-message="<spring:message
          *                 code="validation.empty" text="값이 비었습니다"  />"
          *                 data-validation-type="string"
          *                 placeHolder="<spring:message  code="input.label.password"
          *                 text="패스워드"  />"
          *              />
          *
          *            <spring:message code="input.label.password2" text="패스워드2" />
          *            <input type="text" id="ErrorStat_password2"
          *                    required
          *                    data-validation-required-message="<spring:message
          *                    code="validation.empty"
          *                    text="값이 비었습니다"  />"
          *                    data-validation-type="string"
          *                    data-validation-match-match="#ErrorStat_password1"
          *                    data-validation-match-message="값이 서로 다릅니다."
          *                    placeHolder="<spring:message  code="input.label.password"  text="패스워드"  />"
          *
          *  4. 숫자값의 최소값, 최대값 확인
          *      data-validation-type : 데이터 형식(default: number)
          *      data-validation-number-message: 데이터 형식이 다를 때 표시할 메지시
          *      min : 최소값
          *      max : 최대값
          *      data-validation-min-message: min값 보다 적을 때 표시할 메시지
          *      data-valiadtion-max-message: max값 보다 적을 때 표시할 메시지
          *
          *    예)
          *      <input type="text" id="age"
          *           data-validation-type="number"
          *           min="30"
          *           max="80"
          *           data-validation-min-message="입력값이 너무 작습니다. "
          *           data-validation-max-message="입력값이 너무 큽니다."  />
          *
          *  5. 패턴을 이용한 입력값 검증
          *       pattern : 패턴을 입력하기 위한 속성
          *       data-validation-type  : 데이터 형식( default : pattern)
          *       data-validation-pattern-message: 패턴과 맞지 않을 때 표시할 메시지
          *
          *     예)
          *        <input type="text" id="userId"
          *            pattern="ab+c"
          *            data-validation-type="pattern"
          *            data-validation-pattern-message="입력값은 ab로 시작하고 c로 끝나야 합니다."
          *            />
          *
          *
          * @select  jQuery의 Selector
          */
         validate: function(selector) {

             var checkStatus = true;
             $(selector).not("[type=image],[type=submit], [type=button]").each(function() {

                 // Check the required attribute
                 if($(this).attr("required") != undefined) {
                     if($(this).val() == null || $(this).val().trim() == "") {
                         var msg = $(this).data("validation-required-message");
                         var $that = $(this);
                         if(msg) {
                        	 if(naon.util.isMobileUrl()){
                        		 alert(msg);
                        	 }else{
                        		 naon.ui.alert({
                        			 message : msg,
                        			 callback : function(){$that.focus();}
                        		 });
                        	 }
                         }else{
                        	 $that.focus();
                         }
                         checkStatus = false;
                         return false;
                     }
                 }

                 // Check the validation type which is the date
                 if($(this).data("validation-type") != undefined) {
                     var validType = $(this).data("validation-type");
                     if(validType =="date") {
                         if(!naon.util.validateDate( $(this).val() ))  {
                        	 if($(this).data("validation-date-message")) { 
                            	 var $that = $(this);
                            	 if(naon.util.isMobileUrl()){
                            		 alert($(this).data("validation-date-message"));
                            	 }else{
                            		 naon.ui.alert({
                            			 message : $(this).data("validation-date-message"),
                            			 callback : function(){$that.focus();}
                            		 });
                            	 }
                             }else{
                            	 $(this).focus();
                             }
                             checkStatus = false;
                             return false;
                         }
                     }// validType == date
                 }// if

                 if(!naon.validation.match(this))   {
                     checkStatus = false;
                     return false;
                 }
                 if(!naon.validation.checkEmail(this))  {
                     checkStatus = false;
                     return false;
                 }
                 if(!naon.validation.checkURL(this)) {
                     checkStatus = false;
                     return false;
                 }
                 if(!naon.validation.checkNumber(this)) {
                     checkStatus = false;
                     return false;
                 }
                 if(!naon.validation.checkPattern(this)) {
                     checkStatus = false;
                     return false;
                 }
                 if(!naon.validation.checkPeriod(this)) {
                	 checkStatus = false;
                	 return false;
                 }

             });  // each

             // Everything is OK.
             return checkStatus;

         },// validate

         realTimeIdCheck : function(target){
        	 var obj = null;
        	 if($.type(target) == 'object'){
        		 obj = $(target);
        	 }else if($.type(target) == 'string'){
        		 obj = $('#'+target);
        	 }else{
        		 return ;
        	 }

        	 obj.blur(function(){
        		 if($.trim($(this).val()) == ''){
        			naon.validation.printErrorMsg($(this), '아이디를 입력해 주세요.');
        		 }
        	 });

        	 obj.keyup(function(){
        		 if(!(/^[0-9a-zA-Z]+$/).test($(this).val())){
        			 naon.validation.printErrorMsg($(this), '아이디는 영문과 숫자만 입력 가능합니다.');
        			 return;
        		 }

        		 //if()
        	 });
         },

         realTimePwCheck : function(target){
        	 var obj = null;
        	 if($.type(target) == 'object'){
        		 obj = $(target);
        	 }else if($.type(target) == 'string'){
        		 obj = $('#'+target);
        	 }else{
        		 return ;
        	 }

        	 obj.blur(function(){
        		 $(obj).siblings('.validation_msg').css('display', 'none');
            	 $(obj).removeClass('field_invalid');
        	 });

        	 obj.focus(function(){
        		 if($(this).val().length < 6){
        			 naon.validation.printErrorMsg($(this), '사용 불가');
        			 return;
        		 }else if($(this).val().length > 12){
        			 naon.validation.printErrorMsg($(this), '사용 불가');
        			 return;
        		 }

        		 for(var i=0; i < $(this).val().length; i++){
 			        var chr=$(this).val().substr(i,1);
 			        if(!(chr < 'ㄱ' || chr > '힣'  )){
 			        	naon.validation.printErrorMsg($(this), '사용 불가');
 	        			return;
 			        }
 			     }


        		 naon.validation.printErrorMsg($(this), '사용 가능');
        		 $(this).removeClass('field_invalid');
        		 $(this).siblings('.validation_msg').addClass('msg_valid');
        		 $(this).siblings('.validation_msg').removeClass('msg_invalid');
        	 });

        	 obj.keyup(function(){
        		 if($(this).val().length < 6){
        			 naon.validation.printErrorMsg($(this), '사용 불가');
        			 return;
        		 }else if($(this).val().length > 12){
        			 naon.validation.printErrorMsg($(this), '사용 불가');
        			 return;
        		 }

        		 for(var i=0; i < $(this).val().length; i++){
 			        var chr=$(this).val().substr(i,1);
 			        if(!(chr < 'ㄱ' || chr > '힣'  )){
 			        	naon.validation.printErrorMsg($(this), '사용 불가');
 	        			return;
 			        }
 			     }


        		 naon.validation.printErrorMsg($(this), '사용 가능');
        		 $(this).removeClass('field_invalid');
        		 $(this).siblings('.validation_msg').addClass('msg_valid');
        		 $(this).siblings('.validation_msg').removeClass('msg_invalid');

        	 });
         },
         
         replaceNumber: function() {
        	 $(this).val($(this).val().replace(/[^0-9]/g,''));
         },
         
         replaceNumberToFloat: function() {
        	 $(this).val($(this).val().replace(/[^0-9\.]/g,''));
         },

         printErrorMsg : function(obj, msg){
        	 if($(obj).siblings('.validation_msg').length == 0){
        		 $('<span class="validation_msg"></span>').insertAfter(obj);
        	 }

        	 var errorMsgEl = $(obj).siblings('.validation_msg');

        	 errorMsgEl.html(msg);
        	 errorMsgEl.css('display', 'inline');
        	 $(obj).addClass('field_invalid');
        	 errorMsgEl.addClass('msg_invalid');
        	 errorMsgEl.removeClass('msg_valid');
         }

 }; // naon.validation


 /*
  * naon paletee 생성 추가
  * @param : rootNode - 팔레트가 위치할 node
  * @param : callback - 색상 선택시 색상값을 받을 콜백함수
  */
	naon.palette = function(rootNode, callback) {
		return new palette(rootNode, callback);
	}

	 /*
	  * paletee object
	  * @param : rootNode - 팔레트가 위치할 node
	  * @param : callback - 색상 선택시 색상값을 받을 콜백함수
	  */
    var palette = function(rootNode, callback){

    	// 객체 참조
    	var t = this;

    	// 기본색상정보
    	t.paletteoption = this.paletteoption = {
    			divNode : $('<div class="cal_plt unhidden">'),
    			labels : {
    				       '#ac725e' : $('<label id="1" style="background-color:#ac725e;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#ac725e" fgcolor="#ffffff" class="input_rdo"><span>#ac725e</span></label>'),
    				       '#d06b64' : $('<label id="2" style="background-color:#d06b64;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#d06b64" fgcolor="#ffffff" class="input_rdo"><span>#d06b64</span></label>'),
    			           '#f83a22' : $('<label id="3" style="background-color:#f83a22;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#f83a22" fgcolor="#ffffff" class="input_rdo"><span>#f83a22</span></label>'),
    		  	           '#fa573c' : $('<label id="4" style="background-color:#fa573c;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#fa573c" fgcolor="#ffffff" class="input_rdo"><span>#fa573c</span></label>'),
    			           '#ff7537' : $('<label id="5" style="background-color:#ff7537;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#ff7537" fgcolor="#ffffff" class="input_rdo"><span>#ff7537</span></label>'),
    			           '#ffad46' : $('<label id="6" style="background-color:#ffad46;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#ffad46" fgcolor="#ffffff" class="input_rdo"><span>#ffad46</span></label>'),
    			           '#42d692' : $('<label id="7" style="background-color:#42d692;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#42d692" fgcolor="#ffffff" class="input_rdo"><span>#42d692</span></label>'),
    			           '#16a765' : $('<label id="8" style="background-color:#16a765;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#16a765" fgcolor="#ffffff" class="input_rdo"><span>#16a765</span></label>'),
    			           '#7bd148' : $('<label id="9" style="background-color:#7bd148;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#7bd148" fgcolor="#ffffff" class="input_rdo"><span>#7bd148</span></label>'),
    			           '#b3dc6c' : $('<label id="10" style="background-color:#b3dc6c;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#b3dc6c" fgcolor="#466216" class="input_rdo"><span>#b3dc6c</span></label>'),
    			           '#fbe983' : $('<label id="11" style="background-color:#fbe983;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#fbe983" fgcolor="#584514" class="input_rdo"><span>#fbe983</span></label>'),
    		 	           '#fad165' : $('<label id="12" style="background-color:#fad165;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#fad165" fgcolor="#584514" class="input_rdo"><span>#fad165</span></label>'),
    			           '#92e1c0' : $('<label id="13" style="background-color:#92e1c0;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#92e1c0" fgcolor="#245d45" class="input_rdo"><span>#92e1c0</span></label>'),
    			           '#9fe1e7' : $('<label id="14" style="background-color:#9fe1e7;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#9fe1e7" fgcolor="#1e5d63" class="input_rdo"><span>#9fe1e7</span></label>'),
    			           '#9fc6e7' : $('<label id="15" style="background-color:#9fc6e7;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#9fc6e7" fgcolor="#244b6c" class="input_rdo"><span>#9fc6e7</span></label>'),
    			           '#4986e7' : $('<label id="16" style="background-color:#4986e7;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#4986e7" fgcolor="#ffffff" class="input_rdo"><span>#4986e7</span></label>'),
    			           '#9a9cff' : $('<label id="17" style="background-color:#9a9cff;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#9a9cff" fgcolor="#ffffff" class="input_rdo"><span>#9a9cff</span></label>'),
    			           '#b99aff' : $('<label id="18" style="background-color:#b99aff;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#b99aff" fgcolor="#ffffff" class="input_rdo"><span>#b99aff</span></label>'),
    			           '#c2c2c2' : $('<label id="19" style="background-color:#c2c2c2;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#c2c2c2" fgcolor="#444444" class="input_rdo"><span>#c2c2c2</span></label>'),
    			           '#cabdbf' : $('<label id="20" style="background-color:#cabdbf;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#cabdbf" fgcolor="#4f3e41" class="input_rdo"><span>#cabdbf</span></label>'),
    			           '#cca6ac' : $('<label id="21" style="background-color:#cca6ac;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#cca6ac" fgcolor="#ffffff" class="input_rdo"><span>#cca6ac</span></label>'),
    		 	           '#f691b2' : $('<label id="22" style="background-color:#f691b2;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#f691b2" fgcolor="#ffffff" class="input_rdo"><span>#f691b2</span></label>'),
    			           '#cd74e6' : $('<label id="23" style="background-color:#cd74e6;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#cd74e6" fgcolor="#ffffff" class="input_rdo"><span>#cd74e6</span></label>'),
    			           '#a47ae2' : $('<label id="24" style="background-color:#a47ae2;"><input name="'+rootNode.attr('id')+'plt" type="radio" value="#a47ae2" fgcolor="#ffffff" class="input_rdo"><span>#a47ae2</span></label>')
    					}
    	};


        var newdivNode = t.paletteoption.divNode;
    	t.htmlNode = newdivNode;
    	t.getHtml = getHtml;
    	t.setColor = setColor;
    	t.selectColor = '';
    	t.selectColorObj = null;
    	t.checkedColorID = checkedColorID;
    	t.checkedColorVal = checkedColorVal;
    	t.checkedFgColorVal = checkedFgColorVal;

    	// 각 색상 input box 선택값이 변경되었을때 change event 삽입
		$.each(this.paletteoption.labels, function(key,obj){
			var tObj = $(obj); 
			tObj.children(':first').change(function(){
				var thisObj =  $(this);
			    t.setColor(thisObj.val());
				if(callback){
					callback(thisObj.val(), thisObj.attr('fgcolor'));
				}
			});
			newdivNode.append(tObj);
		});

		// rootnode 존재시 해당 노드에 붙임
		if(rootNode){
			rootNode.append(t.htmlNode);
		}

		// 색상선택 지정
		function setColor(color){

    		t.selectColor = color;
    		$.each(t.paletteoption.labels, function(key,obj){
    			if(color==key){
    				obj.addClass('selected');
    				obj.children(':first').attr('checked',true);
    				t.selectColorObj = obj;
    			}else{
    				obj.removeClass('selected');
    				obj.children(':first').attr('checked',false);
    			}

			});

    	}

		function checkedColorID(){
			return t.selectColorObj.attr('id');
		}

		function checkedColorVal(){
			return t.selectColorObj.children(':first').val();
		}
		function checkedFgColorVal(){
			return t.selectColorObj.children(':first').attr('fgcolor');
		}
		// 팔레트 htmlnode 반환
		function getHtml(){
			return t.htmlNode;
		}

		return t;
    };

    /*
     * 사용자 정보를 정해진 정책에 따른 fomat 으로 리턴함.     
     *
     */
    naon.getTextFomatFromUser = function(username, posName, deptName, cmpName, loginCmpId, targetCmpid){
    	
    	var text = "";
    	
    	text +=  username && username!=''? username+' ':'';
    	text +=  posName && posName!=''? posName : '';
    	
    	// 로그인한 본인과 다른 계열사의 경우에 회사명을 출력한다.
    	if((deptName && deptName!='') && (cmpName && cmpName!='') && (loginCmpId!=targetCmpid)){
    		text +=  '('+deptName+':'+cmpName+')';
    	}else if(deptName && deptName!=''){
    		text +=  deptName? '('+deptName+')' : '';    		
    	}
    	
    	return text;
    	
    };

    /*
     * datepicker, timepicker 공통
     *  - 날짜, 시간 포멧 체크
     *  - 시작일자/시간, 종료일자/시간 간격 체크 조정
     */
    naon.dateTimepicker = function(startEle, startOption, endEle, endOption, startTimeEle, startTimeOption, endTimeEle, endTimeOption){
    	
    	var defaultNmask =  {type:'fixed',mask:'9999-99-99'};
    	var defaultTimeNmask = {type:'fixed',mask:'99:99'};    	
    	var defaultOption = {changeMonth: true, changeYear: true, yearSuffix: '&nbsp;'};    
    	var regional = $.datepicker.regional[frameworkProperties.locale];
		$.extend(defaultOption, regional);
    	var defaultTimeOption = {'step':10, 'timeFormat': 'H:i', 'forceRoundTime': false, 'scrollDefaultNow': true};
    	
    	var isIE = 0 < $('html.old-ie').length;
    	
    	var m_startOption = {
    			/* fix buggy IE focus functionality */
	            fixFocusIE: false,
	            
	            /* blur needed to correctly handle placeholder text */
	            onSelect: function(dateText, inst) {
	            	if($('.ui-dialog'))
	            		$('.ui-dialog').focus();  
	            	this.fixFocusIE = true;
	                  //$('.input_date').focusout();
	                 //$(this).blur().change().focus();
	            },
	            onClose: function(dateText, inst) {
	                  this.fixFocusIE = true;
	            },
	            beforeShow: function(input, inst) {
	            	//IE에서 발생하는 jquery 오류 패치
	            	/*var result = true;
	            	if(this.fixFocusIE){
		                  if (naon.util.ieVersion() > -1 ){
		                    //msg = "You are using IE " + ver;
		                	  result = !this.fixFocusIE;
		                  }else{
		                	  result = true;
		                  }
	            	}
	                  this.fixFocusIE = false;
	                  return result;*/
	            	var result = isIE ? !this.fixFocusIE : true;
	                this.fixFocusIE = false;
	                return result;
	            }};
    	var m_endOption = {
    			/* fix buggy IE focus functionality */
	            fixFocusIE: false,
	            
	            /* blur needed to correctly handle placeholder text */
	            onSelect: function(dateText, inst) {
	            	if($('.ui-dialog'))
	            		$('.ui-dialog').focus();
	                  this.fixFocusIE = true;
	                  //$('.input_date').focusout();
	                 // $(this).blur().change().focus();
	            },
	            onClose: function(dateText, inst) {
	                  this.fixFocusIE = true;
	            },
	            beforeShow: function(input, inst) {
	            	//IE에서 발생하는 jquery 오류 패치
	            	/*var result = true;
	            	if(this.fixFocusIE){
		                  if (naon.util.ieVersion() > -1 ){
		                    //msg = "You are using IE " + ver;
		                	  result = !this.fixFocusIE;
		                  }else{
		                	  result = true;
		                  }
	            	}
	                  this.fixFocusIE = false;
	                  return result;*/
	            	var result = isIE ? !this.fixFocusIE : true;
	                this.fixFocusIE = false;
	                return result;
	            }};    	 
    	var m_startTimeOption = {};
    	var m_endTimeOption = {};
        
        var _isTimeFormat = function(d) {
        	var df = /[0-2]{1}[0-9]{1}:[0-5]{1}[0-9]{1}/;
        	return d.match(df);
        };
    	
    	// 시작일자 객체
    	if(startEle && startEle.length>0){
    		
    		startEle.data('diffTime', 0);
    		startEle.nMask(defaultNmask); 
    		
    		if(startOption==undefined || startOption==null){    		
    			$.extend(m_startOption, defaultOption);
    		}else{
    			$.extend(m_startOption, startOption ,regional);
    		}
    		
    		startEle.datepicker(m_startOption);
    		
    		startEle.datepicker("option", "onClose", 
		    		function(dateText, inst){
		    			
		  		   	    var setdate;
		  		   	   
		  			   // 입력된 값의 길이가 10보다 작을경우 이전값으로 세팅한다.
		  			   if(inst.input.val().length<10){		    				
		  				   
		  				   if(inst.lastVal){	
		      					setdate = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), inst.lastVal, $.datepicker._getFormatConfig(inst));
		  						if(setdate){
		  							$(this).datepicker('setDate', setdate);		    																		
		  						}
		  					}
		  				   return;
		
		  			   }else{
		  				   
		  				   try {	
		  					   setdate = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), inst.input.val(), $.datepicker._getFormatConfig(inst));	    							   
		  				   }
		  				   catch (err) {
		  					   if(inst.lastVal.replace(/\s/g,"").replace(/\-/g, '')){	
		  						   setdate = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), inst.lastVal, $.datepicker._getFormatConfig(inst));
		  						   if(setdate){
		  							   $(this).datepicker('setDate', setdate);		    																		
		  						   }
		  					   }
		  				   }
		  			   }
		  			   			   
		    		   // 시작일자가 변경되면 종료일자와 시간을 재조정한다.
		  			   naon.DatetimeResetChecker('start', startEle, endEle, startTimeEle, endTimeEle);
		  			   $(this).blur(function() {
		    				var elem = $(this);
		    				setTimeout(function() {
		    				},100);
		  			   });
//		  			 $(this).blur(); //dialog에서 datepicker focus남아있는 오류 패치
		      	    }
    		);
    		
    	}
    	
    	// 종료일자 객체
    	if(endEle && endEle.length>0){
    		
    		endEle.nMask(defaultNmask); 
    		
    		endEle.focus(function(){
    			var tobj = $(this); 
    			tobj.attr('lastVal', tobj.val());
    		});
    		
    		if(endOption==undefined || endOption==null){    		
    			$.extend(m_endOption, defaultOption);
    		}else{
    			$.extend(m_endOption, endOption ,regional);
    		}
    		
    		endEle.datepicker(m_endOption);    		
    		
    		endEle.datepicker("option", "onClose", 
		    		function(dateText, inst){
		    			
		    			var setdate;
		    			
		    			// 입력된 값의 길이가 10보다 작을경우 이전값으로 세팅한다.
		    			if(inst.input.val().length<10){		    				
		    				
		    				if(inst.lastVal){	
		    					setdate = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), inst.lastVal, $.datepicker._getFormatConfig(inst));
		    					if(setdate){
		    						$(this).datepicker('setDate', setdate);		    																		
		    					}
		    				}
		    				
		    			}else{    				
		    				try {	
		    					setdate = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), inst.input.val(), $.datepicker._getFormatConfig(inst));	    							   
		    				}
		    				catch (err) {
		    					if(inst.input.attr('lastVal').replace(/\s/g,"").replace(/\-/g, '')){
		    						setdate = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), inst.input.attr('lastVal'), $.datepicker._getFormatConfig(inst));
		    						if(setdate){
		    							$(this).datepicker('setDate', setdate);																	
		    						}
		    					}
		    					
		    				}
		    			}
		    			
		     		   // 시작일자가 변경되면 종료일자와 시간을 재조정한다.
		    			naon.DatetimeResetChecker('end', startEle, endEle, startTimeEle, endTimeEle);
		    			$(this).blur(function() {
		    				var elem = $(this);
		    				setTimeout(function() {
		    				},100);
		  			   	});
//		    			$(this).blur(); //dialog에서 datepicker focus남아있는 오류 패치
		    		}    				
    		
    		);
    		
    	}
    	
    	// 시작시간 객체
    	if(startTimeEle && startTimeEle.length>0){
    		    		
    		startTimeEle.nMask(defaultTimeNmask); 
    		
    		if(startTimeOption==undefined || startTimeOption==null){    		
    			$.extend(m_startTimeOption, defaultTimeOption);
    		}else{
    			$.extend(m_startTimeOption, startTimeOption);
    		}
    		
    		startTimeEle.timepicker(m_startTimeOption);
    		
    		if(m_startTimeOption['changeTime']){    			
	        	startTimeEle.on('changeTime', m_startTimeOption['changeTime']);    			
    			
    		}else{
        		startTimeEle.on('changeTime', function() {	    		   
       			 naon.DatetimeResetChecker('start', startEle, endEle, startTimeEle, endTimeEle);
   	    		   
       		});    			
    		}
    		
    		startTimeEle.focus(function(){
    			tobj = $(this);
    			tobj.attr('lastVal', tobj.val());
    		});
    		
    		startTimeEle.focusout(function() {
    			if(!_isTimeFormat(startTimeEle.val())){
    				tobj = $(this);
	    			tobj.val(tobj.attr('lastVal'));
	    		}
    		});
    		
    		startTimeEle.blur(function(){	    		   
    			if(!_isTimeFormat(startTimeEle.val())){
    				tobj = $(this);
    				tobj.val(tobj.attr('lastVal'));
    			}
    			naon.DatetimeResetChecker('start', startEle, endEle, startTimeEle, endTimeEle);
	    	});
    		
    	}
    	
    	// 종료시간 객체
    	if(endTimeEle && endTimeEle.length>0){
    		
    		endTimeEle.nMask(defaultTimeNmask); 
    		
    		if(endTimeOption==undefined || endTimeOption==null){    		
    			$.extend(m_endTimeOption, defaultTimeOption);
    		}else{
    			$.extend(m_endTimeOption, endTimeOption);
    		}
    		
    		endTimeEle.timepicker(m_endTimeOption);
    		
    		if(m_endTimeOption['changeTime']){
        		endTimeEle.on('changeTime', m_endTimeOption['changeTime']);
    		}else{
        		endTimeEle.on('changeTime', function() {	    			
        			naon.DatetimeResetChecker('end', startEle, endEle, startTimeEle, endTimeEle);
    	    		   
        		});	
    		}    	
    		
    		endTimeEle.focus(function(){
    			tobj = $(this);
    			tobj.attr('lastVal', tobj.val());
    		});
    		
    		endTimeEle.focusout(function() {
    			if(!_isTimeFormat(endTimeEle.val())){
    				tobj = $(this);
	    			tobj.val(tobj.attr('lastVal'));
	    		}
    		});
    		
    		endTimeEle.blur(function(){	    		   
	    		if(!_isTimeFormat(endTimeEle.val())){
	    			tobj = $(this);
	    			tobj.val(tobj.attr('lastVal'));
	    		}
	    		naon.DatetimeResetChecker('end', startEle, endEle, startTimeEle, endTimeEle);
	    	});
    		
    	}
    };
    
    /*
	 * 시작일자+시작시간 - 종료일자+종료시간 간격 유효성 체크 
	 */
	naon.DatetimeResetChecker = function(eventType, startEle, endEle, startTimeEle, endTimeEle){
		
		   var startDate = null;
		   var endDate   = null;
 	   if(startEle && startEle.length>0 && startEle.val().replace(/\s/g,"").replace(/\-/g, '')){
 		   if(startTimeEle && startTimeEle.length>0){
 			   var startTime = startTimeEle.timepicker('getTime');
 			   startDate = new Date($.datepicker.formatDate('yy/mm/dd', startEle.datepicker('getDate'))+' '+startTime.getHours()+':'+startTime.getMinutes());
 		   }else{
 			   startDate = new Date($.datepicker.formatDate('yy/mm/dd', startEle.datepicker('getDate')));    			   
 		   }
 	   }
 	   
 	   if(endEle && endEle.length>0 && endEle.val().replace(/\s/g,"").replace(/\-/g, '')){
 		   if(endTimeEle && endTimeEle.length>0){
 			   var endTime   = endTimeEle.timepicker('getTime');
 			   endDate = new Date($.datepicker.formatDate('yy/mm/dd', endEle.datepicker('getDate'))+' '+endTime.getHours()+':'+endTime.getMinutes());
 		   }else{
 			   endDate = new Date($.datepicker.formatDate('yy/mm/dd', endEle.datepicker('getDate')));    			   
 		   }
 	   }

 	   if(startDate && endDate){

			   var tmp_startDt = startEle.datepicker('getDate');
			   var tmp_endDt   = endEle.datepicker('getDate'); 
     	   if(startDate.getTime()>=endDate.getTime()){         	           		   
     		   if(eventType=='start'){        			   
     			   endEle.datepicker('setDate', new Date(startEle.datepicker('getDate').getTime()+startEle.data('diffTime')));        			   
     		   }else if(eventType=='end'){
     			   startEle.datepicker('setDate', tmp_endDt);
     		   }

     		   // 재세팅된 값을 다시 가져온다.
 			   tmp_startDt = startEle.datepicker('getDate');
 			   tmp_endDt   = endEle.datepicker('getDate');        		   
     		   
				   // 시간정보가 있을때
				   if(startTimeEle && startTimeEle.length>0 && endTimeEle && endTimeEle.length>0){  
					   
					   // 시작일자와 종료일자가 같을경우 
					   if(tmp_startDt.getTime()==tmp_endDt.getTime()){
						  
						    // 시작시간과 종료시간을 비교하여 재세팅해준다.
						    var tmpstartTime =  startTimeEle.val().split(':');
						    var tmpendTime   =  endTimeEle.val().split(':');
						    tmpstartTime[0]  =  parseInt(tmpstartTime[0]);
						    tmpendTime[0]    =  parseInt(tmpendTime[0]);
						    
					    	// 시작시간이 종료시간보다 더크거나 같을 경우 종료시간에 +1해준다.
						    if(tmpstartTime[0]>=tmpendTime[0]){  	  						    	
						    	tmpstartTime[0] = tmpstartTime[0]+1;
						    	
						    	if(tmpstartTime[0]>24){
						    		tmpstartTime[0] = 24;
						    	}
						    	
						    	tmpstartTime[0] = naon.string.lpad(tmpstartTime[0]+'',2,'0');
						    	
	  		    				endTimeEle.timepicker('setTime', tmpstartTime.join(':'));
	  		    				//endTimeEle.timepicker('option','minTime', tmpstartTime.join(':'));
						    }
						    
					   }else if(tmp_startDt.getTime()<tmp_endDt.getTime()){  		  				   
			  				// 종료일자가 시작일자보다 클때는 시간선택에 제한이 없다.
			  				endTimeEle.timepicker('option','minTime', null);  					 
			  		   }
				   }
     	   }else{
     		   startEle.data('diffTime', tmp_endDt.getTime()-tmp_startDt.getTime());
     		   // ie dialog에서 날짜 선택 후 다시 캘린더가 뜨는 오류 수정을 위해 추가
     		  if(eventType=='start'){        			   
     			 startEle.datepicker('setDate', startEle.datepicker('getDate'));        			   
    		   }else if(eventType=='end'){
    			   endEle.datepicker('setDate', endEle.datepicker('getDate'));
    		   }
     	   }
 	   }else{
   		   // ie dialog에서 날짜 선택 후 다시 캘린더가 뜨는 오류 수정을 위해 추가 	   
 		  if(eventType=='start'){        			   
  			 	startEle.datepicker('setDate', startEle.datepicker('getDate'));        			   
 		   }else if(eventType=='end'){
 			   endEle.datepicker('setDate', endEle.datepicker('getDate'));
 		   }
 	   }
 	};
 	
 	// 모바일 에이전트 구분
 	naon.isMobile = {
 	        Android: function () {
 	                 return navigator.userAgent.match(/Android/i) == null ? false : true;
 	        },
 	        BlackBerry: function () {
 	                 return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
 	        },
 	        IOS: function () {
 	                 return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
 	        },
 	        Opera: function () {
 	                 return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
 	        },
 	        Windows: function () {
 	                 return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
 	        },
 	        any: function () {
 	                 return (this.Android() || this.BlackBerry() || this.IOS() || this.Opera() || this.Windows());
 	        }
 	};
 	
 	naon.isTablet = {
		any : function(){
			if (!naon.isMobile.any()) {
				return false;
			}
			
			if (navigator.userAgent.toLowerCase().indexOf('ipad') > -1 || (navigator.userAgent.toLowerCase().indexOf('android') > -1 && navigator.userAgent.toLowerCase().indexOf('mobile') == -1)){
				 return true; 
			}
			
			// 갤럭시 탭만을 위한 리다이렉트. Mobile 이라는 단어가 안들어오게 되면 지우셔도 됨
			var galaxyTabModel = new Array('shw-');
			for (i = 0; i < galaxyTabModel.length; i++) {
				if (navigator.userAgent.toLowerCase().indexOf(galaxyTabModel[i]) > -1) {
					return true;
				}
			}
			return false;
		}
 	};
 	
 	// 모바일, 탭 기기 데스크탑 모드 체크
 	naon.isDesktopMode = {
 		any : function(){
 			if (naon.isMobile.any() || naon.isTablet.any()) {
				return false;
			}
 			
 			var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.appVersion)[1], 10); // also matches AppleWebKit
 			var isGoogle = webkitVer && navigator.vendor.indexOf('Google') === 0;  // Also true for Opera Mobile and maybe others
 			var isAndroid = isGoogle && navigator.userAgent.indexOf('Android') > -1 ;  // Careful - Firefox and Windows Mobile also have Android in user agent
 			var isAndroidDesktopMode = (!isAndroid && isGoogle && (navigator.platform.indexOf('Linux a') === 0)) && ('ontouchstart' in document.documentElement);
 			var isIOSDesktopMode =  !isAndroid && ('ontouchstart' in document.documentElement);	//서피스는 여기서 걸릴건데 일단 막아놓음. 추후 필요시 추가로 해상도 검사할 예정입니다.
 			
 			if(isAndroidDesktopMode || isIOSDesktopMode){
 				return true;
 			}else{
 				return false;
 			} 
 		}
 	};
 	
 	naon.webMsgr = {
 			
		authToken: {
            getAuthToken: function getAuthToken() {
                return localStorage.getItem('x-auth-token');
            },
            setAuthToken: function setAuthToken(authToken) {
                localStorage.setItem('x-auth-token', authToken);
            },
            removeAuthToken: function () {
                localStorage.removeItem('x-auth-token');
            }
        },

        /** 메신저 JTW TOKEN 관련 */
        jwtToken: {
            TOKEN_KEY: "jwtToken",

            /** 토큰 정보를 가져온다 */
            getJwtToken: function () {
                return localStorage.getItem(naon.webMsgr.jwtToken.TOKEN_KEY);
            },

            /** 토큰 정보를 저장한다 */
            setJwtToken: function (token) {
                localStorage.setItem(naon.webMsgr.jwtToken.TOKEN_KEY, token);
            },

            /** 토큰을 제거한다 */
            removeJwtToken: function () {
                localStorage.removeItem(naon.webMsgr.jwtToken.TOKEN_KEY);
            },

            /** API 서버 호출시 토큰을 해더에 세팅한다 */
            createAuthorizationTokenHeader: function () {
            	var tokenHeader = {};

                var authToken = naon.webMsgr.authToken.getAuthToken();
                if (authToken) {
                    tokenHeader['x-auth-token'] = authToken;
                }

                var jwtToken = this.getJwtToken();
                if (jwtToken) {
                    tokenHeader['Authorization'] = "Bearer " + jwtToken;
                }

                return tokenHeader;
            }
        },

        util: {
            /** 텍스트 형식의 메시지를 HTML 형식으로 변환 */
            htmlFromText: function (str) {
                str = str
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;')
                    .replace(/`/g, '&#x60;')
                    .replace(/(?:\r\n|\r|\n)/g, '\n')
                    .replace(/(\n+)/g, '<div>$1</div>')
                    .replace(/\n/g, '<br/>')
                    .replace(/<br\/><\/div>/g, '</div>');

                return str;
            },

            /** HTML 형식의 메시지를 텍스트 형식으로 변환 */
            textFromHtml: function (str) {
                str = str
                    .replace(/&#10;/g, '\n')
                    .replace(/&#09;/g, '\t')
                    .replace(/<img[^>]*alt="([^"]+)"[^>]*>/ig, '$1')
                    .replace(/\n|\r/g, '')
                    .replace(/<br[^>]*>/ig, '\n')
                    .replace(/(?:<(?:div|p|ol|ul|li|pre|code|object)[^>]*>)+/ig, '<div>')
                    .replace(/(?:<\/(?:div|p|ol|ul|li|pre|code|object)>)+/ig, '</div>')
                    .replace(/\n<div><\/div>/ig, '\n')
                    .replace(/<div><\/div>\n/ig, '\n')
                    .replace(/(?:<div>)+<\/div>/ig, '\n')
                    .replace(/([^\n])<\/div><div>/ig, '$1\n')
                    .replace(/(?:<\/div>)+/ig, '</div>')
                    .replace(/([^\n])<\/div>([^\n])/ig, '$1\n$2')
                    .replace(/<\/div>/ig, '')
                    .replace(/([^\n])<div>/ig, '$1\n')
                    .replace(/\n<div>/ig, '\n')
                    .replace(/<div>\n/ig, '\n\n')
                    .replace(/<(?:[^>]+)?>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#x27;/g, "'")
                    .replace(/&#x60;/g, '`')
                    .replace(/&#60;/g, '<')
                    .replace(/&#62;/g, '>')
                    .replace(/&amp;/g, '&');

                return str;
            },

            /** 테그 모두 제거 */
            removeTag: function (str) {
                return str.replace(/(<([^>]+)>)/ig, "");
            },

            getGenerateUUID: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },

            isNotAllowedChatTime: function (isShowMessage) {
                var isNotAllowed = false;
                var clientTimeHour = moment.tz(WmSocket.timezoneServer).format('HH');
                
                if (WmSocket.WEB_SOCKET_CONNECTED === false) {
                    naon.ui.alert({
                        message: common_naonjs_message_408/*서버에서 응답이 없습니다.*/,
                        confirmCallback: function confirmCallback() {
                            return isNotAllowed;
                        }
                    });

                    return isNotAllowed;
                }

                if (naon.webMsgr.config.chatNotUseYn === 'Y' && naon.string.isNotEmpty(naon.webMsgr.config.chatNotTime)) {
                    isNotAllowed = (naon.webMsgr.config.chatNotTime.indexOf(clientTimeHour) != -1);

                    if (isNotAllowed && isShowMessage) {
                        naon.ui.alert({
                            message: common_alert_message453 /*메신저 대화 불가 시간입니다.*/,
                            confirmCallback: function confirmCallback() {
                                return isNotAllowed;
                            }
                        });
                    }
                }

                return isNotAllowed;
            },
            
            isNaonWebBrowser : function(){
                if(/NaonBrowser/.test(navigator.userAgent)) return true;
                return false;
            },
            
            isMacOs: function() {
            	return navigator.platform.toUpperCase().match(/MAC/i) == null ? false : true;
            }
        },
        
        gwOpenUiPopup: function (data, popName, width, height) {
            var options = {
                url: frameworkProperties.webMessengerApiUrl + "/cmm/gwOpenUiPopup",
                type: 'POST',
                data: data,
                headers: naon.webMsgr.jwtToken.createAuthorizationTokenHeader(),
                success: function (res) {
                    var data = res.data;

                    var url = data.groupwareUrl;
                    delete data['groupwareUrl'];

                    naon.openUi.callPopup(data, popName, url, width, height, 1, 1, 0, 0, 1);
                }
            };
            naon.http.ajax(options);
        },

        config: {}
    };
 	
 	naon.custom = {
 		/** 이파피루스 PDF변환 솔루션 streamDocsVu! 제품의 파일 미리보기 동작 */
 		epapyrusPreviewOpen: function(file) {
			naon.http.ajax({
				url : '/service/pdfConvert/pdfConvertMain',
				async: false,
				data : {
					realFileName : file.realFileName,
					localFileName : (file.localFileName || file.fileName) ,
					fileUrl : file.fileUrl
				},
				success : function(url) {
					if(url=="fail") {	// 변환실패시
						if(naon.util.isMobileUrl()) {
							alert(common_naonjs_message_500/*서버에서 오류가 발생했습니다.*/);
						}else{
							naon.ui.alert({
								message : common_naonjs_message_500/*서버에서 오류가 발생했습니다.*/
							});
						}
					} else {
						if(naon.isMobile.IOS()){
							//url += '?a=b';	//IOS환경에서 정상적으로 동작하지 않아서 '?a=b' 추가
							location.href = url;
						} else {
							window.open(url);
						}
					}
				}
			});
 		},
		
		//IE 사용 시스템 팝업 호출
		callPopUpForIE : function(url){
			if(naon.util.ieVersion() > 0){
				window.open(url);
			} else {
				var data = {
						'cmd' : 'browser',
						'lang' : loginUserInfo.langCd,
						'data' : {
							'kind' : '2',
							'url' : ''
						}
				};
				var options = {
						url : '/service/custom/portlet/getLoginId',
						data : JSON.stringify({}),
						type : "POST",
						contentType: "application/json; charset=utf-8",
						dataType: "json",
						success : function(res, statusText) {
							data.data.url = frameworkProperties.serverUrl + frameworkProperties.context+'/inc/openapi/linkSSOLogin?' + 'params=' + encodeURIComponent(res.data.param) + '&returnUrl=' + encodeURI(encodeURI(url))
							
							naon.openUi.fOpen.send(JSON.stringify(data));
						}
				};
				naon.http.ajax(options);
			}
		} 
 	};

	
	//---------------------------------------------------------------------------------- naon.clipboard
	/**
	 * 텍스트를 클립보드에 저장합니다.
	 *
	 * 해당 기능을 사용하기 위해서는 아래 라이브러리 중 하나가 포함되어있어야 합니다.
	 * /resources/lib/clipboard/dist/clipboard.js
	 * /resources/lib/clipboard/dist/clipboard.min.js
	 *
	 * 사용 예제
	 * - naon.clipboard('저장 할 메세지');
	 * - naon.clipboard('저장 할 메세지', function (e) {naon.ui.alert(message : '~~를 클립보드에 저장하였습니다.')});
	 *
	 * @param content [필수] 클립보드로 저장할 내용
	 * @param successFunc 저장 성공 시 수행할 액션 (기본값 naon.ui.alert메세지로 "클립보드에 저장되었습니다." 표시)
	 						string 타입인 경우 해당 메세지를 naon.ui.alert로 표시
	 * @param errorFunc 저장 실패 시 수행할 액션  (기본값 alert메세지로 "클립보드 복사에 실패하였습니다." 표시)
	 						string 타입인 경우 해당 메세지를 alert로 표시
	 */
	naon.clipboard = function(content, successFunc, errorFunc) {

		// 데이터, 파라미터 점검 시작
		if (typeof Clipboard === 'undefined') {
			alert('clipboard.js가 로드되지 않았습니다.'); // <-- 개발자에게만 표시 할 메세지
			return;
		}

		// 0, '' 등 을 저장 할 수 있으므로, !content로 비교하지 않음
		if (content === null) {
			alert('저장할 content가 없습니다.'); // <-- 개발자에게만 표시 할 메세지
			return;
		}

		var contentType = typeof content;
		if (contentType !== 'string'
			&& contentType !== 'bigint'
			&& contentType !== 'boolean'
			&& contentType !== 'number') {
			alert(contentType + '타입은 클립보드 저장이 불가능합니다.'); // <-- 개발자에게만 표시 할 메세지
			return;
		}

		content = content.toString();

		// successFunc가 정의가 되어있지 않은 경우 '클립보드에 저장되었습니다' alert 설정 
		successFunc = successFunc || function(e) {
			naon.ui.alert({
				message: common_alert_successSaveClipboard // 클립보드에 저장되었습니다
			})
		};

		// errorFunc가 정의가 되어있지 않은 경우 아무 동작하지 않음 
		errorFunc = errorFunc || function(e) {
			e = e || '';
			if(e.action) {
				e = JSON.stringify(e);
			}
			alert('알 수 없는 이유로 클립보드 복사에 실패하였습니다. 다시한번 시도해주시길 바랍니다.' + e); // <-- 개발자에게만 표시 할 메세지
		};
		
		// successFunc가 문자열인 경우 naon.ui.alert의 메세지로 취급
		if(typeof successFunc === 'string') {
			var successMessage = successFunc;
			successFunc = function(e) {
				naon.ui.alert({
					message: successMessage
				})
			}
		}

		// errorFunc가 문자열인 경우 alert의 메세지로 취급
		if(typeof errorFunc === 'string') {
			var errorMessage = errorFunc;
			errorFunc = function(e) {
				alert(errorMessage); // <-- 개발자에게만 표시 할 메세지
			}
		}

		// successFunc, errorFunc 최종 타입 확인
		if(typeof successFunc !== 'function'
			|| typeof errorFunc !== 'function') {
			alert('successFunc, errorFunc는 함수로 정의해야합니다.'); // <-- 개발자에게만 표시 할 메세지
			return;
		}
		// 데이터, 파라미터 점검 종료

		var $beforeClipboard = $('#NAON_TEMP_CLIPBOARD');
		// 로직상 기존 클립보드 DIV가 존재해야하지 않아야 하지만, 만약 존재한다면 모두 제거한다.
		if($beforeClipboard.length !== 0) {
			$beforeClipboard.remove();
		}
		
		var clipboard = null;
		try {
			// 임시 클립보드 DIV 생성
			var $clipboardDiv = $('<div id="NAON_TEMP_CLIPBOARD">');
			$clipboardDiv.attr('data-clipboard-text', content);
			$('body').append($clipboardDiv);

			// 클립보드 인스턴스 생성
			clipboard = new Clipboard('#NAON_TEMP_CLIPBOARD');

			// 성공 시
			clipboard.on('success', function(e) {
				$clipboardDiv.remove();
				clipboard.destroy();
				successFunc(e);
			});

			// 실패 시
			clipboard.on('error', function(e) {
				$clipboardDiv.remove();
				clipboard.destroy();
				errorFunc(e);
			});

			// 클립보드 저장 수행
			$('#NAON_TEMP_CLIPBOARD').click();
		} catch (e) {
			// 위 과정 중 예외 발생 시
			
			// CSS Selector로 직접 찾아 제거
			$('#NAON_TEMP_CLIPBOARD').remove();

			if(clipboard != null) {
				clipboard.destroy();
			}
			errorFunc(e);
		}
	}
})( jQuery );

//---------------------------------------------------------------------------------- naon.resize
/**
 * Resize 이벤트 관리 
 * $(window).naonResizeOn(function(){
 *    do sumthing ~~
 * });
 * 
 * @param $
 * @param window
 * @returns
 */
(function($, window) {
    /**
     * resize 이베트 관리 객체
     */
    naon.resize = {
    	listener : [],
    	/**
    	 * resize 이벤트를 등록한다
    	 */
		on : function(fun, obj){
			if(!fun) return;
	    	obj = obj || window;
	    	obj.addEventListener("naonResize", fun);
	    	
	    	naon.resize.listener.push(fun);
	    },
    
	    /**
    	 * resize 이벤트를 제거한다
    	 */
        off : function(fun, obj){
        	if(!fun) return;
        	obj = obj || window;
        	obj.removeEventListener("naonResize", fun);
        	
        	var tempListener = [];
        	naon.resize.listener.forEach(function(f){
        		if(!Object.is(f, fun)){
        			tempListener.push(f);
        		}
        	});
        	
        	naon.resize.listener = tempListener;
        },
	    
        /**
    	 * 모든 resize 이벤트를 제거한다.
    	 */
	    remove : function(obj, fun){
	    	obj = obj || window;
	    	naon.resize.listener.forEach(function(f){
	    		obj.removeEventListener("naonResize", f);
	    	});
	    }
    };
    
    //jquery plug in resize on
    $.fn.naonResizeOn = function(fun){
    	naon.resize.on(fun, this.get(0));
    };
    //jquery plug in resize off
    $.fn.naonResizeOff = function(fun){
    	naon.resize.off(fun, this.get(0));
    };
    
	var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "naonResize");
    
})(jQuery, window);


//---------------------------------------------------------------------------------- SysMenuCdConstants : 시스템 메뉴코드상수
var SysMenuCdConstants = {
		pcCode : {
			"BOD_CD"	:	"A1200",	/**	게시판	*/
			"GAP_CD"	:	"A6800",	/**	공공결재	*/
			"ATN_CD"	:	"A2000",	/**	근태관리	*/
			"APPREC_CD"	:	"A6700",	/**	기록물철관리	*/
			"MMO_CD"	:	"A2700",	/**	메모	*/
			"DOC_CD"	:	"A1900",	/**	문서관리	*/
			"NOT_CD"	:	"A2600",	/**	사내쪽지	*/
			"SUR_CD"	:	"A2200",	/**	설문관리	*/
			"SMW_CD"	:	"A7500",	/**	스마트워크	*/
			"WKS_CD"	:	"A6000",	/**	스페이스	*/
			"WOR_CD"	:	"A7000",	/**	업무보고	*/
			"SCD_CD"	:	"A1400",	/**	일정관리	*/
			"RMG_CD"	:	"A1800",	/**	자원예약관리	*/
			"EAP_CD"	:	"A6500",	/**	전자결재	*/
			"EML_CD"	:	"A1100",	/**	전자우편	*/
			"ORG_CD"	:	"A2500",	/**	조직관리	*/
			"ADR_CD"	:	"A1700",	/**	주소록	*/
			"FORUM_CD"	:	"A2100",	/**	커뮤니티	*/
			"FBX_CD"	:	"A2300",	/**	파일관리	*/
			"PRJ_CD"	:	"A8000"		/**	프로젝트	*/	
		},
		moblCode : {
			"BOD_CD"	:	"A4500",	/**	게시판	*/
			"GAP_CD"	:	"A6900",	/**	결재	*/
			"ATN_CD"	:	"A7200",	/**	근태관리	*/
			"DOC_CD"	:	"A7700",	/**	문서관리	*/
			"NOT_CD"	:	"A4200",	/**	사내쪽지	*/
			"SUR_CD"	:	"A5800",	/**	설문관리	*/
			"SMW_CD"	:	"A7600",	/**	스마트워크	*/
			"WKS_CD"	:	"A6100",	/**	스페이스	*/
			"WOR_CD"	:	"A7100",	/**	업무보고	*/
			"SCD_CD"	:	"A4600",	/**	일정관리	*/
			"RMG_CD"	:	"A5700",	/**	자원예약관리	*/
			"EAP_CD"	:	"A6600",	/**	전자결재	*/
			"EML_CD"	:	"A4100",	/**	전자우편	*/
			"ORG_CD"	:	"A4900",	/**	조직관리	*/
			"ADR_CD"	:	"A4700",	/**	주소록	*/
			"FORUM_CD"	:	"A5600",	/**	커뮤니티	*/
			"FBX_CD"	:	"A5000",	/**	파일관리	*/
			"PRJ_CD"	:	"A8100"		/** 프로젝트	*/
		},
}