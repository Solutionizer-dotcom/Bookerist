(this.webpackJsonpbookerist=this.webpackJsonpbookerist||[]).push([[0],[,,,,,,,,,,,,,,,function(e,t,n){},,,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){},,,,,function(e,t,n){},function(e,t,n){},,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(3),s=n.n(a),i=n(11),o=n.n(i),r=n(4),l=n(5),c=n(6),d=n(8),p=n(7),h=(n(30),n(31),n(25)),u=n(17),m=n(20),j=n(21),b=n(18),v=(n(36),n(22)),O=n(24),f=(n(37),n(15),n(2)),g=function(e){Object(d.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).getHeaderTxt=function(){return{dispo:"Cr\xe9er une nouvelle disponibilit\xe9",rdv:"Cr\xe9er un nouveau rendez-vous",evenement:"Cr\xe9er un nouvel \xe9v\xe8nement"}[a.state.eventType]},a.handleChanges=function(e){var t=e.target.name,n=e.target.value;a.setState(Object(r.a)({},t,n))},a.handleCheckboxChanges=function(e){var t=e.target.name,n=e.target.checked;!0===n&&a.setState({startTime:"",endTime:""}),a.setState(Object(r.a)({},t,n))},a.handleReset=function(e){a.setState({eventType:"dispo",allDay:!1,startDate:"",startTime:"",endDate:"",endTime:"",other_users:[],users_invites:[]})},a.handleClose=function(e){a.props.handleCloseModal()},a.handleSave=function(e){e.preventDefault();var t={};"evenement"===a.state.eventType&&(t={title:a.state.objet,extendedProps:{user_mail:a.props.mail,users_invited:a.state.users_invites,type:a.state.eventType,description:a.state.description},allDay:a.state.allDay,start:a.state.startDate+(a.state.allDay?"":"T"+a.state.startTime),end:a.state.endDate+(a.state.allDay?"":"T"+a.state.endTime),color:"rgb(177, 214, 153)",textColor:"rgb(138, 74, 176)"}),a.clearState(),a.props.handleAddEvent(t),a.handleClose()},a.renderEventDate=function(){return Object(f.jsx)("div",{id:"div_date",children:Object(f.jsx)("table",{className:"tableEventDate",children:Object(f.jsxs)("tbody",{children:[Object(f.jsxs)("tr",{className:"tr_allday",children:[Object(f.jsx)("td",{children:Object(f.jsx)("input",{type:"checkbox",name:"allDay",id:"allDay",value:"allDay",onChange:a.handleCheckboxChanges})}),Object(f.jsx)("td",{children:Object(f.jsx)("label",{htmlFor:"allDay",name:"labelAllDay",id:"labelAllDay",children:"Toute la journ\xe9e"})})]}),Object(f.jsxs)("tr",{className:"tr_startDate",children:[Object(f.jsx)("td",{children:Object(f.jsx)("label",{htmlFor:"startDate",children:"Date de d\xe9but : "})}),Object(f.jsxs)("td",{children:[Object(f.jsx)("input",{type:"date",name:"startDate",onChange:a.handleChanges,value:a.state.startDate,required:!0}),Object(f.jsx)("input",{type:"time",name:"startTime",onChange:a.handleChanges,value:a.state.startTime,disabled:a.state.allDay})]})]}),Object(f.jsxs)("tr",{className:"tr_endDate",children:[Object(f.jsx)("td",{children:Object(f.jsx)("label",{htmlFor:"endDate",children:"Date de fin : "})}),Object(f.jsxs)("td",{children:[Object(f.jsx)("input",{type:"date",name:"endDate",onChange:a.handleChanges,value:a.state.endDate,required:!0}),Object(f.jsx)("input",{type:"time",name:"endTime",onChange:a.handleChanges,value:a.state.endTime,disabled:a.state.allDay})]})]})]})})})},a.renderEventObjAndDescription=function(){return Object(f.jsx)("div",{children:Object(f.jsx)("table",{className:"table_Obj_description",children:Object(f.jsxs)("tbody",{children:[Object(f.jsxs)("tr",{className:"tr_obj",children:[Object(f.jsx)("td",{children:Object(f.jsx)("label",{htmlFor:"inputObj",children:"Objet : "})}),Object(f.jsx)("td",{children:Object(f.jsx)("input",{type:"text",name:"objet",id:"inputObj",maxLength:"30",onChange:a.handleChanges,autoComplete:"off",required:!0})})]}),Object(f.jsxs)("tr",{className:"tr_description",children:[Object(f.jsx)("td",{children:Object(f.jsx)("label",{htmlFor:"inputDescription",children:"Description : "})}),Object(f.jsx)("td",{children:Object(f.jsx)("textarea",{name:"description",id:"inputDescription",maxLength:"130",value:a.state.description,onChange:a.handleChanges})})]})]})})})},a.generateDatalist=function(){return a.state.other_users.map((function(e){return Object(f.jsx)("option",{value:e.prenom+" "+e.nom+" <"+e.mail+">"},e._id)}))},a.handleAddInvite=function(){var e=document.getElementById("searchBarInvite").value;if(e&&""!==e){var t=[e.indexOf("<")+1,e.indexOf(">")],n=e.substring(t[0],t[1]),s=a.state.other_users.find((function(e){return e.mail===n})),i=!!a.state.users_invites.find((function(e){return e._id===s._id}));document.getElementById("searchBarInvite").value="",i||a.setState({users_invites:[].concat(Object(O.a)(a.state.users_invites),[s])})}},a.generateListeInvites=function(){var e=a.state.users_invites.sort((function(e,t){return e.nom.toUpperCase()<t.nom.toUpperCase()?-1:e.nom.toUpperCase()>t.nom.toUpperCase()?1:0}));return(e=e.map((function(e){return e.prenom+" "+e.nom+" <"+e.mail+">\n"}))).toString().replaceAll(",","")},a.renderEventTypeContent=function(){var e=null;return!1===a.state.eventType||"dispo"===a.state.eventType?e=Object(f.jsx)("div",{className:"eventTypeContent",children:a.renderEventDate()}):"evenement"===a.state.eventType&&(e=Object(f.jsxs)("div",{className:"eventTypeContent",children:[a.renderEventObjAndDescription(),a.renderEventDate(),Object(f.jsx)("table",{className:"tableEventTypeContent_evenement",children:Object(f.jsxs)("tbody",{children:[Object(f.jsxs)("tr",{className:"searchInvites",children:[Object(f.jsx)("td",{children:Object(f.jsx)("label",{htmlFor:"labelSearchInvites",children:"Personnes \xe0 inviter \xe0 l'\xe9v\xe8nement : "})}),Object(f.jsxs)("td",{children:[Object(f.jsx)("input",{list:"usersList",name:"searchBarInvite",className:"searchBar",id:"searchBarInvite",onChange:a.handleChanges,autoComplete:"off"}),Object(f.jsx)("datalist",{id:"usersList",children:a.generateDatalist()}),Object(f.jsx)("button",{type:"button",name:"addButtonInvite",className:"addButton",id:"addButtonInvite",onClick:a.handleAddInvite})]})]}),Object(f.jsx)("tr",{children:Object(f.jsx)("td",{className:"liste_invites",id:"liste_invites_label",colSpan:"2",children:Object(f.jsx)("label",{htmlFor:"liste_invites",children:"Personnes invit\xe9es : "})})}),Object(f.jsx)("tr",{id:"tr_liste_invites_content",children:Object(f.jsx)("td",{className:"liste_invites",id:"liste_invites_content",colSpan:"2",children:Object(f.jsx)("textarea",{name:"liste_invites",id:"liste_invites",readOnly:!0,disabled:!0,value:a.generateListeInvites()})})})]})})]})),e},a.state={eventType:a.props.eventType&&""!==a.props.eventType?a.props.eventType:"dispo",allDay:!1,startDate:"",startTime:"",endDate:"",endTime:"",objet:"",description:"",getProps:!1,alreadyFetched:!1,other_users:[],users_invites:[]},a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(){var e=this;if(!this.state.getProps){var t,n=Object(v.a)(["startDate","startTime","endDate","endTime"]);try{for(n.s();!(t=n.n()).done;){var a=t.value;this.setState(Object(r.a)({},a,this.props[a]?this.props[a]:""))}}catch(s){n.e(s)}finally{n.f()}this.setState({getProps:!0})}"evenement"!==this.state.eventType&&"rdv"!==this.state.eventType||this.state.alreadyFetched||(fetch("http://localhost:3001/getUsers",{method:"GET",headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(t){e.setState({other_users:t})})).catch((function(e){return console.log(e)})),this.setState({alreadyFetched:!0}))}},{key:"clearState",value:function(){this.setState({eventType:""!==this.props.eventType?this.props.eventType:"dispo",allDay:!1,startDate:"",startTime:"",endDate:"",endTime:"",getProps:!1,other_users:[],users_invites:[]})}},{key:"render",value:function(){var e=this.getHeaderTxt(),t=this.state.eventType?this.state.eventType:"dispo";return Object(f.jsx)("div",{className:"agendaModal",id:"modal",children:Object(f.jsxs)("div",{className:"agendaModal",id:"modal-content",children:[Object(f.jsxs)("header",{children:[Object(f.jsx)("span",{className:"close",onClick:this.handleClose,children:"\xd7"}),Object(f.jsx)("h1",{children:e})]}),Object(f.jsxs)("form",{id:"formInfosEvent",onSubmit:this.handleSave,children:[Object(f.jsxs)("div",{id:"type",children:[Object(f.jsx)("label",{htmlFor:"eventType",id:"labelType",children:"Type : "}),Object(f.jsxs)("select",{name:"eventType",className:"listeType",value:this.state.eventType,id:t,onChange:this.handleChanges,children:[Object(f.jsx)("option",{value:"dispo",children:"disponibilit\xe9"}),Object(f.jsx)("option",{value:"rdv",children:"rendez-vous"}),Object(f.jsx)("option",{value:"evenement",children:"\xe9v\xe8nement"})]})]}),this.renderEventTypeContent(),Object(f.jsxs)("footer",{children:[Object(f.jsx)("input",{type:"reset",name:"reset",className:"modalButton",value:"R\xe9initialiser",onClick:this.handleReset}),Object(f.jsx)("button",{type:"submit",name:"save",className:"modalButton",id:"save",children:"Sauvegarder"})]})]})]})})}}]),n}(a.Component),x="http://localhost:3001",y=function(e){Object(d.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).calendarRef=s.a.createRef(),a.handleCloseModal=function(){a.props.clearEventType(),a.clearState()},a.handleModalChanges=function(e){a.setState(e)},a.handleDateSelection=function(e){a.setState({openModal:!0});var t=e.view.calendar;t.unselect();var n=Object(b.b)(e.start,t),s=Object(b.b)(e.end,t);a.setState({startDate:n.format("YYYY-MM-DD"),startTime:n.format("HH:mm"),endDate:s.format("YYYY-MM-DD"),endTime:s.format("HH:mm")})},a.handleAddEvent=function(e){a.calendarRef.current.getApi().addEvent(e),a.clearState()},a.handleSendEvents=function(e){var t=e.event,n={user_mail:t.extendedProps.user_mail,users_invited:t.extendedProps.users_invited,allDay:t.allDay,dateStart:t.startStr,dateEnd:t.endStr,objet:t.title,description:t.extendedProps.description,color:t.backgroundColor,textColor:t.textColor,type:t.extendedProps.type};console.log("avant fetch : "+t.color),fetch(x+"/event/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then((function(e){e.ok?e.json().then((function(e){console.log("envoi reussi : "+e.message)})):e.json().then((function(e){console.log("Mauvaise reponse reseau : "+e.message)}))})).catch((function(e){return console.log("erreur lors de l'envoi d'un event dans BDD : "+e)}))},a.state={mail:a.props.mail,eventType:"",openModal:!1,startDate:"",startTime:"",endDate:"",endTime:"",user_events:[],getEvents:!0,putEvents:!1},a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.setState({getEvents:!1}),fetch(x+"/events/get",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mail:this.state.mail})}).then((function(t){t.ok?t.json().then((function(t){if(t.all_events){console.log("events fetched : ",t.all_events);var n,a=[];t.all_events.forEach((function(e){"evenement"===e.type&&a.push({title:e.objet,extendedProps:{user_mail:e.user_mail,users_invited:e.users_invited,type:e.type,description:e.description},allDay:e.allDay,start:e.dateStart,end:e.dateEnd,color:e.color,textColor:e.textColor})})),n=a.concat([]).concat([]),e.setState({user_events:n})}console.log("fetch r\xe9ussi : ",t.message)})):t.json().then((function(e){console.log("Mauvaise r\xe9ponse r\xe9seau : ",e.message)}))})).catch((function(e){return console.log("erreur lors de la r\xe9cup\xe9ration des events dans la BDD : "+e.message)}))}},{key:"componentDidUpdate",value:function(e,t){this.props.eventType&&this.props.eventType!==this.state.eventType&&this.setState({eventType:this.props.eventType,openModal:!0}),e&&e.mail!==this.props.mail&&this.setState({mail:this.props.mail})}},{key:"clearState",value:function(){this.setState({eventType:"",openModal:!1,startDate:"",startTime:"",endDate:"",endTime:""})}},{key:"render",value:function(){var e=this.state.openModal?Object(f.jsx)(g,{handleCloseModal:this.handleCloseModal,handleAddEvent:this.handleAddEvent,startDate:this.state.startDate,startTime:this.state.startTime,endDate:this.state.endDate,endTime:this.state.endTime,eventType:this.state.eventType,mail:this.state.mail}):null;return Object(f.jsxs)("div",{className:"divFullCalendar",children:[e,Object(f.jsx)(h.a,{ref:this.calendarRef,plugins:[u.b,m.a,j.a,b.a],initialView:"dayGridMonth",locale:"fr",firstDay:1,events:this.state.user_events,buttonText:{today:"aujourd'hui",month:"mois",week:"semaine",day:"jour"},headerToolbar:{start:"prev,next,today",center:"title",end:"dayGridMonth,timeGridWeek,timeGridDay"},businessHours:[{daysOfWeek:[1,2,3,4,5],startTime:"08:00",endTime:"19:00"}],selectable:!0,selectMirror:!0,editable:!0,select:this.handleDateSelection,eventAdd:this.handleSendEvents})]})}}]),n}(a.Component),C=function(e){Object(d.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).clearEventType=function(){a.setState({eventType:""}),a.props.clearEventType()},a.state={mail:a.props.mail,eventType:"",menuOpened:!1,profilOpened:!1},a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(e){var t=this.props.menuOpened,n=this.props.profilOpened;e.menuOpened===t&&e.profilOpened===n||this.setState({menuOpened:t,profilOpened:n}),this.props.eventType!==this.state.eventType&&this.setState({eventType:this.props.eventType}),e.mail!==this.props.mail&&this.setState({mail:this.props.mail})}},{key:"render",value:function(){var e=this.state.menuOpened?"menuOpened":this.state.profilOpened?"profilOpened":"";return Object(f.jsx)("div",{id:"accLoggedIn",className:e,children:Object(f.jsx)(y,{eventType:this.state.eventType,clearEventType:this.clearEventType,mail:this.state.mail})})}}]),n}(a.Component),T=(n(39),function(e){Object(d.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).gotoInscription=function(){a.props.handlePage({inInscription:!0})},a.saveChanges=function(e){var t=e.target.name,n=e.target.value;a.setState(Object(r.a)({},t,n))},a.handleCanBeLogged=function(e,t,n){a.props.setUserInfos(e,t,n),a.props.connect()},a.handleConnexion=function(e){e.preventDefault();var t={mail:a.state.mail,mdp:a.state.mdp};fetch(a.baseURL+"/connect",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then((function(e){return e.json().then((function(t){return{status:e.status,data:t}}))})).then((function(e){400===e.status&&alert(e.data.message),200===e.status&&a.handleCanBeLogged(e.data.prenom,e.data.nom,e.data.mail)})).catch((function(e){alert("Erreur : "+e)}))},a.state={mail:"",mdp:""},a.baseURL="http://localhost:3001",a}return Object(c.a)(n,[{key:"render",value:function(){return Object(f.jsx)("div",{className:"corps",children:Object(f.jsx)("div",{className:"formulaire",children:Object(f.jsxs)("form",{name:"formConnexion",id:"formConnexion",onSubmit:this.handleConnexion,children:[Object(f.jsx)("input",{type:"email",id:"email",name:"mail",placeholder:"login (email)",required:!0,onChange:this.saveChanges})," ",Object(f.jsx)("br",{}),Object(f.jsx)("input",{type:"password",id:"pwd",name:"mdp",placeholder:"mot de passe",required:!0,onChange:this.saveChanges})," ",Object(f.jsx)("br",{}),Object(f.jsx)("input",{type:"submit",id:"connect",value:"Connexion"}),Object(f.jsx)("br",{}),Object(f.jsx)("a",{href:"none",id:"pwdforgot",children:"Mot de passe oubli\xe9 ?"}),Object(f.jsx)("div",{className:"divInscription",children:Object(f.jsx)("button",{type:"button",id:"inscription",onClick:this.gotoInscription,children:"Inscription"})})]})})})}}]),n}(a.Component)),S=n.p+"static/media/logo.a22bb596.png",M=(n(40),function(e){return Object(f.jsxs)("header",{className:"header",children:[Object(f.jsx)("img",{className:"logo",src:S,alt:"logo",height:"32",width:"32",onClick:function(){e.gotoMain()}}),Object(f.jsx)("h1",{id:"titreHeader",children:"BOOKERIST"})]})}),D=n(10),N=n(14);n(41);function P(e){var t=Object(a.useState)({menuOpened:!1,profilOpened:!1}),n=Object(N.a)(t,2),s=n[0],i=n[1];function o(t){t.preventDefault(),t.stopPropagation();var n=t.target.name,a="in".concat(n);i({menuOpened:!1,profilOpened:!1}),e.handlePage(Object(r.a)({},a,!0))}function l(t){t.preventDefault(),e.giveEventType({eventType:t.target.name})}return Object(a.useEffect)((function(){function t(){e.handleMenus({menuOpened:!1,profilOpened:!1}),i(Object(D.a)(Object(D.a)({},s),{},{menuOpened:!1,profilOpened:!1}))}return(s.profilOpened||s.menuOpened)&&window.addEventListener("click",t),function(){window.removeEventListener("click",t)}})),Object(f.jsx)("header",{className:"headerLoggedIn",children:Object(f.jsxs)("ul",{className:"menu",children:[Object(f.jsxs)("li",{id:"liMenu",children:[Object(f.jsx)("a",{href:"none",onClick:function(t){t.preventDefault(),t.stopPropagation(),e.handleMenus({menuOpened:!s.menuOpened}),i((function(e){return Object(D.a)(Object(D.a)({},e),{},{menuOpened:!e.menuOpened})}))},children:"MENU"}),s.menuOpened?Object(f.jsxs)("ul",{id:"choixMenu",children:[Object(f.jsx)("li",{children:Object(f.jsx)("a",{href:"none",name:"Accueil",onClick:o,children:"Accueil"})}),Object(f.jsx)("li",{children:Object(f.jsx)("a",{href:"none",name:"dispo",onClick:l,children:"Ajout disponibilit\xe9"})}),Object(f.jsx)("li",{children:Object(f.jsx)("a",{href:"none",name:"rdv",onClick:l,children:"Prendre rendez-vous"})}),Object(f.jsx)("li",{children:Object(f.jsx)("a",{href:"none",name:"evenement",onClick:l,children:"Cr\xe9er \xe9v\xe8nement"})}),Object(f.jsx)("li",{children:Object(f.jsx)("a",{href:"none",name:"Manuel",onClick:o,children:"Manuel d'utilisation"})}),Object(f.jsx)("li",{children:Object(f.jsx)("a",{href:"none",name:"Contact",onClick:o,children:"Contact"})})]}):null]}),Object(f.jsx)("li",{children:Object(f.jsx)("img",{id:"logoLoggedIn",src:S,alt:"logo",width:"32",height:"32",onClick:function(t){t.preventDefault(),t.stopPropagation(),i({menuOpened:!1,profilOpened:!1}),e.gotoMain()}})}),Object(f.jsxs)("li",{id:"liProfil",children:[Object(f.jsxs)("a",{href:"none",onClick:function(t){t.preventDefault(),t.stopPropagation(),e.handleMenus({profilOpened:!s.profilOpened}),i((function(e){return Object(D.a)(Object(D.a)({},e),{},{profilOpened:!e.profilOpened})}))},children:[e.prenom.toUpperCase()," (",e.mail,")"]}),s.profilOpened?Object(f.jsxs)("ul",{id:"choixProfil",children:[Object(f.jsx)("li",{children:Object(f.jsx)("a",{href:"none",name:"Params",onClick:o,children:"Param\xe8tres"})}),Object(f.jsx)("li",{children:Object(f.jsx)("a",{href:"none",onClick:function(t){t.preventDefault(),t.stopPropagation(),localStorage.clear(),e.disconnect()},children:"Se d\xe9connecter"})})]}):null]})]})})}n(42);var _,k=function(e){Object(d.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).saveChanges=function(e){var t=e.target.name,n=e.target.value;a.setState(Object(r.a)({},t,n))},a.handleMailUpdate=function(e){a.setState({mail:e.target.value.toLowerCase()})},a.handleFirstNameUpdate=function(e){var t=e.target.value,n=t.charAt(0).toUpperCase()+t.slice(1);a.setState({prenom:n})},a.handleLastNameUpdate=function(e){a.setState({nom:e.target.value.toUpperCase()})},a.handleInscriptionFinished=function(){a.props.gotoMain()},a.sendInscription=function(e){e.preventDefault();var t=a.state,n=t.nom,s=t.prenom,i=t.mail,r=t.mail2,l=t.mdp,c=t.mdp2;if(i!==r&&alert("Les deux mails ne correspondent pas."),l!==c)alert("Les deux mots de passe ne correspondent pas.");else if(i===r&&l===c){var d={nom:n,prenom:s,mail:i,mdp:l};fetch(a.baseURL+"/inscription",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).then((function(e){return e.json().then((function(t){return{status:e.status,data:t}}))})).then((function(e){alert(e.data.message),201===e.status&&(a.handleInscriptionFinished(),o.a.render(Object(f.jsx)(L,{}),document.getElementById("root")))})).catch((function(e){console.log(e)}))}},a.state={nom:"",prenom:"",mail:"",mail2:"",mdp:"",mdp2:""},a.baseURL="http://localhost:3001",a}return Object(c.a)(n,[{key:"render",value:function(){return Object(f.jsx)("div",{className:"Inscription",children:Object(f.jsx)("form",{className:"formInscription",name:"formInscription",onSubmit:this.sendInscription,children:Object(f.jsxs)("fieldset",{children:[Object(f.jsx)("h2",{children:"Inscription"}),Object(f.jsx)("input",{type:"text",id:"prenom",name:"prenom",placeholder:"Pr\xe9nom",required:!0,onChange:this.handleFirstNameUpdate,value:this.state.prenom}),Object(f.jsx)("input",{type:"text",id:"nom",name:"nom",placeholder:"NOM",required:!0,onChange:this.handleLastNameUpdate,value:this.state.nom}),Object(f.jsx)("input",{type:"email",id:"mail",name:"mail",placeholder:"e-mail",required:!0,onChange:this.handleMailUpdate,value:this.state.mail}),Object(f.jsx)("input",{type:"email",id:"mail2",name:"mail2",placeholder:"confirmer e-mail",required:!0,onChange:this.saveChanges}),Object(f.jsx)("input",{type:"password",id:"mdp",name:"mdp",placeholder:"mot de passe",required:!0,onChange:this.saveChanges}),Object(f.jsx)("input",{type:"password",id:"confirmMdp",name:"mdp2",placeholder:"confirmer mot de passe",required:!0,onChange:this.saveChanges}),Object(f.jsx)("input",{type:"submit",id:"goInscription",value:"Je m'inscris !"})]})})})}}]),n}(a.Component),I=n(23);n(43);function w(e){var t=70,n=2e3,s=Object(a.useState)({objet:"",message:"",compteur_objet:t,compteur_message:n}),i=Object(N.a)(s,2),o=i[0],l=i[1];function c(e){var a=e.target.name,s=e.target.value,i="compteur_".concat(a),o="".concat("objet"===a?t:n);if(s.length<=o)l((function(e){var t;return Object(D.a)(Object(D.a)({},e),{},(t={},Object(r.a)(t,a,s),Object(r.a)(t,i,o-s.length),t))}));else{var c="Nombre de caract\xe8res max atteint pour "(_||(_=Object(I.a)(["",""])),"objet"===a?"l'objet":"le message.");alert(c)}}function d(){l({objet:"",message:"",compteur_objet:t,compteur_message:n}),window.localStorage.setItem("contactSent",JSON.stringify({sentContact:!0})),e.gotoMain()}return Object(f.jsxs)("div",{id:"corps_contact",children:[Object(f.jsx)("h2",{id:"titre_contact",children:"Contact"}),Object(f.jsxs)("form",{method:"post",className:"Contact",id:"formMessage",onSubmit:function(t){t.preventDefault();var n=JSON.parse(window.localStorage.getItem("contactSent"));if(null!==n&&!0===n.sentContact)alert("Vous avez d\xe9j\xe0 envoy\xe9 un message de contact."),d();else{var a={mail:e.mail,prenom:e.prenom,nom:e.nom,objet:o.objet,message:o.message};fetch("http://localhost:3001/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}).then((function(e){return e.json()})).then((function(e){alert(e.message),d()})).catch((function(e){alert("Erreur : "+e)}))}},onReset:function(e){e.preventDefault(),l({objet:"",message:"",compteur_objet:t,compteur_message:n})},children:[Object(f.jsx)("p",{className:"txtMessage",children:"Pour nous contacter, \xe9crivez-nous un message :"}),Object(f.jsx)("br",{}),Object(f.jsxs)("div",{className:"divObjet",children:[Object(f.jsx)("textarea",{name:"objet",id:"objet",placeholder:"Objet",value:o.objet,onChange:c,required:!0}),Object(f.jsx)("span",{id:"compteurObjet",children:o.compteur_objet})]}),Object(f.jsxs)("div",{className:"divMessage",children:[Object(f.jsx)("textarea",{name:"message",id:"message",placeholder:"Message",value:o.message,onChange:c,required:!0}),Object(f.jsx)("span",{id:"compteurMessage",children:o.compteur_message})]}),Object(f.jsx)("br",{}),Object(f.jsx)("input",{className:"bouton_contact",type:"reset",value:"Tout effacer"}),Object(f.jsx)("input",{className:"bouton_contact",type:"submit",value:"Envoyer"})]})]})}n(44);var E=function(){var e=Object(a.useState)(""),t=Object(N.a)(e,2),n=t[0],s=t[1];return Object(f.jsxs)("div",{className:"forgotPass",children:[Object(f.jsx)("h2",{children:"Mot de passe oubli\xe9 "}),Object(f.jsxs)("form",{id:"formulaireMDP",onSubmit:function(e){e.preventDefault(),fetch("http://localhost:3001//forgotPass",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})},children:[Object(f.jsx)("br",{}),Object(f.jsx)("input",{type:"email",id:"mailForgotPass",name:"mailForgotPass",placeholder:"e-mail",onChange:function(e){s(e.target.value.toLowerCase())},value:n,required:!0}),Object(f.jsx)("br",{}),Object(f.jsx)("input",{className:"bouton_forgotPass",type:"submit",value:"Envoyer"})]})]})},A=n(9),U=(n(45),function(e){Object(d.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).state={mail:a.props.mail,newMail:a.props.mail,mdp:"",newMdp:"",confirmNewMdp:"",changeMail:!1,changeMdp:!1},a.handleModifMail=a.handleModifMail.bind(Object(A.a)(a)),a.handleModifPass=a.handleModifPass.bind(Object(A.a)(a)),a.handleMailChange=a.handleMailChange.bind(Object(A.a)(a)),a.handleReset=a.handleReset.bind(Object(A.a)(a)),a.handleSubmitParams=a.handleSubmitParams.bind(Object(A.a)(a)),a.handleChanges=a.handleChanges.bind(Object(A.a)(a)),a.clearState=a.clearState.bind(Object(A.a)(a)),a.handleNewInfos=a.handleNewInfos.bind(Object(A.a)(a)),a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(){this.props.mail!==this.state.mail&&this.setState({mail:this.props.mail,newMail:this.props.mail})}},{key:"clearState",value:function(){this.setState({mail:this.props.mail,newMail:this.props.mail,mdp:"",newMdp:"",confirmNewMdp:"",changeMail:!1,changeMdp:!1})}},{key:"handleModifMail",value:function(e){this.setState({changeMail:!0})}},{key:"handleModifPass",value:function(e){this.setState({changeMdp:!0})}},{key:"handleMailChange",value:function(e){this.setState({newMail:e.target.value.toLowerCase()})}},{key:"handleReset",value:function(e){this.clearState()}},{key:"handleNewInfos",value:function(e){this.props.handleChangeParams(e)}},{key:"handleSubmitParams",value:function(e){var t=this;if(e.preventDefault(),this.state.newMdp===this.state.confirmNewMdp){var n={mail:this.state.mail,newMail:this.state.newMail,mdp:this.state.mdp,newMdp:this.state.newMdp,changeMail:this.state.changeMail,changeMdp:this.state.changeMdp};this.clearState(),console.log(n),fetch("http://localhost:3001/params",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then((function(e){return e.json().then((function(t){return{status:e.status,data:t}}))})).then((function(e){alert(e.data.message),200===e.status&&(console.log("infos"),t.handleNewInfos(e.data.mail))})).catch((function(e){return console.log(e)}))}else alert("Les deux mots de passes ne correspondent pas.")}},{key:"handleChanges",value:function(e){var t=e.target.name,n=e.target.value;this.setState(Object(r.a)({},t,n))}},{key:"render",value:function(){return Object(f.jsx)("div",{className:"parametre",children:Object(f.jsxs)("form",{id:"formParams",method:"post",onSubmit:this.handleSubmitParams,children:[Object(f.jsx)("h2",{children:"Param\xe8tre"}),Object(f.jsx)("input",{className:"inputParam",type:"email",id:"mail",name:"mail",value:this.state.newMail,onChange:this.handleMailChange,disabled:!this.state.changeMail,required:!0}),Object(f.jsx)("br",{}),Object(f.jsx)("input",{className:"bouton_modifier",id:"modifMail",type:"button",onClick:this.handleModifMail,value:"Modifier"}),Object(f.jsx)("br",{}),Object(f.jsx)("input",{className:"bouton_modifier",id:"modifMdp",type:"button",onClick:this.handleModifPass,value:"Modifier mot de passe"}),Object(f.jsx)("br",{}),Object(f.jsx)("input",{className:"inputParamPass",type:"password",id:"newMdp",name:"newMdp",placeholder:"Nouveau mot de passe",disabled:!this.state.changeMdp,onChange:this.handleChanges}),Object(f.jsx)("br",{}),Object(f.jsx)("input",{className:"inputParamPass",type:"password",name:"confirmNewMdp",placeholder:"Confirmez mot de passe",disabled:!this.state.changeMdp,onChange:this.handleChanges}),Object(f.jsx)("br",{}),Object(f.jsx)("input",{className:"inputParamPass",type:"password",id:"mdp",name:"mdp",placeholder:"Mot de passe",required:!0,onChange:this.handleChanges,value:this.state.mdp}),Object(f.jsx)("br",{}),Object(f.jsx)("input",{type:"reset",className:"bouton_modifier",id:"reset",value:"Annuler",onClick:this.handleReset}),Object(f.jsx)("input",{className:"bouton_modifier",id:"save",type:"submit",value:"Sauvegarder"})]})})}}]),n}(a.Component)),L=function(e){Object(d.a)(n,e);var t=Object(p.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).setUserInfos=function(e,t,n){a.setState({prenom:e,nom:t,mail:n})},a.clearState=function(){a.setState({eventType:"",menuOpened:!1,profilOpened:!1,prenom:"",nom:"",mail:"",loggedIn:!1,inAccueil:!0,inInscription:!1,inForgotPass:!1,inContact:!1,inParams:!1})},a.handleLoginChange=function(e){a.setState({loggedIn:e}),e||(localStorage.clear(),a.clearState())},a.handlePage=function(e){for(var t=0,n=["inAccueil","inInscription","inForgotPass","inContact","inParams"];t<n.length;t++){var s=n[t];e[s]=void 0!==e[s]&&e[s],a.setState(Object(r.a)({},s,e[s]))}},a.handleMenusAccueil=function(e){for(var t=0,n=["menuOpened","profilOpened"];t<n.length;t++){var s=n[t];e[s]=void 0!==e[s]&&e[s],a.setState(Object(r.a)({},s,e[s]))}},a.handleEventType=function(e){var t=e.eventType;console.log("App, type: "+t),a.setState({eventType:t})},a.clearEventType=function(){a.setState({eventType:""})},a.handleChangeParams=function(e){a.setState({mail:e})},a.state={eventType:"",menuOpened:!1,profilOpened:!1,prenom:"",nom:"",mail:"",loggedIn:!1,inAccueil:!0,inInscription:!1,inForgotPass:!1,inContact:!1,inParams:!1},a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=window.localStorage.getItem("userInfos");null!=e&&(e=JSON.parse(e),this.setState(e))}},{key:"componentDidUpdate",value:function(){var e=this.state;window.localStorage.setItem("userInfos",JSON.stringify(e))}},{key:"componentWillUnmount",value:function(){localStorage.clear()}},{key:"render",value:function(){var e=this,t=this.state,n=t.nom,a=t.prenom,s=t.mail,i=t.loggedIn,o=t.inAccueil,r=t.inInscription,l=t.inForgotPass,c=t.inContact,d=t.inParams,p=null,h=null;return p=i?Object(f.jsx)(P,{prenom:a,mail:s,disconnect:function(){return e.handleLoginChange(!1)},gotoMain:function(){return e.handlePage({inAccueil:!0})},handlePage:this.handlePage,handleMenus:this.handleMenusAccueil,giveEventType:this.handleEventType}):Object(f.jsx)(M,{gotoMain:function(){return e.handlePage({inAccueil:!0})}}),o&&(h=i?Object(f.jsx)(C,{menuOpened:this.state.menuOpened,profilOpened:this.state.profilOpened,eventType:this.state.eventType,clearEventType:this.clearEventType,mail:this.state.mail}):Object(f.jsx)(T,{handlePage:this.handlePage,setUserInfos:this.setUserInfos,connect:function(){return e.handleLoginChange(!0)}})),r&&(h=Object(f.jsx)(k,{gotoMain:function(){return e.handlePage({inAccueil:!0})}})),l&&(h=Object(f.jsx)(E,{})),c&&(h=Object(f.jsx)(w,{prenom:a,nom:n,mail:s,gotoMain:function(){return e.handlePage({inAccueil:!0})}})),d&&(h=Object(f.jsx)(U,{mail:s,handleChangeParams:this.handleChangeParams})),Object(f.jsxs)("div",{className:"App",children:[p,h]})}}]),n}(a.Component);o.a.render(Object(f.jsx)(L,{}),document.getElementById("root"))}],[[46,1,2]]]);
//# sourceMappingURL=main.1eaee3d7.chunk.js.map