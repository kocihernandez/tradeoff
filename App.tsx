import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Home, Users, Building2, Scale, TrendingUp, Heart, Shield, Sprout } from 'lucide-react';

const DEMOGRAPHIC_DATA = {
  overall: {
    fastVsFair: { fast: 33, fair: 67 },
    costsVsWages: { costs: 53, wages: 47 },
    schoolFunding: 67,
    healthcareAccess: 78
  },
  byParty: {
    Democrat: { fast: 28, fair: 72, costs: 48, wages: 52 },
    Republican: { fast: 42, fair: 58, costs: 61, wages: 39 },
    Independent: { fast: 31, fair: 69, costs: 52, wages: 48 }
  },
  byIncome: {
    'Low Income': { fast: 30, fair: 70, costs: 49, wages: 51 },
    'Middle Income': { fast: 33, fair: 67, costs: 54, wages: 46 },
    'High Income': { fast: 37, fair: 63, costs: 58, wages: 42 }
  },
  byRegion: {
    Urban: { fast: 31, fair: 69, costs: 51, wages: 49 },
    Suburban: { fast: 34, fair: 66, costs: 55, wages: 45 },
    Rural: { fast: 36, fair: 64, costs: 56, wages: 44 }
  }
};

const SCENES = [
  {
    id: 0,
    title: "Opening Disclaimer",
    icon: Shield,
    narrative: "The following story is a fictional illustration of policy concepts from the Possibility Lab Policy Tradeoffs Survey (August 2025, 1,960 California voters). Characters are hypothetical; data is real.",
    dataType: "disclaimer"
  },
  {
    id: 1,
    title: "Meet Elena",
    icon: Home,
    narrative: "Elena has been waiting for affordable housing—one among thousands of Californians facing a shortage. At a city council meeting, officials confront choices that real voters wrestle with.",
    dataType: "context"
  },
  {
    id: 2,
    title: "Fast Option: Build Quickly",
    icon: TrendingUp,
    narrative: "Option one: Move fast. Expedite permits. Build quickly. 33% of California voters prioritize building housing as quickly as possible. Elena could get housing sooner. Tradeoff: reduced environmental review.",
    dataType: "fastVsFair",
    highlight: "fast"
  },
  {
    id: 3,
    title: "Fair Option: Process & Protection",
    icon: Sprout,
    narrative: "Option two: Prioritize fairness—community engagement and environmental review. 67% of voters say housing should only be built where it doesn't harm the environment. Elena waits longer.",
    dataType: "fastVsFair",
    highlight: "fair"
  },
  {
    id: 4,
    title: "Real Tension: Costs vs Wages",
    icon: Scale,
    narrative: "When asked whether to reduce construction costs or ensure good worker wages, voters split nearly evenly: 53% to 47%. This isn't about villains—it's genuine disagreement about priorities.",
    dataType: "costsVsWages"
  },
  {
    id: 5,
    title: "What Voters Value",
    icon: Heart,
    narrative: "Voters emphasized both outcomes AND process: transparency, community voices, fair treatment of workers, environmental protection, and adequate standard of living all matter.",
    dataType: "values"
  },
  {
    id: 6,
    title: "The Reality for Policymakers",
    icon: Building2,
    narrative: "Elena's story is illustrative; the tradeoffs are real. Policymakers must navigate tensions—balancing delivery speed with protections, costs with wages, urgency with inclusion.",
    dataType: "fastVsFair"
  },
  {
    id: 7,
    title: "Consensus & Division",
    icon: Users,
    narrative: "Some issues show broad agreement: 67% support school funding equality, 78% support healthcare access. Others are divisive. First step: acknowledge tradeoffs with evidence, not assumptions.",
    dataType: "consensus"
  }
];

export default function HousingNarrative() {
  const [currentScene, setCurrentScene] = useState(0);
  const [demographic, setDemographic] = useState('overall');
  const [direction, setDirection] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const scene = SCENES[currentScene];
  const Icon = scene.icon;

  useEffect(() => {
    // Check if data panel needs scrolling
    const dataContent = document.getElementById('data-content');
    if (dataContent) {
      const needsScroll = dataContent.scrollHeight > dataContent.clientHeight;
      setShowScrollIndicator(needsScroll);
      setIsScrolling(false); // Reset scroll state when scene/demographic changes
    }
  }, [currentScene, demographic]);

  const handleScroll = (e) => {
    const element = e.target;
    const isAtTop = element.scrollTop < 10;
    
    // Hide indicator when user scrolls down, show when back at top
    setIsScrolling(!isAtTop);
  };

  const handleSliderChange = (e) => {
    const newScene = parseInt(e.target.value);
    setDirection(newScene > currentScene ? 1 : -1);
    setCurrentScene(newScene);
  };

  const getChartData = () => {
    const data = demographic === 'overall' 
      ? DEMOGRAPHIC_DATA.overall 
      : DEMOGRAPHIC_DATA[demographic];

    if (scene.dataType === 'fastVsFair') {
      if (demographic === 'overall') {
        return [
          { name: 'Build Fast', value: data.fastVsFair.fast, color: '#3b82f6' },
          { name: 'Environment First', value: data.fastVsFair.fair, color: '#10b981' }
        ];
      } else {
        const subgroups = Object.keys(data);
        const result = [];
        subgroups.forEach(group => {
          result.push({ name: `${group} Fast`, value: data[group].fast, color: '#3b82f6' });
          result.push({ name: `${group} Fair`, value: data[group].fair, color: '#10b981' });
        });
        return result;
      }
    } else if (scene.dataType === 'costsVsWages') {
      if (demographic === 'overall') {
        return [
          { name: 'Lower Costs', value: data.costsVsWages.costs, color: '#f59e0b' },
          { name: 'Fair Wages', value: data.costsVsWages.wages, color: '#8b5cf6' }
        ];
      } else {
        const subgroups = Object.keys(data);
        const result = [];
        subgroups.forEach(group => {
          result.push({ name: `${group} Costs`, value: data[group].costs, color: '#f59e0b' });
          result.push({ name: `${group} Wages`, value: data[group].wages, color: '#8b5cf6' });
        });
        return result;
      }
    } else if (scene.dataType === 'consensus') {
      return [
        { name: 'School Funding', value: 67, color: '#06b6d4' },
        { name: 'Healthcare', value: 78, color: '#ec4899' }
      ];
    }
    return [];
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}/>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}/>
      </div>

      {/* Header - Compact */}
      <header className="relative z-10 text-center pt-6 pb-4 px-4">
        <div className="inline-block bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
          STORY + DATA
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          The Housing Decision: Fast vs Fair
        </h1>
      </header>

      {/* Main Content - Horizontal Layout */}
      <div className="relative z-10 flex-1 px-8 flex items-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 gap-8" style={{ height: 'calc(100vh - 280px)' }}>
          {/* Left: Narrative */}
          <div 
            key={`narrative-${currentScene}`}
            className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 flex flex-col justify-between shadow-2xl animate-slideInLeft overflow-hidden"
          >
            <div className="overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl shadow-lg animate-float">
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold">{scene.title}</h2>
              </div>
              
              <p className="text-slate-300 leading-relaxed text-lg mb-6">
                {scene.narrative}
              </p>

              {scene.isEnd && (
                <button
                  onClick={() => {
                    setDirection(-1);
                    setCurrentScene(0);
                    setDemographic('overall');
                  }}
                  className="mb-6 bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Start Over
                </button>
              )}
            </div>

            {/* Scene Progress Dots */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
              {SCENES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentScene ? 1 : -1);
                    setCurrentScene(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentScene 
                      ? 'w-8 bg-gradient-to-r from-blue-500 to-emerald-500' 
                      : 'w-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to scene ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Data Visualization */}
          <div 
            key={`data-${currentScene}-${demographic}`}
            className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 flex flex-col shadow-2xl animate-slideInRight overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h3 className="text-xl font-semibold text-slate-300">Survey Data</h3>
              
              {(scene.dataType === 'fastVsFair' || scene.dataType === 'costsVsWages') && (
                <select 
                  value={demographic}
                  onChange={(e) => setDemographic(e.target.value)}
                  className="bg-slate-700/80 text-white text-sm px-4 py-2 rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="overall">All Voters</option>
                  <option value="byParty">By Party</option>
                  <option value="byIncome">By Income</option>
                  <option value="byRegion">By Region</option>
                </select>
              )}
            </div>

            <div 
              className="flex-1 overflow-y-auto custom-scrollbar pr-2 relative" 
              id="data-content"
              onScroll={handleScroll}
            >
              {showScrollIndicator && !isScrolling && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none animate-bounce">
                  <div className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2">
                    <span>Scroll for more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
              
              {scene.dataType !== 'disclaimer' && scene.dataType !== 'context' && scene.dataType !== 'values' && (
                <div className="w-full space-y-3 py-4">
                  {getChartData().map((item, idx) => (
                    <div key={idx} className="animate-slideInRight" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">{item.name}</span>
                        <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="h-7 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${item.value}%`,
                            backgroundColor: item.color,
                            boxShadow: `0 0 20px ${item.color}40`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {scene.dataType === 'values' && (
                <div className="grid grid-cols-2 gap-4 w-full">
                  {['Transparency', 'Community', 'Fair Treatment', 'Environment', 'Living Standards'].map((value, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-500/20 animate-scaleIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="text-emerald-400 text-3xl font-bold mb-2">✓</div>
                      <div className="text-sm font-medium text-slate-300">{value}</div>
                    </div>
                  ))}
                </div>
              )}

              {(scene.dataType === 'disclaimer' || scene.dataType === 'context') && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8 animate-scaleIn">
                  <div className="text-blue-400 text-lg font-semibold mb-3">Survey Methodology</div>
                  <div className="text-slate-400 space-y-2">
                    <div>Possibility Lab Policy Tradeoffs Survey</div>
                    <div>August 2025 • TrueDot.ai</div>
                    <div>1,960 registered CA voters</div>
                    <div>Weighted to demographic composition</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 flex-shrink-0">
              <p className="text-xs text-slate-500 text-center">
                Source: Possibility Lab • Aug 2025 • n=1,960 • Full methodology in report
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Slider Control - Fixed Height */}
      <div className="relative z-10 px-8 pb-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-6">
            <span className="text-sm text-slate-400 whitespace-nowrap">Scene {currentScene + 1} of 8</span>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={currentScene}
              onChange={handleSliderChange}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
              aria-label="Navigate through scenes"
            />
            <div className="flex gap-2">
              {SCENES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentScene ? 1 : -1);
                    setCurrentScene(idx);
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                    currentScene === idx 
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg scale-110' 
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                  aria-label={`Scene ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #10b981);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.7);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #10b981);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(180deg, transparent 0%, #1e293b 20%, #1e293b 80%, transparent 100%);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #10b981);
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #60a5fa, #34d399);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
}