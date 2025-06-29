const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let queue = [];

app.post('/api/follow-match', (req, res) => {
  const { username, count } = req.body;

  if (!username || !count || count <= 0) {
    return res.status(400).json({ message: '유효한 요청이 아닙니다.' });
  }

  const matchIndex = queue.findIndex(user => user.username !== username && user.count === count);

  if (matchIndex !== -1) {
    const matchedUser = queue.splice(matchIndex, 1)[0];
    console.log(`🎉 매칭 완료: ${username} ↔ ${matchedUser.username}`);
    return res.status(200).json({
      message: '매칭 성공!',
      matchedWith: matchedUser.username
    });
  }

  queue.push({ username, count });
  console.log(`🕒 매칭 대기 등록: ${username} (${count})`);
  return res.status(200).json({ message: '대기열에 등록되었습니다. 곧 매칭됩니다!' });
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});