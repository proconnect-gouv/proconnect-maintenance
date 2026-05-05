# Start server

`npx ts-node src/server.ts`

# Test openid-configuration

```bash
curl -s http://localhost:3000/api/v2/.well-known/openid-configuration | jq .
```

Test host reflection:

```bash
curl -s http://localhost:3000/api/v2/.well-known/openid-configuration -H "Host: fca.integ01.dev-agentconnect.fr" | jq '{issuer, authorization_endpoint, token_endpoint}'
```
