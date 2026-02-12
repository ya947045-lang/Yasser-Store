import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';

export const useFirestore = (collectionName) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, collectionName));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setDocuments(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { documents, loading, error };
};
