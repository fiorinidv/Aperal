var React     = require('react');
var ReactDOM  = require('react-dom');
var createStore =  require('redux').createStore;
var Provider    =  require('react-redux').Provider;
var connect   = require('react-redux').connect;

var Router = require('react-router-dom').BrowserRouter
var Route = require('react-router-dom').Route
var Link = require('react-router-dom').Link

import { Redirect } from 'react-router';


function globalReducer(state={playerList:[]}, action) {
  if(action.type == 'playerAddList') {


    var newPlayerList = state.playerList.concat({name:action.playerName, point: 0, malus:0});

    return { playerList: newPlayerList };
  }
  if(action.type == 'playerRemoveList') {

    var newPlayerList = state.playerList.concat();
    newPlayerList.splice(action.playerIndex, 1);

    return { playerList: newPlayerList };
  }
  /*else {
    return state;
  }*/

 if(action.type=='playerAddpoint') {

            var copyPlayerListPoint = state.playerList.concat();
            for(var i =0; i<copyPlayerListPoint.length; i++) {
              if(action.playerIndex == i) {
                copyPlayerListPoint[i].point++;
                copyPlayerListPoint[i].malus = 0;
              }
            }
            return { playerList: copyPlayerListPoint };
          }

     if(action.type=='playerAddMalus') {

            var copyPlayerListMalus = state.playerList.concat();
            for(var i =0; i<copyPlayerListMalus.length; i++) {
              if(action.playerIndex == i) {
                copyPlayerListMalus[i].malus++;
              }
            }
            return { playerList: copyPlayerListMalus };
          }


    return state;

}


if(saveStore != null) {
  var store = createStore(globalReducer, saveStore);
} else {
  var store = createStore(globalReducer);
}


function handleChange() {
  //console.log(store.getState());
  var data = JSON.stringify(store.getState());
  fetch('./saveApp?storeState='+data);
}
store.subscribe(handleChange);



class PlayerAdd extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange     = this.handleChange.bind(this);
    this.handleSubmit     = this.handleSubmit.bind(this);
    this.state = {};
  }

  handleChange(event) {
   // console.log(event.target.value);
    this.setState({playerName: event.target.value, point:0, malus:0});
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onHandleSubmit(this.state.playerName);
    this.setState({value: ""});
  }

  render() {

    return(
      <div className="col-xs-12 input-position">
<img src="logo aperal.JPG" className="center-block" />
<h2>APERAL</h2>
<div className="form-signin">
  <form className="form-inline" onSubmit={this.handleSubmit}>
    <input  onChange={this.handleChange} value={this.state.value} className="form-control mr-sm-2" type="text" id="player" placeholder="Ajouter un joueur" />
    <button type="submit" className="btn btn-primary btn-lg" ><span className="glyphicon btn-glyphicon glyphicon-plus-sign" /></button>
  </form>
</div>
</div>
     )
  }
}

function mapDispatchToPropsPlayerAdd(dispatch) {
  return {
    onHandleSubmit: function(name) {
      dispatch( {type: 'playerAddList', playerName: name} );

    }
  }
}

var PlayerAddRedux = connect(
    null,
    mapDispatchToPropsPlayerAdd
)(PlayerAdd);



class PlayerList extends React.Component {

  constructor() {
   super();
   this.onHandleClick     = this.onHandleClick.bind(this);
   //this.state = {playerList : this.props.playerList};
   this.handleClickTurn4    = this.handleClickTurn4.bind(this);
   this.handleClickTurn8    = this.handleClickTurn8.bind(this);
   this.handleClickTurn12   = this.handleClickTurn12.bind(this);
  
  }

  onHandleClick(e) {
    //console.log(e.currentTarget.getAttribute('data-playeri'));
    //console.log(e.currentTarget);
    var i = e.currentTarget.getAttribute('data-playeri');
    this.props.onHandleClick(i);
    /*var copyPlayerList = this.props.playerList.concat();
    copyPlayerList.splice(i, 1);
    this.setState({
        playerList: copyPlayerList
    })*/
  }


handleClickTurn4() {
this.props.playerList.turn = 4;
  }

handleClickTurn8() {
this.props.playerList.turn = 8;
  }

handleClickTurn12() {
this.props.playerList.turn = 12;
  }


  render() {

   var players = [];
   for(var i=0; i<this.props.playerList.length; i++) {
     players.push(<li key={i} className="list-group-item">{this.props.playerList[i].name} <span onClick={this.onHandleClick} data-playeri={i} ><span className="glyphicon glyphicon-remove-circle grey"  aria-hidden="true"></span></span></li>);
   }



    return(
       <div className=" col-xs-12 input-position">
        <ul className="list-group">
         {players}
          <br/><br/>
            <div className="btn-group inline">
              <button type="button" onClick={this.handleClickTurn4}  className="form-control mr-sm-2" className="btn btn-primary btn-lg center-block"  > 4 tours</button>
              <button type="button" onClick={this.handleClickTurn8}  className="form-control mr-sm-2" className="btn btn-primary btn-lg center-block" > 8 tours</button>
              <button type="button" onClick={this.handleClickTurn12} className="form-control mr-sm-2" className="btn btn-primary btn-lg center-block" > 12 tours</button>
            </div>
          <br/><br/>
         <Link to="/game"> <button type="button" className="form-control mr-sm-2" className="btn btn-primary btn-lg center-block" ><span className="glyphicon glyphicon-glass"></span> Go !!</button></Link>
        </ul>
      </div>
     )
  }
}


function mapStateToProps(state) {
  return {

    playerList: state.playerList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onHandleClick: function(index) {
      dispatch( {type: 'playerRemoveList', playerIndex: index} );

    }
  }
}

var PlayerListRedux = connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerList);



class PlayerFull extends React.Component {

    constructor() {
    super();

  }

  render() {

    return(
      <div>
       <div className="row">
                  <PlayerAddRedux/>
                  <PlayerListRedux/>
      </div>
      </div>
     )
  }
}




class Game extends React.Component {

   constructor(props) {
    super(props);


      this.state = {
        chooseTheme : Math.floor((Math.random() * database.length)),
        chooseQuest: Math.floor((Math.random() * database[0].questions.length)),
        choosePlayer: 0,
        clickstatut : 'start',
        detectTurn:0,
        finTour:this.props.playerList.turn,
        
        

    };

     this.handleClickTrue = this.handleClickTrue.bind(this);
      this.handleClickFalse = this.handleClickFalse.bind(this);
      this.refreshQuest = this.refreshQuest.bind(this);

  }



  refreshQuest() {
    var nextPlayer = this.state.choosePlayer+1;
    var nextTheme =this.state.chooseTheme;
    var turnUp= this.state.detectTurn+1;
    var endTurn= this.state.finTour;


    if(nextPlayer==this.props.playerList.length) {
  nextPlayer=0
  nextTheme= Math.floor((Math.random() * database.length))
}



//console.log(this.state.chooseTheme)

   this.setState({


        chooseTheme :nextTheme,
        chooseQuest: Math.floor((Math.random() * database[0].questions.length)),
        choosePlayer: nextPlayer,
        clickstatut : 'start',
        detectTurn:turnUp,
        finTour: endTurn,

    });
    //console.log(this.state.detectTurn)

}



 handleClickTrue() {

this.props.playerList[this.state.choosePlayer].point++;
this.props.playerList[this.state.choosePlayer].malus=0;

this.props.onHandleClick(this.state.choosePlayer);

console.log(this.props.playerList[this.state.choosePlayer].point);
console.log(this.props.playerList[this.state.choosePlayer].malus);
//console.log(this.props.playerList);
//console.log(this.state.detectTurn);
this.setState(
  {clickstatut : 'vrai'}
)

setTimeout(this.refreshQuest, 2000);

  }


  handleClickFalse() {
  
  console.log("malus=> "+this.props.playerList[this.state.choosePlayer].malus);
  // Attention il ne faut jamais modifier une props !
  // De plus la gestion des états de playerList est géré par Redux grace à l'execution
  // de onHandleClick (qui fait déjà 2 dispatch dans ton cas)
  // Ce qui explique pourquoi tu avais 2 fois le malus qui (une fois avec la ligne juste en bas et une autre a cause du dispatch
  //Erreur  ==> this.props.playerList[this.state.choosePlayer].malus++;

this.props.onHandleClick(this.state.choosePlayer);


//console.log(this.props.playerList[this.state.choosePlayer].point);
//console.log(this.props.playerList[this.state.choosePlayer].malus);

//console.log(this.props.playerList[this.state.choosePlayer]);
this.setState(
  {clickstatut : 'faux'}
)



setTimeout(this.refreshQuest, 2000);

  }



  render() {
  console.log("fin du tour :"+this.state.finTour);
  if(this.state.detectTurn==this.props.playerList.length*this.state.finTour){
    return(
   <Redirect to="/end"/>
      )
  }

  var colorFalse;
    var colorTrue;
    var win= "";
    var loose= "";
    var sanction=this.props.playerList[this.state.choosePlayer].malus+1+" gorgée(s) en jeu !"

    if(this.state.clickstatut == 'vrai') {
      colorTrue = {
        background:'green'
      }
      sanction="";
      win="Tu gagnes 1 point!"


    } else if(this.state.clickstatut == 'faux'){

      colorFalse = {
        background:'red'
      },
      colorTrue = {
        background:'green'
      }
      sanction="";
      loose=this.props.playerList[this.state.choosePlayer].malus+" gorgée(s) pour toi !"

    }
    else {
      colorTrue = {
        background:'#5bc0de'
      },
      colorFalse = {
        background:'#5bc0de'
      }
    }


    return(
      <div>
       <div><h2>Thème sélectionné:<br/>{database[this.state.chooseTheme].theme}</h2></div><br/>
          <div><h4>{this.props.playerList[this.state.choosePlayer].name} à toi de jouer !</h4></div><br/>
                  <div className="label-primary"> {database[this.state.chooseTheme].questions[this.state.chooseQuest].enonce} </div><br/>

                          <div><h4 className="center">{win}{loose}</h4></div><br/>
                             <button style={colorFalse}  className="label-info" onClick={this.handleClickFalse} >{database[this.state.chooseTheme].questions[this.state.chooseQuest].reponse[0].rep}</button><br/><br/>
                             <button style={colorTrue} className="label-info" onClick={this.handleClickTrue} >{database[this.state.chooseTheme].questions[this.state.chooseQuest].reponse[1].rep}</button><br/><br/>
                             <button style={colorFalse}  className="label-info" onClick={this.handleClickFalse} >{database[this.state.chooseTheme].questions[this.state.chooseQuest].reponse[2].rep}</button>

                       <br/><br/>
          <div><h4 className="center">{sanction}</h4></div>
      </div>
     )
  }
}



class GameFull extends React.Component {

    constructor(props) {
    super(props);

  }


  render() {

    return(
      <div>
       <div>
           <GameRedux/>
      </div>
      </div>
     )
  }
}


function mapDispatchToPropsPoint(dispatch) {
  return {

    onHandleClick: function(index) {
      dispatch( {type: 'playerAddPoint',playerIndex: index} );
      dispatch( {type: 'playerAddMalus',playerIndex: index} );
    }

  }
}




var GameRedux = connect(
    mapStateToProps,
    mapDispatchToPropsPoint,


)(Game);


class Classement extends React.Component {

    constructor(props) {
    super(props);

  }
  
  sortPlayer(playerA, playerB) {
    return playerB.point - playerA.point;
  }
  
  render() {
    
    // trie le tableau playerList avec la méthode sort qui va 
    // utiliser notre fonction de comparaison
    this.props.playerList.sort(this.sortPlayer);
    
    var classementfinal = [];

        for(var i=0; i<this.props.playerList.length; i++) {
          classementfinal.push(
          <tr>
          <th>{this.props.playerList[i].name}<br/></th>
          <th>{this.props.playerList[i].point}<br/></th>
          </tr>

          );

        }
        /*playerList.sort(function (a, b) {
          return a.point - b.point;
        });*/

        /*classementfinal.sort(function (a, b) {
return a.point - b.point;
});*/



    return(
     <div className="container">
			<div className="col-xs-12 input-position">
        <h2 className="center">CLASSEMENT</h2><br/>
				<h4 className="center">Et règlements de comptes!!</h4><br/>
					<table className="table table-bordered">
						<thead>
								<tr >

										<th>Joueurs</th>
										<th>Points Finaux</th>

								</tr>
						</thead>
						<tbody>

                  {classementfinal}

						</tbody>
					</table>
           <h4 className="center">Bravo {this.props.playerList[0].name}, tu distribues {this.props.playerList[0].point} gorgées!</h4>
          <h4 className="center">Et bim! {this.props.playerList[classementfinal.length-1].name}, tu prends {this.props.playerList[classementfinal.length-1].point} gorgées!</h4>
<br/><br/><br/>
			</div>
				 <Link to="/game"> <button type="button" className="btn btn-primary btn-lg center-block" >Qui veut une revanche?</button><br/></Link>
					<Link to="/"> <button type="button" className="btn btn-primary btn-lg center-block" >On change les joueurs?</button></Link>

			</div>

     )
  }
}

class ClassementFull extends React.Component {

    constructor() {
    super();

  }

  render() {

    return(
      <div>
       <div>
           <ClassementRedux/>

      </div>
      </div>
     )
  }
}

function mapStateToProps(state) {
  return {
 playerList: state.playerList
  }
}

var ClassementRedux = connect(
    mapStateToProps,
    null
)(Classement);


var database = [
                {
                 theme : "Geographie", questions :
                                                                [
                                                                  {
                                                                    enonce: "A votre avis, quel est le plus gros exportateur de chameaux du monde ?",
                                                                    reponse:
                                                                        [{rep: "La Grèce"}, {rep: "La Turquie"}, {rep: "La Norvège"}]
                                                                  },
                                                                  {
                                                                    enonce: "Quel est le plus petit état du monde ?",
                                                                    reponse:
                                                                        [{rep: "Andorre"}, {rep: "Monaco"}, {rep: "Le Vatican"}]
                                                                  }
                                                                ]

                    },
                    {
                                  theme : "Histoire", questions :
                                                                [
                                                                  {
                                                                    enonce: "En quelle année fut implanté le 1er pacemaker (ou en français, stimulateur cardiaque) ?",
                                                                    reponse:
                                                                        [{rep: "1958"}, {rep: "1969"}, {rep: "1980"}]
                                                                  },
                                                                  {
                                                                    enonce: "En 1820, les scientifiques estimaient l’âge de l’univers à environ 6000 ans. Aujourd’hui, le chiffre avancé tournerait plutôt autour de ",
                                                                    reponse:
                                                                        [{rep: "A peu près 900 millions d’années"}, {rep: "Environ 5 milliards d’années"}, {rep: "Autour de 15 à 20 milliards d’années"}]
                                                                  }
                                                                ]
                    },
                     {
                                  theme : "Stat", questions :
                                                                [
                                                                  {
                                                                    enonce: "D'après vous, quelle est la proportion de gauchers dans le monde ?",
                                                                    reponse:
                                                                        [{rep: "Moins de 1%"}, {rep: "Entre 8 et 15%"}, {rep: "Environ 30%"}]
                                                                  },
                                                                  {
                                                                    enonce: "Pour être sûr d'avoir la bonne combinaison au loto, il vous faudrait remplir combien de grilles ?",
                                                                    reponse:
                                                                        [{rep: "163 425"}, {rep: "1 970 469"}, {rep: "19 068 840"}]
                                                                  }
                                                                ]
                    }
                ];











ReactDOM.render(
  <Provider store={store}>
    <Router>
            <div>
              <Route exact path="/" component={PlayerFull}/>
              <Route path="/game" component={GameFull}/>
              <Route path="/end" component={ClassementFull}/>

           </div>
     </Router>
  </Provider>
  ,
  document.getElementById('container')
);
