import React from 'react';
import { Link } from 'gatsby';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-navy-900 text-slate-light font-sans selection:bg-teal selection:text-navy-900">
      <nav className="fixed w-full z-50 bg-navy-900/90 backdrop-blur-sm shadow-lg transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="text-teal font-mono font-bold text-2xl hover:text-teal/80 transition-colors">MR</Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {['About', 'Experience', 'Projects', 'Skills', 'Blog', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    to={`#${item.toLowerCase()}`}
                    className="text-slate-light hover:text-teal px-3 py-2 rounded-md text-sm font-mono font-medium transition-colors duration-300"
                  >
                    {item}
                  </Link>
                ))}
                <a
                  href="/Mahmud_Rahman.pdf"
                  rel="noopener noreferrer"
                  target='_blank'
                  className="border border-teal text-teal hover:bg-teal/10 px-4 py-2 rounded-md text-sm font-mono font-medium transition-colors duration-300 ml-4"
                >
                  Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-20">
        {children}
      </main>
      <footer className="bg-navy-800 py-6 text-center text-slate-light text-sm font-mono">
        <p>Designed & Built by Mahmudur Rahman</p>
      </footer>
    </div>
  );
};

export default Layout;
