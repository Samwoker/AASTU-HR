import { FiTrendingUp, FiArrowRight, FiTarget, FiDollarSign, FiCalendar, FiMapPin, FiActivity, FiUser } from 'react-icons/fi';
import { CareerEvent } from '../../../pages/Admin/Employees/slice/types';

interface CareerTimelineProps {
  events: CareerEvent[];
  initialData?: {
    job_title?: string;
    job_level?: string;
    department?: string;
    start_date?: string;
    gross_salary?: number | string;
  };
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'PROMOTION': return <FiTrendingUp className="text-green-500" />;
    case 'DEMOTION': return <FiActivity className="text-red-500" />;
    case 'TRANSFER': return <FiMapPin className="text-blue-500" />;
    case 'SALARY_ADJUSTMENT': return <FiDollarSign className="text-amber-500" />;
    case 'ROLE_CHANGE': return <FiTarget className="text-purple-500" />;
    case 'HIRED': case 'JOINED': return <FiUser className="text-[#DB5E00]" />;
    default: return <FiActivity className="text-gray-500" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'PROMOTION': return 'bg-green-100 border-green-200';
    case 'DEMOTION': return 'bg-red-100 border-red-200';
    case 'TRANSFER': return 'bg-blue-100 border-blue-200';
    case 'SALARY_ADJUSTMENT': return 'bg-amber-100 border-amber-200';
    case 'ROLE_CHANGE': return 'bg-purple-100 border-purple-200';
    case 'HIRED': case 'JOINED': return 'bg-orange-100 border-orange-200';
    default: return 'bg-gray-100 border-gray-200';
  }
};

export default function CareerTimeline({ events, initialData }: CareerTimelineProps) {
  // If no events but we have initial data, synthesize a "JOINED" event
  const allEvents = [...events];

  if (initialData?.start_date) {
    // Only add JOINED if not already represented (usually it's not in careerEvents)
    const hasJoined = allEvents.some(e => e.event_type === 'JOINED' || e.event_type === 'HIRED');
    if (!hasJoined) {
      allEvents.push({
        id: -999, // Unique synthetic ID
        event_type: 'JOINED',
        effective_date: initialData.start_date,
        event_date: initialData.start_date,
        newJobTitle: {
          title: initialData.job_title || 'Unknown',
          level: initialData.job_level || 'Entry'
        },
        newEmployment: {
          department: { name: initialData.department || 'General' }
        },
        new_salary: initialData.gross_salary,
        justification: 'Initial employment record'
      } as any);
    }
  }

  if (allEvents.length === 0) {
    return (
      <div className="py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <FiCalendar className="mx-auto text-4xl text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No career history available.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-8 space-y-12 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#DB5E00] before:to-orange-100 before:rounded-full">
      {allEvents.map((event, idx) => {
        const isLatest = idx === 0;

        return (
          <div key={event.id} className="relative group">
            {/* Timeline Marker */}
            <div className={`absolute -left-8 top-1.5 w-8 h-8 rounded-full border-4 border-white shadow-sm z-10 flex items-center justify-center transition-transform group-hover:scale-110 ${isLatest ? 'bg-[#DB5E00]' : 'bg-gray-400'}`}>
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>

            {/* Content Card */}
            <div className={`p-6 rounded-2xl border transition-all hover:shadow-xl hover:-translate-y-1 bg-white ${isLatest ? 'border-orange-200 shadow-lg shadow-orange-50' : 'border-gray-100 shadow-sm'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${getEventColor(event.event_type)}`}>
                    {getEventIcon(event.event_type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {event.event_type.replace('_', ' ')}
                      {isLatest && <span className="text-[10px] uppercase tracking-widest bg-orange-100 text-[#DB5E00] px-2 py-0.5 rounded-full font-bold">Current Status</span>}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <FiCalendar className="text-gray-400" />
                      Effective: {new Date(event.effective_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Event Date</div>
                  <div className="text-sm font-medium text-gray-600">{new Date(event.event_date).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Job Title Migration */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Position Path</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">{event.previousJobTitle?.title || 'Initial'}</span>
                      <FiArrowRight className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-900">{event.newJobTitle?.title}</span>
                    </div>
                    <div className="text-xs text-[#DB5E00] font-medium mt-0.5">
                      Level: {event.previousJobTitle?.level || '-'} → {event.newJobTitle?.level}
                    </div>
                  </div>
                </div>

                {/* Department / Location Migration if changed */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Department</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">{event.previousEmployment?.department?.name || 'Unassigned'}</span>
                      {event.department_changed && <FiArrowRight className="text-gray-400" />}
                      {event.department_changed && <span className="text-sm font-bold text-gray-900">{event.newEmployment?.department?.name}</span>}
                    </div>
                  </div>
                </div>

                {/* Salary Migration */}
                {event.new_salary && (
                  <div className="md:col-span-2 p-4 bg-orange-50/50 rounded-xl border border-orange-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <FiDollarSign />
                      </div>
                      <div>
                        <div className="text-[10px] text-orange-400 font-bold uppercase mb-1">Compensation Adjustment</div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-500">{Number(event.previous_salary).toLocaleString()} ETB</span>
                          <FiTrendingUp className="text-green-500" />
                          <span className="text-lg font-bold text-gray-900">{Number(event.new_salary).toLocaleString()} ETB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Justification & Notes */}
              {(event.justification || event.notes) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  {event.justification && (
                    <div className="mb-4">
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Justification</div>
                      <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-orange-200 pl-3">"{event.justification}"</p>
                    </div>
                  )}
                  {event.notes && (
                    <div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Internal Notes</div>
                      <p className="text-sm text-gray-600 pl-3">{event.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
