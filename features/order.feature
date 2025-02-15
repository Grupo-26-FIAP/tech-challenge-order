Funcionalidade: Criar um novo pedido

  Cenário: Criar um pedido com sucesso
    Dado que eu tenho um payload válido para um novo pedido
    Quando eu envio uma requisição POST para "/orders"
    Então a resposta deve ter status 201
    Então o corpo da resposta deve conter um ID de pedido
    Então o status do pagamento deve ser "pending"
    Então o status do pedido deve ser "none"

  Cenário: Criar um pedido com dados inválidos
    Dado que eu tenho um payload inválido para um novo pedido
    Quando eu envio uma requisição POST para "/orders"
    Então a resposta deve ter status 400