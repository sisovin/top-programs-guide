# PHP Web Assets Guide

## Directory Structure

```
php-web/
└── assets/
    └── images/
        ├── favicon.ico (16x16, 32x32, 48x48)
        ├── apple-touch-icon.png (180x180)
        ├── og-image.jpg (1200x630) - Open Graph image
        ├── twitter-image.jpg (1200x675) - Twitter Card image
        └── logo.png (512x512) - Main logo
```

## Image Requirements

### favicon.ico

- Multi-resolution ICO file
- Sizes: 16x16, 32x32, 48x48
- Format: ICO
- Purpose: Browser tab icon

### apple-touch-icon.png

- Size: 180x180 pixels
- Format: PNG
- Purpose: iOS home screen icon

### og-image.jpg

- Size: 1200x630 pixels
- Format: JPEG or PNG
- Purpose: Open Graph (Facebook, LinkedIn) preview
- Content: Should include branding, title, and visual appeal

### twitter-image.jpg

- Size: 1200x675 pixels (16:9 ratio)
- Format: JPEG or PNG
- Purpose: Twitter Card preview
- Content: Similar to og-image but 16:9 aspect ratio

### logo.png

- Size: 512x512 pixels
- Format: PNG with transparency
- Purpose: Schema.org structured data, general branding
- Content: Main application logo

## Creating Images

You can use tools like:

- Canva (online, free tier available)
- Figma (online, free)
- Adobe Photoshop/Illustrator
- GIMP (free, desktop)
- Inkscape (free, desktop)

Or generate with AI:

- DALL-E
- Midjourney
- Stable Diffusion

## Image Optimization

Before uploading, optimize images:

- Use TinyPNG or ImageOptim for compression
- Ensure proper dimensions
- Keep file sizes under 200KB for social media images
- Use progressive JPEG for faster loading

## Temporary Placeholders

Until custom images are created, you can use:

- favicon.io for generating favicons from text/emoji
- placeholder.com for temporary images
- Unsplash for free stock photos (with attribution)
