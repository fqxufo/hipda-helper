CloudKit.configure({
  locale: 'zh-cn',
  containers: [{
    containerIdentifier: 'iCloud.wujichao.HiPDA',
    apiTokenAuth: {
      apiToken: '8f8836b5e9db0c4260ac058cabbb3b4d7a19f723ab78ced6f3fb997e72c08612',
      persist: true,
      signInButton: {
        id: 'apple-sign-in-button',
        theme: 'white-with-outline' // 'black', 'white', 'white-with-outline'
      },
      signOutButton: {
        id: 'apple-sign-out-button',
        theme: 'white-with-outline' // 'black', 'white', 'white-with-outline'
      }
    },
    environment: 'production'
  }]
});




var container = CloudKit.getDefaultContainer();
container.setUpAuth().then(function (userInfo) {
  console.info('fuck yeah working!')
  if (userInfo) {
    // The user is authenticated
  } else {
    console.log("Need Login");
  }
});

container.whenUserSignsIn().then(function (userInfo) {  // The user just signed in
  if (userInfo) {
    console.log('signed in');
  } else {
    console.log("Need Login");
  }
});

var recordName = 'blocklist';
async function fetchRecord(callback) {
  console.log('fetchRecord...');

  var container = CloudKit.getDefaultContainer();
  var privateDatabase = container.privateCloudDatabase;
  var res = await privateDatabase.fetchRecords(recordName);

  console.log(res);
  var record = res.records[0];

  var changeTime = record.modified.timestamp;
  var date = new Date(changeTime);
  Y = date.getFullYear() + '-';
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  D = date.getDate() + ' ';
  h = date.getHours() + ':';
  m = date.getMinutes() + ':';
  s = date.getSeconds();

  console.log('cookie:  ', document.cookie);
  console.log(changeTime);
  console.log(Y + M + D + h + m + s);



  var timespan = document.getElementById('changetime');

  timespan.innerHTML = Y + M + D + h + m + s;



  console.log(record.fields.list);
  var namelist = record.fields.list.value

  console.log(namelist.length);
  var index;
  for (index = 0; index < namelist.length; index += 1) {
    console.log(namelist[index]);
    var ppp = document.createElement('p');
    ppp.innerHTML = namelist[index];
    document.body.appendChild(ppp);
  }

  return namelist
}



async function mainwork(){
  var icloudlist = await fetchRecord();
  console.log('名单数据是 ',icloudlist);

  chrome.storage.local.set({'icloudblacklist':icloudlist});
}


window.onload=function(){
var fetchbutton = document.getElementById("fetchbutton");
fetchbutton.addEventListener("click", mainwork);
}

