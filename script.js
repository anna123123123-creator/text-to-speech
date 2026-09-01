(function () {
  'use strict';

  var textInput = document.getElementById('textInput');
  var voiceSelect = document.getElementById('voiceSelect');
  var rateInput = document.getElementById('rateInput');
  var pitchInput = document.getElementById('pitchInput');
  var rateVal = document.getElementById('rateVal');
  var pitchVal = document.getElementById('pitchVal');
  var btnPlay = document.getElementById('btnPlay');
  var btnStop = document.getElementById('btnStop');
  var statusHint = document.getElementById('statusHint');

  var supported = 'speechSynthesis' in window;
  var voices = [];

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    if (!voices.length) {
      statusHint.textContent = '当前浏览器暂时没有可用的系统语音（有些浏览器需要先跟系统语音服务同步一下，刷新页面再试）。';
      var opt = document.createElement('option');
      opt.textContent = '无可用语音';
      voiceSelect.appendChild(opt);
      return;
    }
    statusHint.textContent = '共找到 ' + voices.length + ' 个系统语音。';
    var zhFirst = voices.slice().sort(function (a, b) {
      var aZh = /zh|cmn/i.test(a.lang) ? 0 : 1;
      var bZh = /zh|cmn/i.test(b.lang) ? 0 : 1;
      return aZh - bZh;
    });
    zhFirst.forEach(function (v) {
      var opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = v.name + ' (' + v.lang + ')';
      voiceSelect.appendChild(opt);
    });
  }

  function play() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    var text = textInput.value.trim();
    if (!text) return;
    var utter = new SpeechSynthesisUtterance(text);
    var selected = voices.find(function (v) { return v.name === voiceSelect.value; });
    if (selected) utter.voice = selected;
    utter.rate = parseFloat(rateInput.value);
    utter.pitch = parseFloat(pitchInput.value);
    utter.onstart = function () { statusHint.textContent = '正在朗读…'; };
    utter.onend = function () { statusHint.textContent = '朗读结束。'; };
    utter.onerror = function (e) { statusHint.textContent = '朗读出错：' + e.error; };
    window.speechSynthesis.speak(utter);
  }

  function stop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    statusHint.textContent = '已停止。';
  }

  rateInput.addEventListener('input', function () { rateVal.textContent = parseFloat(rateInput.value).toFixed(1); });
  pitchInput.addEventListener('input', function () { pitchVal.textContent = parseFloat(pitchInput.value).toFixed(1); });

  btnPlay.addEventListener('click', play);
  btnStop.addEventListener('click', stop);

  if (!supported) {
    statusHint.textContent = '当前浏览器不支持 Web Speech API，换 Chrome / Edge / Safari 最新版试试。';
    btnPlay.disabled = true;
  } else {
    loadVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }
})();
