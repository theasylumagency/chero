# Chero Restaurant - Image Serving & Caching Analysis

## Issue Summary
Uploaded dish photos aren't displaying even though:
- Files ARE being saved to disk (`/public/uploads/dishes/`)
- JSON paths ARE correct in `data/dishes.json`
- Image component receives correct URLs

## 1. Image Serving Configuration

### How Images Are Served
**Static File Path**: `/public/uploads/dishes/dish_<id>_<size>.webp`
- Full size: `dish_<id>_1600.webp` (1600×900)
- Small size: `dish_<id>_800.webp` (800×450)

**Next.js Config** (`next.config.js`)
```javascript
module.exports = withNextIntl({
    images: {
        formats: ["image/avif", "image/webp"]
    }
})
```
- ✅ Enables WebP format (files ARE WebP)
- ❌ **NO static file caching headers configured**
- ❌ **NO image optimization settings** (deviceSizes, imageSizes, etc.)

### URL Path Construction
1. **API saves with full path** (`/api/admin/dishes/photo/route.ts`):
   ```typescript
   photo: {
       full: `/uploads/dishes/${fullName}`,      // /uploads/dishes/dish_<id>_1600.webp
       small: `/uploads/dishes/${smallName}`     // /uploads/dishes/dish_<id>_800.webp
   }
   ```

2. **JSON stores filenames only** (`data/dishes.json`):
   ```json
   "photo": {
       "full": "dish_dish_0001_1600.webp",
       "small": "dish_dish_0001_800.webp"
   }
   ```

3. **getPublicMenu() reconstructs full path** (`src/lib/menuStore.ts`):
   ```typescript
   photo: d.photo ? {
       full: `/uploads/dishes/${d.photo.full}`,
       small: `/uploads/dishes/${d.photo.small}`,
   } : null
   ```

✅ **Path construction is correct** - Results in: `/uploads/dishes/dish_dish_0001_800.webp`

---

## 2. Component Image Handling

### MenuPage (Menu Card)
**File**: `src/components/menu/DishCard.tsx`
```typescript
<Image
    src={dish.photo.small}           // e.g., /uploads/dishes/dish_dish_0001_800.webp
    alt={dish.title}
    fill
    sizes="(max-width: 640px) 100vw, 50vw"
    className="object-cover ..."
    priority={false}                 // ⚠️ Images NOT high priority
/>
```

**Issues**:
- ❌ No `onError` handler - doesn't show fallback if image fails
- ❌ No explicit `unoptimized` prop - relies on default Image optimization

### DishDetailsModal (Full View)
**File**: `src/components/menu/DishDetailsModal.tsx`
```typescript
<Image
    src={dish.photo.full}            // e.g., /uploads/dishes/dish_dish_0001_1600.webp
    alt={dish.title}
    fill
    sizes="(max-width: 768px) 100vw, 60vw"
    className="object-cover ..."
    priority                         // ✅ This one IS high priority
/>
```

✅ High-priority loading

---

## 3. Cache Invalidation & Data Revalidation

### ISR Configuration
**Menu Page** (`src/app/[locale]/menu/page.tsx`):
```typescript
export const revalidate = 60;  // ✅ Revalidate every 60 seconds
```

**Photo Upload API** (`src/app/api/admin/dishes/photo/route.ts`):
```typescript
await saveDishes(wrap);
revalidatePath("/[locale]/menu", "page");  // ✅ Correct path, correct type
return NextResponse.json({ ok: true, photo: {...} });
```

✅ **On-demand revalidation IS configured correctly**

### The Caching Pipeline

```
User uploads photo
    ↓
POST /api/admin/dishes/photo
    ↓
File saved to disk: /public/uploads/dishes/dish_<id>_800.webp
JSON updated: data/dishes.json (photo paths written)
Next.js cache invalidated via revalidatePath("/[locale]/menu", "page")
    ↓
Next ISR happens within ~60 seconds
    ↓
Menu page re-rendered with getPublicMenu(locale)
getPublicMenu reads fresh data/dishes.json
    ↓
React sends new props to client
DishCard/DishDetailsModal receives new photo URLs
    ↓
Next.js Image component requests image from disk
```

---

## 4. Image Optimization & Caching Issues

### Next.js Image Optimization Cache
**How it works**:
1. When `<Image src="..." />` is rendered, Next.js creates optimized versions
2. Images are cached in `.next/cache/images/` by default
3. Cache key includes: filename + dimensions + quality + format
4. **Problem**: Same filename = same cache key, even if source file changed

**Current Status**:
- ❌ No cache busting strategy
- ❌ Photos use same filename when replaced
- ❌ Optimization cache not cleared on upload

### Static File Headers
**Expected behavior**: Static files in `/public/` should have cache headers
**Current status**: NO explicit cache control headers set for `/public/` files

**Browser sees**:
```
[Unknown/Default headers from Next.js server]
```

Likely behavior:
- Old: Long cache (Next.js default ~1 year for static images)
- New: Unless browser refresh, cached version persists

### Deployment Cache Issues

If running on a VPS with Nginx/reverse proxy:
- Nginx might cache images with its own headers
- Middleware might have caching directives
- Build cache might not be cleared between deployments

---

## 5. Root Cause Analysis

### Primary Issue: Next.js Image Optimization Cache

When you upload a new photo with the **same filename**:
1. ✅ New file written to disk
2. ✅ JSON updated
3. ✅ Page cache invalidated (revalidatePath works)
4. ❌ **Image optimization cache still has old version**
5. ❌ Browser might have cached old URL

**Why you see old images**:
- Next.js Image component tries to optimize `/uploads/dishes/dish_disc_0001_800.webp`
- Optimization cache finds existing optimized version (same filename)
- Serves cached optimized version instead of re-optimizing new source
- Without browser cache clear, stale image persists

### Secondary Issues

1. **No cache busting**: Photos should include timestamp/hash in filename
   - Current: `dish_0001_800.webp` (replaced in-place)
   - Better: `dish_0001_800_<timestamp>.webp`

2. **No explicit cache headers for static images**
   - Browser doesn't know when to invalidate
   - Default Next.js behavior varies by deployment

3. **DishCard missing error handler**
   - If image fails to load, no fallback displayed
   - User unaware of the issue

---

## 6. How Images Are Actually Delivered

```
Browser Request: GET /uploads/dishes/dish_0001_800.webp
    ↓
Next.js Runtime
    ↓
Check: Is this optimized through Image component?
    ↓
if YES → Check .next/cache/images/
if CACHED → Serve cached optimized version ⚠️
if NOT CACHED → Optimize from source file
    ↓
if NO → Serve static file directly
    ↓
with headers: (depends on deployment config)
```

---

## 7. Middleware & Static File Serving

### Middleware Config (`middleware.ts`)
```typescript
export const config = {
    matcher: ["/((?!api|_next|admin|.*\\..*).*)"]
}
```

✅ Correctly **excludes** `/api/`, `/_next/`, and files with extensions
✅ Static files in `/public/uploads/` bypass middleware
✅ Perfect - no interference here

### No Explicit Caching Config Found
- ❌ No `next.config.js` header configuration
- ❌ No `public/_headers` file
- ❌ No Vercel headers configuration
- ❌ No cache busting strategy

---

## 8. Verification Checklist

Run these to diagnose:

```bash
# 1. Check if files exist on disk
ls -la public/uploads/dishes/dish_*_800.webp

# 2. Check if JSON has correct paths
grep -A2 "\"photo\":" data/dishes.json | head -20

# 3. Check browser DevTools:
# - Network tab: What's the actual URL served?
# - Response headers: What cache headers are returned?
# - Application → Cache Storage: Anything there?

# 4. Clear Next.js cache
rm -rf .next

# 5. Rebuild
npm run build

# 6. Check Image optimization cache
ls -la .next/cache/images/ (if exists)
```

---

## 9. Solutions (Priority Order)

### 🔴 CRITICAL: Cache Busting Strategy
**Problem**: Same filename = automatic image caching
```typescript
// BEFORE (Photo upload API)
const fullName = `dish_${dishId}_1600.webp`;

// AFTER - Add timestamp or hash
const now = Date.now();
const fullName = `dish_${dishId}_1600_${now}.webp`;
// Store JUST filename in JSON, include in URL construction
```

### 🟠 HIGH: Add Cache Headers
```javascript
// next.config.js
module.exports = withNextIntl({
    images: {
        formats: ["image/avif", "image/webp"]
    },
    headers: async () => {
        return [
            {
                source: '/uploads/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, must-revalidate'
                        // Must-revalidate forces validation after 1 hour
                    }
                ]
            }
        ]
    }
})
```

### 🟠 HIGH: Image Optimization Control
```typescript
// DishCard & DishDetailsModal
<Image
    src={dish.photo.small}
    alt={dish.title}
    fill
    unoptimized={true}  // For uploaded images, skip optimization
    // OR:
    // priority={true}  // Force fresh optimization
    sizes="..."
/>
```

### 🟡 MEDIUM: Error Handling
```typescript
const [imageFailed, setImageFailed] = useState(false);

<Image
    src={dish.photo.small}
    onError={() => setImageFailed(true)}
    ...
/>
{imageFailed && <div>Image failed to load</div>}
```

### 🟡 MEDIUM: Clear Optimization Cache on Upload
```typescript
// photo/route.ts
import { revalidatePath } from "next/cache";

// After saving files:
await saveDishes(wrap);
revalidatePath("/[locale]/menu", "page");
// Force Image component cache clear (harder to do server-side)
```

---

## 10. Testing the Fix

```typescript
// Upload a new photo
// DevTools → Network tab
// Should see:
// 1. POST /api/admin/dishes/photo → 200 OK
// 2. Image URL changes (with new timestamp) OR
// 3. Image optimization cache cleared
// 4. GET /uploads/dishes/dish_xxx_800.webp → fresh content
```

---

## Summary Table

| Component | Status | Issue | Impact |
|-----------|--------|-------|--------|
| **File Upload** | ✅ Works | None | High |
| **JSON Storage** | ✅ Works | None | High |
| **Path Construction** | ✅ Works | None | High |
| **ISR Revalidation** | ✅ Works | None | High |
| **Middleware** | ✅ Correct | None | N/A |
| **Image Optimization** | ⚠️ Default | Cache not cleared | **CRITICAL** |
| **Browser Cache Headers** | ❌ Missing | No explicit headers | High |
| **Cache Busting** | ❌ Missing | Same filename reused | **CRITICAL** |
| **Error Handling** | ❌ Missing | No fallback UI | Medium |

