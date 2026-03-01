import React, { useState, useRef } from 'react';
import { Download, Send } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const COLORS = [
  'Белый', 'Серебро', 'Кремовый', 'Ярко Красный', 'Темно Красный',
  'Бордовый', 'Бордо-малина', 'Золото', 'Бежевый', 'Светло Сирень',
  'Лаванда', 'Лаванда Сирень', 'Фиолетовый', 'Светлый Баклажан', 'Баклажан',
  'Мята', 'Тиффани', 'Морская волна', 'Зеленая волна', 'Зеленый',
  'Хаки', 'Изумруд', 'Бон Аква', 'Бонаква Матовый', 'Голубой',
  'Синий', 'Арабская ночь', 'Серый', 'Антрацит', 'Титан',
  'Мурена', 'Черный', 'Фуксия', 'Лолли Поп', 'Манго',
  'Роуз Голд', 'Нежно розовый', 'Темно бежевый', 'Прозрачный',
  'Прозрачный розовый', 'Розовый кварц'
];

export default function App() {
  const [school, setSchool] = useState('');
  const [className, setClassName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  const handleGeneratePDF = async () => {
    if (!imageRef.current) return;
    setIsGenerating(true);

    try {
      const img = imageRef.current;
      
      // Create an off-screen container with natural image dimensions
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = `${img.naturalWidth}px`;
      container.style.height = `${img.naturalHeight}px`;
      container.style.backgroundColor = '#ffffff';
      
      // Add background image
      const bgImg = document.createElement('img');
      bgImg.src = img.src;
      bgImg.crossOrigin = 'anonymous';
      bgImg.style.width = '100%';
      bgImg.style.height = '100%';
      bgImg.style.display = 'block';
      container.appendChild(bgImg);

      // Add Color text
      const colorDiv = document.createElement('div');
      colorDiv.innerText = color;
      colorDiv.style.position = 'absolute';
      colorDiv.style.width = '100%';
      colorDiv.style.textAlign = 'center';
      colorDiv.style.top = '42.3%';
      colorDiv.style.transform = 'translateY(-50%)';
      colorDiv.style.fontFamily = '"Playfair Display", Georgia, serif';
      colorDiv.style.fontStyle = 'italic';
      colorDiv.style.fontWeight = '600';
      colorDiv.style.fontSize = `${img.naturalWidth * 0.042}px`;
      colorDiv.style.color = '#141414';
      container.appendChild(colorDiv);

      // Add Class text
      const classDiv = document.createElement('div');
      classDiv.innerText = className;
      classDiv.style.position = 'absolute';
      classDiv.style.width = '100%';
      classDiv.style.textAlign = 'center';
      classDiv.style.top = '49.8%';
      classDiv.style.transform = 'translateY(-50%)';
      classDiv.style.fontFamily = '"Playfair Display", Georgia, serif';
      classDiv.style.fontStyle = 'italic';
      classDiv.style.fontWeight = '600';
      classDiv.style.fontSize = `${img.naturalWidth * 0.042}px`;
      classDiv.style.color = '#141414';
      container.appendChild(classDiv);

      // Add School text (below "оформлен в индивидуальном заказе")
      const schoolDiv = document.createElement('div');
      schoolDiv.innerText = school;
      schoolDiv.style.position = 'absolute';
      schoolDiv.style.width = '100%';
      schoolDiv.style.textAlign = 'center';
      schoolDiv.style.top = '57.0%';
      schoolDiv.style.transform = 'translateY(-50%)';
      schoolDiv.style.fontFamily = '"Playfair Display", Georgia, serif';
      schoolDiv.style.fontStyle = 'italic';
      schoolDiv.style.fontWeight = '600';
      schoolDiv.style.fontSize = `${img.naturalWidth * 0.038}px`;
      schoolDiv.style.color = '#141414';
      container.appendChild(schoolDiv);

      document.body.appendChild(container);

      // Render to canvas
      const canvas = await html2canvas(container, {
        scale: 1, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(container);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [img.naturalWidth, img.naturalHeight]
      });

      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, img.naturalWidth, img.naturalHeight);
      
      // Improved download for mobile and desktop
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      let url;
      const link = document.createElement('a');
      
      if (isIOS) {
        // Force native download prompt on iOS with specific filename
        const pdfArrayBuffer = pdf.output('arraybuffer');
        const blob = new Blob([pdfArrayBuffer], { type: 'application/octet-stream' });
        url = URL.createObjectURL(blob);
        link.download = 'sertificat.pdf';
      } else {
        const pdfBlob = pdf.output('blob');
        url = URL.createObjectURL(pdfBlob);
        link.download = 'BrandLenta_Certificate.pdf';
      }
      
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Произошла ошибка при генерации PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-rose-900/20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/IMG_4387.PNG" alt="Brand Lenta Logo" className="h-12 sm:h-14 object-contain" onError={(e) => {
              // Fallback if logo is missing
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
            <h1 className="text-xl font-medium tracking-tight text-stone-800">
              Генератор Сертификатов
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200">
              <h2 className="text-lg font-semibold mb-6 text-stone-800">Данные для сертификата</h2>
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-stone-700 mb-1.5">
                    Название школы и город
                  </label>
                  <input
                    type="text"
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Школа №1, г. Алматы"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-colors outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="className" className="block text-sm font-medium text-stone-700 mb-1.5">
                    Класс
                  </label>
                  <input
                    type="text"
                    id="className"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="11 «А»"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-colors outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-stone-700 mb-1.5">
                    Выбор цвета
                  </label>
                  <select
                    id="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900 transition-colors outline-none appearance-none cursor-pointer"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    {COLORS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 bg-[#6b1c23] hover:bg-[#5a161c] text-white px-6 py-3.5 rounded-xl font-medium transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span>Скачать PDF</span>
                </button>
                <p className="text-xs text-center text-stone-500 mt-3">
                  Скачайте PDF для отправки менеджеру
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col items-center justify-center min-h-[600px] relative overflow-hidden">
              <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 absolute top-6 left-6">
                Предпросмотр
              </h2>
              
              <div className="relative w-full max-w-2xl mx-auto shadow-xl rounded-sm overflow-hidden bg-stone-100 mt-8">
                {/* Template Image */}
                <img 
                  ref={imageRef}
                  src="/IMG_4386.PNG" 
                  alt="Certificate Template" 
                  className="w-full h-auto block"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    // Fallback visual if image is missing
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1131" fill="%23f5f5f4"><rect width="100%" height="100%"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="%23a8a29e" text-anchor="middle">Шаблон IMG_4386.PNG не найден</text></svg>';
                  }}
                />
                
                {/* Overlay Text */}
                <div className="absolute inset-0 pointer-events-none select-none">
                  <div 
                    className="absolute w-full text-center font-serif italic text-stone-800 font-semibold"
                    style={{ 
                      top: '42.3%', 
                      fontSize: 'clamp(14px, 4.2vw, 34px)',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {color || ' '}
                  </div>
                  <div 
                    className="absolute w-full text-center font-serif italic text-stone-800 font-semibold"
                    style={{ 
                      top: '49.8%', 
                      fontSize: 'clamp(14px, 4.2vw, 34px)',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {className || ' '}
                  </div>
                  <div 
                    className="absolute w-full text-center font-serif italic text-stone-800 font-semibold"
                    style={{ 
                      top: '57.0%', 
                      fontSize: 'clamp(12px, 3.8vw, 30px)',
                      transform: 'translateY(-50%)'
                    }}
                  >
                    {school || ' '}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer with WhatsApp Contact */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4 text-center">
        <a 
          href="https://wa.me/77776889633" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block text-[13px] text-slate-400 hover:text-slate-600 transition-colors font-sans"
        >
          Разработка и автоматизация: Dosymzhan Baidyrakhman
        </a>
      </footer>
    </div>
  );
}
