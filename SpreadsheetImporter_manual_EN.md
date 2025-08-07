# Integrating Spreadsheet Importer into the BTP Tutorial Sample Code

## Referenced Sites
- BTP Tutorial Sample Code  
  - https://github.com/cap-js/incidents-app  
  - A simple incident management application
- Spreadsheet Importer Integration Guide  
  - https://docs.spreadsheet-importer.com/pages/GettingStarted/#option-a-install-from-npm  
  - Followed Option A

## Execution Environment
- BTP Trial Environment

## Integrating Spreadsheet Importer (Local)
### Only the steps not covered in "Getting Started" are described here
- Copy the Spreadsheet Importer files to the path specified below:
  ```json
  "resourceRoots": {
    "cc.spreadsheetimporter.v2_3_0": "./thirdparty/customcontrol/spreadsheetimporter/v2_3_0"
  }
  ```
  - In this case, copy everything under `node_modules/ui5-cc-spreadsheetimporter/dist` to `app/incidents/webapp/thirdparty/customcontrol/spreadsheetimporter/v2_3_0`.

- Add an Action from the BAS Page Map:
  - Add the Action from `conversation/table/toolbar/`
    - You can set the ID and other properties freely
  - A file will be added under `app/incidents/webapp/ext/controller`
    - Modify this file to incorporate Spreadsheet Importer functionality
      - In this case, the file is `Upload.js`

- Modifications to `Upload.js`:
  - Code explanations are omitted
  - Set the `tableId` to the ID of the target table
    - You can check the ID using developer tools
  - Set the target View ID in `sap.ui.getCore().byId("<View ID>")`
    - Confirm the ID in `manifest.json` or similar files

### How to Run
- After launching the app with `cds watch` and navigating to the relevant screen, press the `Upload` button in edit mode. A dialog will open, allowing you to select a file.

## About Deployment
### Steps
- Followed the BTP tutorial deployment procedure, then the Getting Started deployment procedure:
  - https://developers.sap.com/group.cap-application-full-stack.html  
  - https://developers.sap.com/group.deploy-full-stack-cap-application.html  
- During integration of Spreadsheet Importer, `ObjectStore` is used
  - Since `ObjectStore` is not available in the trial environment, an alternative solution is required