import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product } from '../types/Product';
import type { Offer } from '../services/supabase';

// Unified cart item type that can handle both products and offers
interface CartItem {
  id: string;
  type: 'product' | 'offer';
  product?: Product;
  offer?: Offer;
  qty: number;
  price: number; // Final price after any discounts
  originalPrice?: number; // Original price before discounts
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  showNotification: boolean;
  notificationMessage: string;
}

type CartAction =
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'ADD_OFFER'; payload: Offer }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE' }
  | { type: 'CLOSE' }
  | { type: 'LOAD'; payload: CartItem[] }
  | { type: 'SHOW_NOTIFICATION'; payload: string }
  | { type: 'HIDE_NOTIFICATION' };

const CartContext = createContext<{
  state: CartState;
  addProduct: (product: Product) => void;
  addOffer: (offer: Offer) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggle: () => void;
  close: () => void;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const existingItem = state.items.find(item => 
        item.type === 'product' && item.product?.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.type === 'product' && item.product?.id === action.payload.id
              ? { ...item, qty: item.qty + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { 
          id: action.payload.id,
          type: 'product',
          product: action.payload,
          qty: 1,
          price: action.payload.price,
          originalPrice: action.payload.price
        }]
      };
    }
    case 'ADD_OFFER': {
      const existingItem = state.items.find(item => 
        item.type === 'offer' && item.offer?.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.type === 'offer' && item.offer?.id === action.payload.id
              ? { ...item, qty: item.qty + 1 }
              : item
          )
        };
      }
      
      // Calculate offer price based on price fields
      let offerPrice = action.payload.price || 0; // Default to current price
      if (action.payload.price_after) {
        offerPrice = action.payload.price_after;
      } else if (action.payload.price_before) {
        offerPrice = action.payload.price; // Use current price if before price is set
      }
      
      return {
        ...state,
        items: [...state.items, { 
          id: action.payload.id,
          type: 'offer',
          offer: action.payload,
          qty: 1,
          price: offerPrice,
          originalPrice: action.payload.price_before || action.payload.price
        }]
      };
    }
    case 'REMOVE': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    }
    case 'CLEAR': {
      return {
        ...state,
        items: []
      };
    }
    case 'TOGGLE': {
      return {
        ...state,
        isOpen: !state.isOpen
      };
    }
    case 'CLOSE': {
      return {
        ...state,
        isOpen: false
      };
    }
    case 'LOAD': {
      return {
        ...state,
        items: action.payload
      };
    }
    case 'SHOW_NOTIFICATION': {
      return {
        ...state,
        showNotification: true,
        notificationMessage: action.payload
      };
    }
    case 'HIDE_NOTIFICATION': {
      return {
        ...state,
        showNotification: false,
        notificationMessage: ''
      };
    }
    default:
      return state;
  }
};

const CART_STORAGE_KEY = 'jozef-cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    showNotification: false,
    notificationMessage: ''
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        dispatch({ type: 'LOAD', payload: items });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addProduct = (product: Product) => {
    dispatch({ type: 'ADD_PRODUCT', payload: product });
    // Show notification instead of opening cart
    dispatch({ type: 'SHOW_NOTIFICATION', payload: `${product.name} added to cart` });
    // Auto-hide notification after 3 seconds
    setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
  };

  const addOffer = (offer: Offer) => {
    dispatch({ type: 'ADD_OFFER', payload: offer });
    // Show notification instead of opening cart
    dispatch({ type: 'SHOW_NOTIFICATION', payload: `${offer.title} added to cart` });
    // Auto-hide notification after 3 seconds
    setTimeout(() => dispatch({ type: 'HIDE_NOTIFICATION' }), 3000);
  };

  const remove = (id: string) => {
    dispatch({ type: 'REMOVE', payload: id });
  };

  const clear = () => {
    dispatch({ type: 'CLEAR' });
  };

  const toggle = () => {
    dispatch({ type: 'TOGGLE' });
  };

  const close = () => {
    dispatch({ type: 'CLOSE' });
  };

  return (
    <CartContext.Provider value={{ state, addProduct, addOffer, remove, clear, toggle, close, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 