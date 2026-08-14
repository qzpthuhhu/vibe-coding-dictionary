import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { HighlightProvider } from '@/components/HighlightProvider';
import { Toaster } from 'sonner';

export const Layout = () => {
  return (
    <ThemeProvider>
      <HighlightProvider>
        <Outlet />
        <Toaster richColors closeButton position="top-right" />
      </HighlightProvider>
    </ThemeProvider>
  );
};
