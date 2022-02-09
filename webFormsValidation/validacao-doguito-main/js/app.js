import { valida } from './validacao.js'

const inputs = document.querySelectorAll('input'); //seleciono todos os inputs da page

inputs.forEach(input => {                          // com esse forEach eu adiciono o evento do blur para todos os inputs
    
    if(input.dataset.tipo === 'preco') {
        SimpleMaskMoney.setMask(input,{
        prefix: 'R$',
        fixed: true,
        fractionDigits: 2,
        decimalSeparator: ',',
        thousandsSeparator: '.',
        cursor: 'end'
        })
    }
    
    input.addEventListener('blur', (evento) => {    // evento esse que que chama a funcao valida com as entradas para cada input
        valida(evento.target);
    })
})