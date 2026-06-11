import { MetadataRoute } from 'next';

const baseUrl = 'https://yourdomain.com';

const routes = [
  {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 1,
  },
  {
    url: `${baseUrl}/login`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    url: `${baseUrl}/signup`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    url: `${baseUrl}/profile`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes;
}
