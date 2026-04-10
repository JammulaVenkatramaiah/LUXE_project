import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, Maximize2, RotateCw, Download } from 'lucide-react'

interface VirtualTryOnProps {
  productImage: string
  onClose: () => void
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ productImage, onClose }) => {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [overlayPos, setOverlayPos] = useState({ x: 100, y: 100 })
  const [overlaySize, setOverlaySize] = useState(200)
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUserImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX - overlayPos.x, y: e.clientY - overlayPos.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOverlayPos({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      })
    }
  }

  const handleMouseUp = () => setIsDragging(false)

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-full rounded-3xl overflow-hidden flex flex-col md:flex-row relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* Workspace */}
        <div 
          className="flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {!userImage ? (
            <div className="text-center p-10">
              <Upload size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-bold mb-2">Upload your photo</h3>
              <p className="text-slate-500 mb-6">Take a clear photo of yourself to try on this style</p>
              <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                Select Photo
              </label>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center select-none">
              <img 
                src={userImage} 
                className="max-w-full max-h-full object-contain pointer-events-none" 
                alt="Your self" 
              />
              <motion.div
                style={{ 
                  left: overlayPos.x, 
                  top: overlayPos.y, 
                  width: overlaySize,
                  rotate: rotation
                }}
                className="absolute cursor-move active:scale-105 transition-transform"
                onMouseDown={handleMouseDown}
              >
                <img 
                  src={productImage} 
                  className="w-full h-auto drop-shadow-2xl" 
                  alt="Product" 
                  draggable={false}
                />
                <div className="absolute -inset-2 border-2 border-dashed border-white/50 rounded-lg pointer-events-none" />
              </motion.div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Virtual Try-On</h2>
            <p className="text-sm text-slate-500">Transform your look instantly with LUXE AI</p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-3">
                <span className="flex items-center gap-2"><Maximize2 size={16}/> Scale</span>
                <span>{Math.round((overlaySize/200)*100)}%</span>
              </div>
              <input 
                type="range" min="50" max="800" step="1" 
                value={overlaySize} 
                onChange={(e) => setOverlaySize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-3">
                <span className="flex items-center gap-2"><RotateCw size={16}/> Rotate</span>
                <span>{rotation}°</span>
              </div>
              <input 
                type="range" min="-180" max="180" step="1" 
                value={rotation} 
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>
          </div>

          <div className="mt-auto space-y-3">
             <button 
              onClick={() => {
                setUserImage(null);
                setOverlayPos({ x: 100, y: 100 });
                setOverlaySize(200);
                setRotation(0);
              }}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Reset Session
            </button>
            <button className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 shadow-xl shadow-black/10">
              <Download size={20} />
              Screenshot Look
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VirtualTryOn
