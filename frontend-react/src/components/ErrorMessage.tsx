import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
};
