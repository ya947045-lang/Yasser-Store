import { auth, db } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    const adminCredential = await createUserWithEmailAndPassword(auth, 'admin@electrotech.com', 'Admin123!');
    await addDoc(collection(db, 'users'), {
      id: adminCredential.user.uid,
      name: 'Admin User',
      email: 'admin@electrotech.com',
      role: 'admin',
      createdAt: serverTimestamp()
    });
    console.log('✅ Admin user created');

    const categories = [
      { name: 'Smartphones', description: 'Latest smartphones and mobile devices' },
      { name: 'Laptops', description: 'High-performance laptops for work and gaming' },
      { name: 'Tablets', description: 'Portable tablets for entertainment and productivity' },
      { name: 'Accessories', description: 'Essential accessories for your devices' },
      { name: 'Audio', description: 'Premium headphones and speakers' },
      { name: 'Gaming', description: 'Gaming consoles and accessories' }
    ];

    const categoryRefs = [];
    for (const category of categories) {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: serverTimestamp()
      });
      categoryRefs.push({ id: docRef.id, ...category });
    }

    const products = [
      {
        name: 'iPhone 15 Pro',
        description: '6.7-inch Super Retina XDR display, A17 Pro chip, Titanium design',
        price: 1099.99,
        stockQuantity: 25,
        categoryId: categoryRefs[0].id,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch',
        isNew: true
      },
      {
        name: 'MacBook Pro 16"',
        description: 'M3 Max chip, 48GB RAM, 1TB SSD, Space Black',
        price: 2499.99,
        stockQuantity: 10,
        categoryId: categoryRefs[1].id,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-select-202310',
        isNew: true
      },
      {
        name: 'iPad Pro 12.9"',
        description: 'M2 chip, Liquid Retina XDR display, 5G capable',
        price: 1099.99,
        stockQuantity: 15,
        categoryId: categoryRefs[2].id,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-select-wifi-spacegray-202210'
      },
      {
        name: 'AirPods Pro',
        description: 'Active Noise Cancellation, Adaptive Audio, USB-C charging',
        price: 249.99,
        stockQuantity: 50,
        categoryId: categoryRefs[4].id,
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202309',
        isNew: true
      }
    ];

    for (const product of products) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    const customerCredential = await createUserWithEmailAndPassword(auth, 'customer@example.com', 'Customer123!');
    await addDoc(collection(db, 'users'), {
      id: customerCredential.user.uid,
      name: 'John Doe',
      email: 'customer@example.com',
      role: 'customer',
      createdAt: serverTimestamp()
    });

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@electrotech.com / Admin123!');
    console.log('Customer: customer@example.com / Customer123!');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};
