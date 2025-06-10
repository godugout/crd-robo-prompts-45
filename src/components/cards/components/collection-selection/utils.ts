
// Helper function to safely format dates
export const formatDate = (date: Date | string): string => {
  try {
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown date';
  }
};
