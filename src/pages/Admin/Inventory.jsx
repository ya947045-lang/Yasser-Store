import React, { useState, useEffect } from 'react';
import { productService } from '../../services/firebase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { products } = await productService.getProducts(null, null, 100);
      setProducts(products);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (productId, currentStock) => {
    try {
      await productService.updateProduct(productId, {
        stockQuantity: currentStock + 10
      });
      await loadInventory();
    } catch (error) {
      console.error('Error restocking product:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
      
      <div className="space-y-4">
        {products.map(product => (
          <Card key={product.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={product.imageUrl || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {product.id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="mb-2">
                  <Badge variant={product.stockQuantity > 10 ? 'success' : product.stockQuantity > 0 ? 'warning' : 'error'}>
                    {product.stockQuantity} units
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRestock(product.id, product.stockQuantity)}
                >
                  Restock (+10)
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminInventory;
