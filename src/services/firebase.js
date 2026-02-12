import { auth, db, storage } from '../firebase-config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
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
  addDoc
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

export const authService = {
  register: async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role: 'customer',
        createdAt: serverTimestamp()
      });
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getUserRole: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data().role : null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }
};

export const productService = {
  getProducts: async (categoryId = null, lastDoc = null, pageLimit = 12) => {
    try {
      let q = collection(db, 'products');
      let constraints = [orderBy('createdAt', 'desc')];
      if (categoryId) constraints.push(where('categoryId', '==', categoryId));
      constraints.push(limit(pageLimit));
      if (lastDoc) constraints.push(startAfter(lastDoc));
      
      q = query(q, ...constraints);
      const snapshot = await getDocs(q);
      return {
        products: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },

  getProductById: async (productId) => {
    try {
      const docSnap = await getDoc(doc(db, 'products', productId));
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  },

  addProduct: async (productData, imageFile) => {
    try {
      let imageUrl = '';
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

  updateProduct: async (productId, productData, imageFile = null) => {
    try {
      const updateData = { ...productData, updatedAt: serverTimestamp() };
      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        updateData.imageUrl = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(db, 'products', productId), updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

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

export const categoryService = {
  getCategories: async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'categories'), orderBy('name')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }
};

export const orderService = {
  createOrder: async (orderData, cartItems) => {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      await Promise.all(cartItems.map(async (item) => {
        await addDoc(collection(db, 'orderItems'), {
          orderId: orderRef.id,
          productId: item.id,
          quantity: item.quantity,
          priceAtOrder: item.price,
          createdAt: serverTimestamp()
        });
        await updateDoc(doc(db, 'products', item.id), {
          stockQuantity: item.stockQuantity - item.quantity
        });
      }));
      
      return { orderId: orderRef.id, success: true };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getUserOrders: async (userId) => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
      );
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: serverTimestamp() });
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  getOrderItems: async (orderId) => {
    try {
      const snapshot = await getDocs(query(collection(db, 'orderItems'), where('orderId', '==', orderId)));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting order items:', error);
      throw error;
    }
  }
};
