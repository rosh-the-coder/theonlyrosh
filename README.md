# 🚀 Roshan Najar - Advanced Portfolio

A cutting-edge, interactive portfolio website built with Next.js 14, featuring advanced animations, 3D graphics, and immersive user experiences.

## ✨ Features

### 🎨 **Advanced Animations & Interactions**
- **Framer Motion** powered smooth animations
- **GSAP** for complex scroll-triggered animations
- **Three.js** 3D graphics with Unicorn Studio-style effects
- **Parallax scrolling** effects throughout
- **Magnetic hover** effects on interactive elements
- **Text reveal** animations with staggered timing

### 🎯 **Interactive Elements**
- **Custom cursor** with magnetic effects and hover states
- **Horizontal mouse tracking** in hero section
- **Sticky scroll sections** that expand to full screen
- **Music player** with toggle functionality and visualizer
- **Interactive project showcases** with hover effects

### 🎮 **3D & Visual Effects**
- **3D floating spheres** with distortion materials
- **Interactive background particles** that respond to mouse movement
- **Gradient overlays** and backdrop blur effects
- **Floating elements** with continuous animations
- **Glow effects** and dynamic shadows

### 📱 **Responsive Design**
- **Mobile-first** approach
- **Fully responsive** across all devices
- **Touch-friendly** interactions
- **Optimized performance** for mobile devices

### 🚀 **Performance Features**
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for utility-first styling
- **Optimized animations** with proper cleanup
- **Lazy loading** and code splitting

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js, React Three Fiber
- **Icons**: Lucide React
- **Build Tool**: Vite (via Next.js)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd rosh-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page component
│   ├── globals.css        # Global styles and animations
│   └── providers.tsx      # Context providers
├── components/            # React components
│   ├── Hero/             # Hero section with 3D effects
│   ├── Navigation/       # Navigation bar
│   ├── Sections/         # Content sections
│   │   ├── About.tsx     # About section
│   │   ├── Work.tsx      # Work/projects section
│   │   ├── Skills.tsx    # Skills section
│   │   ├── Experience.tsx # Experience timeline
│   │   └── Contact.tsx   # Contact form
│   └── UI/               # Reusable UI components
│       ├── CustomCursor.tsx  # Custom cursor
│       └── MusicPlayer.tsx   # Music player
└── hooks/                 # Custom React hooks
    └── useIntersectionObserver.ts
```

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.js` to customize:
- Primary colors
- Accent colors
- Animation timings
- Custom animations

### Content
Update content in each section component:
- Personal information
- Project details
- Skills and experience
- Contact information

### 3D Elements
Modify 3D scenes in `Hero.tsx`:
- Sphere properties
- Material settings
- Animation parameters
- Lighting setup

## 🎯 Key Features Explained

### 1. **Hero Section with 3D Animations**
- Interactive 3D spheres using Three.js
- Mouse tracking for particle movement
- GSAP-powered text animations
- Smooth scroll transitions

### 2. **Horizontal Project Scrolling**
- Touch-friendly horizontal scroll
- Project navigation dots
- Smooth scroll snapping
- Interactive project cards

### 3. **Advanced Skill Animations**
- Animated skill bars with progress
- Staggered reveal animations
- Interactive hover effects
- Dynamic color coding

### 4. **Custom Cursor System**
- Magnetic hover effects
- Dynamic scaling and rotation
- Context-aware interactions
- Smooth spring animations

### 5. **Music Player**
- Ambient background music
- Volume control with slider
- Visual audio feedback
- Hover tooltips

## 🔧 Performance Optimization

- **Intersection Observer** for scroll animations
- **Proper cleanup** of event listeners
- **Optimized 3D rendering** with proper disposal
- **Lazy loading** of heavy components
- **CSS transforms** for smooth animations

## 📱 Mobile Optimization

- **Touch-friendly** interactions
- **Responsive breakpoints** for all screen sizes
- **Optimized animations** for mobile devices
- **Custom cursor** hidden on mobile
- **Touch gestures** for project navigation

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Build command: `npm run build`
- **AWS Amplify**: Build settings in console
- **Custom server**: Build and serve static files

## 🎨 Design System

### Color Palette
- **Primary**: #000000 (Black)
- **Secondary**: #ffffff (White)
- **Accent**: #ff6b6b (Coral Red)
- **Dark Gray**: #1a1a1a
- **Light Gray**: #f5f5f5

### Typography
- **Primary**: Inter (Sans-serif)
- **Monospace**: JetBrains Mono
- **Display**: Clash Display

### Spacing
- **Base unit**: 4px
- **Container max-width**: 1280px
- **Section padding**: 80px (mobile: 40px)

## 🔮 Future Enhancements

- [ ] **WebGL shaders** for advanced effects
- [ ] **Physics simulations** for interactive elements
- [ ] **Audio reactive** animations
- [ ] **VR/AR** integration
- [ ] **Multi-language** support
- [ ] **Dark/Light** theme toggle

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support or questions:
- **Email**: hello@theonlyrosh.com
- **Portfolio**: [theonlyrosh.com](https://theonlyrosh.com)
- **LinkedIn**: [roshannajar](https://linkedin.com/in/roshannajar)

---

**Built with ❤️ by Roshan Najar** - A multidisciplinary UX/UI designer, creative developer, and digital storyteller based in Dublin, Ireland.
