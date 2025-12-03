// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.bitamin.ai.kr/',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    }
  ]
}