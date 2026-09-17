'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Load the image to get its dimensions based on project
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    
    if (projectId === '1') {
      img.src = '/Work/RVV/RVV Case Study.png';
    } else if (projectId === '2') {
      img.src = '/Work/PowerStride/PowerStride Case Study.png';
    } else if (projectId === '3') {
      img.src = '/Work/TFA/TFA.png';
    }
  }, [projectId]);

  // Calculate the aspect ratio and determine which case study to show
  const isRVVProject = projectId === '1';
  const isPowerStrideProject = projectId === '2';
  const isTFAProject = projectId === '3';
  const aspectRatio = imageDimensions.width > 0 ? imageDimensions.height / imageDimensions.width : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/20">
        <div className="px-10 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Work
            </button>
            <h1 className="text-xl font-bold">
              {isRVVProject ? 'Redvelvetvault Case Study' : isPowerStrideProject ? 'PowerStride Case Study' : isTFAProject ? 'Thefilmmakerarchitect.com' : `Project ${projectId}`}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20">
        {(isRVVProject || isPowerStrideProject || isTFAProject) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            {/* Case Study Image */}
            <div className="w-full relative">
              <img
                src={
                  isRVVProject ? "/Work/RVV/RVV Case Study.png" : 
                  isPowerStrideProject ? "/Work/PowerStride/PowerStride Case Study.png" : 
                  "/Work/TFA/TFA.png"
                }
                alt={
                  isRVVProject ? "RVV Case Study" : 
                  isPowerStrideProject ? "PowerStride Case Study" : 
                  "TFA Work"
                }
                className="w-full h-auto block"
                style={{
                  minHeight: aspectRatio > 0 ? '100vh' : 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-6 py-12"
          >
            {/* Default project content for other projects */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Project {projectId}
              </h1>
              <p className="text-xl text-white/70 mb-8">
                Coming Soon
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed CTA Buttons - Outside of motion.div for proper positioning */}
      {isRVVProject && (
        <div className="fixed bottom-8 right-10 z-[9999] pointer-events-auto">
          <a
            href="https://www.figma.com/proto/IrRpfLUo6AThFUw8EH0AR7/RedVelvetVault?page-id=428%3A236&node-id=436-1167&viewport=534%2C168%2C0.08&t=0zoNS4UXreCVnlVd-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=436%3A1167&show-proto-sidebar=1"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>View Prototype</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      {isPowerStrideProject && (
        <div className="fixed bottom-8 right-10 z-[9999] pointer-events-auto flex flex-col gap-4">
          {/* View Mobile Prototype Button */}
          <a
            href="https://www.figma.com/proto/m3q68BwrhIaqJdgeeUPkRh/Sustainable-App?page-id=0%3A1&node-id=7-409&viewport=-1940%2C-28%2C0.44&t=7Nj9JPY38OMMufub-1&scaling=contain&content-scaling=fixed&starting-point-node-id=7%3A409&show-proto-sidebar=1"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>View Mobile Prototype</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* View on Github Button */}
          <a
            href="https://github.com/rosh-the-coder/PowerStride"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>View on Github</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      )}

      {isTFAProject && (
        <div className="fixed bottom-8 right-10 z-[9999] pointer-events-auto">
          {/* View the Website Button */}
          <a
            href="https://www.thefilmmakerarchitect.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>View the Website</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}