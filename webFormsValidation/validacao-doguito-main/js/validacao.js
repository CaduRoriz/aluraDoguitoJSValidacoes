export function valida (input) {
    const tipoDeInput = input.dataset.tipo; //passo para essa const o tipo do input (no caso atribuido pelo data atributes no html) e colhido pelo dataset

    if(validadores[tipoDeInput]){           //vejo se existe esse tipo de input no meu validadores(que sera uma array de tipos que por enquanto só tem o topo data)
        validadores[tipoDeInput](input);    //caso haja o tipo eu passo o input e chamo ele no validadores que chama a funcao de validacao especifica
    } //esse if em especifico eh apenas para os inputs customizados

    if(input.validity.valid){
        input.parentElement.classList.remove("input-container--invalido");
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
    } else {
        input.parentElement.classList.add("input-container--invalido");
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemErro(tipoDeInput, input)
    }
}

function mostraMensagemErro(tipoDeInput, input ) {
    let mensagem = '';

    tiposDeErro.forEach(erro => { // percorro pelos tipos de erro e comparo se algum deles terá o valor 'true'(que acontece caso tenha algum erro no input)
        if(input.validity[erro]) {
            mensagem = mensagensErro[tipoDeInput][erro] //algum erro dando true, eu pego a matriz de objetos, passo para primeria camada o tipo do input e o erro que tava true para segunda camada
        }
        
    });
    return mensagem;
}

const tiposDeErro = [
    'customError', //aqui eu coloquei o erro customError em primeiro na declaracao pq o browser tem uma ordem de sobrescita no erro, e quando estavamos passando em branco a entrada da data tava colocando o erro de 18 anos e nao o de entrada vazia
    'valueMissing', //pois estava lendo como se tivesse tendo os dois erros e na sobrescrita pega o que foi declarado primeiro
    'typeMismatch',
    'patternMismatch'
]

const mensagensErro = {
    nome: {
        valueMissing: 'O campo nome não pode estar vazio.'
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha: {
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter 6 a 12 caracteres, deve conter ao menos 1 letra maiúscula e não deve conter símbolos.'
    },
    dataNascimento: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Cadastro só é permitido para pessoas com 18 anos ou mais.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio',
        customError: 'O CPF digitado não é válido'
    },
    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado não é válido.',
        customError: 'Não foi possível fazer a busca com esse CEP.'
    },
    logradouro: {
        valueMissing: 'O campo de logradouro não pode estar vazio.'
    },
    cidade: {
        valueMissing: 'O campo de cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo de estado não pode estar vazio.'
    },
    preco: {
        valueMissing: 'O campo de preço não pode estar vazio'
    }
}

const validadores = {
    dataNascimento:input => validaDataNascimento(input), //chama a funcao de valida data de nascimento
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)
}


/*-----------------------------*/


function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value);
    let mensagem = '';
    
    if(!maiorQue18(dataRecebida)){
        mensagem = 'Cadastro só é permitido para pessoas com 18 anos ou mais';
        }
        input.setCustomValidity(mensagem); //propriedade para o navegador entender que ha um erro no campo informado o qual recebe a mensagem que quero passar ao usuario
                                            // pelo visto se eu chamo essa propriedade e não passo uma mensagem, ou no caso uma mensagem vazia, ela nao acusa como se tivesse dado erro no input
                                            //com esse setCustomValidity eu seto um novo tipo de validação para o input e por isso tem o tipo de erro custom(de customizado) nos tipos de erro,
                                            

}

function maiorQue18(data){
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());
    /*  */
    return dataMais18 <= dataAtual;
}

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '') //essa regex ta pegando tudo que não for digito e trocando por string vazia, ou seja, nada
    let mensagem = ''

    if (!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)){
        mensagem = 'O CPF digitado não é válido.'
    }
    input.setCustomValidity(mensagem);
}

function checaCPFRepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]

    let cpfValido = true;

    valoresRepetidos.forEach(valor => {
        if(valor === cpf){
            cpfValido = false;
        }
    });

    return cpfValido;
}

function checaEstruturaCPF(cpf) {
    const multiplicador = 10;

    return checaDigitoVerificador(cpf,multiplicador);
}


function checaDigitoVerificador(cpf,multiplicador) {
    if(multiplicador >= 12){
        return true
    }

    let multiplicadorInicial = multiplicador; //fiz isso pq vou usar recursão, dai eu crio uma outra variavel com o valor de multplicador para eu não sobrescrever o atributo
    let soma = 0;
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('');// essa funcao substr (substring) vai cortando uma string, e eu passo pra ela 2 parameteos, o primeiro da posição que eu quero começar a cortar a string e o segundo até quaol posição eu quero cortar, passando o 'split' com parametro fazio '' split('') eu vou criar um vetor em que cada posicao seja um digito do cpf ate a posicao multiplicador - 1
    const digitoVerificador = cpf.charAt(multiplicador - 1) //apenas estou pegando o digito verificador(digitos apos o ifem) que são os digitos de posicao 10 e 11, como trabalho com vetor, 9 e 10
    for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--, contador++){
        soma = soma + (cpfSemDigitos[contador] * multiplicadorInicial);
    }

    if(digitoVerificador == confirmaDigito(soma)){
        return checaDigitoVerificador(cpf,multiplicador + 1);
    }

    return false
}

function confirmaDigito(soma){
    return 11 - (soma % 11);
}

/*
123 456 789 09
let soma = (10 * 1) + (9 * 2) + (8 * 3) + ... (2 * 9)
let digitoVerificador = 11 - (soma % 11) isso tem que ser igual ao  primeiro digito verificador
para o segundo digito é a mesma coisa só que começa a multiplicação com 11
*/

function recuperarCEP(input) {
    const cep = input.value.replace(/\D/g, ''); //o mesmo que faço com o cpf, substituindo tudo oq eu não for numero por nada para que se retire um eventual ifem do cep e contenha apenas numeros
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET', //metodo da requisisao que vai ser um GET
        mode: 'cors',   //indica que a comunicacao sera feita entre aplicacoes diferentes
        headers: {
            'content-type': 'application/json;charset=utf-8' //indica como queremos receber as informacoes da API no caso os caracteres e simbolos e tals
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing){
        fetch(url, options).then(
            response => response.json() //o que a funcao ta consumindo da api eu to transformando no tipo json, por isso response => response.json(), mas poderia ser QUALQUER NOME respota => resposta.json() e etc...
            
            ).then(
           data =>{
               if(data.erro){
                   input.setCustomValidity('Não foi possível fazer a busca com esse CEP.');
                   return
               }
               input.setCustomValidity('')
               preencheCamposComCEP(data);
               return
           }
        )
    }
}

function preencheCamposComCEP(data){
    const logradouro = document.querySelector('[data-tipo="logradouro"]');
    const cidade = document.querySelector('[data-tipo = "cidade"]');

    logradouro.value = data.logradouro;
    cidade.value = data.localidade;
    estado.value = data.uf;
}