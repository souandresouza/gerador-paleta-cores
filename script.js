document.getElementById("color-input").addEventListener("input", autoComplete);

function autoComplete(event) {
  let input = event.target.value.replace(/\s/g, ''); // Remove espaços do input
  let result = '';

  // Divide o input em partes separadas por vírgulas
  let cores = input.split(',').filter(Boolean); // Filtra valores vazios

  cores.forEach((cor, index) => {
    // Remove qualquer '#' existente e limita a 6 caracteres
    cor = cor.replace(/#/g, '').substring(0, 6);

    // Adiciona '#' antes da cor e a formata para 6 dígitos
    if (cor.length === 6) {
      result += `#${cor}`;
      if (index < cores.length - 1) {
        result += ', '; // Adiciona vírgula e espaço entre as cores
      }
    }
  });

  event.target.value = result; // Atualiza o valor do input
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mensagem = document.getElementById("mensagem");

function gerarPaleta() {
  // Limpa o canvas e a mensagem
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  mensagem.textContent = "";

  // Pega os valores digitados
  const input = document.getElementById("color-input").value;
  const cores = input.split(",").map((cor) => cor.trim()).filter(Boolean);

  // Verifica se há cores válidas
  if (cores.length === 0 || cores[0] === "") {
    mensagem.textContent = "Digite pelo menos uma cor válida.";
    return;
  }

  // Calcula o tamanho de cada quadrado
  const numCores = cores.length;
  const tamanhoQuadrado = canvas.width / Math.ceil(Math.sqrt(numCores));

  // Desenha os quadrados coloridos no canvas
  let x = 0, y = 0;
  let coresInvalidas = [];

  cores.forEach((cor) => {
    if (!isValidHexColor(cor)) {
      coresInvalidas.push(cor);
      return;
    }

    ctx.fillStyle = cor;
    ctx.fillRect(x, y, tamanhoQuadrado, tamanhoQuadrado);

    // Adiciona o texto (código hexadecimal) no centro do quadrado
    ctx.fillStyle = "#000"; // Cor do texto
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cor, x + tamanhoQuadrado / 2, y + tamanhoQuadrado / 2);

    // Atualiza a posição para o próximo quadrado
    x += tamanhoQuadrado;
    if (x >= canvas.width) {
      x = 0;
      y += tamanhoQuadrado;
    }
  });

  // Adiciona bordas aos quadrados coloridos no canvas
  ctx.strokeStyle = "#000"; // Cor da borda
  ctx.lineWidth = 2; // Largura da borda
  cores.forEach((cor, index) => {
    if (!coresInvalidas.includes(cor)) {
      const col = index % Math.ceil(Math.sqrt(numCores));
      const row = Math.floor(index / Math.ceil(Math.sqrt(numCores)));
      ctx.strokeRect(col * tamanhoQuadrado, row * tamanhoQuadrado, tamanhoQuadrado, tamanhoQuadrado);
    }
  });

  // Exibe mensagem de sucesso ou erro
  if (coresInvalidas.length > 0) {
    mensagem.textContent = `Cores inválidas: ${coresInvalidas.join(", ")}. Use o formato #RRGGBB.`;
  } else {
    mensagem.textContent = "Paleta gerada com sucesso!";
    document.getElementById("color-input").value = ""; // Limpa o campo de entrada
  }
}

function baixarImagem() {
  // Cria um link temporário para baixar a imagem
  const link = document.createElement("a");
  link.download = "paleta_de_cores.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function isValidHexColor(cor) {
  // Valida se a cor é um hexadecimal válido (6 dígitos após o #)
  return /^#([0-9A-F]{6})$/i.test(cor);
}
