/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'xjbiohyydhecgtuzppnz.supabase.co',
          // Questo pathname ora copre sia gli URL pubblici che quelli firmati
          // all'interno del tuo bucket 'doc'.
          // 'v1/object/(public|sign)/doc/**' significa:
          // - v1/object/
          // - seguito da 'public' O 'sign' (grazie a (public|sign))
          // - seguito da '/doc/' (il nome del tuo bucket)
          // - seguito da qualsiasi cosa (**)
          pathname: '/storage/v1/object/(public|sign)/doc/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  