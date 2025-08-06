# Instagram API Setup Guide

## 🔗 **Step-by-Step Instagram Integration**

### **1. Instagram Business Account Setup**

Your friend needs to convert their Instagram account to a Business/Creator account:

1. **Go to Instagram Settings**
2. **Account → Switch to Professional Account**
3. **Choose "Business" or "Creator"**
4. **Connect to Facebook Page** (required for API access)

### **2. Create Facebook App**

1. **Visit [Facebook Developers](https://developers.facebook.com/)**
2. **Create New App** → Choose "Consumer" or "Business"
3. **Add Instagram Basic Display** product
4. **Configure OAuth Redirect URIs**

### **3. Get Access Token**

1. **Go to Instagram Basic Display** in your Facebook app
2. **Generate Access Token** with these permissions:
   - `user_profile`
   - `user_media`
3. **Copy the access token**

### **4. Environment Variables**

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN="your_access_token_here"
NEXT_PUBLIC_INSTAGRAM_USER_ID="your_user_id_here"
```

### **5. API Permissions**

Your friend's Instagram account needs these permissions:
- ✅ **Public Profile** (for media access)
- ✅ **Business Account** (for API access)
- ✅ **Connected Facebook Page** (required)

### **6. Automatic Updates**

The Archive page will now:
- ✅ **Fetch posts automatically** on page load
- ✅ **Transform captions** into titles and categories
- ✅ **Detect featured posts** from hashtags
- ✅ **Update in real-time** when new posts are added

### **7. Hashtag Strategy**

Your friend should use these hashtags for automatic categorization:

```text
#denim #jeans → Denim category
#shirt #tee #top → Tops category  
#boot #shoe #footwear → Footwear category
#bag #accessory → Accessories category
#vintage #retro → Vintage category
#featured #staffpick → Featured post
```

### **8. Testing the Integration**

1. **Add the environment variables**
2. **Restart your development server**
3. **Visit `/archive` page**
4. **Check browser console** for API responses

### **9. Troubleshooting**

**Common Issues:**
- ❌ "Invalid access token" → Check token permissions
- ❌ "User not found" → Verify user ID
- ❌ "Rate limit exceeded" → Wait and retry
- ❌ "Permission denied" → Check Instagram account type

**Solutions:**
- ✅ **Refresh token** if expired
- ✅ **Check Instagram account** is Business/Creator
- ✅ **Verify Facebook page** connection
- ✅ **Test with Instagram Graph API Explorer**

### **10. Advanced Features**

**Auto-refresh every 30 minutes:**
```typescript
// Add to Archive component
useEffect(() => {
  const interval = setInterval(fetchInstagramPosts, 30 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

**Webhook for real-time updates:**
```typescript
// Set up webhook endpoint
// Instagram will notify when new posts are added
```

## 🎯 **Result**

Once set up, your Archive page will:
- 🚀 **Automatically fetch** your friend's latest Instagram posts
- 🏷️ **Auto-categorize** posts based on hashtags
- ⭐ **Highlight featured** posts automatically
- 📱 **Display in beautiful** chalkboard grid layout
- 🔄 **Update in real-time** when new posts are added

The integration creates a seamless connection between Instagram and your Archive page! ✨ 