
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-itsss-lightBlue/30">
      <header className="w-full py-6 border-b border-itsss-lightBlue/20 bg-white/80 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-center md:justify-start items-center">
            <div className="text-2xl font-medium text-itsss-blue">
              ITSSS Stress Calculator
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow py-12">
        <div className="container max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="w-full py-6 border-t border-itsss-lightBlue/20 bg-white/80 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              Made by ITSSS
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.itsss.co.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-itsss-blue hover:text-itsss-blue/80 transition-colors text-sm"
              >
                www.itsss.co.in
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
