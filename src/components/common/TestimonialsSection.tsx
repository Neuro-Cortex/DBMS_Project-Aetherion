import React from 'react';

export default function TestimonialsSection() {
  return (
    <section className="py-20 text-white text-center">
      <h2 className="text-3xl font-bold mb-6">
        What Our Patients Say
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white/10 p-6 rounded-xl">
          "Excellent service and fast response!"
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          "Doctors are very professional and caring."
        </div>

        <div className="bg-white/10 p-6 rounded-xl">
          "Best healthcare system I have used."
        </div>
      </div>
    </section>
  );
}