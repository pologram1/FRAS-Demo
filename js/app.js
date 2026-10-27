/**
 * FRAS browser prototype — application state, navigation and simulated workflows.
 * All records are fictional and held in memory; no real biometric recognition.
 */

const $=id=>document.getElementById(id),names=['Student A','Student B','Student C','Student D','Student E','Student F','Student G','Student H'];
let role='prof',page='sections',session=false,records= {
},flagged= {
},preview=null,consent=false,photos=0,users=[ {
  name:'Prof. A. Example',email:'a.example@university.edu',role:'Professor',active:true
}, {
  name:'Admin C',email:'c.admin@university.edu',role:'Administrator',active:true
}],backups=[],sync='Not connected';
const courses=[['CPEN 491','001','MW 10:00–11:20','B-203',28],['CPEN 410','002','TTh 1:00–2:20','B-110',31],['CPEN 457','001','F 9:00–11:50','LAB-2',18]];
const pages= {
  prof:[['sections','Dashboard'],['session','Sessions'],['reports','Reports']],admin:[['dashboard','Dashboard'],['facial','Facial data'],['courses','Course data'],['users','User accounts'],['backups','Backups']]
};
function studentAvatar(i) {
  let skins=['#d9a77f','#8f6049','#efc6a5','#b97e59','#d6a184','#9b694c','#e1b28c','#ae7354'],hair=['#26252b','#352b29','#4b3024','#202b32','#5a3d2d','#292b30','#443126','#312827'];
  let svg='<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="#e9edf1"/><circle cx="90" cy="74" r="42" fill="'+hair[i%8]+'"/><ellipse cx="90" cy="83" rx="35" ry="43" fill="'+skins[i%8]+'"/><path d="M49 65 Q56 13 101 32 Q137 35 131 71 Q106 52 92 52 Q70 69 49 65" fill="'+hair[i%8]+'"/><circle cx="77" cy="85" r="3" fill="#282b32"/><circle cx="104" cy="85" r="3" fill="#282b32"/><path d="M80 107 Q90 114 100 107" fill="none" stroke="#85564b" stroke-width="2.5" stroke-linecap="round"/><path d="M20 180 Q23 128 90 130 Q157 128 160 180" fill="#566b81"/><text x="90" y="170" font-family="Arial" font-size="11" fill="white" text-anchor="middle">DEMO STUDENT '+String.fromCharCode(65+Number(i))+'</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)
};
function login() {
  role=$('role').value;
  page=role==='prof'?'sections':'dashboard';
  $('login').classList.add('hidden');
  $('app').classList.remove('hidden');
  $('roleLabel').textContent=role==='prof'?'PROFESSOR WORKSPACE':'ADMINISTRATOR WORKSPACE';
  render()
}
function logout() {
  $('app').classList.add('hidden');
  $('login').classList.remove('hidden')
}
function nav(p) {
  page=p;
  render()
}
function sessionTab(p) {
  page=p;
  render()
}
function sessionTabs(active) {
  return '<div class="actions" style="margin:14px 0 22px">'+btn('Session overview',"sessionTab('session')",active==='session'?'primary':'')+btn('Review attendance'+(Object.keys(flagged).length?' ('+Object.keys(flagged).length+')':''),"sessionTab('review')",active==='review'?'primary':'')+'</div>'
}
function title(t,sub='') {
  return '<div class="eyebrow">FRAS / '+(role==='prof'?'Professor':'Administrator')+' / '+t+'</div><h1>'+t+'</h1><p class="sub">'+sub+'</p><div class="bar"></div>'
}
function btn(t,fn,cls='') {
  return '<button class="btn '+cls+'" onclick="'+fn+'">'+t+'</button>'
}
function render() {
  $('menu').innerHTML=pages[role].map(([p,n])=>'<button class="'+(page===p?'active':'')+'" onclick="nav(\''+p+'\')">'+n+'</button>').join('');
  let c='';
  if(page==='sections') {
    c=title('My sections','Fall 2026 · Prof. A. Example · Classroom attendance overview')+'<div class="panel"><h2>Assigned sections</h2><table><tr><th>Course</th><th>Section</th><th>Schedule</th><th>Room</th><th>Students</th><th>Action</th></tr>'+courses.map((r,i)=>'<tr>'+r.map(x=>'<td>'+x+'</td>').join('')+'<td>'+btn(i===0?(session?'Open session':'Start session'):'Not scheduled',i===0?'start()':'void(0)',i===0?'primary':'')+'</td></tr>').join('')+'</table><p class="sub">Demo: CPEN 491-001 is the active section. Only one session may be open.</p></div><div class="grid"><div class="panel stat"><h2>Last session</h2><p>CPEN 491-001</p>'+btn('Review list','nav(\'review\')')+'</div><div class="panel stat"><h2>Pending reviews</h2><strong>'+Object.keys(flagged).length+'</strong>'+btn('Open review','nav(\'review\')')+'</div><div class="panel stat"><h2>Session status</h2><strong style="font-size:23px">'+(session?'Open':'Closed')+'</strong>'+btn('Go to sessions','nav(\'session\')')+'</div></div>'
  }
  if(page==='session') {
    c=title('Attendance session',' · Capture → Recognize → Record')+sessionTabs('session')+'<div class="panel"><div class="row"><div><h2>CPEN 491-001 · '+(session?'Session open':'Session closed')+'</h2><p class="sub">Image capture is simulated. No live camera view, as specified in the presentation.</p></div>'+btn(session?'Close session':'Start session',session?'end()':'start()','primary')+'</div></div><div class="two"><div class="panel"><h2>Recognized students</h2><table><tr><th>Student</th><th>Time</th><th>Status</th><th>Image</th></tr>'+names.map((n,i)=>'<tr><td>'+n+'</td><td>'+(records[i]?.time||'—')+'</td><td><span class="pill '+(records[i]?.status==='Present'?'ok':flagged[i]?'warn':'')+'">'+(records[i]?.status|| (flagged[i]?'Flagged':'Not seen'))+'</span></td><td>'+btn('Preview','showPreview('+i+')')+'</td></tr>').join('')+'</table></div><div><div class="panel"><h2>Preview · '+(preview===null?'Select a student':names[preview])+'</h2><div class="preview">'+(preview===null?'Select a student to preview':'<img alt="Illustrated demo portrait" style="max-height:145px;width:auto" src="'+studentAvatar(preview)+'">')+'</div><p class="sub">Temporary preview · demonstration only</p></div><div class="panel"><h2>Simulate capture</h2><div class="form"><label>Student</label><select id="captureStudent">'+names.map((n,i)=>'<option value="'+i+'">'+n+'</option>').join('')+'</select><div class="actions">'+btn('Recognize','capture(false)','orange')+btn('Flag low confidence','capture(true)')+'</div></div><p class="sub">Requires an open session. Duplicate recognition is blocked.</p></div><div class="panel"><h2>Summary</h2><p>Recognized '+Object.keys(records).length+' / '+names.length+'</p><p>Flagged for review '+Object.keys(flagged).length+'</p></div></div></div>'
  }
  if(page==='review') {
    c=title('Review attendance',' · Correct statuses and manually add attendance')+sessionTabs('review')+'<div class="panel"><div class="row"><h2>CPEN 491-001 · Attendance review</h2>'+btn('Save changes','save()','primary')+'</div><table><tr><th>Student</th><th>Time</th><th>Status</th><th>Source</th></tr>'+names.map((n,i)=>'<tr><td>'+n+'</td><td>'+(records[i]?.time||'—')+'</td><td><select onchange="setStatus('+i+',this.value)">'+['Present','Late','Absent'].map(s=>'<option '+((records[i]?.status||'Absent')===s?'selected':'')+'>'+s+'</option>').join('')+'</select></td><td>'+(records[i]?.source||'—')+'</td></tr>').join('')+'</table></div><div class="two"><div class="panel"><h2>Flagged for review</h2>'+ (Object.keys(flagged).length?Object.keys(flagged).map(i=>'<div class="notice"><div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><img alt="Simulated portrait of '+names[i]+'" src="'+studentAvatar(i)+'" style="width:110px;height:110px;border:1px solid #d3d8df;border-radius:6px"><div><strong>Possible match: '+names[i]+'</strong><br><small>Low confidence · illustrated demo portrait, not a real capture</small><br><br>'+btn('Confirm','confirmFlag('+i+')','primary')+' '+btn('Reject','rejectFlag('+i+')')+'</div></div></div>').join(''):'<p class="sub">No flagged faces. Flag a student from the Sessions screen.</p>')+'</div><div class="panel"><h2>Manual entry</h2><p class="sub">Select an authorized roster student to record attendance manually.</p><select id="manual">'+names.map((n,i)=>'<option value="'+i+'">'+n+'</option>').join('')+'</select><p>'+btn('Add to list','manualAdd()','primary')+'</p></div></div>'
  }
  if(page==='reports') {
    c=title('Attendance reports',' · Filter by section and export records')+'<div class="panel"><div class="grid"><div><label>Section</label><select><option>CPEN 491-001</option></select></div><div><label>From</label><input type="date"></div><div><label>To</label><input type="date"></div></div></div><div class="panel"><h2>Attendance summary</h2><table><tr><th>Student</th><th>Present</th><th>Late</th><th>Absent</th><th>Attendance %</th></tr>'+names.map((n,i)=> {
      let st=records[i]?.status;
      return '<tr><td>'+n+'</td><td>'+(st==='Present'?1:0)+'</td><td>'+(st==='Late'?1:0)+'</td><td>'+(st==='Absent'||!st?1:0)+'</td><td>'+(st==='Present'||st==='Late'?'100%':'0%')+'</td></tr>'
    }).join('')+'</table><p class="actions">'+btn('Export Excel-compatible CSV','csv()','primary')+btn('Print / Save as PDF','window.print()')+'</p></div>'
  }
  if(page==='dashboard') {
    c=title('Administrator dashboard',' · System overview')+'<div class="grid"><div class="panel stat"><h2>Facial data</h2><strong>'+photos+'/3</strong><small>Simulated reference image slots</small></div><div class="panel stat"><h2>Course data</h2><strong style="font-size:18px">'+sync+'</strong><small>University connection not configured</small></div><div class="panel stat"><h2>Backups</h2><strong>'+backups.length+'</strong><small>Demo backup snapshots</small></div></div><div class="panel"><h2>Sessions open now</h2><table><tr><th>Course</th><th>Section</th><th>Professor</th><th>Status</th><th>Recognized</th></tr><tr><td>CPEN 491</td><td>001</td><td>Prof. A. Example</td><td>'+(session?'Open':'Closed')+'</td><td>'+Object.keys(records).length+'/'+names.length+'</td></tr></table></div>'
  }
  if(page==='facial') {
    c=title('Student facial data',' · Enrollment and consent')+'<div class="panel"><label>Search student (demo roster)</label><select id="enrollStudent">'+names.map(n=>'<option>'+n+'</option>').join('')+'</select></div><div class="two"><div class="panel"><h2>Student</h2><div class="preview">Student image placeholder</div><p>Facial data: '+(photos===3?'Demo enrolled':'Not enrolled')+'</p><label><input style="width:auto" type="checkbox" id="consent" '+(consent?'checked':'')+' onchange="consent=this.checked"> Student informed about facial data use</label></div><div class="panel"><h2>Reference images</h2><div class="grid">'+[1,2,3].map(i=>'<div class="preview">'+(photos>=i?'Demo image '+i:'Image '+i+' empty')+'</div>').join('')+'</div><p class="actions">'+btn('Capture image (simulation)','enroll()','primary')+btn('Save demo enrollment','saveEnroll()')+btn('Delete demo data','deleteEnroll()')+'</p></div></div><div class="notice">This prototype does not access a camera or collect biometric information.</div>'
  }
  if(page==='courses') {
    c=title('Course data',' · Read-only university roster integration')+'<div class="panel"><div class="row"><p>Last sync: '+sync+'</p>'+btn('Simulate sync','syncNow()','primary')+'</div><p class="sub">The university information system is not connected. These are fictional sample courses.</p><table><tr><th>Course</th><th>Section</th><th>Professor</th><th>Schedule</th><th>Room</th><th>Students</th></tr>'+courses.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>Prof. A. Example</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td></tr>').join('')+'</table></div>'
  }
  if(page==='users') {
    c=title('User accounts',' · Manage professor and administrator accounts')+'<div class="panel"><div class="row"><h2>Accounts</h2>'+btn('+ New demo account','newUser()','primary')+'</div><table><tr><th>Name</th><th>E-mail</th><th>Role</th><th>Status</th><th>Action</th></tr>'+users.map((u,i)=>'<tr><td>'+u.name+'</td><td>'+u.email+'</td><td>'+u.role+'</td><td>'+(u.active?'Active':'Inactive')+'</td><td>'+btn(u.active?'Deactivate':'Activate','toggleUser('+i+')')+'</td></tr>').join('')+'</table><p class="sub">Accounts are simulated; this demo does not create actual login credentials.</p></div>'
  }
  if(page==='backups') {
    c=title('Backups',' · Create, download, restore, or delete backup snapshots')+'<div class="panel"><div class="row"><h2>Backup management</h2>'+btn('Create demo backup','backup()','primary')+'</div><p class="sub">Snapshots contain only fictional demo attendance data.</p><table><tr><th>Date</th><th>Type</th><th>Status</th><th>Actions</th></tr>'+backups.map((b,i)=>'<tr><td>'+b.date+'</td><td>Manual</td><td>Valid</td><td>'+btn('Download','downloadBackup('+i+')')+' '+btn('Restore','restore('+i+')')+' '+btn('Delete','deleteBackup('+i+')')+'</td></tr>').join('')+'</table></div>'
  }
  $('content').innerHTML=c
}
function start() {
  session=true;
  records= {
  };
  flagged= {
  };
  page='session';
  render()
}
function end() {
  session=false;
  names.forEach((_,i)=> {
    if(!records[i]&&!flagged[i])records[i]= {
      status:'Absent',time:'—',source:'System'
    }
  });
  page='review';
  render()
}
function capture(low) {
  if(!session)return alert('Start a session first.');
  let i=$('captureStudent').value;
  if(records[i]||flagged[i])return alert('Already processed.');
  if(low)flagged[i]=true;
  else records[i]= {
    status:'Present',time:new Date().toLocaleTimeString(),source:'Automatic (simulated)'
  };
  preview=+i;
  render()
}
function showPreview(i) {
  preview=i;
  render()
}
function setStatus(i,s) {
  records[i]= {
    status:s,time:records[i]?.time||new Date().toLocaleTimeString(),source:'Manual correction'
  };
  render()
}
function confirmFlag(i) {
  delete flagged[i];
  records[i]= {
    status:'Present',time:new Date().toLocaleTimeString(),source:'Confirmed by professor'
  };
  render()
}
function rejectFlag(i) {
  delete flagged[i];
  records[i]= {
    status:'Absent',time:'—',source:'Rejected'
  };
  render()
}
function manualAdd() {
  let i=$('manual').value;
  records[i]= {
    status:'Present',time:new Date().toLocaleTimeString(),source:'Manual'
  };
  render()
}
function save() {
  alert('Demo changes saved for this browser session.')
}
function csv() {
  let s='Student,Status,Time,Source\n'+names.map((n,i)=>[n,records[i]?.status||'Absent',records[i]?.time||'',records[i]?.source||''].join(',')).join('\n');
  download('FRAS-report.csv',s,'text/csv')
}
function download(name,data,type) {
  let a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([data], {
    type
  }));
  a.download=name;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
function enroll() {
  if(!consent)return alert('Confirm consent before simulating enrollment.');
  photos=Math.min(3,photos+1);
  render()
}
function saveEnroll() {
  alert(photos===3?'Demo enrollment complete.':'Capture three simulated reference images first.')
}
function deleteEnroll() {
  photos=0;
  consent=false;
  render()
}
function syncNow() {
  sync='Demo synced';
  render()
}
function newUser() {
  let name=prompt('Demo account name');
  if(name) {
    users.push( {
      name,email:'demo'+users.length+'@university.edu',role:'Professor',active:true
    });
    render()
  }
}
function toggleUser(i) {
  users[i].active=!users[i].active;
  render()
}
function backup() {
  backups.unshift( {
    date:new Date().toLocaleString(),data:JSON.stringify( {
      records,flagged
    })
  });
  render()
}
function downloadBackup(i) {
  download('FRAS-demo-backup.json',backups[i].data,'application/json')
}
function restore(i) {
  if(confirm('Restore this demo snapshot?')) {
    let x=JSON.parse(backups[i].data);
    records=x.records;
    flagged=x.flagged;
    render()
  }
}
function deleteBackup(i) {
  if(confirm('Delete this demo backup?')) {
    backups.splice(i,1);
    render()
  }
}
