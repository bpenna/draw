var debugMode = false;
var debugBase = false;

// Informações para acessar os bancos de dados do SUPABASE
const SUPABASE_URL = "https://plnapxphvollprupnias.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmFweHBodm9sbHBydXBuaWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU0NDg5NjgsImV4cCI6MTk2MTAyNDk2OH0.S84tT1utiTDPyP1paIT8x4WumfKvbwVAyhZX1TzAZ7s";
const SUPABASE_PLAYERS = ["_DRAWGAME:JOGADOR"]; //ID, NOME, PONTOS, PIN 
const SUPABASE_RECORDS = ["_DRAWGAME:MELHORES"]; //INDEX, JOGADOR, NOME, PONTOS, DATA
const SUPABASE_WORDS = ["_DRAWGAME:PALAVRAS"]; //INDEX, TEMA, PALAVRA
const SUPABASE_DRAWS = ["_DRAWGAME:DESENHOS"]; //INDEX, JOGADOR, ORDEM, X_i, Y_i, X_f, Y_f

const PLAYER_COLOR = ["blue", "green", "red", "gold", "deeppink", "deepskyblue", "lightgreen", "chocolate", "wheat", "magenta"];

/////////////////////////////////////////////////////////////////////////////////////

const pincel = {
  ativo: false,
  movendo: false,
  indiceCor: -1,
  //posicao: {x: 0, y: 0},
  posicao: null,
  //posicaoAnterior: {x: 0, y: 0},
  posicaoAnterior: null,
  nome: "",
  pontos: 0,
  ID: 0,
  PIN: 0,
  tema: "",
  palavra: "",
  numJogadores: 0,
  adversarios: {}
  //adversarios: {id: 0, nome: "", pontos: 0, cor: ""}
}

/////////////////////////////////////////////////////////////////////////////////////

var jogadores = null;
var ordem = -1;
var indice = -1;
var turno2 = false;
var jogoLigado = false;


var assuntos = ["ESPORTES", "FRUTAS", "ESCRITÓRIO", "COZINHA", "CIDADE"];
var palavras = ["ABACAXI", "BANANA", "CAJU", "DAMASCO", "FIGO", "GOIABA"];

var votos = [];

var nomes = [];
var pontos = [];
var cores = [];

//var nomes = ["Bernardo", "Carolina", "Eduardo", "Cristiane", "Henrique", "Luciana", "Andréia", "André", "Letícia", "Gabriela"]; 
//var pontos = [9,8,7,6,5,4,3,2,1,0];

/////////////////////////////////////////////////////////////////////////////////////

// Inicializa cliente do Supabase (banco de dados atua como servidor)
const _supa = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Inicializa as informações na criação da sessão
consultaInfoNoBancoDeDados(SUPABASE_PLAYERS).then((gameInfo) => {
  
  // Exibe a tela inicial com informações das salas
  //inicializaTela(gameInfo).then(() => {});

  // Monitora as tabelas do SUPABASE
  monitoraSupabase().then(() => {});
  
  // Monitora o botão da sala e as teclas pressionadas pelo jogador
  //monitoraTela().then(() => {});

});

// Consulta informações na tabela do SUPABASE
async function consultaInfoNoBancoDeDados(tableName) {
  const { data, error } = await _supa.from(tableName)
    .select('*')
  
  if (error) {
    console.log("####################");
    console.log("TAB: " + tableName);
    console.log("ERRO (SELECT):");
    console.log(error);
    console.log("####################");
    } 
  
  if (debugBase) {
    console.log("> - - - - - - - - - - <");
    console.log("TAB: " + tableName);
    console.log("DADOS (SELECT):");
    console.log(data);
    console.log("|_ _ _ _ _ _ _ _ _ _ _|");
  }
  
  return data;
}

// Adiciona linha na tabela do SUPABASE
async function adicionaInfoNoBancoDeDados(tableName, tableInfo) {
  const { data, error } = await _supa.from(tableName)
    .insert([tableInfo])
  
  if (error) {
    console.log("####################");
    console.log("TAB: " + tableName);
    console.log("INFO:");
    console.log(tableInfo);
    console.log("ERRO (INSERT):");
    console.log(error);
    console.log("####################");
  } 
  
  if (debugBase) {
    console.log("> - - - - - - - - - - <");
    console.log("TAB: " + tableName);
    console.log("INFO:");
    console.log(tableInfo);
    console.log("DADOS (INSERT):");
    console.log(data);
    console.log("|_ _ _ _ _ _ _ _ _ _ _|");
  }
  
  return data;
}

// Atualiza linha na tabela do SUPABASE
async function atualizaInfoNoBancoDeDados(tableName, tableInfo, id, value) {
  const { data, error } = await _supa.from(tableName)
    .update([tableInfo])
    .eq(id, value)
    .single()
    
  if (error) {
    console.log("####################");
    console.log("TAB: " + tableName);
    console.log(id + ": " + value);
    console.log("INFO:");
    console.log(tableInfo);
    console.log("ERRO (UPDATE):");
    console.log(error);
    console.log("####################");
  } 
  
  if (debugBase) {
    console.log("> - - - - - - - - - - <");
    console.log("TAB: " + tableName);
    console.log(id + ": " + value);
    console.log("INFO:");
    console.log(tableInfo);
    console.log("DADOS (UPDATE):");
    console.log(data);
    console.log("|_ _ _ _ _ _ _ _ _ _ _|");
  }
  
  return data;
}

// Remove linha na tabela do SUPABASE
async function removeInfoNoBancoDeDados(tableName, id, value) {
  const { data, error } = await _supa.from(tableName)
    .delete()
    .eq(id, value) 

  if (error) {
    console.log("####################");
    console.log("TAB: " + tableName);
    console.log(id + ": " + value);
    console.log("ERRO (DELETE):");
    console.log(error);
    console.log("####################");
  } 
  
  if (debugBase) {
    console.log("> - - - - - - - - - - <");
    console.log("TAB: " + tableName);
    console.log(id + ": " + value);
    console.log("DADOS (DELETE):");
    console.log(data);
    console.log("|_ _ _ _ _ _ _ _ _ _ _|");
  }
  
  return data;
}

// Define ações caso haja alguma alteração nas tabelas dos jogadores (INSERT, UPDATE, DELETE)
async function monitoraJogador(payload) {

  if (payload.eventType == "INSERT") {
              
    if (debugBase) { 
      console.log("> - - - - - - - - - - <");
      console.log("MONITORADO: " + payload.eventType, ": ", payload.new);
      console.log("|_ _ _ _ _ _ _ _ _ _ _|");
    }
      
    if (payload.new.PIN == pincel.PIN) {
      pincel.adversarios.[pincel.numJogadores] = {id: payload.new.ID, nome: payload.new.NOME, pontos: payload.new.PONTOS, cor: PLAYER_COLOR[pincel.numJogadores]};
      nomes[pincel.numJogadores] = pincel.adversarios.[pincel.numJogadores].nome;
      pontos[pincel.numJogadores] = pincel.adversarios.[pincel.numJogadores].pontos;
      cores[pincel.numJogadores] = PLAYER_COLOR[pincel.numJogadores];
      jogadores = ordena(nomes, pontos, cores);
      atualizarNomes();
      pincel.numJogadores++;
      console.log("OPS: " + payload.new.NOME);
      console.log("OPS: " + pincel.numJogadores);
    }
    
  } //INSERT 
    
  if (payload.eventType == "UPDATE") {
        
    if (debugBase) {
      console.log("> - - - - - - - - - - <");
      console.log("MONITORADO: " + payload.eventType, ": ", payload.new);
      console.log("|_ _ _ _ _ _ _ _ _ _ _|");
    }
        
  } //UPDATE
  
  // Caso algum jogador tenha saído de uma sala
  if (payload.eventType == "DELETE") {
        
    if (debugBase) {
      console.log("> - - - - - - - - - - <");
      console.log("MONITORADO: " + payload.eventType, ": ", payload.old);
      console.log("|_ _ _ _ _ _ _ _ _ _ _|");
    }

  } //DELETE 
  
}

// Define ações caso haja alguma alteração nas tabelas dos desenhos (INSERT, UPDATE, DELETE)
async function monitoraDesenho(payload) {

  if (payload.eventType == "INSERT") {
              
    if (debugBase) { 
      console.log("> - - - - - - - - - - <");
      console.log("MONITORADO: " + payload.eventType, ": ", payload.new);
      console.log("|_ _ _ _ _ _ _ _ _ _ _|");
    }
    
    document.getElementById("screen").getContext("2d").beginPath();
    document.getElementById("screen").getContext("2d").moveTo(payload.new.X_i, payload.new.Y_i);
    document.getElementById("screen").getContext("2d").lineTo(payload.new.X_f, payload.new.Y_f);
    document.getElementById("screen").getContext("2d").stroke();
    
  } //INSERT 
    
  if (payload.eventType == "UPDATE") {
        
    if (debugBase) {
      console.log("> - - - - - - - - - - <");
      console.log("MONITORADO: " + payload.eventType, ": ", payload.new);
      console.log("|_ _ _ _ _ _ _ _ _ _ _|");
    }
        
  } //UPDATE
  
  // Caso algum jogador tenha saído de uma sala
  if (payload.eventType == "DELETE") {
        
    if (debugBase) {
      console.log("> - - - - - - - - - - <");
      console.log("MONITORADO: " + payload.eventType, ": ", payload.old);
      console.log("|_ _ _ _ _ _ _ _ _ _ _|");
    }

  } //DELETE 
  
}

// Utiliza realtime da tabela no SUPABASE para monitorar alterações
async function monitoraSupabase() {
  const data = await _supa.from('*')
    .on('*', payload => {
      
      // Caso tenha sido alterada a tabela de jogadores (SUPABASE_PLAYERS)
      if (SUPABASE_PLAYERS.indexOf(payload.table) >= 0) {
        monitoraJogador(payload);
      }
      
      // Caso tenha sido alterada a tabela de desenhos (SUPABASE_DRAWS)
      if (SUPABASE_DRAWS.indexOf(payload.table) >= 0) {
        monitoraDesenho(payload);
      }
      
    })
    .subscribe()
  
    // Exibe os dados se estiver no modo debug (debugMode = true) 
    if (debugBase) {
      console.log("> - - - - - - - - - - <");
      console.log("SUBSCRIPTION DATA:");
      console.log(data.topic);
      console.log("|_ _ _ _ _ _ _ _ _ _ _|");
    }
  
  return data; 
}

/////////////////////////////////////////////////////////////////////////////////////

function atualizarNomes() {
  var infoText = "";
  for (var i = 0; i < nomes.length; i++) {
    if (i == 0) {
      infoText += "<ol id = 'lista'> ";
    }
    infoText += "<li style = 'color: " + jogadores[i].cor + ";'> (" + pad2(jogadores[i].ponto) + ") " + jogadores[i].nome + " </li> ";
    if (i == nomes.length - 1) {
      infoText += "</ol>";
    }
  }
  document.getElementById('players').innerHTML = infoText; 
}

// Inicializa o jogo
async function carregarJogo() {
  
  // Preenche jogadores já cadastrados
  var dados = await consultaInfoNoBancoDeDados(SUPABASE_PLAYERS);
   
  for (var i = 0; i < dados.length; i++) {
    if (dados[i].PIN == pincel.PIN && dados[i].ID != pincel.ID) {
      pincel.adversarios.[pincel.numJogadores] = {id: dados[i].ID, nome: dados[i].NOME, pontos: dados[i].PONTOS, cor: PLAYER_COLOR[pincel.numJogadores]};
      pincel.numJogadores++;
      console.log(dados[i].NOME);
      console.log(pincel.numJogadores);
    }
  }
  
  for (var i = 0; i < pincel.numJogadores; i++) {
    nomes[i] = pincel.adversarios.[i].nome;
    pontos[i] = pincel.adversarios.[i].pontos;
    cores[i] = PLAYER_COLOR[i];
  }
  
  document.getElementById("screen").addEventListener("mousedown", iniciaMovimentoMouse); 
  document.getElementById("screen").addEventListener("mousemove", (evento) => {continuaMovimentoMouse(evento)});
  document.getElementById("screen").addEventListener("mouseup", () => {finalizaMovimentoMouse()});
  document.getElementById("screen").addEventListener("touchstart", iniciaMovimentoTouch); 
  document.getElementById("screen").addEventListener("touchmove", (evento) => {evento.preventDefault(); continuaMovimentoTouch(evento)});
  document.getElementById("screen").addEventListener("touchend", () => {finalizaMovimentoTouch()});
  document.getElementById("screen").getContext("2d").lineWidth = 3;
  document.getElementById('set').addEventListener("click", configurarJogo); 
  
  jogadores = ordena(nomes, pontos, cores);
  atualizarNomes();
  desenho();
}

// Começar o jogo assim que clica no botão
function configurarJogo() {

  var infoText = "<img id = 'janela' src = 'https://i.imgur.com/omWqxaL.png'> <h2 class = 'info' style = 'top: 0vw'>TEMA:</h2><select id = 'tema' class = 'caixa' style = 'top: 0.5vw; width: 31vw;'><option value='' >escolha o tema do jogo</option>";
  for (var i = 0; i < assuntos.length; i++) {
    infoText += "<option value = '" + assuntos[i] + "'>" + assuntos[i] + "</option>";
  }
  infoText += "</select> <h2 class = 'info' style = 'top: 5vw'>NOME:</h2><input type = 'text' id = 'apelido' class = 'caixa' style = 'top: 5vw' placeholder = 'defina seu apelido aqui'> <h2 class = 'info' style = 'top: 10vw'>Nº PIN:</h2><input type = 'text' id = 'pin' class = 'caixa' style = 'top: 10vw' placeholder = 'digite o PIN para jogar'> <button class = 'ok' onclick = 'fecharJanela()' style = 'top: 15vw; left: 30%;'>CANCEL</button> <button class = 'ok' onclick = 'exibirIniciar()' style = 'top: 15vw; left: 60%;'>OK</button>";
  
  document.getElementById('window').innerHTML = infoText;

}

function fecharJanela() {  
  document.getElementById('window').innerHTML = "";
}

async function exibirIniciar() {
  
  if (document.getElementById('tema').value == "") {
    alert("Escolha um tema!");
  } else {
    pincel.tema = document.getElementById('tema').value;
    if (document.getElementById('apelido').value == "") {
      alert("Defina um nome!");
    } else {
      pincel.nome = document.getElementById('apelido').value;
      if (document.getElementById('pin').value == "") {
        alert("Digite um PIN!");
      } else {
        pincel.PIN = document.getElementById('pin').value;
        document.getElementById('play').classList.remove("btn2_OFF");
        document.getElementById('play').classList.add("btn2_ON");
        document.getElementById('play').addEventListener("click", iniciarJogo); 
        fecharJanela();
        var dados = await adicionaInfoNoBancoDeDados(SUPABASE_PLAYERS, {NOME: pincel.nome, PONTOS: 0, PIN: pincel.PIN});
        pincel.ID = dados[0].ID;
        carregarJogo();
      }
    }
  }
}

function exibirSair() {
  fecharJanela();
  document.getElementById('stop').classList.remove("btn2_OFF");
  document.getElementById('stop').classList.add("btn2_ON");
  document.getElementById('stop').addEventListener("click", sairJogo); 
}

function sairJogo() {
  jogoLigado = false;
  turno2 = false;
  indice = -1;
  ordem = -1;
  inicializaPincel();
  finalizaRodada();
}

function iniciarJogo() { 
  jogoLigado = true;
  iniciaRodada();
  exibirSair();
  document.getElementById("screen").getContext("2d").clearRect(0, 0, document.getElementById("screen").width, document.getElementById("screen").height);
  var word = palavras[0];
  indice = 0;
  ordem = 0;
  document.getElementById('minhaCor').style.background = cores[indice]; // por enquanto
  iniciaTurno(word);
}

function iniciaTurno(palavra) {
  
  // Para evitar iniciar o temporizador com o jogador desenhando
  if (pincel.ativo) {
    pincel.ativo = false;
  }
  
  // Para garantir que o temporizador será iniciado
  var primeiro = true;
  
  //Para finalizar o temporizador caso o jogador não desenhe no tempo adequado
  var tempo = 122; 
 
  // Seleciona o jogador correto para o turno
  var jogador = jogadores[indice].nome;
  
  // Exibe a mensagem correta para o turno
  document.getElementById('texto1').innerHTML = jogador + ",";
  document.getElementById('texto2').innerHTML = "Desenhe " + palavra + ":";
  
  // Exibe a barra sem preenchimento
  var infoText = "<img id = 'image2' src='https://i.imgur.com/QIkPEnO.png'>";
  var num = 2.5;
  
  // Exibe a barra correspondente ao valor do temporizador do turno
  const myInterval = setInterval(function() {
    
    // Indica que o jogador começou a desenhar
    if (pincel.ativo) {
      primeiro = false;
    }
    
    // Reduz o tempo disponível par ao jogador desenhar no turno
    tempo--;
    
    // Continua o temporizador se ainda houver tempo e o jogador ainda não tiver desenhado nada
    if (jogoLigado && tempo > 0 && (primeiro || pincel.ativo)) { 
      if (num < 92) {
        // Aumenta a barra do temporizador
        infoText += "<img class = 'passo' src = 'https://i.imgur.com/3ilVR3y.png' style = 'left: " + num + "vw;'>";
      } else {
        // Finaliza a barra do temporizador
        infoText += "<img class = 'passo' src='https://i.imgur.com/sg5bb38.png' style = 'right: 2.5vw;'>";
      }  
      
      // Aumenta a próxima posição da barra do temporizador
      num += 0.75;
      
    } else {
      // Finaliza temporizador do turno atual
      clearInterval(myInterval);
      
      // Se ainda tem jogador para o turno 1, seleciona-o para jogar 
      indice++;
      document.getElementById('minhaCor').style.background = cores[indice]; // por enquanto
      if (indice < jogadores.length) {
        iniciaTurno(palavra);
      } else {
        // Se não houver mais jogador para turno 1, inicia o turno 2
        if (!turno2) {
          turno2 = true;
          indice = 0;
          iniciaTurno(palavra);
        } else {
          // Se não houver mais jogador para turno 2, finaliza rodada do jogo
          turno2 = false;
          indice = -1;
          ordem = -1;
          inicializaPincel();
          finalizaRodada();
          iniciaVotacao();
          console.log("FIM DESENHOS")
        }
      }
    }      
    document.getElementById('barra').innerHTML = infoText;
  }, 25);
}

function iniciaVotacao() {
  //document.getElementById("texto1").innerHTML = "&emsp; Qual a cor do farsante?";
  temporizador(20);
  var infoText = "";
  var num = 30;
  var num2 = 30.4;
  for (var i = 0; i < nomes.length; i++) {
    num += 5;
    num2 += 5;
    infoText += "<img src = 'https://i.imgur.com/vhWAX1p.png' class = 'circulo' style = 'left: " + num + "vw; top: 4vw'><div id = 'voto" + i + "' class = 'circulo' onclick = 'computaVoto(" + i + ")' style = 'left: " + num2 + "vw; top: 4.4vw; height: 2.8vw; width: 2.8vw; cursor: pointer' ></div>";
  }
  document.getElementById("voting").innerHTML = infoText;
  for (var i = 0; i < nomes.length; i++) {
    document.getElementById("voto" + i).style.backgroundColor = cores[i];
  }
}

function computaVoto(indice) {
  console.log(indice)
  document.getElementById("texto2").innerHTML = "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" + indice;
}

var votos = [1, 0, 4, 3, 1, 1, 3, 0, 4, 8];

function calculaVotacao() {

  
  // FAZER AQUI!!!!!!!!!!!!
  votos.sort(function (a, b) {return a - b});
  if (votos[0] > votos[1]) {
    var vencedor = votos[0];
    console.log("Vencedor: " + vencedor);
  } else {
    console.log("Empate");
  }
  console.log(votos)
  
  /*var entrada = [1, 2, 3, 4, 5, 2, 2, 3];
  var ocorrencias = {};
  for ( var i = 0 ; i < entrada.length ; i++ ) {
    ocorrencias[entrada[i]] = 1 + (ocorrencias[entrada[i]] || 0);
  }
  var maior = null;
  var ocorrenciasMaior = -1;
  for ( var p in ocorrencias ) {
    if ( ocorrencias[p] > ocorrenciasMaior ) {
      maior = p;
      ocorrenciasMaior = ocorrencias[p];
    }
  }*/
}

function finalizaRodada() {
  document.getElementById("screen").getContext("2d").strokeStyle = "black";
  document.getElementById("screen").removeEventListener("mousedown", iniciaMovimentoMouse); 
  document.getElementById("screen").removeEventListener("touchstart", iniciaMovimentoTouch);
  document.getElementById("minhaCor").style.backgroundColor = "transparent";
  document.getElementById("texto1").innerHTML = "";
  document.getElementById("texto2").innerHTML = "";
  //document.getElementById("barra").zIndex = 4;
  //document.getElementById('barra').innerHTML = "<img id = 'image2' src='https://i.imgur.com/cW8kDrL.png'>"; // não funciona 
  //var slides = document.getElementsByClassName("tempo_ON");
  //  for(var i = 0; i < slides.length; i++)  {
  //    slides[i].src = "";
  //}
}

function iniciaRodada() {
  document.getElementById("screen").addEventListener("mousedown", iniciaMovimentoMouse); 
  document.getElementById("screen").addEventListener("touchstart", iniciaMovimentoTouch);
  //document.getElementById("barra").zIndex = 1;
}

// Mostrando o tempo decorrido de jogo
function temporizador(atual) {
  var minJogo = (atual - (atual % 60)) / 60;
  var segJogo = (atual < 60) ? atual : atual - (minJogo * 60);
  document.getElementById('texto1').innerHTML = "&nbsp; Quem é o farsante? (" + pad2(minJogo) + ":" + pad2(segJogo) + ")";
  const myInterval = setInterval(function() {
    document.getElementById("barra").innerHTML = "<img id = 'image2' src = 'https://i.imgur.com/QIkPEnO.png'>";
    atual--;
    if (atual >= 0) { 
      minJogo = (atual - (atual % 60)) / 60;
      segJogo = (atual < 60) ? atual : atual - (minJogo * 60);
      document.getElementById('texto1').innerHTML = "&nbsp; Quem é o farsante? (" + pad2(minJogo) + ":" + pad2(segJogo) + ")";
    }	else {
      clearInterval(myInterval);
      calculaVotacao();
    }
  }, 1000);
  
  console.log("FIM VOTOS")
}

function inicializaPincel(){
  pincel.ativo = false;
  pincel.movendo = false;
  pincel.indiceCor = -1;
  pincel.posicao = null;
  pincel.posicaoAnterior = null;
}

function iniciaMovimentoMouse(e) {
  //pincel.indiceCor = pincel.indiceCor == cores.length - 1 ? 0 : pincel.indiceCor + 1;
  
  e.preventDefault();
  if (debugMode) {console.log("INÍCIO DO TURNO")};
  pincel.ativo = true;
  pincel.indiceCor = indice;
  document.getElementById("screen").getContext("2d").strokeStyle = cores[pincel.indiceCor];
  
  if (debugMode) {
    console.log(document.getElementById("game").offsetTop); 
    console.log(document.getElementById("game").offsetLeft); 
    console.log(document.getElementById("game").offsetWidth);  
    console.log(document.getElementById("game").offsetHeight); 
  }

}

function iniciaMovimentoTouch(evento) { 
  //pincel.indiceCor = pincel.indiceCor == cores.length - 1 ? 0 : pincel.indiceCor + 1;
  
  evento.preventDefault();
  if (debugMode) {console.log("<MOBILE>")};
  const rect = document.getElementById("screen").getBoundingClientRect();
  const newX = (evento.changedTouches[0].pageX - rect.left) * document.getElementById("screen").width / rect.width;
  const newY = (evento.changedTouches[0].pageY - rect.top) * document.getElementById("screen").height / rect.height; 
  pincel.posicaoAnterior = {x: newX, y: newY};
  pincel.ativo = true;
  pincel.indiceCor = indice;
  document.getElementById("screen").getContext("2d").strokeStyle = cores[pincel.indiceCor];
}

function continuaMovimentoMouse(evento) {
 
  const rect = document.getElementById("screen").getBoundingClientRect();
  const newX = (evento.clientX - rect.left) * document.getElementById("screen").width / rect.width;
  const newY = (evento.clientY - rect.top) * document.getElementById("screen").height / rect.height;   
  pincel.posicao = {x: newX, y: newY};  
  pincel.movendo = true;
}

function continuaMovimentoTouch(evento) {
  const rect = document.getElementById("screen").getBoundingClientRect();
  const newX = (evento.changedTouches[0].pageX - rect.left) * document.getElementById("screen").width / rect.width;
  const newY = (evento.changedTouches[0].pageY - rect.top) * document.getElementById("screen").height / rect.height;   
  pincel.posicao = {x: newX, y: newY};
  pincel.movendo = true;
}  
  
function finalizaMovimentoMouse() {
  if (debugMode) {console.log("FIM DO TURNO")};
  pincel.ativo = false;
  pincel.posicao = null;
}

function finalizaMovimentoTouch() {
  pincel.posicaoAnterior = null;
  finalizaMovimentoMouse();
}

async function desenharTela(ponto) {
  if (ponto.anterior && ponto.atual) {
    if (debugMode) {
      console.log(ordem + ") DE " + ponto.anterior.x + " x " + ponto.anterior.y + " PARA " + ponto.atual.x + " x " + ponto.atual.y);
    }
     
    var novo = {
      JOGADOR: indice,
      ORDEM: ordem, 
      X_i: ponto.anterior.x.toFixed(2),
      Y_i: ponto.anterior.y.toFixed(2),
      X_f: ponto.atual.x.toFixed(2),
      Y_f: ponto.atual.y.toFixed(2)
    };
    ordem++;
    await adicionaInfoNoBancoDeDados(SUPABASE_DRAWS, novo);
    
    //document.getElementById("screen").getContext("2d").beginPath();
    //document.getElementById("screen").getContext("2d").moveTo(ponto.anterior.x, ponto.anterior.y);
    //document.getElementById("screen").getContext("2d").lineTo(ponto.atual.x, ponto.atual.y);
    //document.getElementById("screen").getContext("2d").stroke();
  }
}  
  
function desenho() {
  if (pincel.ativo && pincel.movendo && pincel.posicaoAnterior) {
    desenharTela({atual: pincel.posicao, anterior: pincel.posicaoAnterior});
    pincel.movendo = false;
  }
  if (pincel.posicao) {
    pincel.posicaoAnterior = {x: pincel.posicao.x, y: pincel.posicao.y};
  }
  //window.requestAnimationFrame(desenho);
  setTimeout(desenho, 100);
}
 
function ordena(nome, ponto, cor) {
  var vetor = [];
  for (var i = 0; i < nome.length; i++) {
    vetor[i] = {nome: nome[i], ponto: ponto[i], cor: cor[i]};
  }
  vetor = vetor.sort(function (a, b) {return b.ponto - a.ponto});
  return vetor;
}

// Apresenta número com dois dígitos
function pad2(s) {
  return (s < 10) ? '0' + s : s;
} 


/*

function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function atualDataHora() {
  var data = new Date();
  var dia = data.getDate();
  var mes = data.getMonth() + 1; // 0 é janeiro
  var ano = data.getFullYear();
  var hora = data.getHours(); // obtém horas do horário local
  var min = data.getUTCMinutes(); // obtém minutos do horário universal

  return pad2(dia) + "-" + pad2(mes) + "-" + ano + " (" + pad2(hora) + "h" + pad2(min) + "min)";
}

// Mostrando o tempo restante
function contador(atual) {
  const myInterval = setInterval(function() {
    if (pincel.ativo) { 
      atual--;
      minJogo = (atual - (atual % 60)) / 60;
      segJogo = (atual < 60) ? atual : atual - (minJogo * 60);
      document.getElementById('texto').innerHTML = "TEMPO: " + pad2(minJogo) + ":" + pad2(segJogo);   
    }	else {
      clearInterval(myInterval);
    }
  }, 1000);
}

function atualData() {
  var data = new Date();
  var dia = data.getDate();
  var mes = data.getMonth() + 1; // 0 é janeiro
  var ano = data.getFullYear();
  
  return pad2(dia) + "-" + pad2(mes) + "-" + ano;
}  
  
// Apresenta número com três dígitos
function pad3(s) {
  return (s < 100) ? '0' + pad2(s) : pad2(s);
}

// Mostrando o tempo restante
async function exibeNomeComTempoOLD(jogador, atual) {
  
  var primeiro = true;
  const myInterval = setInterval(function() {
    if (pincel.ativo) {
      primeiro = false;
    } 
    
    //console.log(jogador + " " + pincel.ativo + " " + primeiro + " " + atual);
    
    if (atual > 0 && (primeiro || pincel.ativo)) { 
      atual--;
      minJogo = (atual - (atual % 60)) / 60;
      segJogo = (atual < 60) ? atual : atual - (minJogo * 60);
      document.getElementById('texto').innerHTML = jogador + ": " + pad2(minJogo) + ":" + pad2(segJogo);   
    }	else {
      clearInterval(myInterval);
    }
  }, 1000);
}
*/
