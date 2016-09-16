/**
 * Created by trongdoduc on 5/31/16.
 */

/*
 * DEVICE TYPE
 *  0 : NHIET DO
 *  1 : DO AM
 *  2 : BONG DEN DIGITAL
 *  3 : BONG DEN ANALOG
 *  4 : DIEU HOA
 *  5 : QUAT
 */

function Device(){
    
}
Device.prototype.id = 0;
Device.prototype.value = 0;
Device.prototype.isOn = 0;
Device.prototype.isSchedule = 0;
Device.prototype.fromSchedule = "00:00";
Device.prototype.toSchedule = "00:00";
Device.prototype.name = "";
Device.prototype.type = 0;
Device.prototype.fromValue = 0;
Device.prototype.toValue = 0;
Device.prototype.isDigital = false;
Device.prototype.isOutdoor = false;
Device.prototype.status = 1;
