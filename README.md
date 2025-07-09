# Dahlia Dreams - Premium Flower Shop

A beautiful, responsive website dedicated to selling premium dahlia flowers. Built with HTML, CSS, JavaScript, and powered by Google Firebase for authentication and database management.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Product Showcase**: 10 different dahlia flower varieties with detailed descriptions
- **Stock Management**: Real-time stock status for each flower
- **Firebase Authentication**: Secure user registration and login system
- **Firestore Database**: Cloud-based product and order management
- **Real-time Updates**: Live product and order status updates
- **Modern UI**: Beautiful gradients, animations, and hover effects
- **Contact Form**: Easy way for customers to get in touch
- **Smooth Navigation**: Seamless scrolling and mobile-friendly menu

## Flower Collection

The website showcases 10 premium dahlia varieties:

1. **Cafe au Lait** - Creamy blush-pink dinner plate dahlia
2. **Bishop of Llandaff** - Classic red dahlia with dark foliage
3. **Thomas Edison** - Magnificent purple dahlia
4. **Arabian Night** - Dark red velvety dahlia
5. **Pompon** - Small round pink dahlia
6. **Karma Choc** - Dark red with chocolate undertones
7. **White Aster** - Pure white daisy-like dahlia
8. **Firepot** - Vibrant orange with red tips
9. **Lavender Perfection** - Soft lavender dahlia
10. **Yellow Hammer** - Bright yellow golden dahlia

## How to Run

### Option 1: Quick Start (Static Version)
1. **Download/Clone** the project files to your local machine
2. **Open** `index.html` in your web browser
   - Double-click the file, or
   - Right-click and select "Open with" your preferred browser
3. **Enjoy** browsing the beautiful flower collection!

### Option 2: Full Firebase Setup
1. **Follow the Firebase setup guide** in `FIREBASE_SETUP.md`
2. **Configure Firebase** by updating `firebase-config.js` with your project credentials
3. **Run locally** with Firebase CLI: `npm start` or `firebase serve`
4. **Deploy to Firebase Hosting**: `npm run deploy` or `firebase deploy`

## File Structure

```
demo/
├── index.html              # Main HTML file
├── styles.css              # CSS styles and animations
├── script.js               # Main JavaScript functionality
├── firebase-config.js      # Firebase configuration
├── firebase-auth.js        # Firebase authentication service
├── firebase-db.js          # Firebase database service
├── firebase.json           # Firebase hosting configuration
├── package.json            # Node.js dependencies
├── FIREBASE_SETUP.md       # Firebase setup guide
└── README.md               # This file
```

## Features in Detail

### Navigation
- Fixed navigation bar with smooth scrolling
- Mobile-responsive hamburger menu
- Beautiful hover effects and transitions

### Hero Section
- Eye-catching gradient background
- Animated floating flower elements
- Call-to-action button

### Product Showcase
- Grid layout with responsive design
- Product cards with images, descriptions, and prices
- Stock status indicators (In Stock/Out of Stock)
- Add to Cart functionality with notifications

### Sign In Modal
- Clean, modern authentication interface
- Form validation
- Remember me option
- Forgot password link

### Contact Section
- Contact information with icons
- Contact form with validation
- Responsive layout

### Footer
- Company information
- Quick links
- Social media links
- Copyright notice

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Customization

### Adding More Flowers
To add more flowers, edit the `dahliaProducts` array in `script.js`:

```javascript
{
    id: 11,
    name: "New Flower Name",
    description: "Description of the new flower...",
    price: "$XX.XX",
    inStock: true,
    image: "🌺"
}
```

### Changing Colors
The website uses a pink/rose color scheme. To change colors, modify the CSS variables in `styles.css`:

```css
/* Main brand colors */
--primary-color: #e91e63;
--secondary-color: #ff6b9d;
```

### Modifying Content
- Update flower information in `script.js`
- Change company details in `index.html`
- Modify contact information in the contact section

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality
- **Google Firebase**: Authentication and database
- **Firestore**: NoSQL cloud database
- **Font Awesome**: Icons
- **Google Fonts**: Typography (Playfair Display & Poppins)

## Performance Features

- Optimized images and animations
- Smooth scrolling and transitions
- Responsive design for all devices
- Fast loading times

## Future Enhancements

Potential features that could be added:
- Shopping cart functionality
- User registration system
- Payment integration
- Flower filtering and search
- Wishlist feature
- Customer reviews
- Newsletter signup
- Blog section

## Support

For any questions or issues, please check the code comments or refer to this README file.

---

**Enjoy your beautiful Dahlia Dreams flower shopping experience! 🌸** 