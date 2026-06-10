import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiOutlineTrash, HiOutlineShoppingCart } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import OilCan from './OilCan';
import './CartDrawer.css';

export default function CartDrawer() {
  const { isCartOpen, toggleCart, cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  const shippingCost = cartTotal > 100 ? 0 : 15;
  const finalTotal = cartTotal > 0 ? cartTotal + shippingCost : 0;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="cart-drawer-overlay" onClick={toggleCart}>
          <motion.div 
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-header">
              <h2><HiOutlineShoppingCart /> Your Cart ({cartCount})</h2>
              <button className="cart-close-btn" onClick={toggleCart}><HiX /></button>
            </div>

            <div className="cart-body">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <HiOutlineShoppingCart style={{ fontSize: '4rem', opacity: 0.2 }} />
                  <p>Your cart is empty.</p>
                  <button className="btn btn-primary" onClick={toggleCart}>Continue Shopping</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.variant.size}`} className="cart-item">
                    <div className="cart-item-img">
                      <OilCan color={item.color} size={60} />
                    </div>
                    <div className="cart-item-info">
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.id, item.variant.size)}>
                        <HiOutlineTrash />
                      </button>
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-details">
                        {item.category} • {item.viscosity} <br />
                        Package: {item.variant.size}
                      </div>
                      <div className="cart-item-price">RM {item.variant.price.toFixed(2)}</div>
                      
                      <div className={`cart-stock-status ${item.variant.stock > 10 ? 'stock-in' : item.variant.stock > 0 ? 'stock-low' : 'stock-out'}`}>
                        {item.variant.stock > 10 ? 'In Stock' : item.variant.stock > 0 ? `Low Stock (${item.variant.stock} left)` : 'Out of Stock'}
                      </div>

                      <div className="cart-qty-ctrl">
                        <button 
                          className="cart-qty-btn" 
                          onClick={() => updateQuantity(item.id, item.variant.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span>{item.quantity}</span>
                        <button 
                          className="cart-qty-btn" 
                          onClick={() => updateQuantity(item.id, item.variant.size, item.quantity + 1)}
                          disabled={item.quantity >= item.variant.stock}
                        >+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>RM {cartTotal.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Estimated Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `RM ${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="cart-summary-total">
                  <span>Total</span>
                  <span>RM {finalTotal.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary cart-checkout-btn">Proceed to Checkout</button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
