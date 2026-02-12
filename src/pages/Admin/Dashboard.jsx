import React, { useEffect, useState } from 'react';
import { orderService, productService } from '../../services/firebase';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [orders, { products }] = await Promise.all([
        orderService.getAllOrders(),
        productService.getProducts(null, null, 100)
      ]);

      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
        totalProducts: products.length,
        lowStockProducts: products.filter(p => p.stockQuantity <= 5).length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-500 text-white">
          <p className="text-blue-100 mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold">{stats.totalOrders}</h3>
        </Card>
        
        <Card className="bg-green-500 text-white">
          <p className="text-green-100 mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
        </Card>
        
        <Card className="bg-purple-500 text-white">
          <p className="text-purple-100 mb-1">Total Products</p>
          <h3 className="text-3xl font-bold">{stats.totalProducts}</h3>
        </Card>
        
        <Card className="bg-orange-500 text-white">
          <p className="text-orange-100 mb-1">Low Stock</p>
          <h3 className="text-3xl font-bold">{stats.lowStockProducts}</h3>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
