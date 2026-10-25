const http = require('http');
const { app, server } = require('./src/server');

const testEndpoint = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = {
      'Content-Type': 'application/json'
    };
    if (data) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Starting LevelUp Automated End-to-End API Verification ---');
  let failures = 0;

  try {
    // 1. Health check
    console.log('[1/12] Testing Health Endpoint: GET /api/health');
    const health = await testEndpoint('GET', '/api/health');
    if (health.status === 200 && health.body.status === 'online') {
      console.log('  ✓ Passed! Server is online.');
    } else {
      console.error('  ✗ Failed health check:', health);
      failures++;
    }

    // 2. Demo login
    console.log('[2/12] Testing Demo Login: POST /api/auth/login');
    const login = await testEndpoint('POST', '/api/auth/login', {
      email: 'demo@levelup.com',
      password: 'Password123!'
    });
    let token = null;
    if (login.status === 200 && login.body.token) {
      token = login.body.token;
      console.log(`  ✓ Passed! Logged in as ${login.body.user.name} (${login.body.user.level}, ${login.body.user.totalPoints} XP)`);
    } else {
      console.error('  ✗ Failed login:', login);
      failures++;
    }

    // 3. User Me Profile
    console.log('[3/12] Testing User Me: GET /api/auth/me');
    const me = await testEndpoint('GET', '/api/auth/me', null, token);
    if (me.status === 200 && me.body.user) {
      console.log(`  ✓ Passed! Verified profile token for ${me.body.user.email}`);
    } else {
      console.error('  ✗ Failed auth/me:', me);
      failures++;
    }

    // 4. Challenges
    console.log('[4/12] Testing Challenges: GET /api/challenges/today');
    const challenges = await testEndpoint('GET', '/api/challenges/today', null, token);
    if (challenges.status === 200 && Array.isArray(challenges.body.challenges)) {
      console.log(`  ✓ Passed! Retrieved ${challenges.body.challenges.length} daily challenges.`);
    } else {
      console.error('  ✗ Failed challenges/today:', challenges);
      failures++;
    }

    // 5. Tasks CRUD
    console.log('[5/12] Testing Task Creation: POST /api/tasks');
    const newTask = await testEndpoint('POST', '/api/tasks', {
      title: 'Automated Test Task',
      description: 'Verifying end-to-end task flow',
      priority: 'High'
    }, token);

    let createdTaskId = null;
    if (newTask.status === 201 && newTask.body.task) {
      createdTaskId = newTask.body.task._id;
      console.log(`  ✓ Passed! Created task ID: ${createdTaskId}`);
    } else {
      console.error('  ✗ Failed task creation:', newTask);
      failures++;
    }

    // 6. Task Completion Toggle
    console.log('[6/12] Testing Task Completion: PUT /api/tasks/:id');
    if (createdTaskId) {
      const toggleTask = await testEndpoint('PUT', `/api/tasks/${createdTaskId}`, { completed: true }, token);
      if (toggleTask.status === 200 && toggleTask.body.task.completed) {
        console.log(`  ✓ Passed! Task marked completed (+${toggleTask.body.pointsAwarded} XP awarded).`);
      } else {
        console.error('  ✗ Failed task toggle:', toggleTask);
        failures++;
      }
    }

    // 7. Habits
    console.log('[7/12] Testing Habits: GET /api/habits');
    const habits = await testEndpoint('GET', '/api/habits', null, token);
    if (habits.status === 200 && Array.isArray(habits.body.habits)) {
      console.log(`  ✓ Passed! Retrieved ${habits.body.habits.length} habits with 7-day status grids.`);
    } else {
      console.error('  ✗ Failed habits:', habits);
      failures++;
    }

    // 8. Vocabulary Random Word
    console.log('[8/12] Testing Vocabulary: GET /api/vocabulary/random');
    const vocab = await testEndpoint('GET', '/api/vocabulary/random', null, token);
    if (vocab.status === 200 && vocab.body.word) {
      console.log(`  ✓ Passed! Random word: "${vocab.body.word.word}" - ${vocab.body.word.meaning}`);
    } else {
      console.error('  ✗ Failed vocabulary/random:', vocab);
      failures++;
    }

    // 9. Grammar Questions
    console.log('[9/12] Testing Grammar Questions: GET /api/grammar');
    const grammar = await testEndpoint('GET', '/api/grammar', null, token);
    if (grammar.status === 200 && Array.isArray(grammar.body.questions)) {
      console.log(`  ✓ Passed! Retrieved ${grammar.body.questions.length} grammar challenges.`);
    } else {
      console.error('  ✗ Failed grammar:', grammar);
      failures++;
    }

    // 10. Progress Summary & Charts
    console.log('[10/12] Testing Progress Summary: GET /api/progress');
    const progress = await testEndpoint('GET', '/api/progress', null, token);
    if (progress.status === 200 && progress.body.user) {
      console.log(`  ✓ Passed! Progress percent: ${progress.body.today.progressPercent}%, Recommendation: "${progress.body.recommendation?.title || 'None'}"`);
    } else {
      console.error('  ✗ Failed progress:', progress);
      failures++;
    }

    // 11. Achievements
    console.log('[11/12] Testing Achievements: GET /api/achievements');
    const ach = await testEndpoint('GET', '/api/achievements', null, token);
    if (ach.status === 200 && Array.isArray(ach.body.achievements)) {
      console.log(`  ✓ Passed! ${ach.body.unlockedCount} of ${ach.body.totalCount} achievements unlocked.`);
    } else {
      console.error('  ✗ Failed achievements:', ach);
      failures++;
    }

    // 12. Thought of the Day
    console.log('[12/12] Testing Thought of the Day: GET /api/thoughts/today');
    const thought = await testEndpoint('GET', '/api/thoughts/today', null, token);
    if (thought.status === 200 && thought.body.question) {
      console.log(`  ✓ Passed! Prompt: "${thought.body.question}"`);
    } else {
      console.error('  ✗ Failed thoughts/today:', thought);
      failures++;
    }

    console.log('------------------------------------------------------------');
    if (failures === 0) {
      console.log('🎉 ALL 12 VERIFICATION SUITES PASSED FLAWLESSLY!');
    } else {
      console.error(`❌ Encountered ${failures} test failure(s).`);
    }
  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    server.close();
    process.exit(failures === 0 ? 0 : 1);
  }
};

runTests();
