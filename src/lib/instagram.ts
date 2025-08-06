// Instagram API Integration
// Replace these with your actual Instagram API credentials

const INSTAGRAM_ACCESS_TOKEN = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.NEXT_PUBLIC_INSTAGRAM_USER_ID;

export interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp: string;
  permalink: string;
  // Custom fields for our archive
  title?: string;
  category?: string;
  is_featured?: boolean;
}

export class InstagramAPI {
  private accessToken: string;
  private userId: string;

  constructor() {
    this.accessToken = INSTAGRAM_ACCESS_TOKEN || '';
    this.userId = INSTAGRAM_USER_ID || '';
  }

  // Fetch recent posts from Instagram
  async fetchRecentPosts(limit: number = 20): Promise<InstagramPost[]> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,caption,timestamp,permalink&access_token=${this.accessToken}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformPosts(data.data);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      return [];
    }
  }

  // Transform Instagram posts to our archive format
  private transformPosts(posts: any[]): InstagramPost[] {
    return posts.map(post => ({
      id: post.id,
      media_type: post.media_type,
      media_url: post.media_url,
      thumbnail_url: post.thumbnail_url,
      caption: post.caption,
      timestamp: post.timestamp,
      permalink: post.permalink,
      title: this.extractTitle(post.caption),
      category: this.detectCategory(post.caption),
      is_featured: this.isFeatured(post.caption)
    }));
  }

  // Extract title from caption
  private extractTitle(caption: string): string {
    if (!caption) return 'Untitled Post';
    
    // Get first line or first 50 characters
    const firstLine = caption.split('\n')[0];
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  }

  // Detect category from caption hashtags
  private detectCategory(caption: string): string {
    if (!caption) return 'General';
    
    const hashtags = caption.match(/#\w+/g) || [];
    const hashtagText = hashtags.join(' ').toLowerCase();
    
    if (hashtagText.includes('denim') || hashtagText.includes('jeans')) return 'Denim';
    if (hashtagText.includes('shirt') || hashtagText.includes('tee')) return 'Tops';
    if (hashtagText.includes('boot') || hashtagText.includes('shoe')) return 'Footwear';
    if (hashtagText.includes('bag') || hashtagText.includes('accessory')) return 'Accessories';
    if (hashtagText.includes('vintage') || hashtagText.includes('retro')) return 'Vintage';
    
    return 'General';
  }

  // Check if post should be featured
  private isFeatured(caption: string): boolean {
    if (!caption) return false;
    
    const featuredKeywords = ['featured', 'staff pick', 'highlight', 'best', 'top'];
    const captionLower = caption.toLowerCase();
    
    return featuredKeywords.some(keyword => captionLower.includes(keyword));
  }

  // Get post details (for modal view)
  async getPostDetails(postId: string): Promise<InstagramPost | null> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/${postId}?fields=id,media_type,media_url,thumbnail_url,caption,timestamp,permalink&access_token=${this.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
      }

      const post = await response.json();
      return this.transformPosts([post])[0];
    } catch (error) {
      console.error('Error fetching post details:', error);
      return null;
    }
  }

  // Refresh token (if needed)
  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${this.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Token refresh error: ${response.status}`);
      }

      const data = await response.json();
      // Update your token storage here
      console.log('Token refreshed successfully');
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
}

// Singleton instance
export const instagramAPI = new InstagramAPI(); 