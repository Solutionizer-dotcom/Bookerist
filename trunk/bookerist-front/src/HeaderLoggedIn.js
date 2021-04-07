import './HeaderLoggedIn.css';
import './Button.css';
import reactDom from 'react-dom';
import logo from './logo.png';
import App from './App';
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export default function HeaderLoggedIn(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [profilOpen, setProfilOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  function toggleProfil () {
    setProfilOpen((profilOpen) => !profilOpen);
  }

  function handleDisconnect () {
    props.handleDisconnect();
  }

  function handleGotoMain() {
    props.handlePage({ inAccueil: true });
  }

  return (
    <header className="headerLoggedIn">
    {/* <div className={classes.root}> */}
      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          Menu
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                      <MenuItem onClick={handleClose}>Accueil</MenuItem>
                      <MenuItem onClick={handleClose}>Ajout créneau</MenuItem>
                      <MenuItem onClick={handleClose}>Prendre rendez-vous</MenuItem>
                      <MenuItem onClick={handleClose}>Ajout évènement</MenuItem>
                      <MenuItem onClick={handleClose}>Manuel d'utilisation</MenuItem>
                      <MenuItem onClick={handleClose}>Contact</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

      <img className="logoLoggedIn" src={logo} alt="logo" height="32" width="32" onClick={handleGotoMain} />

      <div id="menuProfil">
        <button id="profil" onClick={toggleProfil}>{props.name} ({props.mail})</button>
        { profilOpen
        ? (
          <div className="choices">
        <button className="profilChoix" onClick={handleDisconnect}>Se déconnecter</button>
        </div>
        )
        : (null)
      }
      </div>
    </header>
  );
}

//     toggleMenu(e) {
//         e.preventDefault();
//         this.setState(state => ({
//             showMenu: !state.showMenu
//         }))
//     }
//     handleDisconnect = () => {
//         this.props.handleLoginChange(false);
//     }

//     render(){
//         return (
//             <header className="header">
//                 <button 
//                 onClick={this.toggleMenu}
//                 className="menu"
//                 >
//                     Menu
//                 </button>
                
//             {
//                 this.state.showMenu
//                 ? (
//                     <div className="windowMenu">
//                         <button 
//                         className="listMenu"
//                         >
//                             Ajout créneau
//                         </button>

//                         <button
//                         className="listMenu"
//                         >Prendre rendez-vous
//                         </button>

//                         <button
//                         className="listMenu"
//                         >Ajout évènement
//                         </button>

//                         <button
//                         className="listMenu"
//                         >Manuel d'utilisation
//                         </button>
                        
//                         <button
//                         className="listMenu"
//                         >Contact
//                         </button>
//                     </div>
//                 )
//                 : (null)
//             }

//             {/* <button onClick={this.handleDisconnect}>
//                 Se déconnecter
//             </button>
                
//             <img className="logo" src={logo} alt="logo" height="32" width="32" onClick={() => reactDom.render(<App />, document.getElementById('root'))}/> */}
//             </header>
//         );
//     }
// }

// export default HeaderLoggedIn;