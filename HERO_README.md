# WebGL Hero Section

A high-performance hero section with WebGL2-based image reveal effects, built for Next.js 14 with TypeScript.

## Features

- **WebGL2 Reveal Effect**: Mouse/touch reveals a hidden background portrait with water ripple distortion and chromatic aberration
- **Performance Optimized**: 60fps smooth rendering with DPR capping and ping-pong framebuffers
- **Accessibility**: Respects `prefers-reduced-motion` and includes proper ARIA labels
- **Mobile Support**: Touch-friendly with optimized performance
- **Fallback Mode**: Graceful degradation for non-WebGL browsers
- **Configurable**: Easy-to-tweak parameters for different effects

## Usage

The hero section is already integrated into your app at `/src/components/Hero/Hero.tsx`. It uses the `GlRevealCanvas` component for the WebGL effects.

### Replacing the Placeholder Image

1. Replace `/public/rosh-placeholder.svg` with your portrait image
2. Update the `imageSrc` prop in `Hero.tsx`:
   ```tsx
   <GlRevealCanvas
     imageSrc="/your-portrait.jpg"  // Change this
     name="ROSHAN"
     subtitle="Creative Developer & Designer"
   />
   ```

### Configuration Options

The `GlRevealCanvas` component accepts a `config` prop with these options:

```tsx
const config = {
  brushRadiusPxAt1440: 130,        // Brush size at 1440px width
  brushStrength: 0.9,              // Opacity of brush strokes
  decay: 0.975,                    // Trail fade speed (0.96-0.985)
  rippleAmplitudePxAt1440: 2.2,    // Ripple distortion strength
  rippleFrequency: 26.0,           // Ripple wave frequency
  rippleDamping: 2.4,              // Ripple fade speed
  chromaticAberrationUV: 0.0022,   // RGB channel separation
  maxDPR: 1.75,                    // Maximum device pixel ratio
  blendMode: 'screen',             // 'normal' | 'screen'
  clipToText: false,               // Confine reveal to text shape
}
```

### Performance Settings

- **HD Mode**: Higher quality, more GPU intensive
- **Low Mode**: Lower quality, better performance on mobile
- Toggle via the settings button in the top-right corner

### Accessibility

- Respects `prefers-reduced-motion` - shows static blurred background
- Canvas is marked `aria-hidden="true"`
- Text remains in DOM for screen readers
- Semantic HTML structure maintained

## Technical Details

### WebGL2 Shaders

The effect uses two main shader passes:

1. **Mask Pass**: Accumulates pointer trails with decay
2. **Composite Pass**: Applies ripple distortion and chromatic aberration

### Performance Optimizations

- Ping-pong framebuffers for smooth trail accumulation
- DPR capping to prevent excessive GPU load
- Throttled resize handling
- Efficient pointer tracking with age-based cleanup

### Browser Support

- **WebGL2**: Full interactive experience
- **Fallback**: Static blurred background image
- **Mobile**: Touch-optimized with performance scaling

## Customization

### Text Styling

The hero text uses custom CSS with layered text-shadow for the neon effect:

```css
color: #FF5353;
text-shadow: 
  2px 2px 0px #0C2740,
  -2px -2px 0px #0C2740,
  2px -2px 0px #0C2740,
  -2px 2px 0px #0C2740,
  0 0 6px #FF4949,
  0 0 8px #FF4949,
  0 0 10px #FF4949;
```

### Colors

- Background: `#0B0B0B` (deep black)
- Text: `#FF5353` (neon coral)
- Text stroke: `#0C2740` (deep navy)
- Text glow: `#FF4949` (red glow)

## Troubleshooting

### WebGL Not Working
- Check browser WebGL2 support
- Verify image loads correctly
- Check console for shader compilation errors

### Performance Issues
- Lower `maxDPR` value
- Reduce `brushRadiusPxAt1440`
- Enable "Low" mode in settings

### Image Not Loading
- Ensure image is in `/public` directory
- Check file format (JPG, PNG, SVG supported)
- Verify CORS settings for external images
