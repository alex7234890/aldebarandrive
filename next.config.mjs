/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xjbiohyydhecgtuzppnz.supabase.co',
        // Questo pathname ora copre sia gli URL pubblici che quelli firmati
        // per i bucket 'eventi' e 'galleria'.
        // 'v1/object/(public|sign)/(eventi|galleria)/**' significa:
        // - v1/object/
        // - seguito da 'public' O 'sign' (grazie a (public|sign))
        // - seguito da '/eventi/' O '/galleria/' (i nomi dei tuoi bucket)
        // - seguito da qualsiasi cosa (**)
        pathname: '/storage/v1/object/(public|sign)/(eventi|galleria)/**',
      },
    ],
  },
};

export default nextConfig;
  