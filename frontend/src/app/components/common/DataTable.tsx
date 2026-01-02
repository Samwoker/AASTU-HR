import React, { ReactNode } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

// ==========================================
// Table Column Definition
// ==========================================
export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

// ==========================================
// Table Skeleton Component
// ==========================================
interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 6, rows = 5 }: TableSkeletonProps) {
  // Fixed widths to prevent layout shift
  const widths = [120, 80, 140, 100, 80, 60];

  return (
    <div className="animate-pulse min-w-[800px]">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 p-4 border-b border-gray-50 last:border-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 rounded shrink-0"
              style={{ width: `${widths[colIndex % widths.length]}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// Empty State Component
// ==========================================
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title = "No data found",
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="text-6xl text-gray-300 mx-auto mb-4" />}
      <p className="text-gray-800 font-medium text-lg">{title}</p>
      {description && (
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ==========================================
// Pagination Component
// ==========================================
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  itemLabel = "item",
}: PaginationProps & { itemLabel?: string }) {
  const showingCount =
    totalItems === 0
      ? 0
      : Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage);

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-b-2xl border-t border-gray-100">
      <span className="text-sm text-gray-600">
        Showing {showingCount}{" "}
        {showingCount === 1 ? itemLabel : `${itemLabel}s`}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1 || !onPageChange}
          className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <MdChevronLeft className="text-xl text-gray-600" />
        </button>
        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages || !onPageChange}
          className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <MdChevronRight className="text-xl text-gray-600" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// Data Table Component
// ==========================================
interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyState?: EmptyStateProps;
  keyExtractor: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T, index: number) => string;
  pagination?: PaginationProps;
  skeletonColumns?: number;
  skeletonRows?: number;
  className?: string;
  tableClassName?: string;
  itemLabel?: string; // e.g., "employee", "application", "holiday"
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyState,
  keyExtractor,
  onRowClick,
  rowClassName,
  pagination,
  skeletonColumns,
  skeletonRows,
  className = "",
  tableClassName = "",
  itemLabel = "item",
}: DataTableProps<T>) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className={`bg-white rounded-2xl shadow-card ${className}`}>
      <div className="overflow-x-auto">
        {loading ? (
          <TableSkeleton
            columns={skeletonColumns || columns.length}
            rows={skeletonRows || 5}
          />
        ) : safeData.length === 0 ? (
          <EmptyState {...emptyState} />
        ) : (
          <table
            className={`w-full text-left border-collapse min-w-[800px] ${tableClassName}`}
          >
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-semibold">
                {columns.map((col, index) => (
                  <th
                    key={col.key}
                    className={`p-4 ${index === 0 ? "rounded-l-lg" : ""} ${
                      index === columns.length - 1 ? "rounded-r-lg" : ""
                    } ${col.headerClassName || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {safeData.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${rowClassName?.(item, index) || ""}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`p-4 ${col.className || ""}`}>
                      {col.render
                        ? col.render(item, index)
                        : (item as Record<string, unknown>)[col.key] !==
                          undefined
                        ? String((item as Record<string, unknown>)[col.key])
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Always show pagination info when we have data or explicit pagination */}
      {(pagination || safeData.length > 0) && (
        <Pagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          totalItems={pagination?.totalItems ?? safeData.length}
          itemsPerPage={pagination?.itemsPerPage || safeData.length || 10}
          onPageChange={pagination?.onPageChange}
          itemLabel={itemLabel}
        />
      )}
    </div>
  );
}
