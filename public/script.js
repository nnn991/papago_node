const textAreaArray = document.querySelectorAll('textarea');

// source : 번역할 텍스트와 관련된 명칭
// target : 번역된 결과와 관련된 명칭

// destructuring
const [sourceTextArea, targetTextArea] = textAreaArray;
const [sourceSelect, targetSelect] = document.querySelectorAll('select');

// 번역할 언어의 타입(ko?, en? ja?)
let targetLanguage = 'en';

// 'ko', 'ja'
// 번역할 언어가 바뀔 때마다 값을 변경
// 어떤 언어로 번역할지 선택하는 target selectbox의 선택지 값이 바뀔 때마다 이벤트 발생
targetSelect.addEventListener('change', () => {
    const selectedIndex = targetSelect.selectedIndex;
    targetLanguage = targetSelect.options[selectedIndex].value;
});

let debouncer;

// 입력창에 내용 입력시 나타나는 값을 가져오자
sourceTextArea.addEventListener('input', (event) => {

    // 입력이 끝나지 않았으면 번역 시간을 초기해서 바로바로 번역되지 않게 한다.
    // input 이벤트가 계속해서 나타나지 않게 한다.
    if (debouncer) { // 값이 있으면 true, 없으면 false
        clearTimeout(debouncer);
    }

    debouncer = setTimeout( ()=>{
        
        // const text = sourceTextArea.value;
        // console.log(text);
        const text = event.target.value; // textArea에 입력한 값
        // console.log();
        if (text) {
    
            const xhr = new XMLHttpRequest();
            const url = `/detectLangs`; // node 서버의 특정 url 주소
        
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    
                    // 서버의 응답 결과 확인 (responseText : 응답에 포함된 텍스트)
                    const responseData = xhr.responseText;
                    console.log(`responseData: ${responseData}, type: ${typeof responseData}`);
        
                    const jasonToObject = JSON.parse(JSON.parse(responseData));
                    console.log(typeof jasonToObject, jasonToObject);
                    
                    const result = jasonToObject[`message`]['result'];
        
                    const options = sourceSelect.options;
                    for (let i = 0; i < options.length; i++) {
                        if(options[i] === result['srcLangType']) {
                            sourceSelect.selectedIndex = i;
                        }
                    }

                    // 번역된 텍스트를 결과 화면에 출력
                    targetTextArea.value = result[`translatedText`];
        
        
                    // 응답의 헤더(header) 확인
                    console.log(`응답 헤더 : ${xhr.getAllResponseHeaders()}`);
                }
            };
        
            xhr.open("POST", url);
        
            // 서버에 보내는 요청 데이터의 형식이 json 형식임을 명시.
            xhr.setRequestHeader("Content-type", "application/json");
        
            const requestData = { // object type
                text,
                targetLanguage
            };
        
            // json type : string
            // object type -> json string type으로 변경 (직렬화) 필요
            // 내장모듈 JSON 활용
            jasonToString = JSON.stringify(requestData);
            console.log(typeof jasonToString);
        
            // xhr 
            xhr.send(jasonToString);
    } else {
        // alert('번역할 텍스트를 입력해주세요.');
    }
    }, 2000); // 결과 반환시간 설정
});

