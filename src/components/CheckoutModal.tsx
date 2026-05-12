import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
    const { cart, cartTotal, clearCart } = useCart();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        address: '',
        city: '',
        payment: 'Cartão de Crédito'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Save to Firebase
            const orderData = {
                clientName: formData.name,
                whatsapp: formData.whatsapp,
                address: formData.address,
                city: formData.city,
                paymentMethod: formData.payment,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.selectedSize,
                    color: item.selectedColor
                })),
                totalValue: cartTotal,
                status: 'Finalizado via WhatsApp',
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'orders'), orderData);

            // WhatsApp Message
            const WHATSAPP_NUMBER = "5584994029075";
            const message = `*NOVO PEDIDO BELCHIOR*\n\n` +
                          `*Cliente:* ${formData.name}\n` +
                          `*Telefone:* ${formData.whatsapp}\n\n` +
                          `*Produtos:* \n${cart.map(item => `- ${item.name} (${item.selectedSize}/${item.selectedColor}) x${item.quantity}`).join('\n')}\n\n` +
                          `*Valor total:* R$ ${cartTotal.toFixed(2)}\n` +
                          `*Endereço:* ${formData.address}, ${formData.city}\n` +
                          `*Pagamento:* ${formData.payment}\n\n` +
                          `_Enviado via Website Belchior_`;

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            setIsSuccess(true);
            setTimeout(() => {
                clearCart();
                onClose();
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Error creating order:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-xl bg-premium-black border border-rose-gold/20 rounded-2xl overflow-hidden p-8 md:p-12"
                    >
                        {isSuccess ? (
                            <div className="text-center space-y-6 py-10">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <CheckCircle2 size={40} />
                                </motion.div>
                                <h2 className="text-2xl font-display text-white uppercase tracking-widest">Pedido Enviado!</h2>
                                <p className="text-gray-400 font-light max-w-xs mx-auto">
                                    Seu pedido foi processado e encaminhado via WhatsApp. Entraremos em contato em breve.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-display text-rose-gold uppercase tracking-widest">Finalizar Compra</h2>
                                    <button onClick={onClose} className="text-gray-500 hover:text-white ring-1 ring-white/10 p-1 rounded">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Nome Completo</label>
                                            <input 
                                                required
                                                placeholder="Como podemos te chamar?"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 placeholder:text-gray-800 outline-none focus:border-rose-gold transition-colors text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">WhatsApp</label>
                                            <input 
                                                required
                                                type="tel"
                                                placeholder="(00) 00000-0000"
                                                value={formData.whatsapp}
                                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 placeholder:text-gray-800 outline-none focus:border-rose-gold transition-colors text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Endereço de Entrega</label>
                                        <input 
                                            required
                                            placeholder="Rua, número, complemento"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 placeholder:text-gray-800 outline-none focus:border-rose-gold transition-colors text-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Cidade</label>
                                            <input 
                                                required
                                                placeholder="Ex: Natal"
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 placeholder:text-gray-800 outline-none focus:border-rose-gold transition-colors text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Pagamento</label>
                                            <select 
                                                value={formData.payment}
                                                onChange={e => setFormData({ ...formData, payment: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-rose-gold transition-colors text-white appearance-none"
                                            >
                                                <option>Cartão de Crédito</option>
                                                <option>PIX</option>
                                                <option>Boleto</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button 
                                        disabled={isLoading}
                                        type="submit"
                                        className="w-full bg-rose-gold text-black py-4 rounded-lg uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-rose-gold-light transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 mt-4 shadow-lg shadow-rose-gold/10"
                                    >
                                        {isLoading ? 'Wait...' : 'Confirmar e Enviar WhatsApp'}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
