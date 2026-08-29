'use client';

interface TruncateProps {
  value: string;
  maxLength?: number;
}

export default function TruncateText({
  value,
  maxLength = 10,
}: TruncateProps) {
  const truncated =
    value.length > maxLength
      ? value.slice(0, maxLength) + '…'
      : value;

  return (
    <span
      title={value}
      style={{ cursor: 'help', whiteSpace: 'nowrap' }}
    >
      {truncated}
    </span>
  );
}

