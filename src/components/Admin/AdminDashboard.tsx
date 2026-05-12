import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, TrendingUp, DollarSign, List, X, PlusCircle, Check, Loader2, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, storage } from '../../lib/firebase';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    getDoc,
    setDoc
} from 'firebase/firestore';
import { Product } from '../../context/CartContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
    const [view, setView] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Form states for new/edit product
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        category: 'Vestidos',
        sizes: ['P', 'M', 'G'],
        colors: ['Preto'],
        images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1976&auto=format&fit=crop'],
        isNew: true,
        isBestSeller: false,
        isPromotion: false
    });

    useEffect(() => {
        const qProducts = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        });

        const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeProducts();
            unsubscribeOrders();
        };
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            setFormData(prev => ({
                ...prev,
                images: [downloadURL]
            }));
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Erro ao fazer upload da imagem. Verifique se o Firebase Storage está ativado.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                updatedAt: serverTimestamp(),
                createdAt: editingProduct ? (editingProduct as any).createdAt : serverTimestamp()
            };

            if (editingProduct) {
                await updateDoc(doc(db, 'products', editingProduct.id), data);
            } else {
                await addDoc(collection(db, 'products'), data);
            }
            
            setIsAddingProduct(false);
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                originalPrice: 0,
                stock: 0,
                category: 'Vestidos',
                sizes: ['P', 'M', 'G'],
                colors: ['Preto'],
                images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1976&auto=format&fit=crop'],
                isNew: true,
                isBestSeller: false,
                isPromotion: false
            });
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (window.confirm('Excluir este produto permanentemente?')) {
            await deleteDoc(doc(db, 'products', id));
        }
    };

    const handleSeedData = async () => {
        const dummyProducts: Partial<Product>[] = [
            {
                name: 'Vestido Seda Rose',
                description: 'Vestido midi em seda pura com detalhes em rose gold. Perfeito para eventos sofisticados.',
                price: 459.90,
                originalPrice: 599.90,
                stock: 15,
                category: 'Vestidos',
                sizes: ['P', 'M', 'G'],
                colors: ['Nude', 'Rose Gold'],
                images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop'],
                isNew: true,
                isBestSeller: true,
                isPromotion: true
            },
            {
                name: 'Blusa Transpassada Chic',
                description: 'Blusa em crepe com decote transpassado e mangas levemente bufantes.',
                price: 189.90,
                stock: 25,
                category: 'Blusas',
                sizes: ['U'],
                colors: ['Preto', 'Off White'],
                images: ['https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop'],
                isNew: true,
                isBestSeller: false,
                isPromotion: false
            },
            {
                name: 'Calça Pantalona Essential',
                description: 'Calça pantalona de cintura alta com caimento impecável.',
                price: 289.90,
                stock: 10,
                category: 'Calças',
                sizes: ['36', '38', '40', '42'],
                colors: ['Bege', 'Preto'],
                images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974&auto=format&fit=crop'],
                isNew: false,
                isBestSeller: true,
                isPromotion: false
            }
        ];

        for (const p of dummyProducts) {
            await addDoc(collection(db, 'products'), {
                ...p,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
        alert('Produtos iniciais cadastrados com sucesso!');
    };

    const stats = {
        totalRevenue: orders.reduce((acc, order) => acc + (order.totalValue || 0), 0),
        totalOrders: orders.length,
        totalProducts: products.length,
        stockAlerts: products.filter(p => p.stock < 5).length
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col font-sans">
            {/* Admin Header */}
            <div className="h-16 bg-premium-black border-b border-rose-gold/10 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-display text-rose-gold font-bold">ADMIN BELCHIOR</span>
                    <div className="hidden md:flex gap-4 ml-8">
                        <button 
                            onClick={() => setView('dashboard')}
                            className={`text-[11px] uppercase tracking-widest ${view === 'dashboard' ? 'text-rose-gold' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Dashboard
                        </button>
                        <button 
                            onClick={() => setView('products')}
                            className={`text-[11px] uppercase tracking-widest ${view === 'products' ? 'text-rose-gold' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Produtos
                        </button>
                        <button 
                            onClick={() => setView('orders')}
                            className={`text-[11px] uppercase tracking-widest ${view === 'orders' ? 'text-rose-gold' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Pedidos
                        </button>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Admin Body */}
            <div className="flex-1 overflow-y-auto bg-black p-6">
                {view === 'dashboard' && (
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard icon={<DollarSign className="text-green-500" />} label="Faturado" value={`R$ ${stats.totalRevenue.toFixed(2)}`} />
                            <StatCard icon={<TrendingUp className="text-blue-500" />} label="Pedidos" value={stats.totalOrders} />
                            <StatCard icon={<Package className="text-rose-gold" />} label="Produtos" value={stats.totalProducts} />
                            <StatCard icon={<List className="text-yellow-500" />} label="Estoque Baixo" value={stats.stockAlerts} />
                        </div>

                        <div className="bg-premium-black border border-rose-gold/10 rounded-lg p-6">
                            <h3 className="text-lg font-display text-white mb-6 uppercase tracking-widest">Pedidos Recentes</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="border-b border-rose-gold/10 text-rose-gold uppercase text-[10px] tracking-widest">
                                        <tr>
                                            <th className="pb-4">Cliente</th>
                                            <th className="pb-4">WhatsApp</th>
                                            <th className="pb-4">Valor</th>
                                            <th className="pb-4">Status</th>
                                            <th className="pb-4">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.slice(0, 5).map((order) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 text-white font-medium">{order.clientName}</td>
                                                <td className="py-4">{order.whatsapp}</td>
                                                <td className="py-4 font-display text-rose-gold">R$ {order.totalValue?.toFixed(2)}</td>
                                                <td className="py-4">
                                                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] border border-green-500/20">
                                                        {order.status || 'Finalizado'}
                                                    </span>
                                                </td>
                                                <td className="py-4">{order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'products' && (
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-display text-white uppercase tracking-widest">Gestão de Produtos</h3>
                            <button 
                                onClick={() => { setEditingProduct(null); setIsAddingProduct(true); }}
                                className="bg-rose-gold text-black px-4 py-2 rounded text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-rose-gold-light"
                            >
                                <Plus size={16} /> Novo Produto
                            </button>
                            <button 
                                onClick={handleSeedData}
                                className="bg-white/5 text-gray-400 px-4 py-2 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 ml-2"
                            >
                                Seed Data
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="bg-premium-black border border-rose-gold/10 rounded-lg p-4 flex gap-4">
                                    <img src={product.images[0]} className="w-20 h-24 object-cover rounded" referrerPolicy="no-referrer" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium truncate">{product.name}</h4>
                                        <p className="text-rose-gold font-display">R$ {product.price.toFixed(2)}</p>
                                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Estoque: {product.stock}</p>
                                        <div className="flex gap-2 mt-4 text-gray-400">
                                            <button 
                                                onClick={() => { setEditingProduct(product); setFormData(product); setIsAddingProduct(true); }}
                                                className="p-1 hover:text-rose-gold transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-1 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {isAddingProduct && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-premium-black border border-rose-gold/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-display text-rose-gold uppercase tracking-widest">
                                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                                </h2>
                                <button onClick={() => setIsAddingProduct(false)} className="text-gray-500 ring-1 ring-white/10 p-1 rounded">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProduct} className="space-y-6 text-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] uppercase tracking-widest">Nome</label>
                                        <input 
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded px-4 py-2 focus:border-rose-gold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] uppercase tracking-widest">Preço</label>
                                        <input 
                                            required
                                            type="number"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            className="w-full bg-black border border-white/10 rounded px-4 py-2 focus:border-rose-gold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] uppercase tracking-widest">Estoque</label>
                                        <input 
                                            required
                                            type="number"
                                            value={formData.stock}
                                            onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                            className="w-full bg-black border border-white/10 rounded px-4 py-2 focus:border-rose-gold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] uppercase tracking-widest">Categoria</label>
                                        <select 
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded px-4 py-2 focus:border-rose-gold outline-none h-10"
                                        >
                                            <option>Vestidos</option>
                                            <option>Blusas</option>
                                            <option>Calças</option>
                                            <option>Acessórios</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] uppercase tracking-widest">Descrição</label>
                                    <textarea 
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded px-4 py-2 focus:border-rose-gold outline-none resize-none"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] uppercase tracking-widest">Imagens do Produto</label>
                                        <div className="flex gap-4">
                                            {formData.images?.map((img, idx) => (
                                                <div key={idx} className="relative w-24 h-32 border border-white/10 rounded overflow-hidden bg-black group">
                                                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }))}
                                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} className="text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                            
                                            <label className="w-24 h-32 border-2 border-dashed border-white/10 rounded flex flex-col items-center justify-center cursor-pointer hover:border-rose-gold/50 transition-colors bg-white/5">
                                                {isUploading ? (
                                                    <Loader2 className="w-6 h-6 text-rose-gold animate-spin" />
                                                ) : (
                                                    <>
                                                        <Upload className="w-6 h-6 text-gray-500 mb-2" />
                                                        <span className="text-[8px] uppercase tracking-widest text-gray-500">Upload</span>
                                                    </>
                                                )}
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    className="hidden" 
                                                    onChange={handleFileUpload} 
                                                    disabled={isUploading}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] uppercase tracking-widest">Ou URL da Imagem</label>
                                        <input 
                                            value={formData.images?.[0] || ''}
                                            onChange={e => setFormData({ ...formData, images: [e.target.value] })}
                                            placeholder="https://..."
                                            className="w-full bg-black border border-white/10 rounded px-4 py-2 focus:border-rose-gold outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.isNew} onChange={e => setFormData({...formData, isNew: e.target.checked})} className="accent-rose-gold" />
                                        <span className="text-gray-400 text-[10px] uppercase tracking-widest">Novidade</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.isBestSeller} onChange={e => setFormData({...formData, isBestSeller: e.target.checked})} className="accent-rose-gold" />
                                        <span className="text-gray-400 text-[10px] uppercase tracking-widest">Mais Vendido</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.isPromotion} onChange={e => setFormData({...formData, isPromotion: e.target.checked})} className="accent-rose-gold" />
                                        <span className="text-gray-400 text-[10px] uppercase tracking-widest">Promoção</span>
                                    </label>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-rose-gold text-black py-3 rounded uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-rose-gold-light transition-colors mt-8"
                                >
                                    {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="bg-premium-black border border-rose-gold/10 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-2">
                {icon}
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">{label}</span>
            </div>
            <div className="text-2xl font-display text-white">{value}</div>
        </div>
    );
}
