# 問い合わせ機能のセットアップ手順

## 1. Supabase テーブル確認

テーブル `inquiries` が以下のスキーマで存在することを確認してください：

```sql
CREATE TABLE inquiries (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITHOUT TIME ZONE
);
```

## 2. RLS（Row Level Security）ポリシー設定

Supabase ダッシュボードで以下を設定：

1. **テーブル: `inquiries`** → **Authentication** → **Enable RLS**

2. **ポリシーを追加**:

### Policy 1: 匿名ユーザーが INSERT 可能（新規投稿用）

```sql
CREATE POLICY "Allow anonymous insert" ON inquiries
FOR INSERT
WITH CHECK (true);
```

- **Effect**: Allow
- **Target**: inquiries table
- **For**: INSERT
- **With Check**: `true` (常に許可)

### Policy 2: 全員が SELECT 可能（オプション - 投稿確認用）

```sql
CREATE POLICY "Allow public select" ON inquiries
FOR SELECT
USING (true);
```

## 3. 環境変数確認

`.env.local` に以下が設定されていることを確認：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. テスト手順

1. 開発サーバーを起動: `npm run dev`
2. `http://localhost:3000/contact` にアクセス
3. メールアドレスと内容を入力して「送信」をクリック
4. Supabase ダッシュボード → SQL Editor で以下を実行して確認:

```sql
SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 10;
```

## 5. トラブルシューティング

### 「メールアドレスが必要です」エラー
- フォームのメールフィールドが空になっていないか確認
- API レスポンスを確認: ブラウザの Developer Tools → Network タブで `/api/contact` の POST リクエストを確認

### データベース接続エラー
- Supabase URL と ANON キーが正しいか確認
- RLS ポリシーが INSERT を許可しているか確認
- `.env.local` を修正後、開発サーバーを再起動

### ネットワークエラー
- ブラウザコンソールで詳細なエラーメッセージを確認
- CORS が設定されているか確認（Supabase は CORS 対応）
