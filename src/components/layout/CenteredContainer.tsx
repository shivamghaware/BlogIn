
import { ReactNode } from 'react';

interface CenteredContainerProps {
  children: ReactNode;
}

export function CenteredContainer({ children }: CenteredContainerProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
