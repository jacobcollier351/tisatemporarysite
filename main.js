// 获取元素
let audioList = document.getElementById('audio-list');
let player = document.getElementById('player');
let playerTitle = document.getElementById('player-title'); // Get the title element

// 音频URL前缀
let urlPrefix = "https://cloudflare-cors-anywhere.andyhu0777.workers.dev/?https://cdn.totality-of-life.com/";

// 新增：追踪当前正在播放的列表项
let currentPlayingLi = null;

// 新增：点击标题标签时，平滑滚动到当前播放的列表项
playerTitle.addEventListener('click', function() {
    if (currentPlayingLi) {
        currentPlayingLi.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

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
                let trackName = audio.name_cn + " (" + audio.duration + ")";
                listItem.textContent = trackName;
                listItem.dataset.url = urlPrefix + audio.id;
                
                listItem.addEventListener('click', function() {
                    player.src = listItem.dataset.url;
                    player.play();
                    
                    // --- 新增的标签和滚动逻辑 ---
                    
                    // 1. 显示并更新顶部标签
                    playerTitle.textContent = "正在播放: " + trackName; // "Now playing: ..."
                    playerTitle.style.display = "block";
                    
                    // 2. 移除上一个播放项的高亮样式
                    if (currentPlayingLi) {
                        currentPlayingLi.classList.remove('playing-active');
                    }
                    
                    // 3. 为当前点击的项添加高亮样式并更新追踪变量
                    listItem.classList.add('playing-active');
                    currentPlayingLi = listItem;
                });
                
                audioList.appendChild(listItem);
            });

            // 添加album分隔符
            let delimiter = document.createElement('li');
            delimiter.textContent = album;
            delimiter.style.fontWeight = 'bold';
            delimiter.style.padding = '10px';
            delimiter.style.backgroundColor = '#e0e0e0';
            delimiter.style.cursor = 'default'; // 防止鼠标变成手指形状，因为它不可点击
            audioList.appendChild(delimiter);
        });
    })
    .catch(error => console.error('Error:', error));
