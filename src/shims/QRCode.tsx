import React from 'react';

const QRCode: React.FC<{ value: string; size?: number }> = ({ value, size = 150 }) => (
  <div
    style={{ width: size, height: size }}
    className="grid place-items-center rounded-lg border border-slate-300 bg-white p-3 text-center text-[10px] text-slate-700"
    title={value}
  >
    QR
  </div>
);

export default QRCode;
