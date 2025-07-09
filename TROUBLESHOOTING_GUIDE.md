# Troubleshooting Guide - Dahlia Dreams

## Issue: Products Disappear After Sign In

### What I Fixed:

1. **Added product reload after authentication** - Products now reload automatically after sign in
2. **Enhanced error handling** - Better fallback to static data if Firebase fails
3. **Added debugging logs** - Console logs to track what's happening
4. **Ensured scrollability** - Fixed potential CSS issues that might hide products

### How to Debug:

1. **Open Browser Console** (F12 → Console tab)
2. **Sign in to your account**
3. **Look for these log messages**:
   - "Reloading products after authentication..."
   - "Loading products from Firebase..."
   - "Products loaded from Firebase: X"
   - "Products displayed successfully"

### If Products Still Don't Show:

1. **Check Console for Errors**:
   - Look for red error messages
   - Check if Firebase is connecting properly

2. **Try Force Reload**:
   - Open browser console (F12)
   - Type: `forceReloadProducts()`
   - Press Enter

3. **Check Network Tab**:
   - Open F12 → Network tab
   - Refresh the page
   - Look for failed requests to Firebase

### Common Issues and Solutions:

#### Issue 1: "Firebase DB not available"
**Solution**: Make sure you're running on localhost and Firebase is properly initialized

#### Issue 2: "Permission denied"
**Solution**: Check if you're signed in and Firestore rules allow access

#### Issue 3: "No products in database"
**Solution**: The app will automatically initialize sample products

#### Issue 4: "Products section hidden"
**Solution**: The fix ensures products section is always visible

### Manual Testing Steps:

1. **Clear browser cache** and refresh
2. **Sign out** if you're signed in
3. **Sign in again** and watch console logs
4. **Scroll down** to products section
5. **Check if products appear**

### If Still Not Working:

1. **Open browser console** (F12)
2. **Type these commands one by one**:
   ```javascript
   console.log('Firebase Auth:', !!window.firebaseAuth);
   console.log('Firebase DB:', !!window.firebaseDB);
   console.log('Products Grid:', !!document.getElementById('productsGrid'));
   ```

3. **Check the output** and let me know what you see

### Emergency Fallback:

If nothing works, you can force the static data:
```javascript
loadProducts(); // This will show the original 10 flowers
```

## Other Common Issues:

### Issue: Can't Scroll
**Solution**: The fix ensures `document.body.style.overflow = 'auto'` after authentication

### Issue: Modal Stays Open
**Solution**: The modal should close automatically after sign in

### Issue: Firebase Connection Errors
**Solution**: Check if you're running on localhost:5002 and emulators are running

## Quick Commands for Testing:

```javascript
// Check Firebase status
console.log('Auth:', !!window.firebaseAuth, 'DB:', !!window.firebaseDB);

// Force reload products
forceReloadProducts();

// Load static products
loadProducts();

// Check current products
console.log('Products in grid:', document.getElementById('productsGrid').children.length);
```

## Still Having Issues?

1. **Take a screenshot** of the browser console (F12 → Console)
2. **Note any error messages** you see
3. **Tell me what happens** when you sign in
4. **Check if the URL** shows `localhost:5002`

The fixes I made should resolve the product disappearing issue. The products will now:
- Reload automatically after sign in
- Show detailed console logs for debugging
- Fall back to static data if Firebase fails
- Ensure the page remains scrollable 