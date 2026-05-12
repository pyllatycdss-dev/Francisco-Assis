import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    stock: number;
    category: string;
    sizes: string[];
    colors: string[];
    images: string[];
    isNew?: boolean;
    isBestSeller?: boolean;
    isPromotion?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, size: string, color: string) => void;
    removeFromCart: (index: number) => void;
    updateQuantity: (index: number, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('belchior_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('belchior_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, size: string, color: string) => {
        setCart(prev => {
            const existingIndex = prev.findIndex(item => 
                item.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
            );

            if (existingIndex > -1) {
                const newCart = [...prev];
                newCart[existingIndex].quantity += 1;
                return newCart;
            }

            return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
        });
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const updateQuantity = (index: number, delta: number) => {
        setCart(prev => {
            const newCart = [...prev];
            const newQty = newCart[index].quantity + delta;
            if (newQty < 1) return prev;
            newCart[index].quantity = newQty;
            return newCart;
        });
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
