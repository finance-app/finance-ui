import { AlertsCommon } from './alerts.common';
import * as Toast from "nativescript-toast";

export class AlertsService extends AlertsCommon {

  public addAlert(id: string, type: string, message: string, reload: boolean = false) {
    super.addAlert(id, type, message, reload);
    Toast.makeText(message, "long").show();
  }
}
