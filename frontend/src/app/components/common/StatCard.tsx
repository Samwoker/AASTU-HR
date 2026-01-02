import React from "react";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  color?: string;
  className?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  color = "bg-k-orange",
  className = "",
}: StatCardProps) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-card ${className}`}>
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="text-2xl text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-k-dark-grey">{value}</p>
        </div>
      </div>
    </div>
  );
}
