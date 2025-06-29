// follow-server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

let waitList = [];

app.post('/api/follow-match', (req, res) => {
  const { username, count } = req.body;
  const request = { username, count: Number(count) };

  // 동일 수량 요청자 탐색
  const matchIndex = waitList.findIndex(item => item.count === request.count);

  if (matchIndex !== -1) {
    const matched = waitList.splice(matchIndex, 1)[0];

    console.log(`🎉 매칭 성공: ${matched.username} ↔ ${request.username}`);
    res.status(200).json({
      message: `매칭 완료: ${matched.username}님과 서로 맞팔하세요!`
    });
  } else {
    waitList.push(request);
    console.log(`🕒 대기 중: ${request.username}`);
    res.status(200).json({
      message: '요청이 등록되었습니다. 매칭을 기다려주세요!'
    });
  }
});

app.get('/', (req, res) => {
  res.send('✅ insta-matcher 서버가 정상 작동 중입니다');
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
