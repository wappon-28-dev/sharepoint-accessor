#!/usr/bin/env bash
set -euxo pipefail
cd $(dirname $0)

# デプロイされるディレクトリを掃除
rm -rf ./dist/*

npx tsc

sed -e 's/bun/npm/g' ./package.json > ./dist/package.json
sed -i -e '/npm-types/d' ./dist/package.json

gcloud functions deploy sharepoint-accessor \
--gen2 \
--entry-point=main \
--source=./dist \
--region=asia-northeast2 \
--runtime=nodejs16 \
--memory=128Mi \
--env-vars-file=env.yaml \
--trigger-http \
--allow-unauthenticated