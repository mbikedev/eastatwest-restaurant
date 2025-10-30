# Video Setup Guide for East at West Homepage

## Overview
The new homepage features a full-screen hero video background that showcases the restaurant's ambiance, cuisine, and dining experience.

## Video Requirements

### Technical Specifications
- **Format**: MP4 (primary) and WebM (fallback)
- **Resolution**: Minimum 1920x1080 (Full HD), 4K recommended for best quality
- **Aspect Ratio**: 16:9
- **Duration**: 30-60 seconds for optimal loading and looping
- **File Size**: Optimized for web (target under 10MB for MP4)
- **Compression**: H.264 codec for MP4, VP9 for WebM

### Content Guidelines
The video should include the following shots:

1. **Close-up shots of signature dishes being plated**
   - Focus on the artistry and presentation
   - Show colorful, appetizing Mediterranean dishes
   - Include hands of chefs plating food

2. **Drinks being poured**
   - Wine being poured into glasses
   - Cocktails being prepared
   - Steam rising from hot beverages

3. **Chefs at work**
   - Chef Hanna cooking in the kitchen
   - Food preparation techniques
   - Kitchen atmosphere and teamwork

4. **Restaurant ambiance**
   - Interior shots of dining areas
   - Guests enjoying their meals
   - Elegant table settings
   - Warm lighting and atmosphere

### Audio Considerations
- **Background Music**: Optional ambient Mediterranean music
- **Sound Effects**: Natural kitchen sounds, gentle conversation
- **Volume**: Should be subtle and not overpowering
- **Mute Option**: Users can toggle audio on/off

## File Structure
Place video files in the following directory:
```
public/
└── videos/
    ├── hero-video.mp4      # Primary video file
    ├── hero-video.webm     # Fallback for better browser support
    └── hero-poster.jpg     # Poster image shown before video loads
```

## Implementation Features

### Current Implementation
- ✅ Full-screen video background
- ✅ Automatic looping
- ✅ Mute/unmute toggle
- ✅ Fallback poster image
- ✅ Loading state with spinner
- ✅ Responsive design
- ✅ Cross-browser compatibility

### Video Controls
- **Autoplay**: Enabled (muted by default for browser compatibility)
- **Loop**: Seamless continuous playback
- **Controls**: Hidden (only mute/unmute button visible)
- **Preload**: Metadata loaded for faster start

### Performance Optimization
- **Lazy Loading**: Video loads after critical content
- **Compression**: Optimized file sizes for web delivery
- **Format Support**: Multiple formats for browser compatibility
- **Fallback**: Static image if video fails to load

## Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features
- **Reduced Motion**: Respects user preferences for reduced motion
- **Keyboard Navigation**: Mute button accessible via keyboard
- **Screen Readers**: Proper ARIA labels for controls
- **High Contrast**: Text overlay maintains readability

## Content Management
The video content can be easily updated by:
1. Replacing files in `/public/videos/` directory
2. Ensuring same naming convention
3. Maintaining technical specifications
4. Testing across different devices and browsers

## Future Enhancements
- **Multiple Videos**: Rotate different videos based on time/season
- **Dynamic Content**: CMS integration for easy video updates
- **Analytics**: Track video engagement and performance
- **Optimization**: Further compression and CDN delivery

## Troubleshooting

### Video Not Playing
1. Check file formats and naming
2. Verify file sizes aren't too large
3. Test autoplay policies in different browsers
4. Ensure proper MIME types are set

### Performance Issues
1. Compress video files further
2. Consider reducing resolution for mobile
3. Implement progressive loading
4. Use CDN for video delivery

### Mobile Considerations
- Some mobile browsers may not autoplay videos
- Poster image provides good fallback experience
- Touch-friendly mute/unmute button
- Optimized for mobile data usage

## Contact
For technical support or video production questions, contact the development team. 