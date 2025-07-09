// Firestore Database Service for Dahlia Dreams
class FirebaseDB {
    constructor() {
        this.db = window.db;
        this.auth = window.auth;
        
        // Collection references
        this.productsRef = this.db.collection('products');
        this.ordersRef = this.db.collection('orders');
        this.usersRef = this.db.collection('users');
        this.cartRef = this.db.collection('cart');
    }

    // ===== PRODUCTS =====
    
    // Get all products
    async getProducts() {
        try {
            const snapshot = await this.productsRef.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting products:', error);
            throw error;
        }
    }

    // Get a single product by ID
    async getProduct(productId) {
        try {
            const doc = await this.productsRef.doc(productId).get();
            if (doc.exists) {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting product:', error);
            throw error;
        }
    }

    // Add a new product (admin only)
    async addProduct(productData) {
        try {
            const docRef = await this.productsRef.add({
                ...productData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    // Update a product (admin only)
    async updateProduct(productId, updateData) {
        try {
            await this.productsRef.doc(productId).update({
                ...updateData,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Delete a product (admin only)
    async deleteProduct(productId) {
        try {
            await this.productsRef.doc(productId).delete();
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    // Initialize sample products
    async initializeSampleProducts() {
        const sampleProducts = [
            {
                name: "Cafe au Lait",
                description: "A stunning dinner plate dahlia with creamy, blush-pink petals that fade to a soft coffee color. Perfect for elegant arrangements and wedding bouquets.",
                price: 12.99,
                inStock: true,
                image: "🌺",
                category: "dinner-plate",
                colors: ["cream", "pink"],
                season: "late-summer"
            },
            {
                name: "Bishop of Llandaff",
                description: "A classic red dahlia with dark foliage and vibrant scarlet flowers. This variety is known for its long blooming season and disease resistance.",
                price: 9.99,
                inStock: true,
                image: "🌹",
                category: "decorative",
                colors: ["red"],
                season: "summer"
            },
            {
                name: "Thomas Edison",
                description: "A magnificent purple dahlia with large, fully double flowers. The deep purple blooms are perfect for adding drama to any garden or arrangement.",
                price: 14.99,
                inStock: false,
                image: "💜",
                category: "dinner-plate",
                colors: ["purple"],
                season: "late-summer"
            },
            {
                name: "Arabian Night",
                description: "A dark red dahlia with velvety petals that appear almost black in certain lighting. This variety is highly sought after for its unique coloration.",
                price: 16.99,
                inStock: true,
                image: "🖤",
                category: "decorative",
                colors: ["dark-red", "black"],
                season: "late-summer"
            },
            {
                name: "Pompon",
                description: "Small, perfectly round dahlia flowers in bright pink. These compact blooms are ideal for borders and container gardens.",
                price: 8.99,
                inStock: true,
                image: "🌸",
                category: "pompon",
                colors: ["pink"],
                season: "summer"
            },
            {
                name: "Karma Choc",
                description: "A beautiful dark red dahlia with chocolate undertones. The flowers have a velvety texture and are perfect for cutting gardens.",
                price: 13.99,
                inStock: true,
                image: "🍫",
                category: "decorative",
                colors: ["dark-red", "chocolate"],
                season: "late-summer"
            },
            {
                name: "White Aster",
                description: "Pure white dahlia with delicate, daisy-like flowers. This variety is perfect for wedding arrangements and adds elegance to any garden.",
                price: 11.99,
                inStock: false,
                image: "⚪",
                category: "single",
                colors: ["white"],
                season: "summer"
            },
            {
                name: "Firepot",
                description: "A vibrant orange dahlia with fiery red tips. This eye-catching variety is perfect for adding warmth and energy to your garden.",
                price: 10.99,
                inStock: true,
                image: "🔥",
                category: "decorative",
                colors: ["orange", "red"],
                season: "summer"
            },
            {
                name: "Lavender Perfection",
                description: "Soft lavender dahlia with large, fully double flowers. The gentle color makes it perfect for romantic arrangements and pastel gardens.",
                price: 15.99,
                inStock: true,
                image: "💜",
                category: "dinner-plate",
                colors: ["lavender"],
                season: "late-summer"
            },
            {
                name: "Yellow Hammer",
                description: "Bright yellow dahlia with golden petals that seem to glow in the sunlight. This cheerful variety is perfect for brightening any space.",
                price: 12.99,
                inStock: true,
                image: "🌻",
                category: "decorative",
                colors: ["yellow"],
                season: "summer"
            }
        ];

        try {
            for (const product of sampleProducts) {
                await this.addProduct(product);
            }
            console.log('Sample products initialized successfully');
        } catch (error) {
            console.error('Error initializing sample products:', error);
            throw error;
        }
    }

    // ===== CART =====
    
    // Get user's cart
    async getCart(userId) {
        try {
            const doc = await this.cartRef.doc(userId).get();
            if (doc.exists) {
                return doc.data().items || [];
            }
            return [];
        } catch (error) {
            console.error('Error getting cart:', error);
            throw error;
        }
    }

    // Add item to cart
    async addToCart(userId, productId, quantity = 1) {
        try {
            const cartDoc = this.cartRef.doc(userId);
            const cart = await cartDoc.get();
            
            if (cart.exists) {
                const items = cart.data().items || [];
                const existingItem = items.find(item => item.productId === productId);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    items.push({ productId, quantity });
                }
                
                await cartDoc.update({ items, updatedAt: new Date() });
            } else {
                await cartDoc.set({
                    items: [{ productId, quantity }],
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    }

    // Update cart item quantity
    async updateCartItem(userId, productId, quantity) {
        try {
            const cartDoc = this.cartRef.doc(userId);
            const cart = await cartDoc.get();
            
            if (cart.exists) {
                const items = cart.data().items || [];
                const itemIndex = items.findIndex(item => item.productId === productId);
                
                if (itemIndex !== -1) {
                    if (quantity <= 0) {
                        items.splice(itemIndex, 1);
                    } else {
                        items[itemIndex].quantity = quantity;
                    }
                    
                    await cartDoc.update({ items, updatedAt: new Date() });
                }
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
            throw error;
        }
    }

    // Remove item from cart
    async removeFromCart(userId, productId) {
        try {
            await this.updateCartItem(userId, productId, 0);
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    }

    // Clear cart
    async clearCart(userId) {
        try {
            await this.cartRef.doc(userId).delete();
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    }

    // ===== ORDERS =====
    
    // Create a new order
    async createOrder(userId, orderData) {
        try {
            const orderRef = await this.ordersRef.add({
                userId,
                ...orderData,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            // Clear the cart after order creation
            await this.clearCart(userId);
            
            return orderRef.id;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    // Get user's orders
    async getUserOrders(userId) {
        try {
            const snapshot = await this.ordersRef
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting user orders:', error);
            throw error;
        }
    }

    // Get all orders (admin only)
    async getAllOrders() {
        try {
            const snapshot = await this.ordersRef
                .orderBy('createdAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting all orders:', error);
            throw error;
        }
    }

    // Update order status
    async updateOrderStatus(orderId, status) {
        try {
            await this.ordersRef.doc(orderId).update({
                status,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }

    // ===== USERS =====
    
    // Create or update user profile
    async createUserProfile(userId, userData) {
        try {
            await this.usersRef.doc(userId).set({
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { merge: true });
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }

    // Get user profile
    async getUserProfile(userId) {
        try {
            const doc = await this.usersRef.doc(userId).get();
            if (doc.exists) {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    }

    // Update user profile
    async updateUserProfile(userId, updateData) {
        try {
            await this.usersRef.doc(userId).update({
                ...updateData,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    // ===== UTILITY FUNCTIONS =====
    
    // Get products by category
    async getProductsByCategory(category) {
        try {
            const snapshot = await this.productsRef
                .where('category', '==', category)
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting products by category:', error);
            throw error;
        }
    }

    // Search products
    async searchProducts(searchTerm) {
        try {
            const snapshot = await this.productsRef.get();
            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return products.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }

    // Get cart with product details
    async getCartWithProducts(userId) {
        try {
            const cartItems = await this.getCart(userId);
            const cartWithProducts = [];
            
            for (const item of cartItems) {
                const product = await this.getProduct(item.productId);
                if (product) {
                    cartWithProducts.push({
                        ...item,
                        product
                    });
                }
            }
            
            return cartWithProducts;
        } catch (error) {
            console.error('Error getting cart with products:', error);
            throw error;
        }
    }
}

// Initialize and export the database service
if (typeof window !== 'undefined') {
    // Wait for Firebase to be ready
    if (window.db) {
        window.firebaseDB = new FirebaseDB();
        console.log('Firebase DB service initialized');
    } else {
        console.log('Firebase DB not available yet');
    }
} 