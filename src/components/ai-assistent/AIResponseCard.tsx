import React from 'react';

interface AIResponseCardProps {
  response?: string;
  isLoading?: boolean;
}

export const AIResponseCard: React.FC<AIResponseCardProps> = ({ response = '', isLoading = false }) => {
  if (isLoading) return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-20" />;
  if (!response) return null;
  return <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">{response}</div>;
};

export default AIResponseCard;
