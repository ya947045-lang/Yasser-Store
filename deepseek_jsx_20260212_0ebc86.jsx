import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity <= 5 && product.stockQuantity > 0;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {isOutOfStock && (
          <Badge variant="error" size="sm">Out of Stock</Badge>
        )}
        {isLowStock && (
          <Badge variant="warning" size="sm">Low Stock</Badge>
        )}
        {product.isNew && (
          <Badge variant="success" size="sm">New</Badge>
        )}
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative pt-[100%] bg-gray-100 dark:bg-gray-700">
        <img
          src={imageError ? '/placeholder-image.jpg' : product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            Quick View
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm ${isLowStock ? 'text-orange-500' : 'text-gray-600 dark:text-gray-400'}`}>
            {product.stockQuantity > 0 ? `${product.stockQuantity} left` : 'Out of stock'}
          </span>
        </div>

        {/* Add to Cart */}
        {!isOutOfStock && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={quantity >= product.stockQuantity}
              >
                +
              </button>
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              variant={addedToCart ? 'success' : 'primary'}
              className="flex-1"
              size="md"
            >
              {addedToCart ? '✓ Added!' : 'Add to Cart'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;