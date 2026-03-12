import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Loader2, Star, Check } from 'lucide-react';
import { useProfileStore, SHOP_ITEMS } from '../store/profile';
import { useI18nStore } from '../store/i18n';
import { audio } from '../utils/audio';
import { PurchaseCelebration } from './PurchaseCelebration';
import { SkinAcquisitionHero } from './SkinAcquisitionHero';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { SkinPreview } from './SkinPreview';

const PB_BUNDLES = [
  { id: 'b1', name: 'Handful of Blocks', pbAmount: 1000, priceUsd: 0.99, valueProp: 'Perfect for a quick skin!', image: import.meta.env.BASE_URL + 'bundles/bundle_handful.png' },
  { id: 'b2', name: 'Block Pouch', pbAmount: 3500, priceUsd: 2.99, valueProp: '+15% Extra Value', image: import.meta.env.BASE_URL + 'bundles/bundle_pouch.png' },
  { id: 'b3', name: 'Party Chest', pbAmount: 8500, priceUsd: 4.99, valueProp: 'MOST POPULAR', image: import.meta.env.BASE_URL + 'bundles/bundle_chest.png' },
  { id: 'b4', name: 'Hoard of Blocks', pbAmount: 20000, priceUsd: 9.99, valueProp: 'BEST VALUE', image: import.meta.env.BASE_URL + 'bundles/bundle_hoard.png' },
  { id: 'b5', name: 'Founder’s Vault', pbAmount: 50000, priceUsd: 19.99, valueProp: 'Ultimate Collection', image: import.meta.env.BASE_URL + 'bundles/bundle_vault.png' },
  { id: 'b6', name: 'Whale Stash', pbAmount: 125000, priceUsd: 49.99, valueProp: 'MAXIMUM PRESTIGE', image: import.meta.env.BASE_URL + 'bundles/bundle_vault.png' },
];

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Shop = ({ isOpen, onClose }: ShopProps) => {
  const { profile, purchaseItem, addReward, equipSkin } = useProfileStore();
  const { t } = useI18nStore();
  
  const [celebration, setCelebration] = useState<{ isOpen: boolean; bundleName: string; amount: number; image: string }>({
    isOpen: false,
    bundleName: '',
    amount: 0,
    image: ''
  });
  
  const [heroSkin, setHeroSkin] = useState<{ isOpen: boolean; skinId: string }>({
    isOpen: false,
    skinId: ''
  });

  const [selectedSkinId, setSelectedSkinId] = useState<string | null>(null);

  const getUiScale = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth > 1400 || window.innerHeight > 850) {
      const scaleW = (window.innerWidth * 0.98) / 1400;
      const scaleH = (window.innerHeight * 0.90) / 850;
      return Math.max(1, Math.min(scaleW, scaleH));
    }
    return 1;
  };

  const [uiScale, setUiScale] = useState(getUiScale());

  useEffect(() => {
    const handleResize = () => setUiScale(getUiScale());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!profile) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              onClick={onClose}
              className="fixed inset-0 bg-sky-950/40 z-[120] pointer-events-auto"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 * uiScale, y: 50, rotateX: 20 }}
              animate={{ opacity: 1, scale: uiScale, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8 * uiScale, y: 50, rotateX: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              style={{ perspective: "1000px" }}
              className="fixed inset-0 flex items-center justify-center z-[130] p-2 md:p-6 pointer-events-none"
            >
              <div className="bg-white rounded-[3rem] w-[98vw] max-w-[1400px] h-[90vh] max-h-[850px] border-[10px] border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.5),_0_20px_0_#d97706] pointer-events-auto relative flex flex-col overflow-hidden ring-4 ring-white">
                
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-transparent to-rose-100/50 pointer-events-none" />

                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 md:top-6 md:right-6 text-white bg-rose-500 hover:bg-rose-400 p-3 rounded-full z-50 shadow-[0_6px_0_#9f1239] border-4 border-rose-300"
                >
                  <X size={28} className="stroke-[4px]" />
                </motion.button>

                <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 relative z-0" style={{ scrollbarWidth: 'none' }}>
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 rounded-[2rem] text-white mb-8 shadow-[0_8px_0_#b45309] relative overflow-hidden border-4 border-amber-300">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="absolute -right-10 -top-10 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl" />
                    
                    <div className="relative z-10 text-center">
                      <p className="font-display font-black text-5xl md:text-6xl text-white uppercase leading-none drop-shadow-[0_4px_0_#9a3412] mb-2">{t('shop') || 'NEGOZIO PB'}</p>
                      <p className="text-sm font-bold opacity-100 uppercase tracking-[0.2em] text-amber-100 drop-shadow-sm">Ottieni blocchi e personalizza il tuo stile!</p>
                    </div>
                    
                    <div className="absolute top-1/2 left-0 transform -translate-x-1/4 -translate-y-1/2 opacity-20 rotate-12">
                      <Coins size={200} />
                    </div>

                    <div className="absolute bottom-4 right-8 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/40 flex items-center gap-3">
                      <Coins size={24} className="text-amber-100" />
                      <span className="font-black text-2xl text-white">{profile.coins.toLocaleString()} PB</span>
                    </div>
                  </div>

                  {/* 3D Skin Preview Overlay */}
                  <AnimatePresence>
                    {selectedSkinId && (
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed right-10 top-1/2 -translate-y-1/2 w-80 h-96 bg-white/80 backdrop-blur-xl rounded-[3rem] border-[6px] border-amber-400 shadow-2xl z-50 overflow-hidden hidden xl:block"
                      >
                         <div className="absolute top-4 left-0 right-0 text-center z-10">
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Preview 3D</h4>
                            <p className="text-[10px] font-bold text-slate-400">Trascina per ruotare</p>
                         </div>
                         <button 
                           onClick={() => setSelectedSkinId(null)}
                           className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 z-20"
                         >
                           <X size={20} />
                         </button>
                         <div className="w-full h-full">
                           <Canvas shadows camera={{ position: [0, 1.5, 4], fov: 40 }}>
                             <ambientLight intensity={0.8} />
                             <pointLight position={[10, 10, 10]} intensity={1.5} />
                             <Environment preset="city" />
                             <Suspense fallback={null}>
                               <SkinPreview skinId={selectedSkinId} />
                             </Suspense>
                             <OrbitControls enableZoom={false} enablePan={false} />
                           </Canvas>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mb-12">
                    <h3 className="font-black text-slate-800 text-2xl uppercase tracking-widest mb-6 flex items-center gap-3 border-b-[4px] border-slate-200 pb-4">
                      💎 Acquista Party Blocks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
                      {PB_BUNDLES.map((bundle, idx) => (
                        <motion.div 
                          key={bundle.id}
                          layoutId={`bundle-${bundle.id}`}
                          initial={{ opacity: 0, scale: 0.9, y: 30 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
                          className="bg-white border-[6px] border-slate-200 hover:border-amber-400 rounded-[2.5rem] p-6 flex flex-col transition-colors shadow-[0_8px_0_#cbd5e1] hover:shadow-[0_8px_0_#f59e0b] hover:-translate-y-2 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 transition-colors pointer-events-none" />

                          {bundle.valueProp.includes('POPULAR') && (
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 font-black text-xs uppercase tracking-widest rounded-bl-[1.5rem] z-20 shadow-md">
                              Più Popolare
                            </div>
                          )}
                          {bundle.valueProp.includes('VALUE') && (
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 font-black text-xs uppercase tracking-widest rounded-bl-[1.5rem] z-20 shadow-md">
                              Miglior Valore
                            </div>
                          )}
                          {bundle.valueProp.includes('PRESTIGE') && (
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 font-black text-xs uppercase tracking-widest rounded-bl-[1.5rem] z-20 shadow-md">
                              Ultra Prestige
                            </div>
                          )}

                          <div className="h-44 xl:h-52 bg-slate-50 rounded-[1.5rem] mb-5 overflow-hidden border-[4px] border-slate-200 flex items-center justify-center relative shadow-inner">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/60 z-10 pointer-events-none" />
                            <motion.img 
                              whileHover={{ scale: 1.15, rotate: 2 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              src={bundle.image} 
                              alt={bundle.name} 
                              className="w-full h-full object-cover transform scale-105" 
                            />
                          </div>
                          <h4 className="font-black text-slate-800 text-2xl xl:text-3xl leading-tight mb-2 text-center drop-shadow-sm z-10">{bundle.name}</h4>
                          <div className="text-center mb-6 mt-auto z-10">
                            <span className="font-black text-amber-500 text-3xl flex items-center justify-center gap-2 drop-shadow-sm">
                              <Coins size={32} className="fill-amber-400 stroke-amber-200" /> {bundle.pbAmount.toLocaleString()} 
                            </span>
                            <span className="text-xs font-bold text-slate-500 uppercase flex items-center justify-center mt-3 bg-slate-100 rounded-full px-4 py-1.5 w-max mx-auto shadow-inner border border-slate-200">{bundle.valueProp}</span>
                          </div>
                          
                          <button 
                            onClick={() => {
                              addReward(0, false, bundle.pbAmount);
                              setTimeout(() => {
                                setCelebration({
                                  isOpen: true,
                                  bundleName: bundle.name,
                                  amount: bundle.pbAmount,
                                  image: bundle.image
                                });
                              }, 800);
                            }}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-black text-lg uppercase transition-all shadow-sm border-[3px] border-emerald-700 border-b-[6px] active:border-b-[3px] active:translate-y-1 relative overflow-hidden"
                          >
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                            <span className="relative z-10">{bundle.priceUsd} $</span>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8 pb-8">
                    {['skins', 'trails', 'emotes'].map(category => (
                      <div key={category}>
                        <h3 className="font-black text-slate-800 text-xl uppercase tracking-widest mb-4 flex items-center gap-2 border-b-[3px] border-slate-100 pb-2">
                          {category === 'skins' ? 'Skins Personaggio' : category === 'trails' ? 'Scie di Movimento' : 'Emote & Danze'}
                        </h3>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                          {SHOP_ITEMS.filter(item => item.category === category).map((item) => {
                            const isOwned = profile.inventory?.[category as keyof typeof profile.inventory]?.includes(item.id) || profile.unlocked_items?.includes(item.id);
                            const canAfford = profile.coins >= item.price;

                            return (
                              <div key={item.id} 
                                   onClick={() => item.category === 'skins' && setSelectedSkinId(item.id)}
                                   className={`bg-white border-[4px] rounded-[2rem] p-5 flex flex-col hover:border-amber-400 transition-all shadow-sm relative overflow-hidden cursor-pointer ${selectedSkinId === item.id ? 'border-amber-400 ring-4 ring-amber-100' : 'border-slate-100'}`}
                              >
                                <div className={`absolute top-0 right-0 px-3 py-1 font-black text-[9px] uppercase tracking-widest rounded-bl-xl ${
                                    item.tier === 'Legendary' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                                    item.tier === 'Epic' ? 'bg-indigo-500 text-white' :
                                    item.tier === 'Rare' ? 'bg-blue-500 text-white' :
                                    'bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  {item.tier}
                                </div>

                                <div className="flex items-start gap-4 mb-4 mt-2">
                                  <div className={`p-4 rounded-2xl ${isOwned ? 'bg-emerald-50 text-emerald-500 border-2 border-emerald-100' : 'bg-slate-50 text-slate-400 border-2 border-slate-100'}`}>
                                    <span className="text-2xl">{item.icon}</span>
                                  </div>
                                  <div className="text-left flex-1">
                                    <h4 className="font-black text-slate-800 text-lg leading-tight mb-1">{item.name}</h4>
                                    <p className="text-[11px] text-slate-400 font-bold leading-snug">{item.description}</p>
                                  </div>
                                </div>

                                <button
                                  disabled={isOwned || !canAfford}
                                  onClick={async () => {
                                    const success = await purchaseItem(item.id, item.price);
                                    if (success) {
                                      audio.playCoinSound?.();
                                      if (item.id === 'skin_special_israel' || item.id === 'skin_robsbagliato') {
                                        setHeroSkin({ isOpen: true, skinId: item.id });
                                      }
                                      if (item.category === 'skins') {
                                        await equipSkin(item.id);
                                      }
                                    }
                                  }}
                                  className={`w-full py-3 rounded-2xl font-black text-sm uppercase transition-all shadow-sm border-[3px] border-b-[6px] active:border-b-[3px] active:translate-y-1 ${
                                    isOwned
                                      ? 'bg-emerald-100 text-emerald-600 border-emerald-300 cursor-default shadow-none translate-y-[3px] border-b-[3px]'
                                      : canAfford
                                        ? 'bg-indigo-500 text-white border-indigo-700 hover:bg-indigo-400'
                                        : 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed opacity-70'
                                  }`}
                                >
                                  {isOwned ? 'Sbloccato' : <span className="flex items-center justify-center gap-1.5"><Coins size={16}/> {item.price} PB</span>}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-xs text-slate-300 font-bold uppercase mt-8 tracking-widest">--- Altri oggetti in arrivo ---</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PurchaseCelebration 
        isOpen={celebration.isOpen}
        onClose={() => setCelebration(prev => ({ ...prev, isOpen: false }))}
        bundleName={celebration.bundleName}
        amount={celebration.amount}
        image={celebration.image}
      />

      <SkinAcquisitionHero 
        isOpen={heroSkin.isOpen}
        onClose={() => setHeroSkin(prev => ({ ...prev, isOpen: false }))}
        skinId={heroSkin.skinId}
      />
    </>
  );
};
