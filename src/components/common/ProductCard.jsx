import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity <= 5 && product.stockQuantity > 0;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {isOutOfStock && <Badge variant="error">Out of Stock</Badge>}
        {isLowStock && <Badge variant="warning">Low Stock</Badge>}
        {product.isNew && <Badge variant="success">New</Badge>}
      </div>

      <Link to={`/product/${product.id}`} className="block relative pt-[100%] bg-gray-100">
        <img
          src={imageError ? '/placeholder-image.jpg' : product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
      </Link>

      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm ${isLowStock ? 'text-orange-500' : 'text-gray-600'}`}>
            {product.stockQuantity > 0 ? `${product.stockQuantity} left` : 'Out of stock'}
          </span>
        </div>

        {!isOutOfStock && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center border-2 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
                disabled={quantity <= 1}
              >-</button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100"
                disabled={quantity >= product.stockQuantity}
              >+</button>
            </div>
            <Button
              onClick={handleAddToCart}
              variant={added ? 'success' : 'primary'}
              className="flex-1"
            >
              {added ? '✓ Added!' : 'Add to Cart'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
