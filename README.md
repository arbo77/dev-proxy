# DevProxy

Proxy ini akan otomatis reload ketika file config.json diubah.

Silakan tentukan path local untuk mengarahkan ke target

```json
[
  {
    "path": "/your-api",
    "target": "https://example.your-api.com"
  },
  {
    "path": "/jsonplaceholder",
    "target": "https://jsonplaceholder.typicode.com"
  }
]
```

gunakan url http://localhost:3000/{path} untuk development

atau untuk menggunakan port lain, bisa dengan tambahkan parameter seperti `npm run 3500`

---

Terima kasih,

Semoga bermanfaat :-)
