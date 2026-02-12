import { auth, db, storage } from '../firebase-config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// ==================== AUTH SERVICES ====================
export const authService = {
  // Register new user
  register: async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'customer',
        createdAt: serverTimestamp()
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user role
  getUserRole: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }
};

// ==================== PRODUCT SERVICES ====================
export const productService = {
  // Get all products with pagination
  getProducts: async (categoryId = null, lastDoc = null, pageLimit = 12) => {
    try {
      let q = collection(db, 'products');
      let constraints = [orderBy('createdAt', 'desc')];
      
      if (categoryId) {
        constraints.push(where('categoryId', '==', categoryId));
      }
      
      constraints.push(limit(pageLimit));
      
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }
      
      q = query(q, ...constraints);
      const snapshot = await getDocs(q);
      
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      return {
        products,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  // Get single product
  getProductById: async (productId) => {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  },

  // Add product (admin only)
  addProduct: async (productData, imageFile) => {
    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        imageUrl,
        stockQuantity: Number(productData.stockQuantity),
        price: Number(productData.price),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product (admin only)
  updateProduct: async (productId, productData, imageFile = null) => {
    try {
      const updateData = { ...productData, updatedAt: serverTimestamp() };
      
      // Upload new image if provided
      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        updateData.imageUrl = await getDownloadURL(storageRef);
      }
      
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, updateData);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (admin only)
  deleteProduct: async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

// ==================== CATEGORY SERVICES ====================
export const categoryService = {
  getCategories: async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  },

  addCategory: async (categoryData) => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...categoryData,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  }
};

// ==================== ORDER SERVICES ====================
export const orderService = {
  // Create new order
  createOrder: async (orderData, cartItems) => {
    try {
      // Create order
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Create order items and update inventory
      const orderItemsPromises = cartItems.map(async (item) => {
        await addDoc(collection(db, 'orderItems'), {
          orderId: orderRef.id,
          productId: item.id,
          quantity: item.quantity,
          priceAtOrder: item.price,
          createdAt: serverTimestamp()
        });
        
        // Update product stock
        const productRef = doc(db, 'products', item.id);
        await updateDoc(productRef, {
          stockQuantity: item.stockQuantity - item.quantity
        });
      });
      
      await Promise.all(orderItemsPromises);
      
      return { orderId: orderRef.id, success: true };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Get user orders
  getUserOrders: async (userId) => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  },

  // Get all orders (admin only)
  getAllOrders: async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  },

  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Get order items
  getOrderItems: async (orderId) => {
    try {
      const q = query(collection(db, 'orderItems'), where('orderId', '==', orderId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error('Error getting order items:', error);
      throw error;
    }
  }
};