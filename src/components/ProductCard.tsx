import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import gsap from 'gsap';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || window.innerWidth < 768) return;

    const card = cardRef.current;
    
    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const xPercent = (x / width - 0.5) * 20; // 3D Tilt
      const yPercent = (y / height - 0.5) * -20;
      
      gsap.to(card, {
        rotationY: xPercent,
        rotationX: yPercent,
        scale: 1.05,
        y: -12,
        duration: 0.4,
        ease: 'power2.out',
        perspective: 1000
      });

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: x - 150,
          y: y - 150,
          opacity: 1,
          duration: 0.6
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0,
          duration: 0.6
        });
      }
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);

    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: (index % 4) * 0.1,
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="relative perspective-1000"
    >
      <div 
        ref={cardRef}
        className="relative h-full bg-[#162032] border border-white/10 rounded-[32px] overflow-hidden flex flex-col hover:border-blue-500/30 transition-all duration-300 shadow-xl group backdrop-blur-sm"
      >
        {/* Dynamic Glow Overlay */}
        <div 
          ref={glowRef}
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
          style={{
            background: 'radial-gradient(300px circle at center, rgba(59, 130, 246, 0.12), transparent 80%)',
          }}
        />

        {/* Card Header / Image */}
        <div className="relative aspect-[2/1] md:aspect-[16/10] overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#162032] via-transparent to-transparent opacity-90" />
          

        </div>

        {/* Content */}
        <div className="p-4 md:p-8 flex flex-col flex-grow relative z-20">
          <div className="flex items-center gap-1 text-yellow-500/30 mb-4">
             <Star size={12} fill="currentColor" />
             <Star size={12} fill="currentColor" />
             <Star size={12} fill="currentColor" />
             <Star size={12} fill="currentColor" />
             <Star size={12} fill="currentColor" />
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3 tracking-tighter transition-all duration-300 group-hover:text-blue-400 group-hover:translate-x-1">
            {product.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 line-clamp-2 md:line-clamp-3 mb-4 md:mb-8 leading-relaxed font-medium">
            {product.description}
          </p>
          
          <div className="mt-auto md:mt-8 pt-4 md:pt-6 flex flex-col border-t border-white/10 gap-3 md:gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Projected Cost</span>
              <span className="text-xl font-bold text-white tracking-tight font-sans">
                 ₹{Number(product.price || 82917).toLocaleString('en-IN')}
              </span>
            </div>
            <Link 
              to={`/product/${product.id}`}
              className="group/btn w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10 transition-transform duration-300 group-hover/btn:-translate-x-1">Checkout</span>
              <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-2 group-hover/btn:scale-110" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
