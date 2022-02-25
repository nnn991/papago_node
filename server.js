const express = require("express"); // express 패키지 import 

const app = express();

// API Key를 별도로 관리 : dot(.)env를 활용, env라는 파일에 key를 보관하고
// dotenv가 .env파일을 활용해서 process.env 객체에 포함시킴
const dotenv = require("dotenv");
dotenv.config();

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

// nodejs 서버가 또다른 client가 되어 naver 서버에 요청을 보내기 위해 사용
const request = require("request");
const { options } = require("request");
const { response } = require("express");

// express의 static 미들웨어 활용
// public 폴더에서 찾게 지정
app.use(express.static('public'));

// json 미들웨어 활용
app.use(express.json());

console.log(`현재 파일명 : ${__filename}`);
console.log(`index.html의 파일 경로 : ${__dirname}`);

// root url : localhost:/3000 == localhost:3000
// 해당 경로로 요청이 들어왔을 때 호출할 함수
// 두 인자값(argument)를 받음 : request(req), response(res)
app.get("/", (req, res) => {

  // root url, 즉 메인 페이지로 접속했을 때, papago 메인 페이지가 나와야 함
  res.sendFile(__dirname, `index.html`);
});

// detectLangs 경로로 요청했을 때
app.post("/detectLangs", (req, res) => {
  
  // 입력한 텍스트를 받아야 한다.
  console.log(req.body);
  console.log(typeof req.body);

  const { text:query, targetLanguage} = req.body;
  // console.log(query);
  // console.log(targetLanguage);

  const url = "https://openapi.naver.com/v1/papago/detectLangs";

  const options = {
    url,
    form: { query },
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret
    },
  };

  // options에 요청에 필요한 데이터 동봉
  // ()=> 요청에 따른 응답 정보를 확인
  request.post(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const parsedBody = JSON.parse(body);
        console.log(typeof parsedBody, parsedBody);

        //papago 번역 url로 rediret
        // query string으로 데이터 전송(get 요청)
        res.redirect(`translate?lang=${parsedBody[`langCode`]}&targetLanguage=${targetLanguage}&query=${query}`);

      } else {
        console.log(`error = ${response.statusCode}`);
      }
  });
});

// papago 번역 요청 부분
app.get("/translate", (req, res) => {
  const url = "https://openapi.naver.com/v1/papago/n2mt";
  console.log(req.query, typeof req.query);
  const options = {
    url,
    form: { 
      source: req.query['lang'],
      target: req.query['targetLanguage'],
      text: req.query['query']
    },
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret
    },
  }

  request.post(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      // console.log(body);
      res.json(body); // front에 해당하는 script.js에 응답 데이터 (json) 전송
    } else {
      console.log(`error : ${response.statusCode}`);
    }
  })
});

app.listen(3000, () => {
  console.log(`http://127.0.0.1:3000/ app listening on port 3000!`);
});

