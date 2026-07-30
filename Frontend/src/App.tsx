import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { CartDrawer } from '@/components/Cart/CartDrawer';
import Home from '@/pages/Home';
import Boutique from '@/pages/Boutique';
import Contact from '@/pages/Contact';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import { Checkout } from '@/components/Checkout/Checkout';
import { useState } from 'react';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white flex flex-col">
            <Header
              onCartClick={() => setCartOpen(true)}
              onLogoClick={() => (window.location.href = '/')}
            />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/boutique" element={<Boutique />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/checkout"
                  element={
                    <Checkout
                      onBack={() => (window.location.href = '/boutique')}
                      onOrderComplete={() => (window.location.href = '/')}
                    />
                  }
                />
              </Routes>
            </main>
            <Footer />
            <CartDrawer
              open={cartOpen}
              onClose={() => setCartOpen(false)}
              onCheckout={() => (window.location.href = '/checkout')}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}