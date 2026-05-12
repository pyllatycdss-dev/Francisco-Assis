import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, useCart } from '../context/CartContext';

interface ProductCardProps {
    product: Product;
    onView: (product: Product) => void;
    key?: string | number;
}

export default function ProductCard({ product, onView }: ProductCardProps) {
    const { addToCart } = useCart();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col glass p-4 border border-white/5 transition-all duration-500 hover:border-rose-gold/30"
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#111] mb-6 group cursor-pointer border border-white/5" onClick={() => onView(product)}>
                <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                        <span className="bg-black/80 backdrop-blur-sm text-rose-gold text-[8px] uppercase tracking-[0.2em] font-bold px-3 py-1 ring-1 ring-rose-gold/20">
                            New
                        </span>
                    )}
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product, product.sizes[0], product.colors[0]); }}
                        className="w-full bg-rose-gold text-black py-3 uppercase text-[9px] font-bold tracking-[0.2em] hover:bg-white transition-colors duration-300"
                    >
                        Adicionar
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">
                            {product.category}
                        </p>
                        <h3 className="text-lg font-display text-white group-hover:text-rose-gold transition-colors duration-300 truncate">
                            {product.name}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-base font-sans font-medium text-rose-gold">
                        R$ {product.price.toFixed(2)}
                    </span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onView(product); }}
                        className="text-[9px] border border-white/20 hover:border-rose-gold px-3 py-1 uppercase tracking-widest text-white/60 hover:text-rose-gold transition-all"
                    >
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
