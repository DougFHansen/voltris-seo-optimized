'use client';

import NewsletterForm from '../NewsletterForm';
import SocialShare from './SocialShare';

export default function NewsletterSignup() {
  return (
    <div className="bg-gradient-to-r from-[#FF4B6B]/10 via-[#8B31FF]/10 to-[#31A8FF]/10 rounded-xl p-6 border border-[#8B31FF]/20">
      <h3 className="text-xl font-semibold text-white mb-2">Newsletter</h3>
      <p className="text-gray-400 text-sm mb-4">
        Receba as últimas novidades e atualizações diretamente no seu e-mail.
      </p>
      <NewsletterForm source="blog" />
      <div className="pt-4 mt-4 border-t border-gray-800 flex flex-col items-center">
        <h4 className="text-sm font-medium text-gray-400 mb-2 text-center">Compartilhe</h4>
        <div className="flex justify-center w-full">
          <SocialShare url={typeof window !== 'undefined' ? window.location.href : ''} title="Blog VOLTRIS" size={13} />
        </div>
      </div>
    </div>
  );
} 