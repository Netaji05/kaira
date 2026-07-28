import React from 'react';
import { Instagram, Heart } from 'lucide-react';

export const InstagramWall: React.FC = () => {
  const posts = [
    {
      img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
      handle: '@kaira.jewels4',
      likes: '1.2k',
    },
    {
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      handle: '@kaira.jewels4',
      likes: '1.8k',
    },
    {
      img: 'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=600&q=80',
      handle: '@kaira.jewels4',
      likes: '2.4k',
    },
    {
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
      handle: '@kaira.jewels4',
      likes: '1.5k',
    },
  ];

  return (
    <section className="py-16 bg-stone-50 border-t border-stone-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center justify-center gap-1.5">
            <Instagram className="w-4 h-4 text-amber-800" /> @kaira.jewels4
          </p>
          <h2 className="text-3xl font-serif font-bold text-stone-900">As Seen On You</h2>
          <p className="text-xs text-stone-600">
            Tag us on Instagram <span className="font-semibold text-stone-800">#KairaElegance</span> or DM <a href="https://instagram.com/kaira.jewels4" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-900 underline">@kaira.jewels4</a> to be featured on our official store!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((p, idx) => (
            <a
              key={idx}
              href="https://instagram.com/kaira.jewels4"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-2xs border border-stone-200"
            >
              <img
                src={p.img}
                alt="KAIRA Instagram customer look"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                <span className="text-xs font-bold">{p.handle}</span>
                <span className="text-[11px] flex items-center gap-1 text-amber-300 mt-1">
                  <Heart className="w-3.5 h-3.5 fill-current" /> {p.likes}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
