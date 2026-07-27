

export function LoadingState() {
  return (
    <div className="loading-state">
      <div className="skeleton title-skeleton"></div>
      <div className="skeleton text-skeleton"></div>
      <div className="skeleton text-skeleton short"></div>
      
      <div className="skeleton-grid">
        <div>
          <div className="skeleton subtitle-skeleton"></div>
          <div className="skeleton list-item-skeleton"></div>
          <div className="skeleton list-item-skeleton"></div>
          <div className="skeleton list-item-skeleton"></div>
        </div>
        <div>
          <div className="skeleton subtitle-skeleton"></div>
          <div className="skeleton list-item-skeleton"></div>
          <div className="skeleton list-item-skeleton"></div>
        </div>
      </div>
    </div>
  );
}
