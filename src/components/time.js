export function convertDurationToTime(duration) {
    duration = Number(duration);
    var h = Math.floor(duration / 3600);
    var m = Math.floor((duration % 3600) / 60);
    var s = Math.floor((duration % 3600) % 60);
    var hDisplay = h == 0 ? '' : h + ':';
    var mDisplay = m < 9? "0"+ m + ':' : m + ':';
    var sDisplay = s;
  
    return hDisplay + mDisplay + sDisplay;
  }