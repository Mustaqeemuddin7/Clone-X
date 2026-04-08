export function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

export function formatShortDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-IN', options);
}

export function getDeliveryDate(daysFromNow = 5) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

export function truncateText(text, maxLen = 100) {
  if (!text || text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
