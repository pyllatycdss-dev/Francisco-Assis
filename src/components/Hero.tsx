import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <section id="inicio" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-20">
            {/* Background Image Placeholder with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
                    alt="Premium Fashion"
                    className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-12 text-left w-full h-full flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-[11px] uppercase tracking-[0.3em] text-white/40 mb-6 block">
                        Coleção Inverno 2026
                    </span>
                    <h1 className="text-[80px] md:text-[110px] leading-[0.9] font-display font-bold mb-8 italic tracking-tighter text-white">
                        A Essência <br />
                        <span className="text-rose-gold italic font-light">da Elegância</span>
                    </h1>
                    <p className="max-w-md text-white/60 text-lg mb-12 leading-relaxed font-light tracking-wide">
                        Peças exclusivas desenhadas para mulheres que não abrem mão da sofisticação e do minimalismo.
                    </p>
                    
                    <div className="flex items-center gap-6">
                        <button className="px-10 py-4 bg-rose-gold text-black uppercase text-xs tracking-[0.2em] font-bold hover:brightness-110 transition-all duration-300">
                            Explorar Coleção
                        </button>
                        <button className="px-10 py-4 border border-rose-gold/30 text-rose-gold uppercase text-xs tracking-[0.2em] font-bold hover:bg-white/5 transition-all duration-300">
                            Saiba Mais
                        </button>
                    </div>

                    <div className="mt-20 flex gap-12 border-t border-white/5 pt-8">
                        <div>
                            <p className="text-2xl font-display text-rose-gold">01</p>
                            <p className="text-[9px] uppercase tracking-widest text-white/40">Seda Italiana</p>
                        </div>
                        <div>
                            <p className="text-2xl font-display text-rose-gold">02</p>
                            <p className="text-[9px] uppercase tracking-widest text-white/40">Corte Alfaiataria</p>
                        </div>
                        <div>
                            <p className="text-2xl font-display text-rose-gold">03</p>
                            <p className="text-[9px] uppercase tracking-widest text-white/40">Design Exclusivo</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-rose-gold/30"
            >
                <div className="w-[1px] h-16 bg-gradient-to-t from-rose-gold to-transparent" />
            </motion.div>
        </section>
    );
}
