// Obtém a referência do botão que abre o modal
const openModalBtn = document.getElementById('open-modal-btn');
console.log(openModalBtn);
// Obtém a referência do elemento do modal
const modal = document.getElementById('modal');
let showDisplayTT = document.querySelector('.showDisplay');

// Define um evento para fechar o modal ao clicar no botão de fechar
const closeModalBtn = document.getElementById('close-modal-btn');
closeModalBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

// Define um evento para fechar o modal ao clicar fora dele
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});


// Função para obter o token
function getToken() {
  const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
  const clientId = '3Pp4q6AkjSbxDC2QUlwrACi6LAdLhbGO';
  const clientSecret = 'SGjlYFHaPXCDn8Id';

  // Cria um objeto URLSearchParams para enviar os parâmetros na requisição
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  // Retorna uma Promise que faz a requisição para obter o token
  return fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })
    .then(response => response.json())
    .then(data => data.access_token) // Retorna o token obtido da resposta da requisição
    .catch(error => {
      console.log(error);
      throw error;
    });
}
getToken()

// Função para obter o resultado
function getResult() {
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const departureDate = document.getElementById('departure-date').value;
  const returnDate = document.getElementById('return-date').value;

  if (origin === '' || destination === '' || departureDate === '' || returnDate === '') {
    return alert('Preencha todos os campos!');
  }

  // Chama a função getToken() para obter o token necessário para a requisição
  getToken()
    .then(token => {
      const url = `https://test.api.amadeus.com/v1/travel/predictions/trip-purpose?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}`;
      
      // Faz a requisição para a API Amadeus usando o token obtido
      fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // Usa o token no cabeçalho da requisição
        },
      })
        .then(response => response.json())
        .then(data => {
          const { result } = data.data;

          console.log(result);
          modal.style.display = 'block';

          showDisplayTT.innerHTML = `
            <h3>Geralmente nesse período as pessoas viajam a ${result}</h3>
          `;
        })
        .catch(error => {
          // Em caso de erro na requisição, exibe mensagem de erro
          showDisplayTT.innerHTML = `
            <h3>Erro ${error}</h3>
          `;
          console.log(error);
        });
    })
    .catch(error => {
      // Em caso de erro ao obter o token, exibe mensagem de erro
      console.log(error);
    });
}
