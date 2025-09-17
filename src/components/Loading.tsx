import React from 'react'

export default function Loading({ message }: { message: string }) {
  return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    );
}
