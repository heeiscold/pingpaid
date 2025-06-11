// app/page.tsx
'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState<number | ''>(''); 
  const [activeTab, setActiveTab] = useState('ranking'); 
  const amountInputRef = useRef<HTMLInputElement>(null);

  const bannedWords = ['fuck', 'shit', 'bitch', 'nigger', 'sex', 'porn', 'hitler', 'kkk'];

  const containsBannedWord = (text: string) => {
    return bannedWords.some((word) => text.toLowerCase().includes(word));
  };

  const sampleMessages = [
    'Just testing...', 'WAGMI 🚀', 'Follow my art @artist_name', 'Happy Birthday, Sarah!', 'I was told there would be cake.',
    'Is this thing on?', 'Hello from Gwangju!', 'Buy high, sell low.', 'My first ping!', 'Just graduated! 🎉',
  ];

  const rankings = [
    { rank: 1, name: 'Alice', amount: 120, message: 'Life is short. Ping your message!' },
    { rank: 2, name: 'Bob', amount: 100, message: 'To the moon! 🚀' },
    { rank: 3, name: 'Charlie', amount: 95, message: 'Hello World' },
    ...[...Array(97)].map((_, i) => ({
      rank: i + 4, name: `User #${i + 4}`, amount: 90 - i, message: sampleMessages[i % sampleMessages.length],
    })),
  ];

  const handlePing = () => {
    const lemonSqueezyLink = 'https://YOUR_STORE.lemonsqueezy.com/buy/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // 👈 본인의 링크로 교체!

    if (typeof amount !== 'number' || amount < 1) {
      alert('Minimum amount is $1.');
      return;
    }

    if (containsBannedWord(name) || containsBannedWord(message)) {
      alert('Your message contains inappropriate words.');
      return;
    }

    const amountInCents = amount * 100;
    const checkoutUrl = `${lemonSqueezyLink}?checkout[custom_price]=${amountInCents}`;
    window.location.href = checkoutUrl;
  };

  const presetAmounts = [1, 10, 25, 50];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <main className="flex flex-col items-center min-h-screen w-full max-w-md mx-auto p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        
        <header className="text-center my-12">
          <h1 className="text-5xl font-extrabold text-slate-900">🎯 PingPaid</h1>
          <p className="text-lg text-slate-600 mt-3">Leave a digital echo.</p>
        </header>

        <div className="w-full p-1 bg-slate-200 rounded-xl flex space-x-1 mb-6">
          <button 
            onClick={() => setActiveTab('ranking')}
            className={`w-1/2 py-2.5 rounded-lg text-sm font-bold transition-colors ${activeTab === 'ranking' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:bg-slate-300/50'}`}
          >🏆 Rankings</button>
          <button 
            onClick={() => setActiveTab('ping')}
            className={`w-1/2 py-2.5 rounded-lg text-sm font-bold transition-colors ${activeTab === 'ping' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:bg-slate-300/50'}`}
          >✍️ Ping a Message</button>
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
                
                <div className="w-full max-h-[450px] overflow-y-auto space-y-3 p-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  {rankings.slice(1).map((item) => (
                    <div key={item.rank} className="w-full p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-indigo-400 transition-colors">
                      <div className="flex justify-between items-baseline text-slate-500">
                        <p className="font-bold text-indigo-600">#{item.rank} <span className="text-slate-800 font-semibold">{item.name}</span></p>
                        <p className="font-semibold">${item.amount}</p>
                      </div>
                      <p className="text-sm text-slate-600 mt-1 italic truncate">"{item.message}"</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'ping' && (
              <section id="ping-section" className="w-full space-y-4 pt-4">
                <div>
                    <input
                        className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        placeholder="Nickname"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={20}
                    />
                    <p className="text-right text-xs text-slate-500 mt-1 pr-1">
                        {name.length} / 20
                    </p>
                </div>

                <div>
                    <textarea
                        className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        placeholder="Your Message"
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={50}
                    />
                    <p className="text-right text-xs text-slate-500 mt-1 pr-1">
                        {message.length} / 50
                    </p>
                </div>
                
                <div className="space-y-3 pt-2">
                    <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            ref={amountInputRef}
                            type="number"
                            id="amount"
                            type="text"
                            inputMode="numeric" // 모바일에서 숫자 키패드를 띄웁니다.
                            pattern="[0-9]*"   // 일부 브라우저에서 추가적으로 숫자만 유효하다고 알려줍니다.
                            className="w-full pl-7 pr-4 py-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                            placeholder="Amount (min. $1)"
                            value={amount}
                            onChange={(e) => {
                              const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
                              setAmount(sanitizedValue === '' ? '' : Number(sanitizedValue));
                            }}
                            min="1"
                        />
                    </div>
                    <div className="flex justify-between gap-2">
                        {presetAmounts.map((presetAmount) => (
                            <button
                                key={presetAmount}
                                onClick={() => setAmount(presetAmount)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors w-full ${ amount === presetAmount ? 'bg-indigo-600 text-white shadow' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                            >
                                ${presetAmount}
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                amountInputRef.current?.focus();
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors w-full ${ amount !== '' && !presetAmounts.includes(amount) ? 'bg-indigo-600 text-white shadow' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                        >
                            Custom
                        </button>
                    </div>
                </div>
                
                <button 
                    onClick={handlePing}
                    className="w-full py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg shadow-md transform transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
                >
                Ping!
                </button>
              </section>
            )}
        </div>
      </main>
    </div>
  );
}