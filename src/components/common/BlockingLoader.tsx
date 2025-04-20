// 'use client';

// export default function BlockingLoader() {
//   return (
//     <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
//       <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   );
// }


// 'use client';

// import React from 'react';

// export default function BlockingLoader() {
//     return (
//         <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
//             <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
//         </div>
//     );
// }

// components/ui/BlockingLoader.tsx
'use client';
// import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export default function BlockingLoader({ show }: { show: boolean }) {
    if (!show) return null;

    return (
        <div
            className="absolute inset-0 z-50 bg-white/60 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg"
        >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
