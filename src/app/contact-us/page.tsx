export default function ContactUs() {
  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0b3b32] mb-4">Contact Us</h1>
        <p className="text-lg text-[#2f5f56]">We&apos;d love to hear from you. Get in touch with us today!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-linear-to-br from-[#e7f7f3] to-[#f8fffe] rounded-2xl p-8 text-center border border-[#e2f3ef]">
          <div className="text-4xl mb-3">📧</div>
          <h3 className="text-xl font-bold text-[#0b3b32] mb-2">Email</h3>
          <p className="text-[#2f5f56]">
            <a href="mailto:support@klossyskin.com" className="hover:text-[#008d6e]">
              support@klossyskin.com
            </a>
          </p>
          <p className="text-sm text-[#2f5f56] mt-2">Response within 24 hours</p>
        </div>

        <div className="bg-linear-to-br from-[#e7f7f3] to-[#f8fffe] rounded-2xl p-8 text-center border border-[#e2f3ef]">
          <div className="text-4xl mb-3">📞</div>
          <h3 className="text-xl font-bold text-[#0b3b32] mb-2">Phone</h3>
          <p className="text-[#2f5f56]">
            <a href="tel:+1-800-KLASSY" className="hover:text-[#008d6e]">
              +1-800-KLASSY (555-2779)
            </a>
          </p>
          <p className="text-sm text-[#2f5f56] mt-2">Mon-Fri, 9AM-5PM EST</p>
        </div>

        <div className="bg-linear-to-br from-[#e7f7f3] to-[#f8fffe] rounded-2xl p-8 text-center border border-[#e2f3ef]">
          <div className="text-4xl mb-3">📍</div>
          <h3 className="text-xl font-bold text-[#0b3b32] mb-2">Visit Us</h3>
          <p className="text-[#2f5f56]">
            KlossySkin Inc.<br/>
            123 Skincare Avenue<br/>
            Beauty City, BC 12345
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2f3ef] p-8 md:p-12">
        <h2 className="text-2xl font-bold text-[#0b3b32] mb-8">Send us a message</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#0b3b32] mb-2">
                First Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-[#e2f3ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008d6e]"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0b3b32] mb-2">
                Last Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-[#e2f3ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008d6e]"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0b3b32] mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-[#e2f3ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008d6e]"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0b3b32] mb-2">
              Subject *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-[#e2f3ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008d6e]"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0b3b32] mb-2">
              Message *
            </label>
            <textarea
              required
              rows={6}
              className="w-full px-4 py-3 border border-[#e2f3ef] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008d6e] resize-none"
              placeholder="Tell us more about your inquiry..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-[#1e7864] to-[#008d6e] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Send Message
          </button>
        </form>
      </div>

      <div className="mt-12 bg-linear-to-r from-[#e7f7f3] to-[#f8fffe] rounded-2xl p-8 border border-[#e2f3ef]">
        <h2 className="text-2xl font-bold text-[#0b3b32] mb-4">Follow Us</h2>
        <p className="text-[#2f5f56] mb-4">Stay connected and get skincare tips & exclusive offers</p>
        <div className="flex gap-4 flex-wrap">
          <a href="#" className="inline-block text-2xl hover:scale-110 transition-transform">📘</a>
          <a href="#" className="inline-block text-2xl hover:scale-110 transition-transform">📷</a>
          <a href="#" className="inline-block text-2xl hover:scale-110 transition-transform">𝕏</a>
          <a href="#" className="inline-block text-2xl hover:scale-110 transition-transform">▶️</a>
          <a href="#" className="inline-block text-2xl hover:scale-110 transition-transform">📌</a>
        </div>
      </div>
    </main>
  );
}
