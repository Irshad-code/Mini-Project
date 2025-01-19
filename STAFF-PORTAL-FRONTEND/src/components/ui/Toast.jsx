import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';

export default function Toast({ show, type = 'success', message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center p-4 space-x-4 bg-white rounded-lg shadow-lg border">
          {type === 'success' ? (
            <FiCheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <FiXCircle className="w-6 h-6 text-red-500" />
          )}
          <p className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {message}
          </p>
          <button
            onClick={onClose}
            className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Transition>
  );
}
