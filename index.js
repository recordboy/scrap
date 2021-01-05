// express 모듈 불러오기
const express = require('express');

// express 객체 생성
const app = express();

// 기본 포트를 app 객체에 설정
const port = process.env.PORT || 5000;
app.listen(port);

// 미들웨어 함수를 특정 경로에 등록
app.use('/api/data', function(req, res) {
    res.json({ greeting: 'Hello World' });
});

console.log(`server running at http ${port}`);





// const express = require('express');
// const path = require('path');
// const fetch = require("node-fetch");
// const app = express();

// // 크로스 설정
// const cors = require("cors");
// app.use(cors());

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

// // Put all API endpoints under '/api'
// app.get('/api/data', (req, res) => {

//   // 장소 id
//   const id = req.param('id');

//   fetch(`https://place.map.kakao.com/m/main/v/${id}`)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (myJson) {
//       const data = JSON.parse(JSON.stringify(myJson));
//       res.json(data);
//     });
  
// });

// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

// const port = process.env.PORT || 5000;
// app.listen(port);

// console.log(`server running at http ${port}`);