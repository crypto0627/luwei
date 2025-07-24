# 大竹小倆口滷味 Backend

## 環境設置

### 必需的環境變量

1. **JWT_SECRET**: JWT 簽名密鑰
2. **GOOGLE_ID**: Google OAuth Client ID
3. **GOOGLE_SECRET**: Google OAuth Client Secret
4. **RESEND_API_KEY**: Resend API 密鑰（用於發送 email）

### 設置 Resend Email 服務

1. 註冊 [Resend](https://resend.com) 帳號
2. 獲取 API 密鑰
3. 設置發送域名（建議使用 `luwei.xincheng-brunch.com`）
4. 將 API 密鑰設置為 Cloudflare Worker secret：

```bash
cd apps/backend-luwei
wrangler secret put RESEND_API_KEY
```

### 測試 Email 功能

在設置好 Resend API 密鑰後，可以使用以下端點測試 email 功能：

```bash
curl -X POST https://your-worker-url/api/order/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

### 訂單確認 Email

當用戶完成結帳時，系統會自動發送包含以下內容的訂單確認 email：

- 訂單編號
- 訂單日期
- 商品清單（名稱、數量、單價、小計）
- 總金額
- 取貨資訊
- 重要提醒

Email 標題格式：`訂單確認 - 訂單編號：{orderId} | 大竹小倆口滷味`

### 開發和部署

```bash
# 開發模式
pnpm dev

# 部署到 Cloudflare Workers
pnpm deploy
```

### 資料庫

使用 Cloudflare D1 資料庫，包含以下主要表格：

- `users`: 用戶資訊
- `meals`: 餐點資訊
- `orders`: 訂單資訊
- `orderItems`: 訂單項目

### API 端點

- `POST /api/order/checkout`: 結帳（需要認證）
- `POST /api/order/monitor`: 獲取用戶訂單（需要認證）
- `POST /api/order/get_all_order`: 獲取所有訂單（需要認證）
- `POST /api/order/delete_order`: 刪除訂單（需要認證）
- `POST /api/order/complete_order`: 完成訂單（需要認證）
- `POST /api/order/test-email`: 測試 email 功能（無需認證）
