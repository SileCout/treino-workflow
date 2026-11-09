// ===== COMPORTAMENTO DO FORMULÁRIO "PREENCHA SEUS DADOS" =====

(function () {
  var form = document.getElementById("formDados");
  var campos = {
    nome: document.getElementById("nome"),
    telefone: document.getElementById("telefone"),
    email: document.getElementById("email")
  };
  var sucesso = document.getElementById("mensagemSucesso");

  // ----- Máscara de telefone: (00) 00000-0000 -----
  campos.telefone.addEventListener("input", function (e) {
    var v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (v.length > 0) {
      v = v.replace(/^(\d{0,2})/, "($1");
    }
    e.target.value = v;
  });

  // ----- Regras de validação: retornam a mensagem de erro, ou "" se estiver ok -----
  var validadores = {
    nome: function (valor) {
      var partes = valor.trim().split(/\s+/).filter(Boolean);
      if (!valor.trim()) return "Informe seu nome completo.";
      if (partes.length < 2) return "Digite nome e sobrenome.";
      return "";
    },
    telefone: function (valor) {
      var digitos = valor.replace(/\D/g, "");
      if (!digitos) return "Informe seu telefone.";
      if (digitos.length < 10 || digitos.length > 11) return "Telefone inválido. Use DDD + número.";
      return "";
    },
    email: function (valor) {
      if (!valor.trim()) return "Informe seu e-mail.";
      var regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!regex.test(valor.trim())) return "E-mail inválido.";
      return "";
    }
  };

  // ----- Valida um campo e mostra/esconde a mensagem de erro -----
  function validarCampo(nome) {
    var input = campos[nome];
    var wrapper = input.parentElement;
    var msg = validadores[nome](input.value);
    document.getElementById("erro-" + nome).textContent = msg;
    wrapper.classList.toggle("erro", !!msg);
    wrapper.classList.toggle("ok", !msg);
    return !msg;
  }

  // ----- Valida ao sair do campo e revalida enquanto digita (se já estiver com erro) -----
  Object.keys(campos).forEach(function (nome) {
    campos[nome].addEventListener("blur", function () { validarCampo(nome); });
    campos[nome].addEventListener("input", function () {
      sucesso.classList.remove("visivel");
      if (campos[nome].parentElement.classList.contains("erro")) validarCampo(nome);
    });
  });

  // ----- Envio do formulário -----
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var valido = true;
    Object.keys(campos).forEach(function (nome) {
      if (!validarCampo(nome)) valido = false;
    });
    if (!valido) return;

    var dados = {
      nome: campos.nome.value.trim(),
      telefone: campos.telefone.value,
      email: campos.email.value.trim()
    };

    // Aqui você pode enviar os dados para o seu servidor, por exemplo:
    // fetch("/api/contato", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(dados)
    // });
    console.log("Dados preenchidos:", dados);

    sucesso.classList.add("visivel");
    form.reset();
    Object.keys(campos).forEach(function (nome) {
      campos[nome].parentElement.classList.remove("ok", "erro");
    });
  });
})();