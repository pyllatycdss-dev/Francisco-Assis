import React from 'react';
import { X, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, useCart } from '../context/CartContext';

interface ProductDetailsModalProps {
    product: Product | null;
    onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = React.useState('');
    const [selectedColor, setSelectedColor] = React.useState('');
    const [added, setAdded] = React.useState(false);

    React.useEffect(() => {
        if (product) {
            setSelectedSize(product.sizes[0]);
            setSelectedColor(product.colors[0]);
            setAdded(false);
        }
    }, [product]);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, selectedSize, selectedColor);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <AnimatePresence>
            {product && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="relative w-full max-w-6xl max-h-full overflow-y-auto bg-premium-black border border-rose-gold/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    >
                        {/* Images */}
                        <div className="md:w-1/2 aspect-[4/5] bg-black">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-[10px] text-rose-gold uppercase tracking-[0.3em] font-medium mb-2 block">
                                        {product.category}
                                    </span>
                                    <h2 className="text-3xl md:text-5xl font-display text-white leading-tight">
                                        {product.name}
                                    </h2>
                                </div>
                                <button onClick={onClose} className="text-gray-500 hover:text-white ring-1 ring-white/10 p-2 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-2xl font-display text-rose-gold">
                                    R$ {product.price.toFixed(2)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-lg text-gray-600 line-through font-light">
                                        R$ {product.originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-400 font-light leading-relaxed mb-10 tracking-wide">
                                {product.description || "Design exclusivo e acabamento premium para momentos especiais. Esta peça une sofisticação e conforto de forma impecável."}
                            </p>

                            <div className="space-y-8 mt-auto">
                                {/* Sizes */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Tamanhos Disponíveis</label>
                                        <span className="text-[9px] text-rose-gold underline cursor-pointer">Guia de Medidas</span>
                                    </div>
                                    <div className="flex gap-3">
                                        {product.sizes.map(size => (
                                            <button 
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-12 h-12 flex items-center justify-center text-xs border transition-all duration-300 rounded ${
                                                    selectedSize === size 
                                                    ? 'bg-rose-gold border-rose-gold text-black font-bold' 
                                                    : 'border-white/10 text-gray-500 hover:border-rose-gold/50'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Cor Escolhida</label>
                                    <div className="flex gap-4">
                                        {product.colors.map(color => (
                                            <button 
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all duration-300 rounded-full ${
                                                    selectedColor === color 
                                                    ? 'bg-white border-white text-black font-bold' 
                                                    : 'border-white/10 text-gray-500 hover:border-white/30'
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    className={`w-full py-5 flex items-center justify-center gap-3 uppercase text-[11px] font-bold tracking-[0.2em] transition-all duration-500 overflow-hidden relative ${
                                        added ? 'bg-green-600 text-white' : 'bg-rose-gold text-black hover:bg-rose-gold-light'
                                    }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {added ? (
                                            <motion.div 
                                                key="added" 
                                                initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check size={18} /> Adicionado
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                key="buy" 
                                                initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                                                className="flex items-center gap-2"
                                            >
                                                <ShoppingBag size={18} /> Adicionar ao Carrinho
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
