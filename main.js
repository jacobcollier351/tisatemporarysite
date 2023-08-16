// 获取元素
let audioList = document.getElementById('audio-list');
let player = document.getElementById('player');
let playPauseButton = document.getElementById('play-pause');

// 音频URL前缀
let urlPrefix = "https://cdn.totality-of-life.com/";

// 为播放/暂停按钮添加点击事件
playPauseButton.addEventListener('click', function() {
    if (player.paused) {
        player.play();
        playPauseButton.textContent = '⏸️';
    } else {
        player.pause();
        playPauseButton.textContent = '▶️';
    }
});

// 从服务器获取JSON数据
fetch(urlPrefix + "index.json")
    .then(response => response.json())
    .then(data => {
        data.audios.reverse().forEach(function(audio, index) {
            // 检查音频的id是否以"S08_2023_Conscious_Breathing"开头
            if (audio.id.startsWith("S08_2023_Conscious_Breathing")) {
                // 创建一个新的列表项元素并设置其内容
                let listItem = document.createElement('li');
                listItem.textContent = audio.name_cn + " (" + audio.duration + ")";
                listItem.dataset.url = urlPrefix + audio.id;  // 在元素上存储完整的音频URL
                listItem.addEventListener('click', function() {
                    // 当列表项被点击时，将音频URL设置为播放器的源并播放
                    player.src = listItem.dataset.url;
                    player.play();
                    playPauseButton.textContent = '⏸️';  // 更新按钮文本
                });
                audioList.appendChild(listItem);
            }
        });
    })
    .catch(error => console.error('Error:', error));
