export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateOrderNumber = (orderId) => {
  return `ORD-${orderId.slice(-8).toUpperCase()}`;
};

export const calculateDiscount = (price, discountPercent) => {
  return price - (price * discountPercent / 100);
};
