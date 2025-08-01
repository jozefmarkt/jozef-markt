import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product } from '../types/Product';

interface CartItem {
  product: Product;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; payload: Product }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE' }
  | { type: 'CLOSE' }
  | { type: 'LOAD'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  add: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggle: () => void;
  close: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.id
              ? { ...item, qty: item.qty + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload, qty: 1 }]
      };
    }
    case 'REMOVE': {
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload)
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
    default:
      return state;
  }
};

const CART_STORAGE_KEY = 'jozef-cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false
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

  const add = (product: Product) => {
    dispatch({ type: 'ADD', payload: product });
    dispatch({ type: 'TOGGLE' }); // Open drawer for instant feedback
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
    <CartContext.Provider value={{ state, add, remove, clear, toggle, close }}>
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