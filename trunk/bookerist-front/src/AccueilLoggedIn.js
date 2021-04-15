// import './AccueilLoggedIn.css'
// import './Button.css'
// import React, { Component } from 'react';
// import { ReactAgenda, ReactAgendaCtrl, Modal } from 'react-agenda';

// require('moment/locale/fr.js');

// var colors= {
//     'color-1':"rgba(102, 195, 131 , 1)" ,
//     "color-2":"rgba(242, 177, 52, 1)" ,
//     "color-3":"rgba(235, 85, 59, 1)"
//   }

// class AccueilLoggedIn extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             now: new Date(),
//             cellHeight: 15,
//             numberOfDays: 5,
//             rowsPerHour: 2,
//         };
//     }

//     render(){
//         return (
//             <div id="accLoggedIn">
//                 <ReactAgenda 
//                  minDate={this.state.now}
//                  maxDate={this.state.now.getFullYear()}
//                  startDate={this.state.now}
//                  locale="fr"
//                  cellHeight={this.state.cellHeight}
//                  numberOfDays={this.state.numberOfDays}
//                  rowsPerHour={this.state.rowsPerHour}
//                  itemColors={colors}
//                  />
//             </div>
//         )
//     }

// }

// export default AccueilLoggedIn;

import React, { Component } from 'react';
import moment from 'moment';
import { ReactAgenda , ReactAgendaCtrl, guid , getUnique , getLast , getFirst , Modal } from 'react-agenda';
import './AccueilLoggedIn.css';

const baseURL = "http://localhost:3001";
var now = new Date();

require('moment/locale/fr.js');
    var colors= {
      'color-1':"rgba(102, 195, 131 , 1)" ,
      "color-2":"rgba(242, 177, 52, 1)" ,
      "color-3":"rgba(235, 85, 59, 1)" ,
      "color-4":"rgba(70, 159, 213, 1)",
      "color-5":"rgba(170, 59, 123, 1)"
    }


// var items = [
//   {
//    _id            :guid(),
//     name          : 'Meeting , dev staff!',
//     startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
//     endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
//     classes       : 'color-1 color-4'
//   },
//   {
//    _id            :guid(),
//     name          : 'Working lunch , Holly',
//     startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 11, 0),
//     endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 13, 0),
//     classes       : 'color-2'
//   },
//   {
//    _id            :guid(),
//     name          : 'Conference , plaza',
//     startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 11 , 0),
//     endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 14 ,30),
//     classes       : 'color-4'
//   },
//   {
//    _id            :'event-4',
//     name          : 'Customers issues review',
//     startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 10, 0),
//     endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+2, 15, 0),
//     classes       : 'color-3'

//   },
//   {
//     _id           :'event-5',
//     name          : 'Group activity',
//     startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+3, 10, 0),
//     endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+3, 16, 30),
//     classes       : 'color-4'
//   },
//   {
//     _id           :'event-6',
//     name          : 'Fun Day !',
//     startDateTime : new Date(now.getFullYear(), now.getMonth(), now.getDate()+7, 9, 14),
//     endDateTime   : new Date(now.getFullYear(), now.getMonth(), now.getDate()+7, 17),
//     classes       : 'color-3'
//   }
// ];

class AccueilLoggedIn extends Component {
  constructor(props){
  super(props);



this.state = {
  items:[],
  selected:[],
  cellHeight:(60 / 4),
  showModal:false,
  locale:"fr",
  rowsPerHour:4,
  numberOfDays:4,
  startDate: new Date(),

  menuOpened: false,
  profilOpened: false,
}
this.handleRangeSelection = this.handleRangeSelection.bind(this)
this.handleItemEdit = this.handleItemEdit.bind(this)
this.zoomIn = this.zoomIn.bind(this)
this.zoomOut = this.zoomOut.bind(this)
this._openModal = this._openModal.bind(this)
this._closeModal = this._closeModal.bind(this)
this.addNewEvent = this.addNewEvent.bind(this)
this.removeEvent = this.removeEvent.bind(this)
this.editEvent = this.editEvent.bind(this)
this.changeView = this.changeView.bind(this)
this.handleCellSelection = this.handleCellSelection.bind(this)

  }

  componentDidMount = () => {
    // fetch(baseURL + "/events/get", {
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json' }
    // })
    // .then(res => res.json())
    // .then(res => {
    //     this.setState({
    //       items: res.body,
    //     });
    //     console.log("menuOpened " + this.state.menuOpened);
    // })
    // .catch(err => console.log({err}));


  }


// componentDidUpdate(next , last){
//   if(next.items){

//     this.setState({
//       items:next.items,
//     });
//   }
// }
componentDidUpdate(next){ //next = prevProps
  if (next.items){
    this.setState({ items: next.items });
  }
  // if (next.menuOpened !== this.props.menuOpened || next.profilOpened !== this.props.profilOpened){
    if (this.state.menuOpened !== this.props.menuOpened || this.state.profilOpened !== this.props.profilOpened){
    this.setState({
    menuOpened: this.props.menuOpened,
    profilOpened: this.props.profilOpened,
    });
    console.log("update, menuOpened: " + this.state.menuOpened + ", profilOpened: " + this.state.profilOpened);
  }
 
}
  handleItemEdit(item, openModal) {
    console.log("handleItemEdit");
    // if(item && openModal === true){
    //   this.setState({selected:[item] })
    //   return this._openModal();
    // }



  }
  handleCellSelection(item, openModal) {

    if(this.state.selected && this.state.selected[0] === item){
      return  this._openModal();
    }
       this.setState({selected:[item] })

  }

  zoomIn(){
var num = this.state.cellHeight + 15
    this.setState({cellHeight:num})
  }
  zoomOut(){
var num = this.state.cellHeight - 15
    this.setState({cellHeight:num})
  }


  handleDateRangeChange (startDate, endDate) {
      this.setState({startDate:startDate })

  }

  handleRangeSelection (selected) {


this.setState({selected:selected , showCtrl:true})
this._openModal();

}

_openModal(){
  this.setState({showModal:true})
}
_closeModal(e){
  if(e){
    e.stopPropagation();
    e.preventDefault();
  }
    this.setState({showModal:false})
}

handleItemChange(items , item){
console.log("handleItemChange");
// this.setState({items:items})
}

handleItemSize(items , item){

  this.setState({items:items})

}

removeEvent(items , item){

    this.setState({ items:items});
}

addNewEvent (items , newItems){
    console.log("addNewEvent");
  this.setState({showModal:false ,selected:[] , items:items});
  this._closeModal();
  fetch(baseURL + '/events/save', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: this.state.items,
  })
  .then(res => res.json())
  .then(res => {
      console.log(res.message);
  })
  .catch(error => console.log(error));
}
editEvent (items , item){
console.log("editEvent");
//   this.setState({showModal:false ,selected:[] , items:items});
//   this._closeModal();
}

changeView (days , event ){
this.setState({numberOfDays:days})
}

  render() {
    const divClass = this.state.menuOpened ? 'menuOpened' : (this.state.profilOpened ? 'profilOpened' : '');
    console.log("classe: " + divClass);
    // const classProfilOpened = this.state.profilOpened ? 'profilOpened' : false;

    console.log("rendu menuOpened : " + this.state.menuOpened + " profilOpened : " + this.state.profilOpened);
    return (
    <div id="accLoggedIn" className={divClass}>

      <div className="content-expanded ">

        <div className="control-buttons">
          <button  className="button-control" onClick={this.zoomIn}> <i className="zoom-plus-icon">+</i> </button>
          <button  className="button-control" onClick={this.zoomOut}> <i className="zoom-minus-icon">-</i> </button>
          <button  className="button-control" onClick={this._openModal}> <i className="schedule-icon">Ajouter</i> </button>
          <button  className="button-control" onClick={this.changeView.bind(null , 7)}> {moment.duration(7, "days").humanize()}  </button>
          <button  className="button-control" onClick={this.changeView.bind(null , 5)}> {moment.duration(5, "days").humanize()}  </button>
          <button  className="button-control" onClick={this.changeView.bind(null , 1)}> {moment.duration(1, "day").humanize()} </button>
        </div>

        <ReactAgenda
          minDate={new Date(now.getFullYear(), now.getMonth()-3)}
          maxDate={new Date(now.getFullYear(), now.getMonth()+3)}
          startDate={this.state.startDate}
          startAtTime={8}
          endAtTime={23}
          cellHeight={this.state.cellHeight}
          locale="fr"
          items={this.state.items}
          numberOfDays={this.state.numberOfDays}
          headFormat={"ddd DD MMM"}
          rowsPerHour={this.state.rowsPerHour}
          itemColors={colors}
          helper={true}
          //itemComponent={AgendaItem}
          view="calendar"
          autoScale={false}
          fixedHeader={true}
          onRangeSelection={this.handleRangeSelection.bind(this)}
          onChangeEvent={this.handleItemChange.bind(this)}
          onChangeDuration={this.handleItemSize.bind(this)}
          onItemEdit={this.handleItemEdit.bind(this)}
          onCellSelect={this.handleCellSelection.bind(this)}
          onItemRemove={this.removeEvent.bind(this)}
          onDateRangeChange={this.handleDateRangeChange.bind(this)}
           />
         {
          this.state.showModal
          ?(
            <Modal clickOutside={this._closeModal} >
                <div className="modal-content">
                    <ReactAgendaCtrl 
                    items={this.state.items}
                    itemColors={colors}
                    selectedCells={this.state.selected}
                    Addnew={this.addNewEvent}
                    edit={this.editEvent}
                    />
                </div>
            </Modal>)
            : (null)
        }


       </div>
    </div>

    );
  }
}

export default AccueilLoggedIn;