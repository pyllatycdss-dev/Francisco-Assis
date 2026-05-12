import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Instagram, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
    onOpenAdmin: () => void;
    onOpenCart: () => void;
}

export default function Header({ onOpenAdmin, onOpenCart }: HeaderProps) {
    const [clickCount, setClickCount] = useState(0);
    const [lastClickTime, setLastClickTime] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cart } = useCart();

    const handleLogoClick = () => {
        const now = Date.now();
        if (now - lastClickTime < 3000) {
            const newCount = clickCount + 1;
            if (newCount === 5) {
                onOpenAdmin();
                setClickCount(0);
            } else {
                setClickCount(newCount);
            }
        } else {
            setClickCount(1);
        }
        setLastClickTime(now);
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-rose-gold/10">
            <div className="max-w-7xl mx-auto px-12 h-20 flex items-center justify-between relative">
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden text-rose-gold p-2"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Left Links - Desktop */}
                <nav className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] font-semibold text-white/50">
                    <a href="#colecoes" className="hover:text-white transition-colors">Coleções</a>
                    <a href="#novidades" className="hover:text-white transition-colors">Novidades</a>
                </nav>

                {/* Logo Centralized */}
                <div 
                    onClick={handleLogoClick}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none group flex items-center justify-center"
                >
                    <img 
                        src="/logo.png" 
                        alt="BELCHIOR" 
                        className="h-14 md:h-16 w-auto object-contain brightness-110 group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                    />
                </div>

                {/* Right Links - Desktop */}
                <div className="flex items-center gap-8">
                    <nav className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] font-semibold text-white/50">
                        <button onClick={onOpenCart} className="hover:text-white transition-colors">Carrinho ({cartCount})</button>
                        <a href="#contato" className="hover:text-white transition-colors">Contato</a>
                    </nav>
                    
                    <button 
                        onClick={onOpenCart}
                        className="lg:hidden relative text-rose-gold p-2 hover:bg-rose-gold/5 rounded-full transition-colors"
                    >
                        <ShoppingBag size={22} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Sidebar */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 top-20 bg-black z-40 lg:hidden p-8 flex flex-col gap-8"
                    >
                        <nav className="flex flex-col gap-6 text-lg uppercase tracking-widest font-display text-gray-300">
                            <a href="#inicio" onClick={() => setIsMenuOpen(false)} className="hover:text-rose-gold transition-colors">Início</a>
                            <a href="#colecoes" onClick={() => setIsMenuOpen(false)} className="hover:text-rose-gold transition-colors">Coleções</a>
                            <a href="#novidades" onClick={() => setIsMenuOpen(false)} className="hover:text-rose-gold transition-colors">Novidades</a>
                            <a href="#promocoes" onClick={() => setIsMenuOpen(false)} className="hover:text-rose-gold transition-colors">Promoções</a>
                            <a href="#contato" onClick={() => setIsMenuOpen(false)} className="hover:text-rose-gold transition-colors">Contato</a>
                        </nav>

                        <div className="mt-auto flex gap-4 pt-8 border-t border-rose-gold/10">
                            <a href="https://instagram.com/bybelchior" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rose-gold transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://wa.me/5584994029075" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-rose-gold transition-colors">
                                <Phone size={20} />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
