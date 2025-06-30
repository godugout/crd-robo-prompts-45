
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  description
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-crd-dark to-crd-darkest flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#23262F] rounded-2xl p-8 border border-crd-mediumGray/20">
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-crd-lightGray hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
            <p className="text-crd-lightGray">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
