import React from "react";
import { CalendarRange, Download, X } from "lucide-react";

export const ADMIN_FILTER_CONTAINER_CLASS =
  "admin-filter-container glass-panel p-4 rounded-2xl border border-white/10";

export const AdminExportCsvButton = ({ onClick, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="admin-export-btn"
  >
    <Download size={16} className="text-violet-400" />
    <span>Export CSV</span>
  </button>
);

export const AdminDateRangeFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}) => (
  <div className="admin-date-filter">
    <CalendarRange size={14} className="text-starlight/50" />
    <input
      type="date"
      value={startDate}
      onChange={(event) => onStartDateChange(event.target.value)}
      className="admin-date-input"
      aria-label="Filter from date"
    />
    <span className="text-[10px] font-bold uppercase tracking-wider text-starlight/40">
      to
    </span>
    <input
      type="date"
      value={endDate}
      onChange={(event) => onEndDateChange(event.target.value)}
      className="admin-date-input"
      aria-label="Filter to date"
    />
    {(startDate || endDate) && (
      <button
        type="button"
        onClick={onClear}
        className="admin-date-clear"
        aria-label="Clear date range filter"
      >
        <X size={12} />
      </button>
    )}
  </div>
);
