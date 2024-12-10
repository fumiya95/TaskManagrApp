// タスクを追加するボタンの要素を取得
const addTaskButton = document.getElementById('addTaskButton');
const taskInput = document.getElementById('taskInput');
const taskTime = document.getElementById('taskTime');
const taskList = document.getElementById('taskList');
const reminderSound = document.getElementById('reminderSound'); // 音声要素を取得

// タスクを追加する関数
function addTask() {
    const taskText = taskInput.value;
    const timeText = taskTime.value;

    if (taskText === '') {
        alert('タスクを入力してください');
        return;
    }

    if (timeText === '') {
        alert('時間を入力してください');
        return;
    }

    const li = document.createElement('li');

    const taskContent = document.createElement('span');
    taskContent.textContent = taskText;

    const taskTimeSpan = document.createElement('span');
    taskTimeSpan.textContent = timeText;
    taskTimeSpan.className = 'task-time';

    // 削除ボタンを作成してタスクに追加
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', function() {
        taskList.removeChild(li);
    });

    li.appendChild(taskContent);
    li.appendChild(taskTimeSpan);
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    // 入力フィールドをクリア
    taskInput.value = '';
    taskTime.value = '';

    // リマインダー設定
    setReminder(taskText, timeText);
}

// リマインダーを設定する関数
function setReminder(taskText, taskTime) {
    const currentClock = new Date();
    // 9秒プラスした現在の表示時間
    let displayedTime = new Date(currentClock.getTime() + 9 * 1000);

    // タスクの時間を設定
    let taskDateTime = new Date();
    const timeParts = taskTime.split(":");
    taskDateTime.setHours(parseInt(timeParts[0]));
    taskDateTime.setMinutes(parseInt(timeParts[1]));
    taskDateTime.setSeconds(0);

    // タスク時間から10分前の時間を計算
    let reminderTime = new Date(taskDateTime.getTime() - 10 * 60 * 1000);

    // 現在の時間との差を計算
    let timeUntilReminder = reminderTime - displayedTime;

    if (timeUntilReminder <= 0) {
        // 時間が過ぎている場合、翌日の同じ時間の10分前に設定
        taskDateTime.setDate(taskDateTime.getDate() + 1);
        reminderTime = new Date(taskDateTime.getTime() - 10 * 60 * 1000);
        timeUntilReminder = reminderTime - displayedTime;
    }

    setTimeout(function() {
        reminderSound.play(); // 音を再生
        alert(`リマインド: 10分後にタスク「${taskText}」があります`); // アラートを表示
    }, timeUntilReminder);
}

// ボタンがクリックされた時にタスクを追加
addTaskButton.addEventListener('click', addTask);

// Enterキーでもタスクを追加できるようにする
[taskInput, taskTime].forEach(element => {
    element.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

// 時計の更新コード
function updateClock() {
    const now = new Date();

    // 9秒を加算
    now.setSeconds(now.getSeconds() + 9);

    // 日付の表示を更新
    const dateDisplay = document.getElementById('dateDisplay');
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('ja-JP', dateOptions);

    // 時間の表示を更新
    const timeDisplay = document.getElementById('timeDisplay');
    const timeString = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    timeDisplay.textContent = timeString;
}

// 1秒ごとに時計を更新
setInterval(updateClock, 1000);

// ページが読み込まれた時に時計を初期化
window.onload = updateClock;