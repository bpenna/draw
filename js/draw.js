var debugMode = false;

var nomes = ["012345678", "012345678", "012345678", "012345678", "012345678", "012345678", "012345678", "012345678", "012345678", "012345678"]; 

const cores = ["blue", "green", "red", "gold", "deeppink", "deepskyblue", "lightgreen", "chocolate", "wheat", "magenta"];

var pontos = [9,8,7,6,5,4,3,2,1,0];

function ordena(nome, ponto, cor) {
  var vetor = [];
  for (var i = 0; i < nome.length; i++) {
    vetor[i] = {nome: nome[i], ponto: ponto[i], cor: cor[i]};
  }
  vetor = vetor.sort(function (a, b) {return b.ponto - a.ponto});
  return vetor;
}

function jogo() {
  var jogadores = ordena(nomes, pontos, cores);
  
  var infoText = "";
  for (var i = 0; i < nomes.length; i++) {
    if (i == 0) {
      infoText += "<ol id = 'lista'> ";
    }
    infoText += "<li style = 'color: " + jogadores[i].cor + ";'> " + jogadores[i].nome + " (" + pad2(jogadores[i].ponto) + ")"+ " </li> ";
    if (i == nomes.length - 1) {
      infoText += "</ol>";
    }
  }
  document.getElementById('players').innerHTML = infoText; 
}

var tela = document.getElementById("screen");
var contexto = tela.getContext("2d");
contexto.lineWidth = 3;



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

const pincel = {
  ativo: false,
  movendo: false,
  indiceCor: 0,
  posicao: {x: 0, y: 0},
  posicao: null,
  posicaoAnterior: null
}

tela.addEventListener("mousedown", (evento) => {evento.preventDefault(); iniciaMovimentoMouse()}); 
tela.addEventListener("mousemove", (evento) => {continuaMovimentoMouse(evento)});
tela.addEventListener("mouseup", () => {finalizaMovimentoMouse()});

tela.addEventListener("touchstart", (evento) => {evento.preventDefault(); iniciaMovimentoTouch(evento)}); 
tela.addEventListener("touchmove", (evento) => {evento.preventDefault(); continuaMovimentoTouch(evento)});
tela.addEventListener("touchend", () => {finalizaMovimentoTouch()});

function iniciaMovimentoMouse() {
  if (debugMode) {console.log("INÍCIO DO TURNO")};
  pincel.ativo = true;
  pincel.indiceCor = pincel.indiceCor == cores.length - 1 ? 0 : pincel.indiceCor + 1;
  contexto.strokeStyle = cores[pincel.indiceCor];
  
  if (debugMode) {
    console.log(document.getElementById("game").offsetTop); 
    console.log(document.getElementById("game").offsetLeft); 
    console.log(document.getElementById("game").offsetWidth);  
    console.log(document.getElementById("game").offsetHeight); 
  }
  
//  contador(6);
}

function iniciaMovimentoTouch(evento) {  
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
  document.getElementById('texto').innerHTML = "acabou";
}

function finalizaMovimentoTouch() {
  pincel.posicaoAnterior = null;
  finalizaMovimentoMouse();
}

const desenho = () => {
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

function tempo() {
  var tela = document.getElementById("texto");  
}


///////////////////////////////////////////////////////////////////
desenho();
jogo();







///////////////////////////////////////////////////////////////////
