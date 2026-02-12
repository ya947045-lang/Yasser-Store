rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && (isOwner(userId) || isAdmin());
      allow write: if request.auth != null && isOwner(userId);
      allow create: if request.auth != null;
      allow delete: if isAdmin();
    }
    
    // Categories collection
    match /categories/{category} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Products collection
    match /products/{product} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Orders collection
    match /orders/{order} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Order items collection
    match /orderItems/{item} {
      allow read: if request.auth != null && 
        (get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.userId == request.auth.uid || 
         isAdmin());
      allow write: if isAdmin();
    }
  }
}