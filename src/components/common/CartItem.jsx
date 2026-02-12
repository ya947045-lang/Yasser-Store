import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center py-4 border-b">
      <img
        src={item.imageUrl || '/placeholder-image.jpg'}
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />
      
      <div className="flex-1 ml-4">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-3 py-1 hover:bg-gray-100"
            disabled={item.quantity <= 1}
          >-</button>
          <span className="px-4 py-1">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-1 hover:bg-gray-100"
            disabled={item.quantity >= item.stockQuantity}
          >+</button>
        </div>
        
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
