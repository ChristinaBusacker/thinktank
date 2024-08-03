import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) { }

  setTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  setMetaDescription(description: string): void {
    this.metaService.updateTag({ name: 'description', content: description });
  }

  setMetaKeywords(keywords: string): void {
    this.metaService.updateTag({ name: 'keywords', content: keywords });
  }

  setOpenGraphData(ogData: { property: string, content: string }[]): void {
    ogData.forEach(data => {
      this.metaService.updateTag({ property: data.property, content: data.content });
    });
  }

  setLanguage(lang: string): void {
    this.document.documentElement.lang = lang;
  }

  setCanonicalURL(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]') || null;
    if (link) {
      link.href = url;
    } else {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }
}
