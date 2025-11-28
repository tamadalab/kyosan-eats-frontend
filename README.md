# Kyosan Eats Frontend

## 概要

Next.js + TypeScript + TailwindCSS で作られたフロントエンドです。  
開発用の Dockerfile（`Dockerfile.dev`）を用意しており、Node.js 20 ベースのイメージで依存関係をイメージビルド時にインストールします。M1/M2（arm64）環境でも公式 Node イメージを使うため動作しやすく、コンテナを通してローカルと同一の開発環境を再現できます。コンテナは外部からアクセス可能にするために 0.0.0.0:3000 で起動します。

## 使用技術

- Next.js
- TypeScript
- TailwindCSS
- Node.js 20 (公式 Node イメージ / Debian ベース)
- Docker（開発用: `Dockerfile.dev`）

注: `Dockerfile.dev` は依存をイメージビルド時にインストールするため、基本的にはコンテナ内で追加の `npm install` を実行する必要はありません。ただし、ホストのソースをコンテナにボリュームマウントするとホスト側のファイルがコンテナ内のファイルを上書きするため、マウント時は `node_modules` の扱いに注意してください。

## 🛠 環境構築

1. リポジトリをクローン

```bash
git clone git@github.com:tamadalab/kyosan-eats-frontend.git
```

2. ディレクトリを移動

```bash
cd kyosan-eats-frontend
```

3. Docker イメージを build(最初の一回だけ)

```bash
docker build -t nextjs-frontend -f Dockerfile.dev .
```

4. Docker のコンテナの立ち上げ(マウントして起動)

```bash
docker run -it -p 3000:3000 -v $(pwd):/app --workdir /app --name kyosan-eats-frontend nextjs-frontend
```

5. (補足)マウント時に node_modules が無い/上書きされたらコンテナに入って npm install

```bash
docker exec -it kyosan-eats-frontend bash
npm install
```

6. (補足)コンテナから出る方法

```bash
exit
```

7. ブラウザで開く URL

```bash
http://localhost:3000
```

## git の簡単な操作方法

1. リモートへのアップロード方法

```bash
git add .
git commit -m "メッセージ"
git push
```

2. ローカルにあるブランチ確認(\*現在の作業ブランチ)

```bash
git branch
```

3. リモート追跡ブランチ一覧

```bash
git branch -r
```

4. ブランチを移動

```bash
git checkout [ブランチ名]
```

5. ブランチを作成し、移動 + ローカルブランチをリモートに反映

ローカルとリモートを同じにしたいので、同じ名前でリモートにも登録してください

```bash
git checkout -b [ブランチ名]
git push -u origin [ブランチ名]
```
