import React from 'react';
import { Instagram, Facebook, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="contato" className="bg-premium-black border-t border-rose-gold/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-center md:text-left">
                {/* Brand */}
                <div className="space-y-6">
                    <div className="flex flex-col items-center md:items-start">
                        <img 
                            src="/logo.png" 
                            alt="BELCHIOR" 
                            className="h-12 w-auto object-contain brightness-110"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs mx-auto md:mx-0">
                        Onde a sofisticação encontra a mulher moderna. Moda premium com curadoria exclusiva.
                    </p>
                </div>

                {/* Explore */}
                <div>
                    <h4 className="text-[11px] uppercase tracking-[0.3em] text-white font-bold mb-8">Navegação</h4>
                    <ul className="space-y-4 text-sm text-gray-400 font-light">
                        <li><a href="#inicio" className="hover:text-rose-gold transition-colors">Início</a></li>
                        <li><a href="#colecoes" className="hover:text-rose-gold transition-colors">Coleções</a></li>
                        <li><a href="#novidades" className="hover:text-rose-gold transition-colors">Novidades</a></li>
                        <li><a href="#promocoes" className="hover:text-rose-gold transition-colors">Mais Vendidos</a></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 className="text-[11px] uppercase tracking-[0.3em] text-white font-bold mb-8">Atendimento</h4>
                    <ul className="space-y-4 text-sm text-gray-400 font-light">
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <Phone size={16} className="text-rose-gold" />
                            <span>(84) 99402-9075</span>
                        </li>
                        <li className="flex items-center justify-center md:justify-start gap-3">
                            <Mail size={16} className="text-rose-gold" />
                            <span>contato@belchior.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                    © 2026 BELCHIOR MODA FEMININA. Todos os direitos reservados.
                </p>
                <div className="flex gap-6 text-gray-500">
                    <a href="https://instagram.com/bybelchior" target="_blank" rel="noopener noreferrer" className="hover:text-rose-gold transition-colors"><Instagram size={18} /></a>
                </div>
            </div>
        </footer>
    );
}
