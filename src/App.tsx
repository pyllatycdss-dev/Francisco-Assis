import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import Cart from './components/Cart';
import Footer from './components/Footer';
import AdminDashboard from './components/Admin/AdminDashboard';
import { CartProvider } from './context/CartContext';
import { Product } from './context/CartContext';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';
import { ArrowRight } from 'lucide-react';

export default function App() {
    const [isAdminOpen, setIsAdminOpen] = React.useState(false);
    const [isCartOpen, setIsCartOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
            setProducts(data);
        });
        return unsubscribe;
    }, []);

    const filterProducts = (type: 'new' | 'bestseller' | 'promotion' | 'all') => {
        if (type === 'new') return products.filter(p => p.isNew);
        if (type === 'bestseller') return products.filter(p => p.isBestSeller);
        if (type === 'promotion') return products.filter(p => p.isPromotion);
        return products;
    };

    return (
        <CartProvider>
            <div className="min-h-screen bg-black overflow-x-hidden selection:bg-rose-gold selection:text-black">
                <Header 
                    onOpenAdmin={() => setIsAdminOpen(true)} 
                    onOpenCart={() => setIsCartOpen(true)} 
                />

                <main>
                    <Hero />

                    {/* Novidades */}
                    <Section 
                        id="novidades"
                        title="Novidades" 
                        subtitle="Acompanhe o que acaba de chegar em nossa coleção premium."
                        products={filterProducts('new')}
                        onView={setSelectedProduct}
                    />

                    {/* Coleção Highlight */}
                    <div id="colecoes" className="max-w-7xl mx-auto px-4 py-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="relative group overflow-hidden bg-premium-black rounded-2xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Coleção Casual Luxe"
                                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                                    referrerPolicy="no-referrer"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-10">
                                    <h3 className="text-3xl font-display text-white mb-4">Casual Luxe</h3>
                                    <p className="text-gray-300 font-light text-sm mb-6">O equilíbrio perfeito entre o básico e o sofisticado.</p>
                                    <button className="text-rose-gold text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                        Explorar <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-6xl font-display text-white leading-tight">
                                    Moda que expressa sua <br />
                                    <span className="italic text-rose-gold font-light">essência única.</span>
                                </h2>
                                <p className="text-gray-400 font-light leading-relaxed tracking-wide">
                                    Na BELCHIOR, acreditamos que a roupa é uma extensão da personalidade. 
                                    Nossas coleções são pensadas para a mulher contemporânea, 
                                    unindo tendências globais com o toque atemporal da sofisticação.
                                </p>
                                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-rose-gold/10">
                                    <div>
                                        <span className="block text-2xl font-display text-rose-gold mb-1">Premium</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest leading-loose">Curadoria de tecidos nobres e acabamento impecável.</span>
                                    </div>
                                    <div>
                                        <span className="block text-2xl font-display text-rose-gold mb-1">Exclusivo</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest leading-loose">Peças limitadas para garantir a sua originalidade.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mais Vendidos */}
                    <Section 
                        id="bestsellers"
                        title="Mais Vendidos" 
                        subtitle="Os favoritos de nossas clientes. Peças que não podem faltar no seu closet."
                        products={filterProducts('bestseller')}
                        onView={setSelectedProduct}
                        dark
                    />

                    {/* Promoções */}
                    <Section 
                        id="promocoes"
                        title="Special Offers" 
                        subtitle="Oportunidades únicas de adquirir suas peças favoritas com condições especiais."
                        products={filterProducts('promotion')}
                        onView={setSelectedProduct}
                    />

                    {/* Instagram Loop / Banner */}
                    <div className="bg-premium-black py-20 border-y border-rose-gold/10 overflow-hidden relative">
                         <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center opacity-[0.03]">
                            <span className="text-[20vw] font-display uppercase tracking-tighter">BELCHIOR</span>
                         </div>
                         <div className="max-w-7xl mx-auto px-4 text-center space-y-8 relative z-10">
                            <h3 className="text-4xl font-display text-white italic">#BELCHIORLUXE</h3>
                            <p className="text-gray-400 font-light mx-auto max-w-sm uppercase tracking-[0.2em] text-[10px]">
                                Marque @belchior nas suas fotos e apareça em nossa galeria de estilo.
                            </p>
                            <div className="flex justify-center gap-4">
                                <a 
                                    href="https://instagram.com/bybelchior" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 border border-rose-gold text-rose-gold text-[10px] uppercase font-bold tracking-widest hover:bg-rose-gold hover:text-black transition-all duration-500"
                                >
                                    Ir para Instagram
                                </a>
                            </div>
                         </div>
                    </div>
                </main>

                <Footer />

                {/* Modals & Overlays */}
                <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
                {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
            </div>
        </CartProvider>
    );
}

function Section({ id, title, subtitle, products, onView, dark = false }: { id: string, title: string, subtitle: string, products: Product[], onView: (p: Product) => void, dark?: boolean }) {
    return (
        <section id={id} className={`py-24 ${dark ? 'bg-premium-black' : 'bg-black'}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-4 max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-display text-white">{title}</h2>
                        <p className="text-gray-500 font-light text-sm tracking-wide leading-relaxed">
                            {subtitle}
                        </p>
                    </div>
                    {/* View All Button */}
                    <button className="text-rose-gold text-[10px] uppercase tracking-[0.3em] font-bold border-b border-rose-gold/20 pb-1 hover:border-rose-gold transition-all">
                        Ver Todos
                    </button>
                </div>

                {products.length === 0 ? (
                   <div className="py-20 text-center border border-white/5 bg-white/5 rounded-3xl">
                        <p className="text-gray-600 italic font-light">Nenhum produto encontrado nesta categoria.</p>
                   </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} onView={onView} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
