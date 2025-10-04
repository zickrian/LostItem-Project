# 🧪 LCP Performance Testing Guide

## 📋 Prerequisites
- Chrome DevTools
- Working internet connection
- Local development server running

## 🚀 Quick Start Testing

### 1. Start Development Server
```bash
npm run dev
```

### 2. Open Chrome DevTools
- Press `F12` or `Ctrl + Shift + I`
- Go to **Lighthouse** tab

### 3. Run Lighthouse Test
1. Select "Performance" category
2. Select "Desktop" or "Mobile"
3. Click "Analyze page load"
4. Wait for results

## 📊 Key Metrics to Check

### Core Web Vitals
| Metric | Target | Current (Before) | Expected (After) |
|--------|--------|------------------|------------------|
| **LCP** | < 2.5s | 13.09s | ~2.0-3.5s |
| **FID** | < 100ms | - | < 100ms |
| **CLS** | < 0.1 | - | < 0.1 |

### Other Important Metrics
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s
- **TBT (Total Blocking Time)**: < 200ms
- **Speed Index**: < 3.4s

## 🔍 Detailed Testing Steps

### A. Chrome DevTools Performance Panel

1. **Open Performance Tab**
   ```
   DevTools → Performance
   ```

2. **Record Page Load**
   - Click the Record button (⚫)
   - Refresh the page (`Ctrl + R`)
   - Stop recording after page loads

3. **Analyze LCP**
   - Look for "LCP" marker in the timeline
   - Check which element caused LCP
   - Verify it's an optimized image

4. **Check Network**
   - Switch to Network tab
   - Look at image loading
   - Verify AVIF/WebP formats
   - Check image sizes

### B. Network Throttling Test

1. **Simulate Slow Network**
   ```
   DevTools → Network → Throttling → Slow 3G
   ```

2. **Test Loading States**
   - Verify skeleton appears immediately
   - Watch shimmer animation
   - Confirm images load progressively

3. **Expected Behavior**
   - Skeleton shows within 100ms
   - First image loads within 2s
   - All images load within 5s

### C. Mobile Device Testing

1. **Device Emulation**
   ```
   DevTools → Toggle device toolbar (Ctrl + Shift + M)
   ```

2. **Test Different Devices**
   - iPhone 12 Pro
   - Samsung Galaxy S20
   - iPad Pro

3. **Check Responsiveness**
   - Grid layout adapts
   - Images scale properly
   - No horizontal scroll

## 🎯 What to Look For

### ✅ Good Signs
- [ ] Skeleton appears immediately
- [ ] Shimmer animation plays smoothly
- [ ] Images load progressively
- [ ] No layout shift during load
- [ ] AVIF or WebP images served
- [ ] Image sizes are optimized
- [ ] LCP < 2.5 seconds
- [ ] CLS score < 0.1

### ⚠️ Warning Signs
- [ ] Blank screen > 1 second
- [ ] Layout shifts during load
- [ ] Large image sizes (> 500KB)
- [ ] JPEG/PNG format (should be AVIF/WebP)
- [ ] Waterfall shows sequential loading
- [ ] LCP > 4 seconds

## 🔬 Advanced Testing

### 1. Web Vitals Measurement

Install web-vitals package:
```bash
npm install web-vitals
```

Add to page:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

useEffect(() => {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}, []);
```

### 2. Real User Monitoring (RUM)

Check browser console for:
```javascript
// LCP
performance.getEntriesByType('largest-contentful-paint')

// Images
performance.getEntriesByType('resource')
  .filter(entry => entry.initiatorType === 'img')
```

### 3. Lighthouse CI

Run automated tests:
```bash
npm install -g @lhci/cli
lhci autorun --config=lighthouserc.json
```

## 📈 Compare Before/After

### Before Optimization
```
LCP: 13.09s
- No skeleton loading
- Large unoptimized images (JPEG)
- No lazy loading
- No caching
- Layout shifts
```

### After Optimization
```
LCP: ~2.0-3.5s (Expected)
✓ Skeleton loading
✓ Optimized images (AVIF/WebP)
✓ Lazy loading enabled
✓ 30-day caching
✓ No layout shifts
✓ Blur placeholders
```

## 🐛 Troubleshooting

### Issue: LCP Still High

**Check:**
1. Network tab - are images loading?
2. Console - any errors?
3. Format - is AVIF/WebP served?
4. Priority - is first image priority loaded?

**Solutions:**
- Clear browser cache
- Check Supabase storage settings
- Verify image optimization config
- Add priority to first images

### Issue: Images Not Loading

**Check:**
1. Supabase URL in next.config.ts
2. Image paths are correct
3. CORS settings in Supabase
4. Network connectivity

**Solutions:**
- Verify remotePatterns in next.config.ts
- Check Supabase storage bucket is public
- Test image URL directly in browser

### Issue: Layout Shifts

**Check:**
1. Image dimensions specified?
2. Placeholder working?
3. Skeleton matching layout?

**Solutions:**
- Add width/height to Image
- Verify blur placeholder
- Match skeleton to actual layout

## 📊 Benchmarking Commands

### Test Build Size
```bash
npm run build
# Check output for bundle sizes
```

### Test Production Build
```bash
npm run build
npm start
# Test on http://localhost:3000
```

### Test with Lighthouse CLI
```bash
lighthouse http://localhost:3000 --view
```

## 📝 Testing Checklist

### Pre-Deployment
- [ ] Build succeeds without errors
- [ ] All images load correctly
- [ ] Skeleton shows during loading
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] LCP < 2.5s on desktop
- [ ] LCP < 4s on mobile
- [ ] CLS < 0.1
- [ ] Images are AVIF/WebP
- [ ] Caching headers present

### Post-Deployment
- [ ] Test on production URL
- [ ] Test from different locations
- [ ] Test on real mobile devices
- [ ] Monitor RUM data
- [ ] Check error rates
- [ ] Verify CDN caching

## 🎓 Understanding Results

### Lighthouse Scores
- **90-100**: Excellent ✅
- **50-89**: Needs improvement ⚠️
- **0-49**: Poor ❌

### LCP Ranges
- **0-2.5s**: Good 🟢
- **2.5-4s**: Needs improvement 🟡
- **4s+**: Poor 🔴

### Image Format Comparison
```
Original JPEG: 1.2 MB
WebP: 600 KB (-50%)
AVIF: 480 KB (-60%)
```

## 🔧 Optimization Tips

### If LCP is still > 3s:
1. Add priority to first 3 images
2. Preload critical images
3. Use CDN for images
4. Reduce image quality to 75-80
5. Consider lazy loading below fold only

### If skeleton doesn't show:
1. Check loading state logic
2. Verify skeleton import
3. Test with slow network
4. Add artificial delay for testing

### If images are blurry:
1. Check quality setting (should be 75-90)
2. Verify source image resolution
3. Check deviceSizes in config
4. Test on different devices

## 📚 Resources

- [Web Vitals](https://web.dev/vitals/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

---

**Last Updated**: October 5, 2025
**Status**: Ready for Testing ✅
