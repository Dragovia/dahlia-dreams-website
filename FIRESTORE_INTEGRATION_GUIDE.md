# Firestore Integration Guide for Dahlia Dreams

This guide explains how Firestore is integrated with your Dahlia Dreams flower shop project and how to use all the database features.

## Overview

Your project now has a complete Firestore integration that provides:

- **Product Management** - Store and retrieve flower products
- **Shopping Cart** - User-specific cart functionality
- **Order Management** - Create and track orders
- **User Profiles** - Store user information
- **Real-time Updates** - Live data synchronization

## Database Structure

### Collections

1. **`products`** - Flower product information
2. **`orders`** - Customer orders
3. **`users`** - User profiles
4. **`cart`** - Shopping cart items per user

### Product Document Structure

```javascript
{
  name: "Cafe au Lait",
  description: "A stunning dinner plate dahlia...",
  price: 12.99,
  inStock: true,
  image: "🌺",
  category: "dinner-plate",
  colors: ["cream", "pink"],
  season: "late-summer",
  createdAt: Date,
  updatedAt: Date
}
```

### Order Document Structure

```javascript
{
  userId: "user123",
  items: [
    {
      productId: "product123",
      quantity: 2,
      price: 12.99
    }
  ],
  total: 25.98,
  status: "pending", // pending, processing, shipped, delivered
  shippingAddress: {...},
  createdAt: Date,
  updatedAt: Date
}
```

## Available Functions

### Product Operations

```javascript
// Get all products
const products = await window.firebaseDB.getProducts();

// Get a specific product
const product = await window.firebaseDB.getProduct('productId');

// Add a new product (admin)
const productId = await window.firebaseDB.addProduct(productData);

// Update a product (admin)
await window.firebaseDB.updateProduct('productId', updateData);

// Delete a product (admin)
await window.firebaseDB.deleteProduct('productId');

// Get products by category
const dinnerPlateDahlias = await window.firebaseDB.getProductsByCategory('dinner-plate');

// Search products
const searchResults = await window.firebaseDB.searchProducts('cafe');
```

### Cart Operations

```javascript
// Get user's cart
const cartItems = await window.firebaseDB.getCart(userId);

// Add item to cart
await window.firebaseDB.addToCart(userId, productId, quantity);

// Update cart item quantity
await window.firebaseDB.updateCartItem(userId, productId, newQuantity);

// Remove item from cart
await window.firebaseDB.removeFromCart(userId, productId);

// Clear entire cart
await window.firebaseDB.clearCart(userId);

// Get cart with product details
const cartWithProducts = await window.firebaseDB.getCartWithProducts(userId);
```

### Order Operations

```javascript
// Create a new order
const orderId = await window.firebaseDB.createOrder(userId, orderData);

// Get user's orders
const userOrders = await window.firebaseDB.getUserOrders(userId);

// Get all orders (admin)
const allOrders = await window.firebaseDB.getAllOrders();

// Update order status
await window.firebaseDB.updateOrderStatus(orderId, 'shipped');
```

### User Operations

```javascript
// Create/update user profile
await window.firebaseDB.createUserProfile(userId, userData);

// Get user profile
const profile = await window.firebaseDB.getUserProfile(userId);

// Update user profile
await window.firebaseDB.updateUserProfile(userId, updateData);
```

## How to Use in Your Code

### 1. Adding Products to Cart

The cart functionality is already integrated into your product cards. When a user clicks "Add to Cart":

1. Checks if user is authenticated
2. Adds item to their Firestore cart
3. Shows success notification
4. Updates cart display

### 2. Creating Orders

```javascript
// Example: Create an order from cart
async function createOrderFromCart(userId, shippingAddress) {
    try {
        const cartItems = await window.firebaseDB.getCartWithProducts(userId);
        
        const orderData = {
            items: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price
            })),
            total: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
            shippingAddress: shippingAddress
        };
        
        const orderId = await window.firebaseDB.createOrder(userId, orderData);
        return orderId;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}
```

### 3. User Authentication Integration

When a user signs up or signs in, you can automatically create/update their profile:

```javascript
// In your auth success handler
async function onAuthSuccess(user) {
    try {
        // Create user profile
        await window.firebaseDB.createUserProfile(user.uid, {
            email: user.email,
            displayName: user.displayName || '',
            createdAt: new Date()
        });
        
        // Load user's cart
        await updateCartDisplay();
    } catch (error) {
        console.error('Error setting up user profile:', error);
    }
}
```

## Setting Up Firestore Rules

For security, you'll need to set up Firestore security rules. Here's a basic example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - anyone can read, only admins can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Cart - users can only access their own cart
    match /cart/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders - users can read/write their own orders, admins can read all
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.token.admin == true);
    }
    
    // Users - users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Emulator Setup

To use Firestore locally with emulators:

1. **Start emulators**:
   ```bash
   npm run emulators
   ```

2. **Access Emulator UI**: `http://localhost:4000`

3. **View Firestore data**: Go to the "Firestore" tab in the emulator UI

4. **Add test data**: Use the emulator UI to add sample products and test the functionality

## Best Practices

### 1. Error Handling

Always wrap Firestore operations in try-catch blocks:

```javascript
try {
    const products = await window.firebaseDB.getProducts();
    // Handle success
} catch (error) {
    console.error('Error loading products:', error);
    // Handle error (show notification, fallback data, etc.)
}
```

### 2. Loading States

Show loading indicators during database operations:

```javascript
async function loadProducts() {
    showLoadingSpinner();
    try {
        const products = await window.firebaseDB.getProducts();
        displayProducts(products);
    } catch (error) {
        showErrorMessage('Failed to load products');
    } finally {
        hideLoadingSpinner();
    }
}
```

### 3. Real-time Updates

For real-time data, you can use Firestore listeners:

```javascript
// Listen for product changes
function listenToProducts() {
    window.firebaseDB.productsRef.onSnapshot((snapshot) => {
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        displayProducts(products);
    });
}
```

### 4. Data Validation

Validate data before saving to Firestore:

```javascript
function validateProduct(product) {
    if (!product.name || !product.price) {
        throw new Error('Product name and price are required');
    }
    if (product.price <= 0) {
        throw new Error('Price must be greater than 0');
    }
    return true;
}
```

## Troubleshooting

### Common Issues

1. **"Firebase DB not available"**
   - Make sure `firebase-db.js` is loaded after `firebase-config.js`
   - Check that Firebase is properly initialized

2. **Permission denied errors**
   - Check Firestore security rules
   - Ensure user is authenticated for protected operations

3. **Data not loading**
   - Check browser console for errors
   - Verify Firestore rules allow read access
   - Check if emulators are running (if using local development)

### Debug Tips

1. **Check console logs** for detailed error messages
2. **Use Emulator UI** to inspect data and operations
3. **Test with simple operations** first before complex queries
4. **Verify authentication state** before performing user-specific operations

## Next Steps

1. **Set up Firestore security rules** in your Firebase console
2. **Add more product data** using the emulator UI or admin functions
3. **Implement order checkout flow** using the cart and order functions
4. **Add real-time updates** for inventory and order status
5. **Create admin interface** for managing products and orders

Your Firestore integration is now complete and ready for development and testing! 