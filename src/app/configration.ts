import { data } from "jquery";

export class Configuration {
  BASE_URL = '';

  constructor(public state: projectState) {
    if (this.state == 'production') {
      //this.BASE_URL = "https://api.thecommunity-connect.com/";
      ////this.BASE_URL = "https://staging-api.thecommunity-connect.com/";
      // this.BASE_URL = "https://staging-api.spcsusa.org/";
      // this.BASE_URL ="https://apis.dfwgujaratisamaj.org/"
      this.BASE_URL = 'https://staging-api.techroversolutions.com/';
      // this.BASE_URL = "https://dev-api.communityclub.net/"
    } else if (this.state == "local") {
      this.BASE_URL = 'http://192.168.0.54:3010/';
    } else if (this.state == "spcs") {
      this.BASE_URL = "https://api.spcsusa.org/";
      //this.BASE_URL = 'https://staging-api.spcsusa.org/';
    } else if (this.state == "dfw") {
      // this.BASE_URL = 'https://apis.dfwgujaratisamaj.org/';
      this.BASE_URL = 'https://staging-api.techroversolutions.com/';
      // this.BASE_URL = "https://dev-api.communityclub.net/";
    }
    else if (this.state == "staging") {
      // this.BASE_URL = "https://dev-api.communityclub.net/"
      this.BASE_URL = 'https://staging-api.techroversolutions.com/';
      // this.BASE_URL = "https://spcs-api.techroversolutions.com/";      
      //  this.BASE_URL ="https://staging.iant.org/communityconnect/api/V1.0/";
      // this.BASE_URL ="https://apis.dfwgujaratisamaj.org/";
    }
    else {
      // this.BASE_URL = 'https://spcs-api.techroversolutions.com/';
      // this.BASE_URL = 'https://apis.dfwgujaratisamaj.org/';
      this.BASE_URL = 'https://staging-api.techroversolutions.com/';
      //  this.BASE_URL = "https://dev-api.communityclub.net/";
    }
    localStorage.setItem('baseUrl', this.BASE_URL);
  }

  getSurvey(date) {
    let current_datetime = new Date('2020-05-01T10:00:00.000+0000');
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var date1 = current_datetime.getFullYear() + "/" + this.appendLeadingZeroes(current_datetime.getMonth() + 1) + "/" + this.appendLeadingZeroes(current_datetime.getDate());

    var hours = current_datetime.getHours();
    var minutes: any = current_datetime.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    let formatted_date = this.dateFormat(date1) + " " + strTime;

    let timezone = current_datetime.toString().split('(')[1].slice(0, -1);
    return timezone;
  }

  getTime(date, status = true) {
    let dateTime = date.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");
    let current_datetime = new Date(dateTime);
    var hours = current_datetime.getHours();
    var minutes: any = current_datetime.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';

    minutes = minutes < 10 ? '0' + minutes : minutes;

    if (status == false) {
      var strTime = hours + ':' + minutes + ' ';
    } else {
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      var strTime = hours + ':' + minutes + ' ' + ampm;
    }


    let formatted_date = strTime;

    return formatted_date;
  }

  get_time(date, status = true) {
    let dateTime = date.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");

    let current_datetime = new Date(dateTime);
    var hours: any = current_datetime.getHours();
    var minutes: any = current_datetime.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';

    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;

    if (status == false) {
      var strTime = hours + ':' + minutes + ' ';
    } else {
      var strTime = hours + ':' + minutes;
    }


    let formatted_date = strTime;

    return formatted_date;
  }

  getTimeCreateEvent(date, status = true) {
    let dateTime = date;
    let current_datetime = new Date(dateTime);
    var hours = current_datetime.getHours();
    var minutes: any = current_datetime.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';

    minutes = minutes < 10 ? '0' + minutes : minutes;

    if (status == false) {
      var strTime = hours + ':' + minutes + ' ';
    } else {
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      var strTime = hours + ':' + minutes + ' ' + ampm;
    }


    let formatted_date = strTime;

    return formatted_date;
  }

  appendLeadingZeroes(n) {
    if (n <= 9) {
      return "0" + n;
    }
    return n
  }

  dateFormat(d) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    let dateTime = d.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dateObj = new Date(dateTime);
    var day = dateObj.getDate();
    var monthIndex = dateObj.getMonth();
    var year = dateObj.getFullYear();
    var dayName = days[dateObj.getDay()];
    var a = monthNames[monthIndex] + ' ' + day + ', ' + year;

    return a;
  }

  dateFormatCreateEvent(d) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    let dateTime = d;
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dateObj = new Date(dateTime);
    var day = dateObj.getDate();
    var monthIndex = dateObj.getMonth();
    var year = dateObj.getFullYear();
    var dayName = days[dateObj.getDay()];
    var a = monthNames[monthIndex] + ' ' + day + ', ' + year;

    return a;
  }

  eventDateFormat(d1, d2) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    let dateTime = d1.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");
    let dateTime2 = d2.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var dateObj = new Date(dateTime);
    var day = dateObj.getDate();
    var monthIndex = dateObj.getMonth();
    var year = dateObj.getFullYear();
    var dayName = days[dateObj.getDay()];
    var hours: any = dateObj.getHours();
    var minutes: any = dateObj.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;

    var date1 = monthNames[monthIndex] + ' ' + day + ', ' + year;
    var time1 = hours + ':' + minutes + ' ' + ampm;

    let dateObj1 = new Date(dateTime2);
    day = dateObj1.getDate();
    monthIndex = dateObj1.getMonth();
    year = dateObj1.getFullYear();
    hours = dateObj1.getHours();
    minutes = dateObj1.getMinutes();
    ampm = hours >= 12 ? 'PM' : 'AM';
    var dayName2 = days[dateObj1.getDay()];
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;

    var time2 = hours + ':' + minutes + ' ' + ampm;
    var date2 = monthNames[monthIndex] + ' ' + day + ', ' + year;
    var date = [];
    if (date1 == date2) {
      date.push(dayName + ' ' + date1);
      date.push(' from ' + time1 + ' - ' + time2);
    } else {
      date.push(dayName + ' ' + date1 + ' ' + time1 + ' To ');
      date.push(dayName2 + ' ' + date2 + ' ' + time2);
    }
    return date;
  }

  calculateAge(year) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    let currentDate = new Date();
    let day = currentDate.getDate();
    let monthIndex = currentDate.getMonth();
    let date = new Date((year + '/' + monthNames[monthIndex] + '/' + day));
    let timeDiff: any;
    let age: any;
    timeDiff = Math.abs(currentDate.getTime() - date.getTime());
    age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    console.log("age", age)
    return age;
  }

  format_date(d) {

    // var monthNames = [
    //   "January", "February", "March",
    //   "April", "May", "June", "July",
    //   "August", "September", "October",
    //   "November", "December"
    // ];
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let dateTime = d.replace(/([+\-]\d\d)(\d\d)$/, "$1:$2");
    var dateObj = new Date(dateTime);
    var day = dateObj.getDate();
    var monthIndex = dateObj.getMonth();
    var year = dateObj.getFullYear();
    var dayName = days[dateObj.getDay()];
    var hours = dateObj.getHours();
    var minutes: any = dateObj.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    let a;
    a = dayName + ' ' + monthNames[monthIndex] + ' ' + day + ', ' + year + ' ' + strTime;

    return a;
  }

  validRegisterTime(currentDate, startDate, endDate) {
    if ((currentDate.getTime() <= endDate.getTime() && currentDate.getTime() >= startDate.getTime())) {
    }
  }

  timeDifference(startDateTime) {
    let currentDate = new Date()
    let startDate = new Date(startDateTime)
    // @ts-ignore
    console.log(startDate - currentDate)
    // @ts-ignore
    return startDate - currentDate;

  }

  isValidUrl(string) {
    try {
      new URL(string);
    } catch (_) {
      return false;
    }

    return true;
  }

  dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

}

type projectState = 'staging' | 'production' | "local" | "spcs" | "test" | "dfw";
export const configuration = new Configuration('staging');