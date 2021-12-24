let storage = []
let contadorDeClicks = 0
let parDeIndicesCartas = []
let iniciou = false
let pontos = 0
let horarioInicioDoJogo
let wLocalStorage = window.localStorage;
let numeroErros = 0
let segundos = 0
let interval;
let cartasJaAcertadas = []

function noCarregamento() {
    let cartas = criarCartas();
    let cartasIniciais = cartasInicio(cartas);
    tabuleiro(cartasIniciais);
    document.getElementById("tempo").innerHTML = segundos + " segundos"
}

function iniciar() {
    contadorDeClicks = 0
    clearInterval(interval)
    segundos = 0
    numeroErros = 0
    pontos = 0
    cartasJaAcertadas = []
    let cartas = criarCartas();
    let cartasEmbaralhadas = embaralharCartas(cartas)
    storage = cartasEmbaralhadas.slice()
    let cartasDesviradas = todasCartasDesviradas(cartasEmbaralhadas)
    tabuleiro(cartasDesviradas);
    setTimeout(function () {
        let cartasViradas = todasCartasViradas(cartasDesviradas)
        tabuleiro(cartasViradas);
        iniciou = true
        horarioInicioDoJogo = new Date()
        contagemDeTempo()
    }, 3000);
}

function todasCartasViradas(cartas) {
    let cartasResult = cartas.slice();
    cartasResult.forEach(function (cartasResult) {
        cartasResult[2] = false;
    });
    return cartasResult;
}

function todasCartasDesviradas(cartas) {
    let cartasResult = cartas.slice();
    cartasResult.forEach(function (cartasResult) {
        cartasResult[2] = true;
    });
    return cartasResult;
}

function criarCartas() {
    let cartas = []
    let j = 0
    for (let i = 0; i < 16; i++) {
        let carta = []
        carta.push("img8.png")
        carta.push(`img${j}.png`)
        //true é a frente da carta e false é a parte de tras da carta
        carta.push(true)
        carta.push(i)
        j++
        if (i === 7) {
            j = 0
        }
        cartas.push(carta)
    }
    return cartas;
}

function tempoInicial() {}

function embaralharCartas(cartas) {
    let cartasResult = []
    arrayCartasEmbaralhada = calcularArrayDeNumerosAleatoriosNaoRepetidos(16, 0, 15)
    for (let i = 0; i < 16; i++) {
        cartasResult.push(cartas[arrayCartasEmbaralhada[i]])
    }
    return cartasResult;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcularArrayDeNumerosAleatoriosNaoRepetidos(qtde, numMin, numMax) {
    let listaNum = [];
    for (let i = 1; i <= qtde; i++) {
        let numeroAleatorio = getRandomIntInclusive(numMin, numMax);
        if (listaNum.includes(numeroAleatorio)) {
            i--;
        } else {
            listaNum.push(numeroAleatorio);
        }
        if (listaNum.length === (numMax - numMin + 1)) {
            break;
        }
    }
    return listaNum
}

function cartasInicio(cartas) {
    cartasResult = []
    cartas.forEach(function (carta) {
        carta[2] = true
    });
    for (let i = 0; i < 8; i++) {
        cartasResult.push(cartas[i])
        cartasResult.push(cartas[i + 8])
    }
    return cartasResult
}

function tabuleiro(cartas) {
    tabuleiroDeCartas = document.getElementById("tabuleiro")
    tabuleiroDeCartas.innerHTML = ''

    cartas.forEach(function (carta, i) {
        frenteOuVerso = carta[2] == true ? 1 : 0;
        tabuleiroDeCartas.innerHTML += `
        <input type="checkbox" id="switch${i}" />
        <label class="flip-container${i}" for="switch${i}" >
        <div class="carta${i}" id="carta${i}" onclick="igualdadeDasCartas(${i})">
        <img class ="imagem" src="images/${carta[frenteOuVerso]}">
        </div>
        </label>
        `
    });
}

function igualdadeDasCartas(indiceCarta) {
    if (iniciou) {
        contadorDeClicks += 1
        if (contadorDeClicks <= 2) {
            virarCarta(indiceCarta)
            parDeIndicesCartas.push(indiceCarta)
            if (parDeIndicesCartas.length == 2) {
                let cartas = storage.slice()
                let carta1 = cartas[parDeIndicesCartas[0]]
                let carta2 = cartas[parDeIndicesCartas[1]]
                if (carta1[1] == carta2[1] && carta1[3] != carta2[3] &&
                    !cartasJaAcertadas.includes(carta1[3]) && !cartasJaAcertadas.includes(carta2[3])) {
                    contadorDeClicks = 0
                    parDeIndicesCartas = []
                    pontos += 1
                    cartasJaAcertadas.push(carta1[3])
                    cartasJaAcertadas.push(carta2[3])
                    if (pontos == 8) {
                        iniciou = false
                        terminoDoJogo()
                    }
                } else {
                    setTimeout(function () {
                        numeroErros += 1
                        virarCarta(parDeIndicesCartas[0])
                        virarCarta(parDeIndicesCartas[1])
                        contadorDeClicks = 0
                        parDeIndicesCartas = []
                    }, 1500);
                }
            }

        }
    }
}

function mostrarMelhorTempo() {
    if (wLocalStorage.getItem("melhorTempo")) {
        let melhorTempo = wLocalStorage.getItem("melhorTempo")
        let erros = wLocalStorage.getItem("numeroErros")
        window.alert(`O melhor tempo no jogo foi de : ${Math.round(melhorTempo)} segundos com ${erros} erros `)
    } else {
        window.alert(`Ainda não houve registro de melhor tempo:`)
    }
}

function terminoDoJogo() {
    let horarioFimDoJogo = new Date()
    let tempoDecorrido = (horarioFimDoJogo - horarioInicioDoJogo) / 1000
    setTimeout(function () {
        window.alert(`Você terminou o jogo em ${Math.round(tempoDecorrido)} segundos e errou ${numeroErros} vezes`)
        if (wLocalStorage.getItem("melhorTempo") == null) {
            wLocalStorage.setItem("melhorTempo", tempoDecorrido)
            wLocalStorage.setItem("numeroErros", numeroErros)
        } else {
            if (tempoDecorrido < parseInt(wLocalStorage.getItem("melhorTempo"))) {
                wLocalStorage.setItem("melhorTempo", tempoDecorrido)
                wLocalStorage.setItem("numeroErros", numeroErros)
            }
        }
        clearInterval(interval);
        segundos = 0
        numeroErros = 0
        pontos = 0
        cartasJaAcertadas = []
    }, 1000);
}


function contagemDeTempo() {
    interval = setInterval(function () {
        document.getElementById("tempo").innerHTML = segundos + ' segundos'
        segundos++;
    }, 1000);
}

function virarCarta(indiceCarta) {
    /*
    console.log(indiceCarta)
    let cartaSrc = document.getElementById(`carta${indiceCarta}`).getElementsByTagName("img")[0].src
    let tamanhoSrc = parseInt(cartaSrc.length)
    let indiceSrc = cartaSrc.charAt(tamanhoSrc-5)
    console.log(indiceSrc)
    */
    let cartas = storage.slice()
    let carta = cartas[indiceCarta]
    carta[2] = carta[2] == true ? false : true
    frenteOuVerso = carta[2] == true ? 1 : 0;

    //interval3 = setTimeout(function () {
    if (frenteOuVerso == 1) {
        interval2 = setTimeout(function () {
            document.getElementById(`switch${indiceCarta}`).checked = true;
        }, 1);
        interval2 = setTimeout(function () {
            document.getElementById(`carta${indiceCarta}`).innerHTML = `
                <img class="imagem" src="images/${carta[frenteOuVerso]}"> 
                `
        }, 250);
    } else {
        interval2 = setTimeout(function () {
            document.getElementById(`switch${indiceCarta}`).checked = false;
        }, 1);
        interval2 = setTimeout(function () {
            document.getElementById(`carta${indiceCarta}`).innerHTML = `
                <img class="imagem" src="images/${carta[frenteOuVerso]}"> 
                `
        }, 250);
    }
    //}, 250);

}