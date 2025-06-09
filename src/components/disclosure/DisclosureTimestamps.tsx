
interface DisclosureTimestampsProps {
  lastGeneratedAt: Date | null;
  lastSavedAt: Date | null;
  hasUnsavedChanges: boolean;
}

export const DisclosureTimestamps = ({
  lastGeneratedAt,
  lastSavedAt,
  hasUnsavedChanges
}: DisclosureTimestampsProps) => {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!lastGeneratedAt && !lastSavedAt) {
    return null;
  }

  return (
    <div className="mt-3 space-y-1">
      {lastGeneratedAt && (
        <p className="text-sm text-green-600">
          Generated: {formatTimestamp(lastGeneratedAt)}
        </p>
      )}
      {lastSavedAt && !hasUnsavedChanges && (
        <p className="text-sm text-green-600">
          Last saved: {formatTimestamp(lastSavedAt)}
        </p>
      )}
    </div>
  );
};
