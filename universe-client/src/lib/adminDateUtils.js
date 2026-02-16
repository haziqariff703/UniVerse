const DEFAULT_DATE_KEYS = [
  "date_time",
  "created_at",
  "createdAt",
  "updated_at",
  "updatedAt",
  "timestamp",
  "date",
];

const toValidDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const matchesDateRange = (
  item,
  startDate,
  endDate,
  dateKeys = DEFAULT_DATE_KEYS,
) => {
  if (!startDate && !endDate) return true;

  const dateValue = dateKeys.map((key) => item?.[key]).find(Boolean);
  const itemDate = toValidDate(dateValue);
  if (!itemDate) return false;

  let startBoundary = startDate ? new Date(`${startDate}T00:00:00`) : null;
  let endBoundary = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

  if (startBoundary && endBoundary && startBoundary > endBoundary) {
    [startBoundary, endBoundary] = [endBoundary, startBoundary];
  }

  if (startBoundary && itemDate < startBoundary) return false;
  if (endBoundary && itemDate > endBoundary) return false;

  return true;
};
