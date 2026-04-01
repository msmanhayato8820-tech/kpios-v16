'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SimulatorParams } from '@/types';
import { DEFAULT_SIMULATOR_PARAMS } from '@/data/mock';

function SliderInput({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-sm text-gray-300">{label}</label>
        <span className="text-sm font-medium text-white">{value.toLocaleString()}{unit}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-gray-700 accent-blue-500 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
        <span>{min.toLocaleString()}{unit}</span>
        <span>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
}

function simulate(params: SimulatorParams) {
  const { customers, monthlyNetNew, arpu, churnRate } = params;
  const years: { year: number; arr: number; vehicles: number; customers: number }[] = [];
  let currentCustomers = customers;
  const vehiclesPerCustomer = params.managedVehicles / customers;

  for (let y = 2026; y <= 2035; y++) {
    // チャーン率は年率 → 月率に変換
    const monthlyChurnRate = churnRate / 100 / 12;
    let yearEndCustomers = currentCustomers;

    for (let m = 0; m < 12; m++) {
      const monthlyChurn = Math.round(yearEndCustomers * monthlyChurnRate);
      yearEndCustomers = yearEndCustomers + monthlyNetNew - monthlyChurn;
    }

    currentCustomers = Math.max(0, yearEndCustomers);
    const currentArr = (currentCustomers * arpu) / 10000; // 万円 → 億円

    years.push({
      year: y,
      arr: Math.round(currentArr * 10) / 10,
      vehicles: Math.round(currentCustomers * vehiclesPerCustomer),
      customers: currentCustomers,
    });
  }
  return years;
}

export default function SimulatorPage() {
  const [params, setParams] = useState<SimulatorParams>({ ...DEFAULT_SIMULATOR_PARAMS });

  const projection = useMemo(() => simulate(params), [params]);
  const arr2030 = projection.find((p) => p.year === 2030);
  const arr2035 = projection.find((p) => p.year === 2035);

  const update = (key: keyof SimulatorParams) => (val: number) =>
    setParams((prev) => ({ ...prev, [key]: val }));

  const target100 = 100; // 100億円

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Strategy Simulator</h1>
        <p className="text-sm text-gray-500 mt-0.5">100億円達成シミュレーター</p>
      </div>

      {/* Result Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-xl p-5 border ${
          (arr2030?.arr ?? 0) >= target100
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-blue-500/10 border-blue-500/30'
        }`}>
          <p className="text-xs text-gray-400 mb-1">2030年 推定ARR</p>
          <p className="text-3xl font-bold text-white">{arr2030?.arr ?? '-'}億円</p>
          <p className="text-xs text-gray-500 mt-1">顧客数 {arr2030?.customers.toLocaleString() ?? '-'}社</p>
        </div>
        <div className={`rounded-xl p-5 border ${
          (arr2035?.arr ?? 0) >= target100
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-amber-500/10 border-amber-500/30'
        }`}>
          <p className="text-xs text-gray-400 mb-1">2035年 推定ARR</p>
          <p className="text-3xl font-bold text-white">{arr2035?.arr ?? '-'}億円</p>
          <p className="text-xs text-gray-500 mt-1">顧客数 {arr2035?.customers.toLocaleString() ?? '-'}社</p>
          {(arr2035?.arr ?? 0) >= target100 ? (
            <p className="text-xs text-emerald-400 mt-1 font-medium">100億円目標達成</p>
          ) : (
            <p className="text-xs text-amber-400 mt-1 font-medium">
              目標まで あと{Math.round(target100 - (arr2035?.arr ?? 0))}億円
            </p>
          )}
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">2035年 推定管理車両数</p>
          <p className="text-3xl font-bold text-white">{arr2035?.vehicles.toLocaleString() ?? '-'}台</p>
          <p className="text-xs text-gray-500 mt-1">
            現在比 {arr2035 ? Math.round((arr2035.vehicles / params.managedVehicles) * 100) : '-'}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-gray-900/60 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-300 mb-4">ARR成長曲線（2026-2035）</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projection} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => `${v}億`} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                  formatter={(value) => [`${value}億円`, 'ARR']}
                />
                <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '100億円目標', fill: '#ef4444', fontSize: 11 }} />
                <Area type="monotone" dataKey="arr" stroke="#3b82f6" strokeWidth={2} fill="url(#simGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sliders */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-medium text-gray-300">パラメーター調整</h3>
          <SliderInput label="管理車両台数" value={params.managedVehicles} min={50000} max={500000} step={5000} unit="台" onChange={update('managedVehicles')} />
          <SliderInput label="顧客数" value={params.customers} min={5000} max={100000} step={1000} unit="社" onChange={update('customers')} />
          <SliderInput label="月次純増" value={params.monthlyNetNew} min={10} max={500} step={5} unit="社/月" onChange={update('monthlyNetNew')} />
          <SliderInput label="ARPU（年間）" value={params.arpu} min={10} max={100} step={1} unit="万円" onChange={update('arpu')} />
          <SliderInput label="チャーン率" value={params.churnRate} min={0} max={5} step={0.1} unit="%" onChange={update('churnRate')} />

          <button
            onClick={() => setParams({ ...DEFAULT_SIMULATOR_PARAMS })}
            className="w-full text-xs text-gray-500 hover:text-gray-300 py-2 rounded border border-gray-700 hover:border-gray-600 transition-colors mt-2"
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}
