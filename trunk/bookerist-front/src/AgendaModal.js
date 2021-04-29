import React, { Component } from 'react';
import './AgendaModal.css';
import './Button.css';
// import moment from 'moment';

const users_get = "/users/get";

//Composant permettant d'afficher le modal pour créer un évènement dans l'agenda
export default class AgendaModal extends Component {
    constructor(props){
        super(props);

        //Définission de l'état, par défaut le eventType sera disponibilité
        this.state = {
            editable: this.props.editable,
            eventType: this.props.eventType && this.props.eventType !== '' ? this.props.eventType : "evenement",
            eventId: this.props.eventId && this.props.eventId !== '' ? this.props.eventId : '',
            allDay: this.props.allDay ? this.props.allDay : false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            objet: '',
            description: '',
            getProps: false, //pour ne récupérer les props qu'une fois
            alreadyFetched: false,
            mail: this.props.mail,
            other_users: [],
            users_invited: this.props.modifier ? this.props.users_invited : [],
            modifier: this.props.modifier,

            invitesVisible: false,
        }
        this.API = this.props.API;
    }

    componentDidMount() {
    }

    componentDidUpdate(){
        const listProps = ["startDate", "startTime", "endDate", "endTime", "objet", "description", "users_invited", "eventId", "allDay", "editable", "mail"];
        if (!this.state.getProps)
        {
            for(let prop of listProps)
            {
                this.setState({
                    [prop]: this.props[prop] ? this.props[prop] : this.state[prop]
                });
            }
            this.setState({ getProps: true});
        }
        if ((this.state.eventType === "evenement" || this.state.eventType === "rdv") && !this.state.alreadyFetched)
        {
            fetch(this.API + users_get, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mail: this.props.mail })
            })
            .then(res => res.json())
            .then(res => {
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
            eventType: this.props.eventType !== '' ? this.props.eventType : "evenement",
            allDay: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            getProps: false,
            other_users: [],
            users_invited: [],
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
            eventType: "evenement",
            allDay: false,
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            other_users: [],
            users_invited: [],
        })
    }

    handleClose = (e) => {
        // var modal = document.getElementById("modal");
        // modal.style.display = "none";
        this.props.handleCloseModal();
    }
    
   

    handleSave = (e) => {
        if (e)
            e.preventDefault();
        let event = {};

        if (this.state.eventType === 'evenement')
        {
            event = {
                id: this.state.eventId,
                title: this.state.objet,
                extendedProps: {
                    user_mail: this.props.mail,
                    users_invited: this.state.users_invited,
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
        if (this.state.modifier)
            this.props.handleChangeEvent(event);
        else
            this.props.handleAddEvent(event);

        this.clearState();
        this.handleClose();
    }

    handleRemove = () => {
        if (this.state.editable === true)
        {
            let text = {
                dispo: "cette disponibilité",
                rdv: "ce rendez-vous",
                evenement: "cet évènement"
            }
            let eventText = "Êtes-vous sûrs de vouloir supprimer " + text[this.state.eventType] + " ?";
            let confirmation = window.confirm(`${eventText}`);
            if (confirmation)
            {
                this.props.handleRemove({ eventId: this.state.eventId });
                this.clearState();
                this.handleClose();
            }
        }
        else
        {
            let text = {
                rdv: "ce rendez-vous",
                evenement: "cet évènement"
            }
            let eventText = "Êtes-vous sûrs de vouloir annuler votre participation à " + text[this.state.eventType] + " ?";
            let confirmation = window.confirm(`${eventText}`);
            if (confirmation)
            {
                let users_invited = this.state.users_invited;
                let user = users_invited.find(user => user.mail === this.state.mail);
                let index = users_invited.indexOf(user);
                users_invited.splice(index, 1);
                this.setState({ users_invited });
                this.handleSave();
                this.props.handleRemove({ eventId: this.state.eventId });
                this.clearState();
                this.handleClose();
            }
        }
        
    }

    showInvites = () => {
        this.setState({ invitesVisible: !this.state.invitesVisible });
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
                            <select name="eventType" className={this.state.editable ? "listeType" : "listeType--nonEditable"} value={this.state.eventType} id={eventType} disabled={!this.state.editable} onChange={this.handleChanges}>
                                {/* <option value="dispo">disponibilité</option>
                                <option value="rdv">rendez-vous</option> */}
                                <option value="evenement">évènement</option>
                            </select>
                        </div>
                        {this.renderEventTypeContent()}
                        <footer>
                            <button type="button" name="toggleInvites" className={this.state.editable ? "modalButton" : "modalButton--invisible"} id="toggleInvites" onClick={this.showInvites} disabled={!this.state.editable}>
                                {this.state.invitesVisible ? "Ne pas ajouter de participant" : "Ajouter des participants"}
                            </button>
                            <button type="button" name="remove" className={this.state.modifier ? "modalButton" : "modalButton--invisible"} id="remove" onClick={this.handleRemove}>Supprimer</button>
                            <input type="reset" name="reset" className="modalButton" value="Réinitialiser" disabled={!this.state.editable} onClick={this.handleReset}/>
                            <button type="submit" name="save" className="modalButton" id="save" disabled={!this.state.editable}>Sauvegarder</button>
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
                                <input type="checkbox" name="allDay" id="allDay" value="allDay" checked={this.state.allDay} disabled={!this.state.editable} onChange={this.handleCheckboxChanges}/>
                            </td>
                            <td>
                                <label htmlFor="allDay" name="labelAllDay" id="labelAllDay">Toute la journée</label>
                            </td>
                        </tr>
                        <tr className="tr_startDate">
                            <td>
                                <label htmlFor="startDate" className="required-field">Date de début</label>
                            </td>
                            <td>
                                <input type="date" name="startDate" onChange={this.handleChanges}
                                value={this.state.startDate} disabled={!this.state.editable} required />
                                <input type="time" name="startTime" onChange={this.handleChanges}
                                value={this.state.startTime} disabled={!this.state.editable || this.state.allDay}/>
                            </td>
                        </tr>
                        <tr className="tr_endDate">
                            <td>
                                <label htmlFor="endDate" className="required-field">Date de fin</label>
                            </td>
                            <td>
                                <input type="date" name="endDate" onChange={this.handleChanges}
                                value={this.state.endDate} disabled={!this.state.editable} required />
                                <input type="time" name="endTime" onChange={this.handleChanges}
                                value={this.state.endTime} disabled={!this.state.editable || this.state.allDay}/>
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
                            <label htmlFor="inputObj" className="required-field">Objet</label>
                        </td>
                        <td>
                            <input type="text" name="objet" id="inputObj" maxLength="30" value={this.state.objet} autoComplete="off" disabled={!this.state.editable} onChange={this.handleChanges}  required />
                        </td>
                    </tr>
                    <tr className="tr_description">
                        <td>
                            <label htmlFor="inputDescription">Description</label>
                        </td>
                        <td>
                            <textarea name="description" id="inputDescription" maxLength="130" value={this.state.description} disabled={!this.state.editable} onChange={this.handleChanges} />
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        );
    }

    generateDatalist = () => {
        if (this.state.other_users.length > 0)
        {
            let tabUsers = this.state.other_users;
            let list = tabUsers.map(user => {
                return(<option key={user._id} value={user.prenom + " " + user.nom + " <" + user.mail + ">"} />);
            })
            return list;
        }
        return null;
    }

     //arrow fct to bind 'this'
    handleAddInvite = () => {
        let strInvite = document.getElementById('searchBarInvite').value;
        if (strInvite && strInvite !== '')
        {
            let mailIndexes = [strInvite.indexOf("<") + 1 , strInvite.indexOf(">")]
            let strMailInvite = strInvite.substring(mailIndexes[0], mailIndexes[1]);
            let invite = this.state.other_users.find(user => user.mail === strMailInvite);
            let alreadyInvited = this.state.users_invited.find(user => user._id === invite._id) ? true : false;
            //on remet la search bar à vide
            document.getElementById('searchBarInvite').value="";
            if (!alreadyInvited)
                this.setState({ users_invited: [...this.state.users_invited, invite] });
        }

    }

    generateListeInvites = () => {
        let liste = this.state.users_invited;
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
                <div className="eventTypeContent">
                    {this.renderEventDate()}
                </div>
            );
        }
        else if (this.state.eventType === "evenement")
        {
            let contentClass = this.state.invitesVisible || !this.state.editable ? "tableEventTypeContent_evenement--visible" : "tableEventTypeContent_evenement--invisible";

            let searchBarClass = this.state.editable ? "searchBarInvites--visible" : "searchBarInvites--invisible";

            content = (
                <div className="eventTypeContent">
                    {this.renderEventObjAndDescription()}
                    {this.renderEventDate()}
                    <table className={contentClass}>
                        <tbody>
                            <tr className={searchBarClass}>
                                <td>
                                    <label htmlFor="labelSearchInvites">Personnes à inviter à l'évènement</label>
                                </td>
                                <td>
                                    <input list="usersList" name="searchBarInvite" className="searchBar" id="searchBarInvite"
                                    disabled={!this.state.editable} onChange={this.handleChanges}
                                    autoComplete="off"
                                    />

                                    <datalist id="usersList">
                                        {this.generateDatalist()}
                                    </datalist>

                                    <button type="button" name="addButtonInvite" className="addButton" id="addButtonInvite"
                                    onClick={this.handleAddInvite}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="liste_invites" id="liste_invites_label" colSpan="2">
                                    <label htmlFor="liste_invites">Personnes invitées</label>
                                </td>
                            </tr>
                            <tr id="tr_liste_invites_content">
                                <td className="liste_invites" id="liste_invites_content" colSpan="2">
                                    <textarea name="liste_invites" id="liste_invites" readOnly disabled
                                    value={this.generateListeInvites()} />
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