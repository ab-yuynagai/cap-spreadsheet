# BTP TutorialのサンプルコードにSpreadsheet Importerを組み込む

## 参照したサイト
- BTP Turtorialのサンプルコード
  - https://github.com/cap-js/incidents-app
  - Incident管理の簡易的なアプリ
- Spreadsheet Importer組み込み手順
  - https://docs.spreadsheet-importer.com/pages/GettingStarted/#option-a-install-from-npm
  - オプションAを実施

## 実行環境
- BTP Trial環境

## Spreadsheet Importer組み込み（ローカル）
### GetStared以外に必要な手順のみ記載
- 以下に記載されたパスにspreadsheetimporterのファイルをコピー
  ```
  "resourceRoots": {
    "cc.spreadsheetimporter.v2_3_0": "./thirdparty/customcontrol/spreadsheetimporter/v2_3_0"
  }
  ```
  - 今回は、`node_modules/ui5-cc-spreadsheetimporter/dist`直下を`app/incidents/webapp/thridparty/~/v2_3_0`直下にコピー
- BASのPageMapからActionを追加
  - `conversation/table/toolbar/`からActionを追加
    - ID等は自由に設定
  - `app/incidents/webapp/ext/controller`直下にファイルが追加
    - このファイルを書き換えて、Spreadsheet Importerの機能を組み込む
      - 今回は、`Upload.js`となる
- `upload.js`の修正
  - コードの説明は省略
  - `tableId`に追加対象となるテーブルのIDを記載
    - 開発者ツールから確認
  - `sap.ui.getCore().byId("<View ID>")`に対象となるView IDを記載
    - `manifest.json`等で確認


### 動かし方
- `cds watch`でアプリを起動して該当画面に遷移後、編集モードで`Upload`ボタンを押下するとダイアログが開きファイルを選択可能

## デプロイについて
### 手順
- BTPチュートリアルのデプロイ手順→GetStartedのデプロイ手順の順番で進めた
  - https://developers.sap.com/group.cap-application-full-stack.html
  - https://developers.sap.com/group.deploy-full-stack-cap-application.html
- Spreadsheet Importerを組み込む過程でObjectStoreを利用
  - Trial環境ではObjectStoreは使用できないためデプロイは未確認

