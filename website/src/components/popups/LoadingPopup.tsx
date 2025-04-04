import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-10 w-10 text-blue-600" // Adjust size and color as needed
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

interface LoadingPopupProps {
  open: boolean;
  message?: string;
}

function LoadingPopup(
  {
    open,
    message = "Carregando...", // Default loading message
  }: LoadingPopupProps
) {
  if (!open) {
    return null;
  }

  return (
    // Use Headless UI Dialog for accessibility and backdrop management
    // Pass a no-op function or undefined to onClose if you DON'T want overlay/Esc clicks to close it.
    // The parent component controls closure purely via the `open` prop.
    <Dialog open={open} onClose={() => {}} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        {/* Dialog Panel */}
        <DialogPanel
          transition
          className="w-full max-w-sm transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        >
          {/* Centered Content */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <LoadingSpinner />
            {message && (
              <p className="text-base text-gray-700">{message}</p>
            )}
          </div>

          {/* No buttons needed for a loading indicator */}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default LoadingPopup;