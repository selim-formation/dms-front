/**
 * Index Route (Landing Page)
 * Public route without tenant requirement
 */

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: async () => {
    // No data needed for landing page
return 'Hello World';
  },
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Document Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Multi-Tenant SaaS Platform for Enterprise Document Management
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🗂️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Organize</h3>
              <p className="text-sm text-gray-600">
                Manage documents in workspaces with powerful organization tools
              </p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-lg">
              <div className="text-3xl mb-2">🔐</div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">
                Enterprise-grade security with role-based access control
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold text-gray-900 mb-2">Collaborate</h3>
              <p className="text-sm text-gray-600">
                Work together with teams across your organization
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">To access your tenant:</p>
            <p className="text-gray-600">
              Navigate to 
              {/* <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">/{'{'tenant{'}'}/login</code> */}
            </p>
            <p className="text-sm text-gray-500">
              Replace 
              {/* <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{'{'tenant{'}'}</code> with your organization's identifier */}
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Tech Stack</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'React 18',
                'TypeScript',
                'TanStack Router',
                'TanStack Query',
                'Tailwind CSS',
                'Axios',
                'Zod',
                'React Hook Form',
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-gray-600">
          Built with ❤️ for enterprise document management
        </p>
      </div>
    </div>
  );
}
