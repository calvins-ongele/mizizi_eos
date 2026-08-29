interface ComponentProps {
  height?: number; // The '?' makes this prop optional
}

export default function Loading({ height = 200 }: ComponentProps) {
  return (
    <div className="center-container">
      <div className="centered-div"><img height={height} src="/system/kOnzy.gif"/></div>
    </div>
  );
}
 
 