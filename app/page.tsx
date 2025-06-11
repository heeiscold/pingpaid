// app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('ranking'); 

  // --- 1. 데이터 수정 ---
  // 더 현실적인 예시 메시지 목록을 만듭니다.
  const sampleMessages = [
    'Just testing...',
    'WAGMI 🚀',
    'Follow my art @artist_name',
    'Happy Birthday, Sarah!',
    'I was told there would be cake.',
    'Is this thing on?',
    'Hello from Gwangju!',
    'Buy high, sell low.',
    'My first ping!',
    'Just graduated! 🎉',
  ];

  const rankings = [
    { rank: 1, name: 'Alice', amount: 120, message: 'Life is short. Ping your message!' },
    { rank: 2, name: 'Bob', amount: 100, message: 'To the moon! 🚀' },
    { rank: 3, name: 'Charlie', amount: 95, message: 'Hello World' },
    // 4위 이하 랭커들에게도 sampleMessages에서 메시지를 할당합니다.
    ...[...Array(97)].map((_, i) => ({
      rank: i + 4,
      name: `User #${i + 4}`,
      amount: 90 - i,
      message: sampleMessages[i % sampleMessages.length], // 순환하면서 메시지 할당
    })),
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <main className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto p-4
      pt-[env(safe-area-inset-top)] 
      pb-[env(safe-area-inset-bottom)]">
        
        <header className="text-center my-12">
          <h1 className="text-5xl font-extrabold text-slate-900">🎯 PingPaid</h1>
          <p className="text-lg text-slate-600 mt-3">Leave a digital echo.</p>
        </header>

        <div className="w-full p-1 bg-slate-200 rounded-xl flex space-x-1 mb-6">
          <button 
            onClick={() => setActiveTab('ranking')}
            className={`w-1/2 py-2.5 rounded-lg text-sm font-bold transition-colors
              ${activeTab === 'ranking' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:bg-slate-300/50'}`}
          >
            🏆 Rankings
          </button>
          <button 
            onClick={() => setActiveTab('ping')}
            className={`w-1/2 py-2.5 rounded-lg text-sm font-bold transition-colors
              ${activeTab === 'ping' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:bg-slate-300/50'}`}
          >
            ✍️ Ping a Message
          </button>
        </div>

        <div className="w-full">
          {activeTab === 'ranking' && (
            <section id="ranking-section">
              <div className="w-full p-4 rounded-xl shadow-lg bg-white border-2 border-indigo-500 mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-indigo-600">#1 {rankings[0].name}</span>
                  <span className="text-xl font-bold text-slate-800">${rankings[0].amount}</span>
                </div>
                <p className="text-md text-slate-700 mt-2 italic">"{rankings[0].message}"</p>
              </div>
              
              <div className="w-full max-h-[450px] overflow-y-auto space-y-3 p-1
                scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                {rankings.slice(1).map((item) => (
                  <div key={item.rank} className="w-full p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-indigo-400 transition-colors">
                    <div className="flex justify-between items-baseline text-slate-500">
                      <p className="font-bold text-indigo-600">#{item.rank} <span className="text-slate-800 font-semibold">{item.name}</span></p>
                      <p className="font-semibold">${item.amount}</p>
                    </div>
                    {/* --- 2. UI 수정 --- */}
                    {/* 2위 이하 랭커들의 메시지를 표시하는 p 태그를 추가합니다. */}
                    <p className="text-sm text-slate-600 mt-1 italic truncate">"{item.message}"</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'ping' && (
            <section id="ping-section" className="space-y-4 pt-4">
              <input
                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                placeholder="Nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                placeholder="Your Message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="
                w-full py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg shadow-md
                transform transition-all duration-200
                hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5
              ">
                Ping!
              </button>
            </section>
          )}
        </div>

      </main>
    </div>
  );
}