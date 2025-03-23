
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col itsss-bg-pattern overflow-x-hidden">
      <div className="absolute inset-0 itsss-bg-gradient z-0"></div>
      <header className="w-full py-6 border-b border-itsss-lightBlue/20 bg-white/90 backdrop-blur-md relative z-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex justify-center md:justify-start items-center">
            <div className="text-2xl font-medium text-itsss-blue flex items-center">
              <img 
                src="/lovable-uploads/12c01383-84b6-47b4-a264-3506b78f64d5.png" 
                alt="ITSSS Logo" 
                className="h-10 w-auto mr-3" 
              />
              ITSSS Stress Calculator
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow py-12 relative z-10">
        <div className="container max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="w-full py-6 border-t border-itsss-lightBlue/20 bg-white/90 backdrop-blur-md relative z-10">
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
                className="text-itsss-blue hover:text-itsss-blue/80 transition-colors text-sm flex items-center"
              >
                <img 
                  src="/lovable-uploads/12c01383-84b6-47b4-a264-3506b78f64d5.png" 
                  alt="ITSSS Logo" 
                  className="h-5 w-auto mr-2" 
                />
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
