/**
 * Content Discovery Bot Integration
 * Integrates AI-powered content discovery and automatic indexing with the dashboard system
 */

class ContentDiscoveryBot {
  constructor() {
    this.discoveryCapabilities = {
      automaticIndexing: true,
      contentClassification: true,
      metadataExtraction: true,
      relationshipMapping: true,
      contentEnrichment: true,
      duplicateDetection: true,
      contentVersioning: true,
      searchOptimization: true
    };
    
    this.contentIndex = new Map();
    this.metadataStore = new Map();
    this.relationshipGraph = new Map();
    this.contentCache = new Map();
    
    this.discoveryRules = {
      contentTypes: ['text', 'image', 'video', 'audio', 'document', 'code', 'data'],
      priorityLevels: ['high', 'medium', 'low'],
      classificationCategories: ['dashboard', 'service', 'metric', 'user', 'system', 'documentation']
    };
    
    this.indexingStatus = {
      totalContent: 0,
      indexedContent: 0,
      pendingContent: 0,
      failedContent: 0,
      lastIndexed: null
    };
    
    this.initializeContentDiscovery();
  }

  /**
   * Initialize content discovery capabilities
   */
  initializeContentDiscovery() {
    console.log('🔍 Content Discovery Bot initialized');
    
    // Setup automatic content scanning
    this.setupAutomaticContentScanning();
    
    // Setup content classification
    this.setupContentClassification();
    
    // Setup metadata extraction
    this.setupMetadataExtraction();
    
    // Setup relationship mapping
    this.setupRelationshipMapping();
    
    // Setup content enrichment
    this.setupContentEnrichment();
    
    // Setup search optimization
    this.setupSearchOptimization();
    
    // Start initial content discovery
    this.startInitialContentDiscovery();
  }

  /**
   * Setup automatic content scanning
   */
  setupAutomaticContentScanning() {
    // Monitor DOM changes for new content
    this.setupDOMObserver();
    
    // Monitor AJAX requests for dynamic content
    this.setupAJAXMonitor();
    
    // Monitor localStorage/sessionStorage changes
    this.setupStorageMonitor();
    
    // Setup periodic content refresh
    this.setupPeriodicRefresh();
  }

  /**
   * Setup DOM observer for content changes
   */
  setupDOMObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processNewContent(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-content', 'data-service', 'data-metric', 'title', 'alt']
    });
  }

  /**
   * Setup AJAX monitor for dynamic content
   */
  setupAJAXMonitor() {
    const originalFetch = window.fetch;
    const originalXHR = XMLHttpRequest.prototype.open;
    
    // Monitor fetch requests
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.ok) {
        this.processAJAXResponse(args[0], response);
      }
      return response;
    };
    
    // Monitor XMLHttpRequest
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._url = url;
      this._method = method;
      return originalXHR.apply(this, [method, url, ...args]);
    };
    
    const originalOnReadyStateChange = XMLHttpRequest.prototype.onreadystatechange;
    XMLHttpRequest.prototype.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        this.processAJAXResponse(this._url, { data: this.responseText });
      }
      if (originalOnReadyStateChange) {
        originalOnReadyStateChange.apply(this, arguments);
      }
    };
  }

  /**
   * Setup storage monitor
   */
  setupStorageMonitor() {
    // Monitor localStorage changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, [key, value]);
      window.dispatchEvent(new CustomEvent('storageChange', {
        detail: { key, value, type: 'localStorage' }
      }));
    };
    
    // Monitor sessionStorage changes
    const originalSessionSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
      originalSessionSetItem.apply(this, [key, value]);
      window.dispatchEvent(new CustomEvent('storageChange', {
        detail: { key, value, type: 'sessionStorage' }
      }));
    };
    
    // Listen for storage changes
    window.addEventListener('storageChange', (event) => {
      this.processStorageContent(event.detail);
    });
  }

  /**
   * Setup periodic content refresh
   */
  setupPeriodicRefresh() {
    // Refresh content every 5 minutes
    setInterval(() => {
      this.refreshContentIndex();
    }, 300000);
    
    // Full content discovery every hour
    setInterval(() => {
      this.performFullContentDiscovery();
    }, 3600000);
  }

  /**
   * Process new content from DOM
   */
  processNewContent(element) {
    try {
      const contentData = this.extractContentFromElement(element);
      if (contentData) {
        this.indexContent(contentData);
      }
    } catch (error) {
      console.error('Error processing new content:', error);
    }
  }

  /**
   * Extract content from DOM element
   */
  extractContentFromElement(element) {
    const contentData = {
      id: this.generateContentId(element),
      type: this.detectContentType(element),
      title: this.extractTitle(element),
      description: this.extractDescription(element),
      text: this.extractText(element),
      metadata: this.extractMetadata(element),
      relationships: this.extractRelationships(element),
      timestamp: Date.now(),
      source: 'dom'
    };
    
    return contentData.text || contentData.title ? contentData : null;
  }

  /**
   * Generate unique content ID
   */
  generateContentId(element) {
    const tagName = element.tagName.toLowerCase();
    const id = element.id || '';
    const className = element.className || '';
    const text = element.textContent?.substring(0, 50) || '';
    
    return `${tagName}_${id}_${className}_${text}`.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  /**
   * Detect content type
   */
  detectContentType(element) {
    const tagName = element.tagName.toLowerCase();
    const className = element.className.toLowerCase();
    
    // Check for specific content types
    if (tagName === 'img' || className.includes('image')) return 'image';
    if (tagName === 'video') return 'video';
    if (tagName === 'audio') return 'audio';
    if (tagName === 'code' || className.includes('code')) return 'code';
    if (tagName === 'table' || className.includes('table')) return 'data';
    if (tagName === 'a' && element.href) return 'link';
    
    // Check for dashboard-specific content
    if (className.includes('dashboard')) return 'dashboard';
    if (className.includes('service')) return 'service';
    if (className.includes('metric')) return 'metric';
    if (className.includes('user')) return 'user';
    if (className.includes('system')) return 'system';
    
    // Default to text
    return 'text';
  }

  /**
   * Extract title from element
   */
  extractTitle(element) {
    // Check various title attributes
    return element.title || 
           element.getAttribute('data-title') || 
           element.getAttribute('aria-label') ||
           element.querySelector('h1, h2, h3, h4, h5, h6')?.textContent ||
           element.querySelector('.title, .header')?.textContent ||
           '';
  }

  /**
   * Extract description from element
   */
  extractDescription(element) {
    return element.getAttribute('data-description') ||
           element.getAttribute('aria-describedby') ||
           element.querySelector('.description, .desc')?.textContent ||
           '';
  }

  /**
   * Extract text content from element
   */
  extractText(element) {
    return element.textContent?.trim() || '';
  }

  /**
   * Extract metadata from element
   */
  extractMetadata(element) {
    const metadata = {};
    
    // Extract data attributes
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        metadata[attr.name] = attr.value;
      }
    });
    
    // Extract common attributes
    if (element.id) metadata.id = element.id;
    if (element.className) metadata.className = element.className;
    if (element.href) metadata.url = element.href;
    if (element.src) metadata.src = element.src;
    if (element.alt) metadata.alt = element.alt;
    
    return metadata;
  }

  /**
   * Extract relationships from element
   */
  extractRelationships(element) {
    const relationships = [];
    
    // Parent-child relationships
    if (element.parentElement) {
      relationships.push({
        type: 'parent',
        target: this.generateContentId(element.parentElement)
      });
    }
    
    // Child relationships
    Array.from(element.children).forEach(child => {
      relationships.push({
        type: 'child',
        target: this.generateContentId(child)
      });
    });
    
    // Link relationships
    if (element.tagName === 'A' && element.href) {
      relationships.push({
        type: 'link',
        target: element.href
      });
    }
    
    return relationships;
  }

  /**
   * Process AJAX response
   */
  async processAJAXResponse(url, response) {
    try {
      let data;
      
      if (response.json) {
        data = await response.json();
      } else if (response.data) {
        data = response.data;
      } else {
        return;
      }
      
      const contentData = {
        id: this.generateContentId({ tagName: 'AJAX', textContent: url }),
        type: 'data',
        title: url.split('/').pop(),
        description: 'AJAX response data',
        text: typeof data === 'string' ? data : JSON.stringify(data),
        metadata: { url, method: 'GET' },
        relationships: [],
        timestamp: Date.now(),
        source: 'ajax'
      };
      
      this.indexContent(contentData);
    } catch (error) {
      console.error('Error processing AJAX response:', error);
    }
  }

  /**
   * Process storage content
   */
  processStorageContent(storageData) {
    const contentData = {
      id: `storage_${storageData.key}`,
      type: 'data',
      title: `Storage: ${storageData.key}`,
      description: 'Local storage data',
      text: storageData.value,
      metadata: { 
        key: storageData.key, 
        storageType: storageData.type 
      },
      relationships: [],
      timestamp: Date.now(),
      source: 'storage'
    };
    
    this.indexContent(contentData);
  }

  /**
   * Index content
   */
  indexContent(contentData) {
    try {
      // Check for duplicates
      if (this.isDuplicate(contentData)) {
        return;
      }
      
      // Classify content
      const classification = this.classifyContent(contentData);
      contentData.classification = classification;
      
      // Extract additional metadata
      const enrichedMetadata = this.enrichMetadata(contentData);
      contentData.metadata = { ...contentData.metadata, ...enrichedMetadata };
      
      // Store in content index
      this.contentIndex.set(contentData.id, contentData);
      
      // Store metadata separately
      this.metadataStore.set(contentData.id, contentData.metadata);
      
      // Update relationship graph
      this.updateRelationshipGraph(contentData);
      
      // Update indexing status
      this.updateIndexingStatus('indexed');
      
      // Optimize for search
      this.optimizeForSearch(contentData);
      
      console.log(`📝 Content indexed: ${contentData.title}`);
    } catch (error) {
      console.error('Error indexing content:', error);
      this.updateIndexingStatus('failed');
    }
  }

  /**
   * Check for duplicate content
   */
  isDuplicate(contentData) {
    for (const [id, existingContent] of this.contentIndex.entries()) {
      if (existingContent.text === contentData.text && 
          existingContent.source === contentData.source) {
        return true;
      }
    }
    return false;
  }

  /**
   * Classify content
   */
  classifyContent(contentData) {
    const classification = {
      category: 'unknown',
      priority: 'low',
      tags: [],
      confidence: 0.5
    };
    
    const text = (contentData.text + ' ' + contentData.title).toLowerCase();
    
    // Dashboard content
    if (text.includes('dashboard') || contentData.type === 'dashboard') {
      classification.category = 'dashboard';
      classification.priority = 'high';
      classification.confidence = 0.9;
    }
    
    // Service content
    if (text.includes('service') || contentData.type === 'service') {
      classification.category = 'service';
      classification.priority = 'high';
      classification.confidence = 0.8;
    }
    
    // Metric content
    if (text.includes('metric') || text.includes('performance') || contentData.type === 'metric') {
      classification.category = 'metric';
      classification.priority = 'medium';
      classification.confidence = 0.8;
    }
    
    // User content
    if (text.includes('user') || text.includes('profile') || contentData.type === 'user') {
      classification.category = 'user';
      classification.priority = 'medium';
      classification.confidence = 0.7;
    }
    
    // System content
    if (text.includes('system') || text.includes('config') || contentData.type === 'system') {
      classification.category = 'system';
      classification.priority = 'high';
      classification.confidence = 0.8;
    }
    
    // Extract tags
    const commonTags = ['dashboard', 'service', 'metric', 'user', 'system', 'error', 'status', 'health', 'performance'];
    commonTags.forEach(tag => {
      if (text.includes(tag)) {
        classification.tags.push(tag);
      }
    });
    
    return classification;
  }

  /**
   * Enrich metadata
   */
  enrichMetadata(contentData) {
    const enriched = {};
    
    // Add content length
    enriched.contentLength = contentData.text.length;
    
    // Add word count
    enriched.wordCount = contentData.text.split(/\s+/).length;
    
    // Add language detection (simplified)
    enriched.language = this.detectLanguage(contentData.text);
    
    // Add content quality score
    enriched.qualityScore = this.calculateQualityScore(contentData);
    
    // Add update frequency
    enriched.updateFrequency = this.calculateUpdateFrequency(contentData.id);
    
    return enriched;
  }

  /**
   * Detect language (simplified)
   */
  detectLanguage(text) {
    const englishWords = ['the', 'and', 'is', 'are', 'for', 'with', 'this', 'that'];
    const wordCount = text.split(/\s+/).length;
    const englishWordCount = englishWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    
    return englishWordCount / englishWords.length > 0.3 ? 'english' : 'unknown';
  }

  /**
   * Calculate quality score
   */
  calculateQualityScore(contentData) {
    let score = 0.5; // Base score
    
    // Title quality
    if (contentData.title && contentData.title.length > 5) {
      score += 0.2;
    }
    
    // Description quality
    if (contentData.description && contentData.description.length > 10) {
      score += 0.2;
    }
    
    // Text content quality
    if (contentData.text && contentData.text.length > 20) {
      score += 0.1;
    }
    
    return Math.min(score, 1.0);
  }

  /**
   * Calculate update frequency
   */
  calculateUpdateFrequency(contentId) {
    const content = this.contentIndex.get(contentId);
    if (!content) return 'unknown';
    
    const age = Date.now() - content.timestamp;
    const hours = age / (1000 * 60 * 60);
    
    if (hours < 1) return 'high';
    if (hours < 24) return 'medium';
    return 'low';
  }

  /**
   * Update relationship graph
   */
  updateRelationshipGraph(contentData) {
    contentData.relationships.forEach(relationship => {
      if (!this.relationshipGraph.has(contentData.id)) {
        this.relationshipGraph.set(contentData.id, []);
      }
      
      this.relationshipGraph.get(contentData.id).push(relationship);
    });
  }

  /**
   * Optimize content for search
   */
  optimizeForSearch(contentData) {
    // Create searchable text
    const searchableText = [
      contentData.title,
      contentData.description,
      contentData.text,
      ...contentData.classification.tags
    ].join(' ').toLowerCase();
    
    // Store searchable text
    contentData.searchableText = searchableText;
    
    // Create search index entry
    const searchEntry = {
      id: contentData.id,
      title: contentData.title,
      description: contentData.description,
      text: contentData.text,
      category: contentData.classification.category,
      priority: contentData.classification.priority,
      tags: contentData.classification.tags,
      searchableText: searchableText,
      timestamp: contentData.timestamp
    };
    
    // Update search index
    this.updateSearchIndex(searchEntry);
  }

  /**
   * Update search index
   */
  updateSearchIndex(searchEntry) {
    // Store in search index
    this.contentCache.set(searchEntry.id, searchEntry);
    
    // Notify search system
    if (window.modernSearch) {
      window.modernSearch.addSearchableContent(searchEntry);
    }
  }

  /**
   * Update indexing status
   */
  updateIndexingStatus(status) {
    switch (status) {
      case 'indexed':
        this.indexingStatus.indexedContent++;
        this.indexingStatus.lastIndexed = Date.now();
        break;
      case 'failed':
        this.indexingStatus.failedContent++;
        break;
      case 'pending':
        this.indexingStatus.pendingContent++;
        break;
    }
    
    this.indexingStatus.totalContent = this.contentIndex.size;
  }

  /**
   * Refresh content index
   */
  refreshContentIndex() {
    console.log('🔄 Refreshing content index...');
    
    // Re-scan existing content
    const elements = document.querySelectorAll('[data-content], [data-service], [data-metric], .dashboard-card, .service-item');
    elements.forEach(element => {
      this.processNewContent(element);
    });
    
    // Clean up old content
    this.cleanupOldContent();
    
    console.log(`📊 Content index refreshed: ${this.contentIndex.size} items`);
  }

  /**
   * Perform full content discovery
   */
  performFullContentDiscovery() {
    console.log('🔍 Performing full content discovery...');
    
    // Reset indexing status
    this.indexingStatus = {
      totalContent: 0,
      indexedContent: 0,
      pendingContent: 0,
      failedContent: 0,
      lastIndexed: Date.now()
    };
    
    // Discover all content on page
    this.discoverPageContent();
    
    // Discover content from external sources
    this.discoverExternalContent();
    
    // Update content relationships
    this.updateContentRelationships();
    
    console.log('✅ Full content discovery completed');
  }

  /**
   * Discover page content
   */
  discoverPageContent() {
    // Discover all text content
    const textElements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6, li, td, th');
    textElements.forEach(element => {
      if (element.textContent.trim().length > 10) {
        this.processNewContent(element);
      }
    });
    
    // Discover images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      this.processNewContent(img);
    });
    
    // Discover links
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      this.processNewContent(link);
    });
    
    // Discover forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      this.processNewContent(form);
    });
  }

  /**
   * Discover external content
   */
  discoverExternalContent() {
    // This would typically involve API calls to discover content from external sources
    // For now, we'll focus on the current page content
    console.log('🔍 External content discovery not implemented yet');
  }

  /**
   * Update content relationships
   */
  updateContentRelationships() {
    // Update relationship graph with current content
    for (const [contentId, contentData] of this.contentIndex.entries()) {
      this.updateRelationshipGraph(contentData);
    }
  }

  /**
   * Cleanup old content
   */
  cleanupOldContent() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [contentId, contentData] of this.contentIndex.entries()) {
      if (now - contentData.timestamp > maxAge) {
        this.contentIndex.delete(contentId);
        this.metadataStore.delete(contentId);
        this.contentCache.delete(contentId);
      }
    }
  }

  /**
   * Start initial content discovery
   */
  startInitialContentDiscovery() {
    // Wait for page to load
    setTimeout(() => {
      this.performFullContentDiscovery();
    }, 2000);
  }

  /**
   * Get content discovery insights
   */
  getContentDiscoveryInsights() {
    return {
      indexingStatus: this.indexingStatus,
      contentDistribution: this.getContentDistribution(),
      categoryDistribution: this.getCategoryDistribution(),
      priorityDistribution: this.getPriorityDistribution(),
      relationshipStats: this.getRelationshipStats(),
      recommendations: this.generateContentRecommendations()
    };
  }

  /**
   * Get content distribution
   */
  getContentDistribution() {
    const distribution = {};
    
    for (const [id, content] of this.contentIndex.entries()) {
      const type = content.type;
      distribution[type] = (distribution[type] || 0) + 1;
    }
    
    return distribution;
  }

  /**
   * Get category distribution
   */
  getCategoryDistribution() {
    const distribution = {};
    
    for (const [id, content] of this.contentIndex.entries()) {
      const category = content.classification?.category || 'unknown';
      distribution[category] = (distribution[category] || 0) + 1;
    }
    
    return distribution;
  }

  /**
   * Get priority distribution
   */
  getPriorityDistribution() {
    const distribution = {};
    
    for (const [id, content] of this.contentIndex.entries()) {
      const priority = content.classification?.priority || 'low';
      distribution[priority] = (distribution[priority] || 0) + 1;
    }
    
    return distribution;
  }

  /**
   * Get relationship statistics
   */
  getRelationshipStats() {
    let totalRelationships = 0;
    let relationshipTypes = {};
    
    for (const [contentId, relationships] of this.relationshipGraph.entries()) {
      totalRelationships += relationships.length;
      relationships.forEach(rel => {
        relationshipTypes[rel.type] = (relationshipTypes[rel.type] || 0) + 1;
      });
    }
    
    return {
      totalRelationships,
      relationshipTypes,
      averageRelationshipsPerContent: totalRelationships / this.contentIndex.size
    };
  }

  /**
   * Generate content recommendations
   */
  generateContentRecommendations() {
    const recommendations = [];
    
    // Check content coverage
    const categories = this.getCategoryDistribution();
    if (categories.dashboard < 5) {
      recommendations.push({
        type: 'coverage',
        message: 'Low dashboard content coverage',
        suggestion: 'Add more dashboard-related content'
      });
    }
    
    // Check content quality
    let lowQualityContent = 0;
    for (const [id, content] of this.contentIndex.entries()) {
      if (content.metadata?.qualityScore < 0.5) {
        lowQualityContent++;
      }
    }
    
    if (lowQualityContent > this.contentIndex.size * 0.3) {
      recommendations.push({
        type: 'quality',
        message: 'High percentage of low-quality content',
        suggestion: 'Improve content quality and metadata'
      });
    }
    
    // Check relationship density
    const relationshipStats = this.getRelationshipStats();
    if (relationshipStats.averageRelationshipsPerContent < 2) {
      recommendations.push({
        type: 'relationships',
        message: 'Low content relationship density',
        suggestion: 'Improve content linking and relationships'
      });
    }
    
    return recommendations;
  }

  /**
   * Search content
   */
  searchContent(query, filters = {}) {
    const results = [];
    const queryLower = query.toLowerCase();
    
    for (const [id, content] of this.contentIndex.entries()) {
      // Apply filters
      if (filters.category && content.classification?.category !== filters.category) {
        continue;
      }
      if (filters.priority && content.classification?.priority !== filters.priority) {
        continue;
      }
      if (filters.type && content.type !== filters.type) {
        continue;
      }
      
      // Search in content
      const searchableText = content.searchableText || '';
      if (searchableText.includes(queryLower)) {
        const relevance = this.calculateRelevance(queryLower, searchableText);
        results.push({
          ...content,
          relevance
        });
      }
    }
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Calculate relevance score
   */
  calculateRelevance(query, text) {
    const queryWords = query.split(/\s+/);
    let score = 0;
    
    queryWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    
    return score;
  }

  /**
   * Export content discovery data
   */
  exportContentDiscoveryData() {
    return {
      contentIndex: Object.fromEntries(this.contentIndex),
      metadataStore: Object.fromEntries(this.metadataStore),
      relationshipGraph: Object.fromEntries(this.relationshipGraph),
      contentCache: Object.fromEntries(this.contentCache),
      indexingStatus: this.indexingStatus,
      insights: this.getContentDiscoveryInsights()
    };
  }

  /**
   * Destroy content discovery bot
   */
  destroy() {
    // Clear all data structures
    this.contentIndex.clear();
    this.metadataStore.clear();
    this.relationshipGraph.clear();
    this.contentCache.clear();
    
    console.log('🔍 Content Discovery Bot destroyed');
  }
}

// Initialize Content Discovery Bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.contentDiscoveryBot = new ContentDiscoveryBot();
  console.log('🔍 Content Discovery Bot integrated with IZA OS Dashboard');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentDiscoveryBot;
}
