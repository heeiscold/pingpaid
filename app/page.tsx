// app/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// 랭킹 데이터의 타입을 명확하게 정의합니다.
type Ranking = {
  id: string;
  created_at: string;
  nickname: string;
  latest_message: string;
  total_amount: number;
  updated_at: string;
};

export default function Home() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState<number | ''>(''); 
  const [activeTab, setActiveTab] = useState('ranking'); 
  const amountInputRef = useRef<HTMLInputElement>(null);
  const [rankings, setRankings] = useState<Ranking[]>([]);

  const bannedWords = ['fuck', 'shit', 'bitch', 'nigger', 'sex', 'porn', 'hitler', 'kkk'];

  const containsBannedWord = (text: string) => {
    return bannedWords.some((word) => text.toLowerCase().includes(word));
  };

  async function getRankings() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('total_amount', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching rankings:', error);
    } else {
      setRankings(data as Ranking[]);
    }
  }

  useEffect(() => {
    if (activeTab === 'ranking') {
      getRankings();
    }
  }, [activeTab]);

  const handlePing = async () => {
  // 5개의 상품 링크를 미리 준비하는 부분은 그대로 둡니다.
  const linkFor1 = 'https://pingpaid.lemonsqueezy.com/buy/a8144ce4-8611-4365-97e0-38a0ecd9e8a8';
  const linkFor10 = 'https://pingpaid.lemonsqueezy.com/buy/33b45576-c34a-4a0e-adca-d610d1f972ce';
  const linkFor25 = 'https://pingpaid.lemonsqueezy.com/buy/bdfc1c1f-b0bd-4b2b-a858-58d00621ee46';
  const linkFor50 = 'https://pingpaid.lemonsqueezy.com/buy/9f40fef4-3fd4-4e24-b2fd-435a37481abb';
  const linkForCustom = 'https://pingpaid.lemonsqueezy.com/buy/396403bf-11ed-449a-a20c-bad5dd56df1e';

  // 유효성 검사도 그대로 둡니다.
  if (!name.trim()) { /* ... */ }
  if (typeof amount !== 'number' || amount < 1) { /* ... */ }
  if (containsBannedWord(name) || containsBannedWord(message)) { /* ... */ }
  
  // --- ▼▼▼ URL 생성 로직 수정 ▼▼▼ ---

  let baseUrl = ''; // 기본 URL을 담을 변수
  let hasQuery = false; // 기본 URL에 이미 쿼리 파라미터가 있는지 여부

  // 금액에 따라 올바른 기본 URL을 선택합니다.
  if (amount === 1) {
    baseUrl = linkFor1;
  } else if (amount === 10) {
    baseUrl = linkFor10;
  } else if (amount === 25) {
    baseUrl = linkFor25;
  } else if (amount === 50) {
    baseUrl = linkFor50;
  } else {
    // 그 외의 모든 'Custom' 금액일 경우
    const amountInCents = Number(amount) * 100;
    // Custom의 경우, URL에 이미 '?'가 포함됩니다.
    baseUrl = `${linkForCustom}?checkout[custom_price]=${amountInCents}`;
    hasQuery = true; // ?가 이미 있다고 표시
  }
  
  // 닉네임과 메시지 파라미터를 추가하기 전,
  // ?를 붙일지 &를 붙일지 결정합니다.
  const separator = hasQuery ? '&' : '?';

  // 최종 URL을 조합합니다.
  const finalUrl = `${baseUrl}` +
                 `${separator}checkout[custom][nickname]=${encodeURIComponent(name)}` +
                 `&checkout[custom][message]=${encodeURIComponent(message)}`;

  // 최종 생성된 URL로 사용자를 이동시킵니다.
  window.location.href = finalUrl;
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
                {rankings.length > 0 ? (
                  <>
                    <div className="w-full p-4 rounded-xl shadow-lg bg-white border-2 border-indigo-500 mb-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-bold text-indigo-600">#1 {rankings[0].nickname}</span>
                        <span className="text-xl font-bold text-slate-800">${rankings[0].total_amount}</span>
                      </div>
                      <p className="text-md text-slate-700 mt-2 italic">{`"${rankings[0].latest_message}"`}</p>
                    </div>
                    <div className="w-full max-h-[450px] overflow-y-auto space-y-3 p-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                      {rankings.slice(1).map((item, index) => (
                        <div key={item.id} className="w-full p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-indigo-400 transition-colors">
                          <div className="flex justify-between items-baseline text-slate-500">
                            <p className="font-bold text-indigo-600">#{index + 2} <span className="text-slate-800 font-semibold">{item.nickname}</span></p>
                            <p className="font-semibold">${item.total_amount}</p>
                          </div>
                          <p className="text-sm text-slate-600 mt-1 italic truncate">{`"${item.latest_message}"`}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-500 py-10">
                    No rankings yet. Be the first to ping!
                  </div>
                )}
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
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            id="amount"
                            className="w-full pl-7 pr-4 py-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                            placeholder="Amount (min. $1)"
                            value={amount}
                            onChange={(e) => {
                              const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
                              setAmount(sanitizedValue === '' ? '' : Number(sanitizedValue));
                            }}
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
                <p className="text-center text-xs text-gray-500 px-4">
                    결제 금액은 랭킹에만 반영되며, 언급된 대상에게 직접 전달되지 않습니다.
                </p>
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