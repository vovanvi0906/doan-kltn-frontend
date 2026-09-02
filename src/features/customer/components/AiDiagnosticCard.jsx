import React, { useState } from 'react';
import { Sparkles, Camera, Upload, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function AiDiagnosticCard() {
  const [toastMessage, setToastMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleTriggerAi = (e) => {
    e.preventDefault();
    setToastMessage('Trạng thái: Tính năng AI phân tích hình ảnh đang được phát triển.');
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/40 p-6 border border-indigo-500/30 shadow-2xl space-y-4">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                AI Chẩn Đoán Sự Cố Bằng Hình Ảnh
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                BETA AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Chụp hoặc tải ảnh thiết bị hư hỏng để AI tự động nhận diện linh kiện và báo giá
            </p>
          </div>
        </div>
      </div>

      {/* Upload Dropzone Mockup */}
      <div
        onClick={handleTriggerAi}
        className="relative group border-2 border-dashed border-indigo-500/30 hover:border-indigo-400/60 rounded-2xl p-6 bg-slate-950/60 hover:bg-slate-950/80 transition-all text-center cursor-pointer space-y-2"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
            {selectedFileName || 'Chụp ảnh hoặc Tải ảnh hiện trường lên'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Hỗ trợ định dạng JPG, PNG, WEBP tối đa 10MB</p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleTriggerAi}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>PHÂN TÍCH VÀ ĐỀ XUẤT PHƯƠNG ÁN SỬA CHỮA</span>
      </button>

      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs animate-bounce">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
