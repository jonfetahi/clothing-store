import { Link } from 'react-router-dom';
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiArrowRight,
} from 'react-icons/fi';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-14">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              CLOTHING<span className="font-light">STORE.</span>
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-500">
              Discover your style with our curated collection
              of modern essentials and timeless fashion.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <a href="https://instagram.com" aria-label="Instagram"
                 className="text-gray-500 transition hover:text-black">
                <FiInstagram size={19} />
              </a>

              <a href="https://facebook.com" aria-label="Facebook"
                 className="text-gray-500 transition hover:text-black">
                <FiFacebook size={19} />
              </a>

              <a href="https://twitter.com" aria-label="Twitter"
                 className="text-gray-500 transition hover:text-black">
                <FiTwitter size={19} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-gray-900">
              Shop
            </h3>

            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link to="/public" className="hover:text-black">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/public/men" className="hover:text-black">
                  Men
                </Link>
              </li>
              <li>
                <Link to="/public/women" className="hover:text-black">
                  Women
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-gray-900">
              Customer Care
            </h3>

            <ul className="space-y-3 text-sm text-gray-500">
              <li>Contact Us</li>
              <li>Shipping & Returns</li>
              <li>Size Guide</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-gray-900">
              Stay in the Loop
            </h3>

            <p className="mb-5 text-sm leading-6 text-gray-500">
              Get updates on new arrivals and exclusive collections.
            </p>

            <div className="flex items-center border-b border-gray-300 pb-2">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                aria-label="Subscribe"
                className="ml-3 text-gray-900 transition hover:text-gray-500"
              >
                <FiArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-gray-200 pt-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Clothing Store.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
