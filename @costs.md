# Operational Cost Estimate

## For a Single Tenant with 100K Visits/Month
Based on final plan: Cloudflare Workers + KV + Instant DB + Turso + AI chat + Several R2 Storages for images/assets.

### Assumptions
- Visits: 100K/month = ~3,333/day.
- Per Visit: 1 Workers request, 1-2 KV reads, 1 Instant DB query, 1 Turso query (AI), 5-10 R2 requests.
- Data: 500MB R2, 100MB Instant DB, 50MB Turso.
- AI Chat: 10% visits.

### Monthly Cost Breakdown
| Component | Details | Cost |
|-----------|---------|------|
| Cloudflare Workers | 100K requests ($0.15/1M) | ~$0.015 |
| Cloudflare KV | 150K reads ($0.50/1M) | ~$0.075 |
| Instant DB | 100MB storage ($0.10/GB) | ~$0.01 |
| Turso | 50MB storage + 10K queries ($0.001/query) | ~$0.01 |
| Several R2 Storages | 500MB storage ($0.015/GB) + 500K requests ($0.036/1M) | ~$0.026 |
| **Total** | | **~$0.14/month** |

### Scaling Notes
- 1B Tenants: ~$140M/month (amortize over active tenants).
- Costs scale linearly; monitor with Cloudflare Analytics.
