// app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  // const [link, setLink] = useState(''); // 링크 state 삭제

  // 랭킹 데이터 예시 (실제로는 DB에서 가져와야 함)
  const rankings = [
    { rank: 1, name: 'Alice', amount: 120, message: 'Life is short. Ping your message!' },
    { rank: 2, name: 'Bob', amount: 100, message: 'To the moon! 🚀' },
    { rank: 3, name: 'Charlie', amount: 95, message: 'Hello World' },
    ...[...Array(97)].map((_, i) => ({
      rank: i + 4,
      name: `User #${i + 4}`,
      amount: 90 - i,
      message: `This is test message ${i + 4}`,
    })),
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <main className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto p-4
      pt-[env(safe-area-inset-top)] 
      pb-[env(safe-area-inset-bottom)]">
        
        <header className="text-center my-12">
          <h1 className="text-5xl font-extrabold text-slate-900">🎯 PingPaid</h1>
          {/* 슬로건: 더 세련되고 의미 있는 문구로 교체 */}
          <p className="text-lg text-slate-600 mt-3">Leave a digital echo.</p>
        </header>

        <section className="w-full flex flex-col gap-4">
          <h2 className="text-xl font-bold text-center text-slate-500 mb-2 tracking-wider">RANKING</h2>
          
          <div className="w-full p-4 rounded-xl shadow-lg bg-white border-2 border-indigo-500 transform transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold text-indigo-600">#1 {rankings[0].name}</span>
              <span className="text-xl font-bold text-slate-800">${rankings[0].amount}</span>
            </div>
            <p className="text-md text-slate-700 mt-2 italic">"{rankings[0].message}"</p>
          </div>
          
          <div className="w-full max-h-[350px] overflow-y-auto space-y-3 p-1
             scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
            {rankings.slice(1).map((item) => (
              <div key={item.rank} className="w-full p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-indigo-400 transition-colors">
                <div className="flex justify-between items-baseline text-slate-500">
                  <p className="font-bold text-indigo-600">#{item.rank} <span className="text-slate-800 font-semibold">{item.name}</span></p>
                  <p className="font-semibold">${item.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full space-y-4 my-16">
           <h2 className="text-xl font-bold text-center text-slate-500 mb-2 tracking-wider">LEAVE A MESSAGE</h2>

          <input
            className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            placeholder="Nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            placeholder="Your Message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          
          {/* 링크 입력창: 과감하게 삭제하여 핵심에 집중 */}
          {/* <input
            className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            placeholder="https://your-link.com (Optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          */}

          <button className="
            w-full py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg shadow-md
            transform transition-all duration-200
            hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5
          ">
            Ping!
          </button>
        </section>

      </main>
    </div>
  );
}