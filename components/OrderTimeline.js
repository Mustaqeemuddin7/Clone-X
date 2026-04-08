'use client';
import './OrderTimeline.css';

const STAGES = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTimeline({ currentStatus }) {
  const currentIndex = STAGES.findIndex(s => s.key === currentStatus);
  return (
    <div className="order-timeline">
      {STAGES.map((stage, i) => (
        <div key={stage.key} className={`timeline-step ${i <= currentIndex ? 'timeline-step-done' : ''} ${i === currentIndex ? 'timeline-step-current' : ''}`}>
          <div className="timeline-dot">{i <= currentIndex ? '✓' : ''}</div>
          {i < STAGES.length - 1 && <div className={`timeline-line ${i < currentIndex ? 'timeline-line-done' : ''}`} />}
          <div className="timeline-label">{stage.label}</div>
        </div>
      ))}
    </div>
  );
}
