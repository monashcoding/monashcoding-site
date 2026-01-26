# monashcoding-site

## Sanity Webhook Setup

The site uses on-demand revalidation via a webhook that Sanity calls when content is published.

### Endpoint

```
POST /api/revalidate
```

### Environment Variable

Add to the server:

```
SANITY_WEBHOOK_SECRET=secret123
```

### Setting up the webhook in Sanity

1. Go to [manage.sanity.io](https://manage.sanity.io)
2. Select the project
3. Go to **API** > **Webhooks**
4. Click **Create webhook**
5. Configure:
   - **Name**: `Revalidate site`
   - **URL**: `https://your-domain.com/api/revalidate`
   - **Trigger on**: `Create`, `Update`, `Delete`
   - **Filter**: Leave it empty to trigger all
   - **Projection**: `{_type}` (**important!**)
   - **HTTP method**: `POST`
   - **HTTP Headers**: Add `x-sanity-webhook-secret` with `SANITY_WEBHOOK_SECRET` from `.env.local`
   - **API version**: Latest (e.g. `2024-01-01`)
   - **Draft**: Disabled (only trigger on publish)
