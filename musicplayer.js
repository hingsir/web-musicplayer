(function(window, document, undefined) {

    function MusicPlayer(options) {
        this.container = options.container;
        this.songList = options.songList || [];
        this.autoplay = options.autoplay || false;
        this.init();
    }
    MusicPlayer.prototype = {

        init: function() {
            var self = this;
            self.render();
        },
        render: function() {
            var self = this;
            if (self.songList.length > 0) {
                return self.renderMusicPlayer(self.songList);
            }else{
                throw 'no songs provided'
            }
        },
        renderMusicPlayer: function(songList) {
            var self = this;
            self.container.innerHTML = '<div id="J_music_player_control">'
                + '<a id="J_music_player_btn_prev" href="javascript:;">上一首</a>'
                + '<a id="J_music_player_btn_play" href="javascript:;">播放</a>'
                + '<a id="J_music_player_btn_next" href="javascript:;">下一首</a>'
                + '</div>';
            self.bindEvents();
            self.songNum = songList.length;
            self.songList = songList;
            self.currIndex = 0;
            self.playByIndex(0);
        },
        bindEvents: function() {
            var self = this;
            Event.bind(self.container, 'click', function(e) {
                var target = Event.getTarget(e);
                if (target.id == 'J_music_player_btn_prev') {
                    self.prev();
                } else if (target.id == 'J_music_player_btn_next') {
                    self.next();
                } else if (target.id == 'J_music_player_btn_play') {
                    if (/played/.test(target.className)) {
                        self.pause();
                        self.switchPlayBtn('pause');
                    } else {
                        self.autoplay = true;
                        self.play();
                        self.switchPlayBtn('play');
                    }
                }
            })
        },
        prev: function() {
            var self = this;
            self.autoplay = true;
            if (self.currIndex == 0) {
                self.playByIndex(self.songNum - 1);
            } else {
                self.playByIndex(self.currIndex - 1)
            }
            self.switchPlayBtn('play');
        },
        next: function() {
            var self = this;
            self.autoplay = true;
            if (self.currIndex == self.songNum - 1) {
                self.playByIndex(0);
            } else {
                self.playByIndex(self.currIndex + 1)
            }
            self.switchPlayBtn('play');
        },
        playByIndex: function(songIndex) {
            var self = this;
            var audio = document.getElementById('J_music_player');
            if (!audio) {
                audio = document.createElement('audio');
                audio.id = 'J_music_player';
                audio.style.display = 'none';
                Event.bind(audio, 'ended', function() {
                    self.next();
                })
                document.body.appendChild(audio);
            }
            audio.autoplay = self.autoplay;
            audio.src = self.songList[songIndex];
            self.currIndex = songIndex;
            self.player = audio;
        },
        pause: function() {
            var self = this;
            self.player.pause();
        },
        play: function() {
            var self = this;
            self.player.play();
        },
        switchPlayBtn: function(state) {
            var target = document.getElementById('J_music_player_btn_play');
            target.className = target.className.replace('played', '');
            if (state == 'play') {
                target.className += 'played';
                target.innerHTML = '暂停'
            } else {
                target.innerHTML = '播放'

            }
        }
    }

    var Event = {
        bind: function(dom, type, handler) {
            if (dom.addEventListener) {
                dom.addEventListener(type, handler, false);
            } else if (dom.attachEvent) {
                dom.attachEvent('on' + type, handler);
            } else {
                dom['on' + type] = handler;
            }
        },
        unBind: function(dom, type, handler) {
            if (dom.removeEventListener) {
                dom.removeEventListener(type, handler, false);
            } else if (dom.attachEvent) {
                dom.detachEvent('on' + type, handler);
            } else {
                dom['on' + type] = null;
            }
        },
        getTarget: function(e) {
            e = e || window.event;
            return e.target || e.srcElement;
        }
    }

    window.MusicPlayer = MusicPlayer;

})(window, document)
