// src/components/client/UpcomingAppointments.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, ChevronRight, Star } from 'lucide-react';
import { Appointment } from '../../types/client';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ appointments }) => {
  const upcoming = appointments.filter(a => a.status === 'upcoming').slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">Upcoming Appointments</h3>
        <motion.button
          whileHover={{ x: 4 }}
          className="text-cyan-400 text-sm flex items-center gap-1"
        >
          View All <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {upcoming.length === 0 ? (
        <div className="text-center py-8 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <Calendar className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No upcoming appointments</p>
          <button className="mt-3 px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/20 transition-all">
            Book Appointment
          </button>
        </div>
      ) : (
        upcoming.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan-500/20 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <img
                src={appointment.doctorAvatar || `https://ui-avatars.com/api/?name=${appointment.doctorName}&background=06b6d4&color=fff`}
                alt={appointment.doctorName}
                className="w-12 h-12 rounded-xl object-cover border border-white/[0.08]"
              />
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{appointment.doctorName}</h4>
                <p className="text-white/40 text-xs">{appointment.doctorSpecialty}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-400" />
                    <span className="text-white/50 text-xs">{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span className="text-white/50 text-xs">{appointment.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {appointment.type === 'video' && (
                  <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-[10px] font-medium flex items-center gap-1">
                    <Video className="w-3 h-3" /> Video
                  </span>
                )}
                {appointment.type === 'in-person' && (
                  <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> In-Person
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-all" />
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default UpcomingAppointments;