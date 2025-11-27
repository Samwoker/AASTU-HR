export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-5 flex items-center gap-4">
      <div className="p-3 rounded-full bg-[#FFCC00] text-black text-xl md:text-2xl">
        {icon}
      </div>

      <div>
        <p className="text-[#888] text-xs md:text-sm">{title}</p>
        <p className="text-xl md:text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
