# Kyosan Eats Frontend

## 概要

Next.js + TypeScript + TailwindCSS で作られたフロントエンドです。  
Docker を使って誰でも同じ開発環境を再現できます。

## 使用技術

Next.js 16, TypeScript, TailwindCSS, Docker

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

4. Docker のコンテナの立ち上げ

```bash
docker run -it -p 3000:3000 -v $(pwd):/app --workdir /app --name kyosan-eats-frontend nextjs-frontend

```

5. コンテナ内で依存関係をインストール（最初の 1 回だけ）

```bash
npm install
```

5. (補足)コンテナの中に別のターミナルから入る方法

```bash
docker exec -it kyosan-eats-frontend bash
```

5. (補足)コンテナから出る方法

```bash
exit
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
