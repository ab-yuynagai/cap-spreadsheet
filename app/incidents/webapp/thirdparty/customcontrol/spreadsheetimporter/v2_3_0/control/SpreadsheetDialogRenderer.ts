import RenderManager from 'sap/ui/core/RenderManager';
import DialogRenderer from 'sap/m/DialogRenderer';
import SpreadsheetDialog from './SpreadsheetDialog';
/**
 * @name cc.spreadsheetimporter.v2_3_0.SpreadsheetDialog
 */
// ui5lint-disable-next-line --  can´t use apiVersion: 2, because of support for 1.71, remove when out of support
export default {
  //apiVersion: 2,
  render: function (rm: RenderManager, control: SpreadsheetDialog) {
    // @ts-ignore
    DialogRenderer.render.apply(this, arguments);
  }
};
