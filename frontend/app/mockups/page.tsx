'use client';

import { useState } from 'react';
import { Cloud, FileText, CheckCircle, AlertCircle, Zap } from 'lucide-react';

export default function DesignMockups() {
  const [activeTab, setActiveTab] = useState('typography');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Design Mockups</h1>
        <p className="text-slate-300 mb-8">Explore different design directions for your file converter</p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'typography', label: 'Typography Hierarchy' },
            { id: 'cards', label: 'Sectioned Cards' },
            { id: 'multistate', label: 'Multi-State Design' },
            { id: 'buttons', label: 'Button Alternatives' },
            { id: 'icons', label: 'Icons + Text' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-150 ease-in-out whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TYPOGRAPHY HIERARCHY */}
        {activeTab === 'typography' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 min-h-96">
              <div className="space-y-8">
                <div>
                  <h2 className="text-5xl font-bold text-white mb-2">Primary Heading</h2>
                  <p className="text-slate-300">Bold, high contrast - grabs attention</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-slate-100 mb-2">Secondary Heading</h3>
                  <p className="text-slate-400">Regular weight, subtle color shift</p>
                </div>

                <div>
                  <p className="text-base text-slate-300 leading-relaxed">
                    Body text sits on the glassmorphic background. Use consistent line height for readability.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-slate-500 mb-4">Hint text - very subtle, for secondary info</p>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-150 ease-in-out border border-white/20">
                      Button
                    </button>
                    <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-purple-500/50">
                      Primary Action
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">Key Principles</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Weight contrast instead of size alone</li>
                <li>✓ Color layering: white → light gray → dark gray</li>
                <li>✓ Text shadows for readability on glass</li>
                <li>✓ Letter spacing on CTAs makes them breathe</li>
              </ul>
            </div>
          </div>
        )}

        {/* SECTIONED CARDS */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Card */}
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-150 ease-in-out">
                <div className="flex items-center gap-3 mb-4">
                  <Cloud className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">Upload File</h3>
                </div>
                <p className="text-slate-300 mb-6">Drop your file here or click to browse</p>
                <div className="bg-black/30 border-2 border-dashed border-blue-400/50 rounded-2xl py-12 px-6 text-center mb-4">
                  <p className="text-blue-300 font-medium">Click or drag files here</p>
                </div>
                <p className="text-xs text-slate-400">Supported: PPT, PPTX, DOC, DOCX</p>
              </div>

              {/* Supported Formats */}
              <div className="bg-gradient-to-br from-green-900/40 to-emerald-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-150 ease-in-out">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Supported Formats</h3>
                </div>
                <div className="space-y-2">
                  {['PowerPoint (.ppt, .pptx)', 'Word (.doc, .docx)', 'Output: PDF'].map((format) => (
                    <div key={format} className="flex items-center gap-2 text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      {format}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Display */}
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-150 ease-in-out">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Processing</h3>
                </div>
                <div className="space-y-4">
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full w-2/3 animate-pulse" />
                  </div>
                  <p className="text-slate-300 text-sm">Converting to PDF... 65%</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gradient-to-br from-orange-900/40 to-red-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-150 ease-in-out">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-orange-400" />
                  <h3 className="text-xl font-semibold text-white">Complete!</h3>
                </div>
                <p className="text-slate-300 mb-6">Your PDF is ready to download</p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-green-500/50">
                    Download PDF
                  </button>
                  <button className="w-full px-4 py-3 rounded-full bg-white/10 text-white border border-white/20 font-medium transition-all duration-150 ease-in-out hover:bg-white/20">
                    Convert Another
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">Benefits</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Clear visual separation of concerns</li>
                <li>✓ Each section has its own icon + color</li>
                <li>✓ Text is organized into scannable blocks</li>
                <li>✓ Scattered text feels organized</li>
              </ul>
            </div>
          </div>
        )}

        {/* MULTI-STATE DESIGN */}
        {activeTab === 'multistate' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Idle State */}
              <div>
                <p className="text-slate-400 mb-3 text-sm font-medium">IDLE STATE</p>
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                  <Cloud className="w-16 h-16 mx-auto text-slate-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Drop your file</h3>
                  <p className="text-slate-400 text-sm">Subtle, inviting state</p>
                </div>
              </div>

              {/* Hover State */}
              <div>
                <p className="text-slate-400 mb-3 text-sm font-medium">HOVER STATE</p>
                <div className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 backdrop-blur-xl border border-purple-400/50 rounded-3xl p-8 text-center shadow-lg shadow-purple-500/20">
                  <Cloud className="w-16 h-16 mx-auto text-purple-300 mb-4 animate-bounce" />
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to upload</h3>
                  <p className="text-slate-200 text-sm">Glow effect, slight lift, animated icon</p>
                </div>
              </div>

              {/* Active State */}
              <div>
                <p className="text-slate-400 mb-3 text-sm font-medium">ACTIVE/UPLOADING STATE</p>
                <div className="bg-gradient-to-br from-blue-800/50 to-cyan-800/50 backdrop-blur-xl border-2 border-blue-400 rounded-3xl p-8 text-center shadow-lg shadow-blue-500/30 animate-pulse">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-blue-400/30 border-t-blue-300 animate-spin" />
                  <h3 className="text-xl font-semibold text-white mb-2">Uploading...</h3>
                  <p className="text-slate-200 text-sm">Animated border, progress indicator, strong glow</p>
                </div>
              </div>

              {/* Success State */}
              <div>
                <p className="text-slate-400 mb-3 text-sm font-medium">SUCCESS STATE</p>
                <div className="bg-gradient-to-br from-green-800/50 to-emerald-800/50 backdrop-blur-xl border border-green-400 rounded-3xl p-8 text-center shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-300 mb-4 animate-bounce" />
                  <h3 className="text-xl font-semibold text-white mb-2">Complete!</h3>
                  <p className="text-slate-200 text-sm">Celebratory color shift, checkmark animation</p>
                </div>
              </div>

              {/* Error State */}
              <div className="md:col-span-2">
                <p className="text-slate-400 mb-3 text-sm font-medium">ERROR STATE</p>
                <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-xl border border-red-400 rounded-3xl p-8 text-center shadow-lg shadow-red-500/30">
                  <AlertCircle className="w-16 h-16 mx-auto text-red-300 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Conversion Failed</h3>
                  <p className="text-slate-200 text-sm mb-4">Clear warning with helpful message</p>
                  <button className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400 transition-all duration-150 ease-in-out">
                    Try Again
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">State Design Benefits</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Different visual states for different actions</li>
                <li>✓ Color changes guide user understanding</li>
                <li>✓ Animations add delight without shape changes</li>
                <li>✓ Users always know what's happening</li>
              </ul>
            </div>
          </div>
        )}

        {/* BUTTON ALTERNATIVES */}
        {activeTab === 'buttons' && (
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Current: Shape Change */}
              <div>
                <p className="text-slate-400 mb-3 text-sm font-medium">❌ CURRENT: Shape Change (Circle → Square)</p>
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <div className="flex gap-6 items-center justify-center">
                    <div className="text-center">
                      <button className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium mb-2 transition-all duration-150 ease-in-out">
                        Default
                      </button>
                      <p className="text-xs text-slate-400">Circle shape</p>
                    </div>
                    <div className="text-center">
                      <button className="px-8 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium mb-2 transition-all duration-150 ease-in-out">
                        Hover
                      </button>
                      <p className="text-xs text-slate-400">Square shape (odd!)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 1: Gradient Shift */}
              <div>
                <p className="text-slate-400 mb-3 text-sm font-medium">✓ OPTION 1: Gradient Shift (Shape Stays Pill)</p>
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <div className="flex gap-6 items-center justify-center">
                    <div className="text-center">
                      <button className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium mb-2 transition-all duration-150 ease-in-out hover:bg-white/20">
                        Default
                      </button>
                      <p className="text-xs text-slate-400">Subtle background</p>
                    </div>
                    <div className="text-center">
                      <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium mb-2 transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-purple-500/50">
                        Hover
                      </button>
                      <p className="text-xs text-slate-400">Gradient fill + glow</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2: Glow Border */}
              <div>
                <p className="text-slate-400 mb-3 text-sm font-medium">✓ OPTION 2: Animated Glow Border (Shape Stays Pill)</p>
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <div className="flex gap-6 items-center justify-center">
                    <div className="text-center">
                      <button className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium mb-2 transition-all duration-150 ease-in-out">
                        Default
                      </button>
                      <p className="text-xs text-slate-400">Muted border</p>
                    </div>
                    <div className="text-center">
                      <button className="px-8 py-3 rounded-full bg-white/10 border border-purple-400 text-white font-medium mb-2 transition-all duration-150 ease-in-out shadow-lg shadow-purple-500/50">
                        Hover
                      </button>
                      <p className="text-xs text-slate-400">Bright border + glow</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 3: Floating Effect */}
              <div>
                <p className="text-slate-400 mb-3 text-sm font-medium">✓ OPTION 3: Floating Effect (Shape Stays Pill)</p>
                <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                  <div className="flex gap-6 items-center justify-center">
                    <div className="text-center">
                      <button className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium mb-2 transition-all duration-150 ease-in-out">
                        Default
                      </button>
                      <p className="text-xs text-slate-400">Normal state</p>
                    </div>
                    <div className="text-center">
                      <button className="px-8 py-3 rounded-full bg-white/15 border border-white/30 text-white font-medium mb-2 transition-all duration-150 ease-in-out shadow-lg shadow-white/20 -translate-y-1">
                        Hover
                      </button>
                      <p className="text-xs text-slate-400">Lifts up with shadow</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">Why These Work Better</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Maintains consistent pill shape</li>
                <li>✓ Visual feedback is clear but subtle</li>
                <li>✓ No jarring shape transformation</li>
                <li>✓ Works well with text-heavy interfaces</li>
              </ul>
            </div>
          </div>
        )}

        {/* ICONS + TEXT */}
        {activeTab === 'icons' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <div className="space-y-8">
                {/* Section with icon + heading + text */}
                <div className="flex gap-4">
                  <Cloud className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Upload Your File</h3>
                    <p className="text-slate-300">
                      Drag and drop any PowerPoint or Word document. We'll convert it to a high-quality PDF in seconds.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FileText className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Multiple Formats Supported</h3>
                    <p className="text-slate-300">
                      Works with .ppt, .pptx, .doc, and .docx files. No matter which version you're using, we'll handle it.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast Conversion</h3>
                    <p className="text-slate-300">
                      Most files convert in under 30 seconds. Your PDF will be ready to download immediately.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
                    <p className="text-slate-300">
                      Your files are processed securely and deleted immediately after conversion. We don't store anything.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">Icon + Text Strategy</h4>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>✓ Icons break up text walls and guide the eye</li>
                <li>✓ Colors differentiate sections visually</li>
                <li>✓ Scattered text feels organized & intentional</li>
                <li>✓ Easy to scan vs. reading paragraphs</li>
                <li>✓ Adds visual interest without cluttering</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
