import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/firebase';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img
            src={product.imageUrl || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="mb-4">
            {product.isNew && <Badge variant="success" className="mr-2">New Arrival</Badge>}
            {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
              <Badge variant="warning">Only {product.stockQuantity} left</Badge>
            )}
          </div>
          
          <p className="text-4xl font-bold text-blue-600 mb-6">
            ${product.price.toFixed(2)}
          </p>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {product.description}
          </p>
          
          {product.stockQuantity > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border-2 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >-</button>
                  <span className="w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                    disabled={quantity >= product.stockQuantity}
                  >+</button>
                </div>
              </div>
              
              <Button
                onClick={handleAddToCart}
                variant={added ? 'success' : 'primary'}
                size="lg"
                className="w-full md:w-auto"
              >
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </Button>
            </div>
          ) : (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              This product is currently out of stock.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
