#!/bin/bash
gemini "Generate Google Ads API call: create campaign → output JSON" | curl -X POST https://googleads.googleapis.com/v11/customers/123/campaigns -d @vercel-simple.json
