export function HomeHero() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-10 mb-8 text-white relative overflow-hidden shadow-xl">
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">What are you looking for?</h1>
        <p className="text-purple-100 mb-8 text-lg opacity-90">Search documents, templates, trackers and more</p>
        
        <div className="relative group">
          <input 
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 border-none shadow-2xl focus:ring-4 focus:ring-purple-400/30 transition-all outline-none text-lg placeholder:text-gray-400" 
            placeholder="Search by name, tag, or category..." 
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
    </div>
  );
}
