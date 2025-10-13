# East at West - Fusion Restaurant Website

A modern, responsive restaurant website built with Next.js, featuring a fusion of Eastern and Western cuisines. The website includes multilingual support, dark/light mode toggle, and a complete restaurant management system.

## 🌟 Features

### ✅ Core Features
- **Multilingual Support**: English, French, and Dutch translations
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **Responsive Design**: Fully responsive across all devices
- **Modern UI**: Clean, professional design with smooth animations
- **SEO Optimized**: Meta tags, structured data, and performance optimized

### 📱 Pages
- **Home**: Hero section, features, and call-to-action
- **Menu**: Categorized menu items with descriptions and pricing
- **Reservations**: Online booking form with validation
- **Take Away**: Delivery and pickup information

### 🎨 Design Features
- **Smooth Animations**: CSS animations and transitions
- **Interactive Elements**: Hover effects and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation
- **Custom Styling**: Tailwind CSS with custom components

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Internationalization**: next-i18next
- **Language**: TypeScript/JavaScript
- **State Management**: React Context API
- **Icons**: Heroicons (SVG)

## 📁 Project Structure

```
eastatwest/
├── public/
│   ├── images/               # Restaurant images, icons, logos
│   │   ├── locales/
│   │   │   ├── en/               # English translations
│   │   │   │   └── common.json
│   │   │   ├── fr/               # French translations
│   │   │   │   └── common.json
│   │   │   └── nl/               # Dutch translations
│   │   │       └── common.json
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   └── ThemeToggle.jsx
│   │   │
│   │   ├── pages/                # Page components
│   │   │   ├── index.jsx         # Home page
│   │   │   ├── menu.jsx          # Menu page
│   │   │   ├── reservations.jsx  # Reservations page
│   │   │   └── takeaway.jsx      # Take Away page
│   │   │
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── page.tsx          # Home route
│   │   │   ├── menu/page.tsx     # Menu route
│   │   │   ├── reservations/page.tsx
│   │   │   └── takeaway/page.tsx
│   │   │
│   │   ├── context/              # Context providers
│   │   │   ├── ThemeContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   │
│   │   └── styles/
│   │       └── globals.css       # Global styles
│   │
│   ├── tailwind.config.ts        # Tailwind configuration
│   │
│   ├── next.config.js            # Next.js configuration
│   └── next-i18next.config.js    # i18n configuration
│
└── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd eastatwest
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Internationalization

The website supports three languages:
- **English** (default)
- **French** (Français)
- **Dutch** (Nederlands)

### Adding New Languages

1. Create a new folder in `public/locales/[language-code]/`
2. Add a `common.json` file with translations
3. Update `next-i18next.config.js` to include the new locale

### Translation Structure

```json
{
  "nav": {
    "home": "Home",
    "menu": "Menu",
    "reservations": "Reservations",
    "takeaway": "Take Away"
  },
  "home": {
    "title": "East at West",
    "subtitle": "Where East Meets West in Every Bite"
  }
}
```

## 🎨 Customization

### Colors
The primary color scheme uses orange and red gradients. You can customize colors in:
- `tailwind.config.ts` - Primary color palette
- `src/styles/globals.css` - Custom CSS variables

### Styling
- **Tailwind Classes**: Use utility classes for styling
- **Custom Components**: Pre-built components in `src/components/`
- **Animations**: Custom keyframes in `globals.css`

### Content
- **Menu Items**: Update in translation files and page components
- **Contact Information**: Modify in translation files
- **Images**: Add to `public/images/` directory

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npm run type-check   # Check TypeScript types
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
```bash
npm run build
npm run start
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, please contact:
- Email: contact@eastatwest.com
- Phone: +32 496 93 57 45

---

**East at West** - Where East meets West in every bite! 🍽️
=======
# resteast
restaurant app
>>>>>>> ae519e4123bf4c70866caad8df896ac419369840
# eastatwest4
# eastatwest4
echo # eastatwest8
