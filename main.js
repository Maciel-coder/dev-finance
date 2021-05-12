

const Modal = {
  //desafio no final 
  //trocar essas duas functions po uma
  //chamada toogle()
  open() {
    //Abrir modal
    //Adicionar a class active ao modal
    //alert("abro mpdal")
    document //utilizado para procurar elementos html
      .querySelector(".modal-overlay")
      .classList.add("active");
  },
  close() {
    //fechar o modal
    //remover a class active do modal
    document
      .querySelector(".modal-overlay")
      .classList.remove("active");
  },

};

const Storage = {
  get(){

    console.log(localStorage)
    return JSON.parse(localStorage.getItem("dev.finance:transactions")) || []
  },

  set(transactions){
    localStorage.setItem("dev.finance:transactions", JSON.stringify(transactions))

  }
}
Storage.get()

//const com as functions que calculam:
//entradas, saidas e total
const Transaction = {
  // criando objetos com as caracteristicas
  //toLocaleString
  all: Storage.get(),

  add(transaction){
    Transaction.all.push(transaction);
    App.reload()
  },

  remove(index){
    Transaction.all.splice(index, 1)
    App.reload()

  },

  incomes() {
    let income = 0;
    //somar as Entradas:
    //pegar todas as transações
    //para cada transação,
    Transaction.all.forEach((transaction) =>{
      //se ela for maior que 0
      if(transaction.amount > 0){
        //somar a uma variavel e retornar a variavel
        //income = income + transaction.amount;
        //ou
        income += transaction.amount;
      }

    })
    
    return income;
  },

  expenses() {
    let expense = 0;
    //somar as Entradas:
    //pegar todas as transações
    //para cada transação,
    Transaction.all.forEach((transaction) =>{
      //se ela for menor que 0
      if(transaction.amount < 0){
        //somar a uma variavel e retornar a variavel
        expense = expense + transaction.amount;
        //out
        //income += transaction.amount;
      }

    })
    
    return expense;
  },

  total() {
    //total entradas - saidas
    return Transaction.incomes() + Transaction.expenses();

  }
}

//const que substitui os valores passados no html
// e preeche as tabelas
const DOM = {
  //faz a buscano container html onde esta a tabela
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {

    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMTransaction(transaction, index)
    tr.dataset.index = index
    DOM.transactionsContainer.appendChild(tr)
    //console.log()
  }, //fim addTransaction

  innerHTMTransaction(transaction, index) {
    //ternario usado para mudar a cor do valor 
    //quando for negativo ou positivo
    const CSSclass = transaction.amount > 0 ? "income" : "expense"  
    
    const amount = Utils.formatCurrency(transaction.amount)
    const html = `
      
        <!--constroi as linhas da tabela -->
          <td class="amount">${transaction.description}</td>
          <!--constroi as colunas -->
          <td class="${CSSclass}">${amount}</td>
          <td class="date">${transaction.date}</td>
          <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação">
          </td>
       
    `;
    return html //retorna a function  html para que possa ser usada por outra function
  }, //fim innerHTMTransaction

  //atualizando os valores mostrados no cabecalho
  updateBalance(){
    document
        .getElementById('incomesDisplay') //pegando o id p do html
        .innerHTML = Utils.formatCurrency( //aplicando a formatação cirada na funcao Utils
            Transaction.incomes() //passando para o elemento <p> do html
                                  //o calculo das entradas que esta sendo feito na função icomes() dentro de "const Transaction"
                                  //nos demais elementos abaixo utiliza-se a mesma logica
          )

    document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())

    document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
  },

  //lipar a tela a cada reload para não adicionar
  //transactions repetidas
  clearTransactions(){
    DOM.transactionsContainer.innerHTML = ""
  }


} //fim DOM

//const contendo as funções que serão usadas para
//formatação
const Utils = {

 
   //formatando os dados
   formatAmount(value) {
    value = Number(value.replace(/\,\./g, "")) * 100
    return value
    //console.log(value)
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    //console.log(splittedDate)
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : "" //formatando o sinal da moeda
    value = String(value).replace(/\D/g, "") // a funcao replace "/\D/g" e uma expresao regular e serve para substituir o q esta entre
    // aspas pelo dado q vc desejar o /g significa que essa configuração eh global, ou seja para todos os caracteres

    value = Number(value) / 100 //dividindo o valor para formatação de valores quebrados
    
    //padroniando no formato da moeda brasileira
    //toLocaleString é uma funcionalidade q recebe dois argumentos da
    //locale indica a localização no mundo
    //currency = tipo de moeda: nesse caso a real brasileirp
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    
    return signal + value //concatena variavel signal com o vlor formatado
  },
  
  
  
}

const Form = {
  description: 
    document.querySelector('input#description'),
  amount:
    document.querySelector('input#amount'),
  date:
    document.querySelector('input#date'),

  getValue(){
    return{
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  //verificar se todas as informações foram preechidas
  validateFields(){
    const {description,amount,date} = Form.getValue();
    //console.log(description)
    if( description.trim()=== "" || 
        amount.trim()=== "" || 
        date.trim()=== ""){

      throw new Error("Por favor, preencha todos os campos")
    }
  },

  //formatar os dados para salvar
  formatarValues(){
    let {description,amount,date} = Form.getValue();
    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)
    //console.log(amount)
    //console.log(date)  

    return {description,amount,date}
  },


  clearFileds(){
    Form.description.value =""
    Form.amount.value =""
    Form.date.value =""
  },

  submit(event){
    //console.log(event)
    event.preventDefault()

    try {
        //validar dados
        //formatar os dados
        Form.validateFields()
        const transaction = Form.formatarValues()
        //salvar os dados para
        Transaction.add(transaction)
        //limpar os dados do formulario
        Form.clearFileds()
        //fechar modal
        Modal.close()

    } catch (error) {
      alert(error.message)
    }
    
  }
}


const App ={
  init(){

    //prenche com os dados apos a inicializar o app
    Transaction.all.forEach(DOM.addTransaction) //=> {
        
    DOM.updateBalance()

    Storage.set(Transaction.all)

  },

  reload(){
    DOM.clearTransactions() //limpando a tela antes de iniciar o app
    App.init() //incia o app
  
  }

}

App.init()




