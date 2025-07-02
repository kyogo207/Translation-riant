import React, { useState } from 'react';
import './App.css';

const LANGUAGES = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: '英語' },
  { code: 'zh', name: '中国語' },
  { code: 'ko', name: '韓国語' },
  { code: 'fr', name: 'フランス語' },
  { code: 'It', name: 'イタリア語'},
];

function App() {
  const [sourceLang, setSourceLang] = useState('ja');
  const [targetLang, setTargetLang] = useState('en');
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('このブラウザは音声認識に対応していません');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = `${sourceLang}-${sourceLang.toUpperCase()}`; // ex: ja-JA, en-EN
    recognition.interimResults = false;
    recognition.onresult = async (event) => {
      const speechText = event.results[0][0].transcript;
      setText(speechText);

      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(speechText)}&langpair=${sourceLang}|${targetLang}`);
      const data = await res.json();
      setTranslation(data.responseData.translatedText);
    };

    recognition.start();
  };

  return (
    // ↓↓↓ この行を修正しました ↓↓↓
    <div className="container" style={{ marginTop: '-50px' }}>
      <h1>翻訳ディスプレイ</h1>
      <div>
        <label>入力言語: </label>
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
          {LANGUAGES.map((lang) => (
            <option value={lang.code} key={lang.code}>{lang.name}</option>
          ))}
        </select>
        <label style={{ marginLeft: '1em' }}>出力言語: </label>
        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          {LANGUAGES.map((lang) => (
            <option value={lang.code} key={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div className="box">
        <div className="jp-text">{text}</div>
        <div className="en-text">{translation}</div>
      </div>
      <button onClick={startListening}>🎤 話す</button>
      <div>
        <p>🎤 話すのボタンを押してください</p>
      </div>
    </div>
  );
}

export default App;