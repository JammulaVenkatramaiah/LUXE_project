import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold font-serif mb-4">LUXE</h3>
            <p className="text-gray-400 mb-4">Premium fashion for the modern lifestyle.</p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent cursor-pointer transition-colors" aria-label="Follow LUXE on Facebook">FB</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent cursor-pointer transition-colors" aria-label="Follow LUXE on Instagram">IG</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent cursor-pointer transition-colors" aria-label="Follow LUXE on Twitter">TW</a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=men" className="hover:text-white transition-colors">Men&apos;s</Link></li>
              <li><Link to="/products?category=women" className="hover:text-white transition-colors">Women&apos;s</Link></li>
              <li><Link to="/products?category=kids" className="hover:text-white transition-colors">Kids</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+1 (888) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@luxe.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1" />
                <span>123 Fashion Street, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>&copy; 2024 LUXE Fashion. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
