import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/firebase';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getUserOrders(currentUser.uid);
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'primary';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
        <a href="/shop" className="text-blue-600 hover:underline">Start Shopping</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500">
                  {order.createdAt?.toDate().toLocaleDateString()}
                </p>
              </div>
              <Badge variant={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
