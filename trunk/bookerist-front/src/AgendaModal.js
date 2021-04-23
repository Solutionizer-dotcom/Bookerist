import React, { Component } from 'react';
import './AgendaModal.css';
import './Button.css';
// import moment from 'moment';

// let eventId = 0;
const baseURL = "http://localhost:3001";
//Composant permettant d'afficher le modal pour créer un évènement dans l'agenda
export default class AgendaModal extends Component {
    constructor(props){
        super(props);

        //Définission de l'état, par défaut le eventType sera disponibilité
        this.state = {
            eventType: this.props.eventType && this.props.eventType !== '' ? this.props.eventType : "dispo",
            allDay: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            objet: '',
            description: '',
            getProps: false, //pour ne récupérer les props qu'une fois
            alreadyFetched: false,
            other_users: [],
            users_invites: [],
        }
    }
    componentDidUpdate(){
        const listProps = ["startDate", "startTime", "endDate", "endTime"];
        if (!this.state.getProps)
        {
            for(let prop of listProps)
            {
                this.setState({
                    [prop]: this.props[prop] ? this.props[prop] : ''
                });
            }
            this.setState({ getProps: true});
        }
        if ((this.state.eventType === "evenement" || this.state.eventType === "rdv") && !this.state.alreadyFetched)
        {
            fetch(baseURL + "/getUsers", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(res => res.json())
            .then(res => {
                // console.log(res);
                this.setState({ other_users: res});
            })
            .catch(err => console.log(err));
            this.setState({ alreadyFetched: true });
        }
        // let modal = document.getElementById("modal");
        // this.state.openModal ? modal.style.display = "block" : modal.style.display = "none";
    }

    clearState(){
        this.setState({
            eventType: this.props.eventType !== '' ? this.props.eventType : "dispo",
            allDay: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            getProps: false,
            other_users: [],
            users_invites: [],
        })
    }

    //On génère le texte pour le header du modal en fonction de l'objet à créer
    //Fonction fléchée pour accéder au this
    getHeaderTxt = () => {
        const eventTxt = {
            dispo: "Créer une nouvelle disponibilité",
            rdv: "Créer un nouveau rendez-vous",
            evenement: "Créer un nouvel évènement",
        };
        return eventTxt[this.state.eventType];
    }

    //fonction fléchée pour accéder au this
    handleChanges = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value,
        });
    }
    //fonction fléchée pour accéder au this
    handleCheckboxChanges = (e) => {
        //pour l'instant seulement pour le allDay
        const name = e.target.name;
        const value = e.target.checked;
        if (value === true)
            this.setState({
                startTime: '',
                endTime: '',
            });
        this.setState({
            [name]: value,
        })
    }

    handleReset = (e) => {
        this.setState({
            eventType: "dispo",
            allDay: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            other_users: [],
            users_invites: [],
        })
    }

    handleClose = (e) => {
        // var modal = document.getElementById("modal");
        // modal.style.display = "none";
        this.props.handleCloseModal();
    }
    
   

    handleSave = (e) => {
        e.preventDefault();
        // const event = {
        //     id: eventId++,
        //     title: this.state.eventType === "dispo" ? "disponibilité" : this.state.objet,
        //     extendedProps: {
        //         type: this.state.eventType,
        //         description: this.state.description ? this.state.description : ''
        //     },
        //     allDay: this.state.allDay,
        //     start: (this.state.startDate + (!this.state.allDay ? "T" + this.state.startTime : '')),
        //     end: (this.state.endDate + (!this.state.allDay ? "T" + this.state.endTime : ''))
        // }
        let event = {};
        if (this.state.eventType === 'evenement')
        {
            event = {
                // id: moment().format('x'),
                title: this.state.objet,
                extendedProps: {
                    user_mail: this.props.mail,
                    users_invited: this.state.users_invites,
                    type: this.state.eventType,
                    description: this.state.description,
                },
                allDay: this.state.allDay,
                start: (this.state.startDate + (!this.state.allDay ? "T" + this.state.startTime : '')),
                end: (this.state.endDate + (!this.state.allDay ? "T" + this.state.endTime : '')),
                color: "rgb(177, 214, 153)",
                textColor: "rgb(138, 74, 176)"
            }
        }
        this.clearState();
        this.props.handleAddEvent(event);
        this.handleClose();
    }

    render(){
        const headerTxt = this.getHeaderTxt();
        const eventType = this.state.eventType ? this.state.eventType : "dispo";
        return (
            //L'ensemble du modal
            <div className="agendaModal" id="modal">

                {/* Le contenu du modal */}
                <div className="agendaModal" id="modal-content">
                    <header>
                        <span className="close" onClick={this.handleClose}>&times;</span>
                        <h1>{headerTxt}</h1>
                    </header>
                    <form id="formInfosEvent" onSubmit={this.handleSave}>
                        <div id="type">
                            <label htmlFor="eventType" id="labelType">Type : </label>
                            <select name="eventType" className="listeType" value={this.state.eventType} id={eventType} onChange={this.handleChanges}>
                                <option value="dispo">disponibilité</option>
                                <option value="rdv">rendez-vous</option>
                                <option value="evenement">évènement</option>
                            </select>
                        </div>
                        {/* <div id="all-day">
                            <input type="checkbox" name="allDay" id="allDay" value="allDay" onChange={this.handleCheckboxChanges}/>
                            <label htmlFor="allDay" name="labelAllDay" id="labelAllDay">Toute la journée</label>
                        </div> */}
                        {this.renderEventTypeContent()}
                        <footer>
                            {/* <button type="button" name="reset" className="modalButton" id="reset" onClick={this.handleReset}>Réinitialiser</button> */}
                            <input type="reset" name="reset" className="modalButton" value="Réinitialiser" onClick={this.handleReset}/>
                            <button type="submit" name="save" className="modalButton" id="save">Sauvegarder</button>
                        </footer>
                    </form>
                </div>

            </div>
        );
    };

    renderEventDate = () => {
        return (
            <div id="div_date">
                {/* <table className="tableEventTypeContent"> */}
                <table className="tableEventDate">
                    <tbody>
                        <tr className="tr_allday">
                            <td>
                                <input type="checkbox" name="allDay" id="allDay" value="allDay" onChange={this.handleCheckboxChanges}/>
                            </td>
                            <td>
                                <label htmlFor="allDay" name="labelAllDay" id="labelAllDay">Toute la journée</label>
                            </td>
                        </tr>
                        <tr className="tr_startDate">
                            <td>
                                <label htmlFor="startDate">Date de début : </label>
                            </td>
                            <td>
                                <input type="date" name="startDate" onChange={this.handleChanges}
                                value={this.state.startDate} required />
                                <input type="time" name="startTime" onChange={this.handleChanges}
                                value={this.state.startTime} disabled={this.state.allDay}/>
                            </td>
                        </tr>
                        <tr className="tr_endDate">
                            <td>
                                <label htmlFor="endDate">Date de fin : </label>
                            </td>
                            <td>
                                <input type="date" name="endDate" onChange={this.handleChanges}
                                value={this.state.endDate} required />
                                <input type="time" name="endTime" onChange={this.handleChanges}
                                value={this.state.endTime} disabled={this.state.allDay}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
        );      
    }

    renderEventObjAndDescription = () => {
        return (
            <div>
            <table className="table_Obj_description">
                <tbody>
                    <tr className="tr_obj">
                        <td>
                            <label htmlFor="inputObj">Objet : </label>
                        </td>
                        <td>
                            <input type="text" name="objet" id="inputObj" maxLength="30" onChange={this.handleChanges} autoComplete="off" required />
                        </td>
                    </tr>
                    <tr className="tr_description">
                        <td>
                            <label htmlFor="inputDescription">Description : </label>
                        </td>
                        <td>
                            <textarea name="description" id="inputDescription" maxLength="130" value={this.state.description} onChange={this.handleChanges} />
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        );
    }

    generateDatalist = () => {
        const tabUsers = this.state.other_users;
        // const list = [];
        let list = tabUsers.map(user => {
            return(<option key={user._id} value={user.prenom + " " + user.nom + " <" + user.mail + ">"} />);
        })
        return list;
    }

     //arrow fct to bind 'this'
    handleAddInvite = () => {
        let strInvite = document.getElementById('searchBarInvite').value;
        if (strInvite && strInvite !== '')
        {
            let mailIndexes = [strInvite.indexOf("<") + 1 , strInvite.indexOf(">")]
            let strMailInvite = strInvite.substring(mailIndexes[0], mailIndexes[1]);
            let invite = this.state.other_users.find(user => user.mail === strMailInvite);
            let alreadyInvited = this.state.users_invites.find(user => user._id === invite._id) ? true : false;
            //on remet la search bar à vide
            document.getElementById('searchBarInvite').value="";
            if (!alreadyInvited)
                this.setState({ users_invites: [...this.state.users_invites, invite] });
        }

    }

    generateListeInvites = () => {
        // let liste = [];

        let liste = this.state.users_invites;
        //on trie dans l'ordre alphabétique par NOM
        //la fonction sort place el1 avant el2 si la foncion de tri renvoie un nb < 0,
        //place el2 avant el1 si la fonction de tri renvoie un nb > 0
        let listeSorted = liste.sort((user1, user2) => {
            if (user1.nom.toUpperCase() < user2.nom.toUpperCase())
                return -1;
            else if (user1.nom.toUpperCase() > user2.nom.toUpperCase())
                return 1;
            return 0;
        })
        //on transforme la liste en ce qu'on veut afficher
        listeSorted = listeSorted.map((user) => {
            return user.prenom + " " + user.nom + " <" + user.mail + ">\n"
        });
        //on retourne le tableau sous forme de string en enlevant les virgules
        return listeSorted.toString().replaceAll(',', '');
        // this.state.users_invites.forEach((user) => {
        //     liste.push(
        //         user.prenom + " " + user.nom + " <" + user.mail + ">\n"
        //     );
        // });

        // this.state.users_invites.forEach((user) => {
        //     list.push(
        //     <li key={user._id} className="li_user_invited">
        //         {user.prenom + " " + user.nom + " <" + user.mail + ">"}
        //     </li>
        //     );
        // })

        // return liste;
    }
    //fonction pour afficher les informations à remplir en fontion du type d'objet à créer
    //fonction fléchée pour accéder au this
    renderEventTypeContent = () => {
        let content = null;
        //la variable content contiendra le contenu à afficher en fonction de la valeur de
        //eventType dans l'état local
        if(this.state.eventType === false || this.state.eventType === "dispo")
        {
            content = (
                // <div className="eventTypeContent">
                //     <table className="tableEventTypeContent">
                //         <tbody>
                //             <tr className="startDate">
                //                 <td>
                //                     <label htmlFor="startDate">Date de début : </label>
                //                 </td>
                //                 <td>
                //                     <input type="date" name="startDate" onChange={this.handleChanges}
                //                     value={this.state.startDate} />
                //                     <input type="time" name="startTime" onChange={this.handleChanges}
                //                     value={this.state.startTime} disabled={this.state.allDay}/>
                //                 </td>
                //             </tr>
                //             <tr className="endDate">
                //                 <td>
                //                     <label htmlFor="endDate">Date de fin : </label>
                //                 </td>
                //                 <td>
                //                     <input type="date" name="endDate" onChange={this.handleChanges}
                //                     value={this.state.endDate} />
                //                     <input type="time" name="endTime" onChange={this.handleChanges}
                //                     value={this.state.endTime} disabled={this.state.allDay}/>
                //                 </td>
                //             </tr>
                //         </tbody>
                //     </table>
                // </div>
                <div className="eventTypeContent">
                    {this.renderEventDate()}
                </div>
            );
        }
        else if (this.state.eventType === "evenement")
        {
            content = (
                <div className="eventTypeContent">
                    {this.renderEventObjAndDescription()}
                    {this.renderEventDate()}
                    <table className="tableEventTypeContent_evenement">
                        <tbody>
                            {/* <tr className="startDate">
                                <td>
                                    <label htmlFor="startDate">Date de début : </label>
                                </td>
                                <td>
                                    <input type="date" name="startDate" onChange={this.handleChanges}
                                    value={this.state.startDate} />
                                    <input type="time" name="startTime" onChange={this.handleChanges}
                                    value={this.state.startTime} disabled={this.state.allDay}/>
                                </td>
                            </tr>
                            <tr className="endDate">
                                <td>
                                    <label htmlFor="endDate">Date de fin : </label>
                                </td>
                                <td>
                                    <input type="date" name="endDate" onChange={this.handleChanges}
                                    value={this.state.endDate} />
                                    <input type="time" name="endTime" onChange={this.handleChanges}
                                    value={this.state.endTime} disabled={this.state.allDay}/>
                                </td>
                            </tr> */}
                            <tr className="searchInvites">
                                <td>
                                    <label htmlFor="labelSearchInvites">Personnes à inviter à l'évènement : </label>
                                </td>
                                <td>
                                    <input list="usersList" name="searchBarInvite" className="searchBar" id="searchBarInvite"
                                    onChange={this.handleChanges}
                                    autoComplete="off"
                                    />

                                    <datalist id="usersList">
                                        {this.generateDatalist()}
                                    </datalist>

                                    <button type="button" name="addButtonInvite" className="addButton" id="addButtonInvite"
                                    onClick={this.handleAddInvite}
                                    />
                                    {/* <input type="search" /> */}
                                </td>
                            </tr>
                            <tr>
                                <td className="liste_invites" id="liste_invites_label" colSpan="2">
                                    <label htmlFor="liste_invites">Personnes invitées : </label>
                                </td>
                            </tr>
                            <tr id="tr_liste_invites_content">
                                <td className="liste_invites" id="liste_invites_content" colSpan="2">
                                    <textarea name="liste_invites" id="liste_invites" readOnly disabled
                                    value={this.generateListeInvites()} />

                                    {/* <div id="liste_invites">
                                        <ul id="ul_invites">
                                            {this.generateListeInvites()}
                                        </ul>
                                    </div> */}

                                    {/* <textarea name="liste_invites" id="liste_invites" readOnly>
                                        
                                    </textarea> */}

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
        return content;
    }
}