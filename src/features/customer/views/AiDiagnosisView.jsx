import React, { useState } from 'react';
import { Sparkles, Camera, Upload, Cpu, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';

const COMMON_ISSUES = [
  { id: 1, name: 'Aptomat tự nhảy liên tục', tag: 'Điện dân dụng', risk: 'Cao' },
  { id: 2, name: 'Máy lạnh thổi gió nhưng không lạnh', tag: 'Điện lạnh', risk: 'Trung bình' },
  { id: 3, name: 'Vòi nước bị rỉ nước liên tục', tag: 'Ống nước', risk: 'Thấp' },
  { id: 4, name: 'Khóa cửa vân tay báo pin yếu / không nhận', tag: 'Khóa cửa', risk: 'Trung bình' },
];

export default function AiDiagnosisView() {
  const [toastMessage, setToastMessage] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleScan = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setToastMessage('Trạng thái: Tính năng AI phân tích hình ảnh đang được phát triển.');
      setTimeout(() => setToastMessage(''), 4500);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-tight">AI Chẩn Đoán Sự Cố & Dự Báo Chi Phí</h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            FixGo AI 2.0
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Chụp ảnh hiện trường thiết bị hư hỏng, hệ thống AI Computer Vision sẽ nhận diện mức độ hư hại và đề xuất thợ chuyên môn phù hợp.
        </p>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Scanner */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center">
        <div className="relative max-w-md mx-auto aspect-video rounded-2xl bg-slate-950 border-2 border-dashed border-purple-500/40 flex flex-col items-center justify-center p-6 space-y-3 cursor-pointer hover:border-purple-400 transition-colors" onClick={handleScan}>
          <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-lg">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Chụp ảnh hoặc Kéo thả hình ảnh tại đây</h3>
            <p className="text-xs text-slate-500 mt-1">Hỗ trợ JPG, PNG, WEBP (Tối đa 10MB)</p>
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={analyzing}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Đang phân tích mạng nơ-ron...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>BẮT ĐẦU PHÂN TÍCH AI VÀ TÍNH TOÁN CHI PHÍ</span>
            </>
          )}
        </button>
      </div>

      {/* Common Symptoms */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Các sự cố thường gặp được AI nhận diện tự động</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMMON_ISSUES.map((issue) => (
            <div key={issue.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 shadow-md">
              <div>
                <h4 className="text-xs font-bold text-white">{issue.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Phân loại: {issue.tag}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                issue.risk === 'Cao' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'
              }`}>
                Mức độ {issue.risk}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
