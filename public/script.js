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

// 입력창에 내용 입력시 나타나는 값을 가져오자
sourceTextArea.addEventListener('input', (event) => {
    // const text = sourceTextArea.value;
    // console.log(text);

    const text = event.target.value;

    const xhr = new XMLHttpRequest();
    const url = `https://jsonplaceholder.typicode.com/todos/1`;

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            
            // 서버의 응답 결과 확인 (responseText : 응답에 포함된 텍스트)
            console.log(xhr.responseText);

            // 응답의 헤더(header) 확인
            console.log(`응답 헤더 : ${xhr.getAllResponseHeaders()}`);
        }
    };

    xhr.open("GET", url);
    xhr.send(null);
});

