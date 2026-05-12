import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setIsCheckoutOpen(true);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex justify-end">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-md bg-premium-black h-full shadow-2xl flex flex-col border-l border-rose-gold/10"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-rose-gold/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag size={20} className="text-rose-gold" />
                                    <h2 className="text-lg font-display uppercase tracking-widest text-white">Seu Carrinho</h2>
                                </div>
                                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Items List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-rose-gold/5 flex items-center justify-center text-rose-gold opacity-20">
                                            <ShoppingBag size={32} />
                                        </div>
                                        <p className="text-gray-500 font-light tracking-wide italic">Seu carrinho está vazio.</p>
                                        <button 
                                            onClick={onClose}
                                            className="text-rose-gold text-[10px] uppercase tracking-widest font-bold border-b border-rose-gold/30 pb-1"
                                        >
                                            Continuar Compras
                                        </button>
                                    </div>
                                ) : (
                                    cart.map((item, index) => (
                                        <div key={`${item.id}-${index}`} className="flex gap-4 group">
                                            <div className="w-20 h-24 bg-black rounded overflow-hidden flex-shrink-0">
                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-sm font-medium text-white truncate pr-4">{item.name}</h3>
                                                    <button 
                                                        onClick={() => removeFromCart(index)}
                                                        className="text-gray-600 hover:text-rose-gold p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                                    {item.selectedSize} / {item.selectedColor}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-3 border border-white/10 rounded px-2 py-1">
                                                        <button 
                                                            onClick={() => updateQuantity(index, -1)}
                                                            className="text-gray-500 hover:text-rose-gold"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="text-xs text-white min-w-[20px] text-center font-mono">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => updateQuantity(index, 1)}
                                                            className="text-gray-500 hover:text-rose-gold"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                    <span className="text-sm font-display text-rose-gold">
                                                        R$ {(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {cart.length > 0 && (
                                <div className="p-6 border-t border-rose-gold/10 space-y-6 bg-black/40">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Subtotal</span>
                                        <span className="text-xl font-display text-white">R$ {cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button 
                                        onClick={handleCheckout}
                                        className="w-full bg-rose-gold text-black py-4 uppercase text-[11px] font-bold tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-rose-gold-light transition-all duration-300"
                                    >
                                        Finalizar Pedido
                                        <ArrowRight size={14} />
                                    </button>
                                    <p className="text-[9px] text-gray-600 text-center uppercase tracking-widest">
                                        * O pedido será finalizado via WhatsApp
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
        </>
    );
}
