// 获取元素
let audioList = document.getElementById('audio-list');
let player = document.getElementById('player');
//let playPauseButton = document.getElementById('play-pause');

// 音频URL前缀
let urlPrefix = "https://cloudflare-cors-anywhere.andyhu0777.workers.dev/?https://cdn.totality-of-life.com/";

// 为播放/暂停按钮添加点击事件
// playPauseButton.addEventListener('click', function() {
//     if (player.paused) {
//         player.play();
//         playPauseButton.textContent = '⏸️';
//     } else {
//         player.pause();
//         playPauseButton.textContent = '▶️';
//     }
// });

// 从服务器获取JSON数据
fetch(urlPrefix + "index.json")
    .then(response => response.json())
    .then(data => {
        // 按album分组音频
        let groupedAudios = {};
        data.audios.reverse().forEach(audio => {
            if (audio.id.startsWith("S")) {
                let album = audio.id.split('/')[0]; // 获取album名称（ID中斜杠前的部分）
                if (!groupedAudios[album]) {
                    groupedAudios[album] = [];
                }
                groupedAudios[album].push(audio);
            }
        });

        // 遍历分组并添加到列表
        Object.keys(groupedAudios).forEach(album => {

            // 添加该album下的音频
            groupedAudios[album].forEach(audio => {
                let listItem = document.createElement('li');
                listItem.textContent = audio.name_cn + " (" + audio.duration + ")";
                listItem.dataset.url = urlPrefix + audio.id;
                listItem.addEventListener('click', function() {
                    player.src = listItem.dataset.url;
                    player.play();
                    playPauseButton.textContent = '⏸️';
                });
                audioList.appendChild(listItem);
            });

            // 添加album分隔符
            let delimiter = document.createElement('li');
            delimiter.textContent = album;
            delimiter.style.fontWeight = 'bold';
            delimiter.style.padding = '10px';
            delimiter.style.backgroundColor = '#e0e0e0';
            audioList.appendChild(delimiter);
            
        });
    })
    .catch(error => console.error('Error:', error));
