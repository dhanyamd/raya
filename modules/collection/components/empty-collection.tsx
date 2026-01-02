import { Archive, Upload } from 'lucide-react'
import React from 'react'

const EmptyCollections = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="mb-6">
                <div className="w-24 h-24 border-2 border-dashed border-neon-purple/30 bg-neon-purple/5 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    <Archive className="w-12 h-12 text-neon-purple/70" />
                </div>
            </div>
            <h3 className="text-zinc-300 text-base font-medium mb-2">Collections are empty</h3>
            <p className="text-zinc-500 text-xs mb-8 text-center max-w-[200px] leading-relaxed">
                Create a collection to organize your requests and share them with your team.
            </p>
            <div className="space-y-3 w-full max-w-xs">
                <button className="w-full bg-white text-black hover:bg-zinc-200 py-2.5 px-4 rounded-xl font-medium text-sm transition-all shadow-lg shadow-white/5 flex items-center justify-center space-x-2 group">
                    <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Import Collection</span>
                </button>
            </div>
        </div>
    )
}

export default EmptyCollections