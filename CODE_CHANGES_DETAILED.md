# 📝 Code Changes - Side by Side Comparison

## 1. getPlatformStats.ts

### ❌ BEFORE (Unsafe)
```typescript
export async function getPlatformStats() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_platform_stats`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Bad status ' + res.status);
  const json = await res.json();
  return {
    hilang: Number(json?.BarangHilangDilaporkan ?? 0),
    ditemukan: Number(json?.BarangDitemukan ?? 0),
    diklaim: Number(json?.BarangDiklaim ?? 0),
  };
}
```

### ✅ AFTER (Safe)
```typescript
export async function getPlatformStats() {
  // Safety check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getPlatformStats');
    return {
      hilang: 0,
      ditemukan: 0,
      diklaim: 0,
    };
  }

  const url = `${supabaseUrl}/rest/v1/rpc/get_platform_stats`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Bad status ' + res.status);
  const json = await res.json();
  return {
    hilang: Number(json?.BarangHilangDilaporkan ?? 0),
    ditemukan: Number(json?.BarangDitemukan ?? 0),
    diklaim: Number(json?.BarangDiklaim ?? 0),
  };
}
```

**Key Changes:**
- ✅ Extract variables first
- ✅ Check if they exist
- ✅ Return safe default if not
- ✅ Use variables safely

---

## 2. getFoundItemStats.ts

### ❌ BEFORE
```typescript
export async function getFoundItemStats() {
const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_found_item_totals`;
const res = await fetch(url, {
method: 'POST',
headers: {
apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
'Content-Type': 'application/json',
},
cache: 'no-store',
});
// ... rest
}
```

### ✅ AFTER
```typescript
export async function getFoundItemStats() {
  // Safety check for environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getFoundItemStats');
    return {
      'STNK': 0,
      'Handphone': 0,
      'Buku': 0,
      'Kunci': 0,
      'Dompet': 0,
      'Laptop': 0,
    };
  }

  const url = `${supabaseUrl}/rest/v1/rpc/get_found_item_totals`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  // ... rest
}
```

---

## 3. getFoundItemsPage.ts

### ❌ BEFORE
```typescript
export async function getFoundItemsPage(page = 1, limit = 6): Promise<FoundItemsPage> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;    // ❌ Non-null assertion
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const url = `${base}/rest/v1/rpc/get_found_items_paged`;
  // ... rest
}
```

### ✅ AFTER
```typescript
export async function getFoundItemsPage(page = 1, limit = 6): Promise<FoundItemsPage> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Safety check for environment variables
  if (!base || !key) {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getFoundItemsPage');
    return {
      items: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  const url = `${base}/rest/v1/rpc/get_found_items_paged`;
  // ... rest
}
```

---

## 4. getFoundItems.ts

### ❌ BEFORE
```typescript
export async function getFoundItems(): Promise<FoundItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_found_items`, {
      method: 'GET',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
      },
      cache: 'no-store',
    });
    // ... rest
  }
}
```

### ✅ AFTER
```typescript
export async function getFoundItems(): Promise<FoundItem[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Safety check for environment variables
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getFoundItems');
      return [];
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_found_items`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
      cache: 'no-store',
    });
    // ... rest
  }
}
```

---

## 5. getFoundItemTotals.ts

### ❌ BEFORE
```typescript
export async function getFoundItemTotals(): Promise<Totals> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;      // ❌ Unsafe
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const res = await fetch(`${base}/rest/v1/rpc/get_found_item_totals`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    cache: 'no-store'
  });
  // ... rest
}
```

### ✅ AFTER
```typescript
export async function getFoundItemTotals(): Promise<Totals> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Safety check for environment variables
  if (!base || !key) {
    console.warn('⚠️ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in getFoundItemTotals');
    return { STNK:0, Handphone:0, Buku:0, Kunci:0, Dompet:0, Laptop:0 };
  }

  const res = await fetch(`${base}/rest/v1/rpc/get_found_item_totals`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    cache: 'no-store'
  });
  // ... rest
}
```

---

## Summary of Changes

| File | Before | After |
|------|--------|-------|
| getPlatformStats.ts | `process.env.URL!` | Safe check + `{hilang:0,...}` fallback |
| getFoundItemStats.ts | `process.env.KEY!` | Safe check + category fallback |
| getFoundItemsPage.ts | `const base = ...!` | Safe check + empty page fallback |
| getFoundItems.ts | `process.env.KEY \|\| ''` | Explicit safe check + `[]` fallback |
| getFoundItemTotals.ts | `process.env.URL!` | Safe check + zeros fallback |

## Common Pattern

All changes follow the same pattern:

```typescript
// ✅ PATTERN EVERY FILE NOW USES

1. Extract variables
   const url = process.env.NEXT_PUBLIC_URL;
   const key = process.env.NEXT_PUBLIC_KEY;

2. Check if exist
   if (!url || !key) {
     return getDefaultValue();
   }

3. Use safely
   const result = await fetch(`${url}/...`);
```

This makes the code:
- ✅ Type-safe
- ✅ Runtime-safe
- ✅ Build-safe
- ✅ User-safe
