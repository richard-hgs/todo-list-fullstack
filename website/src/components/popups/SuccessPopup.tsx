import React from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline'; // Or /24/solid for filled

interface SuccessPopupProps {
  open: boolean;
  setOpen: (value: boolean) => void,
  title?: string;
  message?: string;
  buttonText?: string
}

function SuccessPopup(
  {
    open,
    setOpen,
    title = "Sucesso",
    message,
    buttonText = "OK", // Default button text
  }: SuccessPopupProps
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
            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
              <CheckCircleIcon aria-hidden="true" className="size-6 text-green-600" />
            </div>
            {title && (
              <p className="text-base text-gray-700 font-bold">{title}</p>
            )}
            {message && (
              <p className="text-base text-gray-700">{message}</p>
            )}
          </div>

          <div className="bg-gray-50 mt-4 px-4 py-3 sm:flex sm:justify-center sm:px-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex w-full justify-center rounded-md bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
            >
              {buttonText}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default SuccessPopup;