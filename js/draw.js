var debugMode = false;

var jogadores = null;
var indice = -1;
var turno2 = false;
var nomes = ["Bernardo", "Carolina", "Eduardo", "Cristiane", "Henrique", "Luciana", "Andréia", "André", "Letícia", "Gabriela"]; 
var assuntos = ["ESPORTES", "FRUTAS", "ESCRITÓRIO", "COZINHA", "CIDADE"];
var palavras = ["ABACAXI", "BANANA", "CAJU", "DAMASCO", "FIGO", "GOIABA"];
var cores = ["blue", "green", "red", "gold", "deeppink", "deepskyblue", "lightgreen", "chocolate", "wheat", "magenta"];
var pontos = [9,8,7,6,5,4,3,2,1,0];

var tela = document.getElementById("screen");
var contexto = tela.getContext("2d");
contexto.lineWidth = 3;

// Inicializa o jogo
function carregaJogo() {
  jogadores = ordena(nomes, pontos, cores);
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
  desenho();
}

// Começar o jogo assim que clica no botão
function iniciarJogo() {
  contexto.clearRect(0, 0, tela.width, tela.height);
  var bla = shuffle(palavras);
  var word = bla[0];
  indice = 0;
  iniciaTurno(word);
  //document.getElementById('barra').innerHTML = "";
  //document.getElementById('barra').innerHTML = "<img id = 'image2' src='https://i.imgur.com/QIkPEnO.png'>";
  //document.getElementById('texto').innerHTML = "Votem 2 !!!";
}

function iniciaTurno(palavra) {
  
  var jogador = jogadores[indice].nome;
  var primeiro = true;
  var tempo = 122;
  if (pincel.ativo) {
    pincel.ativo = false;
  }
  document.getElementById('texto').innerHTML = "Desenhe " + palavra + ", " + jogador + "!";
  var infoText = "<img id = 'image2' src='https://i.imgur.com/QIkPEnO.png'>";
  var num = 2.5;
  const myInterval = setInterval(function() {
    if (pincel.ativo) {
      primeiro = false;
    }
    tempo--;
    if (tempo > 0 && (primeiro || pincel.ativo)) { 
        if (num < 92) {
          infoText += "<img id = 'left' src = 'https://i.imgur.com/3ilVR3y.png' style = 'left: " + num + "vw;'>";
        } else {
          infoText += "<img id = 'right' src='https://i.imgur.com/sg5bb38.png' style = 'right: 2.5vw;'>";
        }  
        num += 0.75;
    } else {
      clearInterval(myInterval);
      indice++;
      if (indice < jogadores.length) {
        iniciaTurno(palavra);
      } else {
        if (!turno2) {
          turno2 = true;
          indice = 0;
          iniciaTurno(palavra);
        } else {
          turno2 = false;
          indice = -1;
          jogadores = null;
          pincel.ativo = false;
          pincel.indiceCor = -1;
          contexto.strokeStyle = "black";
          tela.removeEventListener("mousedown", iniciaMovimentoMouse); 
          tela.removeEventListener("touchstart", iniciaMovimentoTouch);
          document.getElementById('barra').innerHTML = "<img id = 'image2' src = 'https://i.imgur.com/QIkPEnO.png'>";
          document.getElementById('texto').innerHTML = "Votem !!!";
        }
      }
    }      
    document.getElementById('barra').innerHTML = infoText;
  }, 100);
}

// Mostrando o tempo decorrido de jogo
function temporizador(atual) {
  const myInterval = setInterval(function() {
    if (pincel.ativo) { 
      atual++;
      minJogo = (atual - (atual % 60)) / 60;
      segJogo = (atual < 60) ? atual : atual - (minJogo * 60);
      document.getElementById('texto').innerHTML = "TEMPO: " + pad2(minJogo) + ":" + pad2(segJogo);   
    }	else {
      clearInterval(myInterval);
    }
  }, 1000);
}

const pincel = {
  ativo: false,
  movendo: false,
  indiceCor: -1,
  posicao: {x: 0, y: 0},
  posicao: null,
  posicaoAnterior: null
}

//tela.addEventListener("mousedown", (evento) => {evento.preventDefault(); iniciaMovimentoMouse()}); 
tela.addEventListener("mousedown", iniciaMovimentoMouse); 
tela.addEventListener("mousemove", (evento) => {continuaMovimentoMouse(evento)});
tela.addEventListener("mouseup", () => {finalizaMovimentoMouse()});

//tela.addEventListener("touchstart", (evento) => {evento.preventDefault(); iniciaMovimentoTouch(evento)}); 
tela.addEventListener("touchstart", iniciaMovimentoTouch); 
tela.addEventListener("touchmove", (evento) => {evento.preventDefault(); continuaMovimentoTouch(evento)});
tela.addEventListener("touchend", () => {finalizaMovimentoTouch()});

function iniciaMovimentoMouse(e) {
  e.preventDefault();
  if (debugMode) {console.log("INÍCIO DO TURNO")};
  pincel.ativo = true;
  //pincel.indiceCor = pincel.indiceCor == cores.length - 1 ? 0 : pincel.indiceCor + 1;
  pincel.indiceCor = indice;
  
  contexto.strokeStyle = cores[pincel.indiceCor];
  
  if (debugMode) {
    console.log(document.getElementById("game").offsetTop); 
    console.log(document.getElementById("game").offsetLeft); 
    console.log(document.getElementById("game").offsetWidth);  
    console.log(document.getElementById("game").offsetHeight); 
  }

}

function iniciaMovimentoTouch(evento) { 
  evento.preventDefault();
  if (debugMode) {console.log("<MOBILE>")};
  const rect = tela.getBoundingClientRect();
  const newX = (evento.changedTouches[0].pageX - rect.left) * tela.width / rect.width;
  const newY = (evento.changedTouches[0].pageY - rect.top) * tela.height / rect.height; 
  pincel.posicaoAnterior = {x: newX, y: newY};
  iniciaMovimentoMouse();
}

function continuaMovimentoMouse(evento) {
 
  // pincel.posicao = {x: evento.clientX, y: evento.clientY};
  // Ymin = offsetTop
  // Xmin = offsetLeft
  // Xmax = offsetLeft + offsetWidth
  // Ymax = offsetTop + offsetHeight
  // console.log("X: " + pincel.posicao.x);
  // console.log("Y: " + pincel.posicao.y);
  
  const rect = tela.getBoundingClientRect();
  const newX = (evento.clientX - rect.left) * tela.width / rect.width;
  const newY = (evento.clientY - rect.top) * tela.height / rect.height;   
  pincel.posicao = {x: newX, y: newY};  
  pincel.movendo = true;
}

function continuaMovimentoTouch(evento) {
  const rect = tela.getBoundingClientRect();
  const newX = (evento.changedTouches[0].pageX - rect.left) * tela.width / rect.width;
  const newY = (evento.changedTouches[0].pageY - rect.top) * tela.height / rect.height;   
  pincel.posicao = {x: newX, y: newY};
  pincel.movendo = true;
}  
  
function finalizaMovimentoMouse() {
  if (debugMode) {console.log("FIM DO TURNO")};
  pincel.ativo = false;
  pincel.posicao = null;
  //document.getElementById('texto').innerHTML = "acabou";
}

function finalizaMovimentoTouch() {
  pincel.posicaoAnterior = null;
  finalizaMovimentoMouse();
}

///////////////////////////////////////////////////////////////////
carregaJogo();
///////////////////////////////////////////////////////////////////

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

const desenharTela = (ponto) => {
  if (ponto.anterior && ponto.atual) {
    if (debugMode) {
      console.log("DE " + ponto.anterior.x + " x " + ponto.anterior.y + " PARA " + ponto.atual.x + " x " + ponto.atual.y);
    }
    contexto.beginPath();
    contexto.moveTo(ponto.anterior.x, ponto.anterior.y);
    contexto.lineTo(ponto.atual.x, ponto.atual.y);
    contexto.stroke();
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
  window.requestAnimationFrame(desenho);
  //setTimeout(desenho, 10);
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

function atualData() {
  var data = new Date();
  var dia = data.getDate();
  var mes = data.getMonth() + 1; // 0 é janeiro
  var ano = data.getFullYear();
  
  return pad2(dia) + "-" + pad2(mes) + "-" + ano;
}  
  
// Apresenta número com dois dígitos
function pad2(s) {
  return (s < 10) ? '0' + s : s;
}

// Apresenta número com três dígitos
function pad3(s) {
  return (s < 100) ? '0' + pad2(s) : pad2(s);
}

function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}
  
function ordena(nome, ponto, cor) {
  var vetor = [];
  for (var i = 0; i < nome.length; i++) {
    vetor[i] = {nome: nome[i], ponto: ponto[i], cor: cor[i]};
  }
  vetor = vetor.sort(function (a, b) {return b.ponto - a.ponto});
  return vetor;
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

/*else {
          infoText += "<img id = 'right' src='https://i.imgur.com/sg5bb38.png' style = 'right: 2.5vw;'>";
          indice++;
          clearInterval(myInterval);
          if (indice < jogadores.length) {
            exibeNomeComTempo(palavra, 0);
          } else {
            if (!turno2) {
              turno2 = true;
              indice = 0;
              exibeNomeComTempo(palavra, 0);
            } else {
              turno2 = false;
              indice = -1;
              jogadores = null;
              pincel.ativo = false;
              pincel.indiceCor = -1;
              contexto.strokeStyle = "black";
              tela.removeEventListener("mousedown", iniciaMovimentoMouse); 
              tela.removeEventListener("touchstart", iniciaMovimentoTouch);
              document.getElementById('barra').innerHTML = "<img id = 'image2' src='https://i.imgur.com/QIkPEnO.png'>";
            }
          } 
        }
      document.getElementById('barra').innerHTML = infoText;
      atual++;
    }	else {
      clearInterval(myInterval);
      indice++;
      if (indice < jogadores.length) {
        exibeNomeComTempo(palavra, 0);
      } else {
        if (!turno2) {
          turno2 = true;
          indice = 0;
          exibeNomeComTempo(palavra, 0);
        } else {
          turno2 = false;
          indice = -1;
          jogadores = null;
          pincel.ativo = false;
          pincel.indiceCor = -1;
          contexto.strokeStyle = "black";
          tela.removeEventListener("mousedown", iniciaMovimentoMouse); 
          tela.removeEventListener("touchstart", iniciaMovimentoTouch);
          document.getElementById('barra').innerHTML = "<img id = 'image2' src='https://i.imgur.com/QIkPEnO.png'>";
        }*/
