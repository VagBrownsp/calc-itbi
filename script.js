const $ = (id) => document.getElementById(id);

const valorCompra = $("valorCompra");
const valorReferencia = $("valorReferencia");
const valorFinanciado = $("valorFinanciado");
const sistema = $("sistema");
const financiamentoBox = $("financiamentoBox");
const referenciaBox = $("referenciaBox");
const primeiroImovelBox = $("primeiroImovelBox");
const primeiroImovelAviso = $("primeiroImovelAviso");
const resultado = $("resultado");

const LIMITE_PRIMEIRO_IMOVEL = 147000;

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function parseMoney(value) {
  if (!value) return 0;
  let v = String(value).trim().replace(/[^\d,.-]/g, "");
  if (v.includes(",")) {
    v = v.replace(/\./g, "").replace(",", ".");
  }
  return Number(v) || 0;
}

function formatMoneyInput(input) {
  let digits = input.value.replace(/\D/g, "");
  if (!digits) {
    input.value = "";
    return;
  }
  const number = Number(digits) / 100;
  input.value = number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getBaseAtual() {
  const compra = parseMoney(valorCompra.value);
  const tem = getTemReferencia();
  const referencia = tem ? parseMoney(valorReferencia.value) : 0;
  return tem ? Math.max(compra, referencia) : compra;
}

function atualizarCampoPrimeiroImovel() {
  const compra = parseMoney(valorCompra.value);
  const base = getBaseAtual();
  const relevante = compra > 0 && base <= LIMITE_PRIMEIRO_IMOVEL;
  primeiroImovelBox.classList.toggle("hidden", !relevante);
  primeiroImovelAviso.classList.toggle("hidden", relevante);
}

[valorCompra, valorReferencia, valorFinanciado].forEach(input => {
  input.addEventListener("input", () => {
    formatMoneyInput(input);
    atualizarCampoPrimeiroImovel();
  });
});

sistema.addEventListener("change", () => {
  const financed = sistema.value === "sfh" || sistema.value === "sfi";
  financiamentoBox.classList.toggle("hidden", !financed);
});

document.querySelectorAll('input[name="temReferencia"]').forEach(input => {
  input.addEventListener("change", () => {
    const tem = document.querySelector('input[name="temReferencia"]:checked').value === "sim";
    referenciaBox.classList.toggle("hidden", !tem);
    if (!tem) {
      valorReferencia.value = "";
    }
    atualizarCampoPrimeiroImovel();
  });
});

atualizarCampoPrimeiroImovel();

function getPrimeiroImovel() {
  return document.querySelector('input[name="primeiroImovel"]:checked').value === "sim";
}

function getTemReferencia() {
  return document.querySelector('input[name="temReferencia"]:checked').value === "sim";
}

// Tabela de Custas e Emolumentos do Estado de São Paulo para 2026
// (Lei Estadual nº 11.331/2002, com atualizações — divulgada pela ANOREG-SP/ARISP)
// Tabela II, item 1 "Registro com valor declarado" (coluna "Total")
const TABELA_REGISTRO = [
  { min: 0.01, max: 2306.00, total: 257.20 },
  { min: 2306.01, max: 5761.00, total: 412.72 },
  { min: 5761.01, max: 9603.00, total: 740.42 },
  { min: 9603.01, max: 19210.00, total: 1098.57 },
  { min: 19210.01, max: 38420.00, total: 1335.60 },
  { min: 38420.01, max: 115260.00, total: 1489.46 },
  { min: 115260.01, max: 192100.00, total: 1901.09 },
  { min: 192100.01, max: 230520.00, total: 2311.88 },
  { min: 230520.01, max: 268940.00, total: 2516.87 },
  { min: 268940.01, max: 307360.00, total: 2723.02 },
  { min: 307360.01, max: 345780.00, total: 2870.61 },
  { min: 345780.01, max: 384200.00, total: 2945.43 },
  { min: 384200.01, max: 768400.00, total: 3284.18 },
  { min: 768400.01, max: 1152600.00, total: 3846.10 },
  { min: 1152600.01, max: 1536800.00, total: 4427.79 },
  { min: 1536800.01, max: 1921000.00, total: 5009.53 },
  { min: 1921000.01, max: 2305200.00, total: 5310.30 },
  { min: 2305200.01, max: 3842000.00, total: 6814.06 },
  { min: 3842000.01, max: 5763000.00, total: 9520.82 },
  { min: 5763000.01, max: 7684000.00, total: 12528.33 },
  { min: 7684000.01, max: 9605000.00, total: 15535.85 },
  { min: 9605000.01, max: 11526000.00, total: 18543.37 },
  { min: 11526000.01, max: 13447000.00, total: 21550.88 },
  { min: 13447000.01, max: 15368000.00, total: 24558.39 },
  { min: 15368000.01, max: 17289000.00, total: 27565.91 },
  { min: 17289000.01, max: 19210000.00, total: 30573.43 },
  { min: 19210000.01, max: 23052000.00, total: 35084.71 },
  { min: 23052000.01, max: 26894000.00, total: 41099.74 },
  { min: 26894000.01, max: 30736000.00, total: 47114.79 },
  { min: 30736000.01, max: 34578000.00, total: 53129.83 },
  { min: 34578000.01, max: 38420000.00, total: 59144.87 },
  { min: 38420000.01, max: 42262000.00, total: 65159.90 },
  { min: 42262000.01, max: 46104000.00, total: 71174.94 },
  { min: 46104000.01, max: 49946000.00, total: 77189.96 },
  { min: 49946000.01, max: 53788000.00, total: 83205.00 },
  { min: 53788000.01, max: 57630000.00, total: 89220.04 },
  { min: 57630000.01, max: 65314000.00, total: 98242.59 },
  { min: 65314000.01, max: 72998000.00, total: 110272.66 },
  { min: 72998000.01, max: 80682000.00, total: 122302.74 },
  { min: 80682000.01, max: 88366000.00, total: 134332.81 },
  { min: 88366000.01, max: 96050000.00, total: 146362.88 },
  { min: 96050000.01, max: 103734000.00, total: 158392.94 },
  { min: 103734000.01, max: 111418000.00, total: 170423.02 },
  { min: 111418000.01, max: 119102000.00, total: 182453.09 },
  { min: 119102000.01, max: 126786000.00, total: 194483.15 },
  { min: 126786000.01, max: 134470000.00, total: 206513.23 },
  { min: 134470000.01, max: 142154000.00, total: 218543.30 }
];

// Tabela II, item 2 "Averbação com valor declarado" (coluna "Total")
// Usada para a averbação da garantia (alienação fiduciária) sobre o valor financiado.
const TABELA_AVERBACAO = [
  { min: 0.01, max: 2306.00, total: 91.43 },
  { min: 2306.01, max: 5761.00, total: 137.73 },
  { min: 5761.01, max: 9603.00, total: 235.47 },
  { min: 9603.01, max: 19210.00, total: 383.45 },
  { min: 19210.01, max: 38420.00, total: 489.12 },
  { min: 38420.01, max: 115260.00, total: 510.91 },
  { min: 115260.01, max: 192100.00, total: 569.06 },
  { min: 192100.01, max: 230520.00, total: 627.20 },
  { min: 230520.01, max: 268940.00, total: 656.51 },
  { min: 268940.01, max: 307360.00, total: 685.37 },
  { min: 307360.01, max: 345780.00, total: 714.68 },
  { min: 345780.01, max: 384200.00, total: 743.63 },
  { min: 384200.01, max: 768400.00, total: 903.44 },
  { min: 768400.01, max: 1152600.00, total: 1194.34 },
  { min: 1152600.01, max: 1536800.00, total: 1485.19 },
  { min: 1536800.01, max: 1921000.00, total: 1776.02 },
  { min: 1921000.01, max: 2305200.00, total: 1926.38 },
  { min: 2305200.01, max: 3842000.00, total: 2678.27 },
  { min: 3842000.01, max: 5763000.00, total: 4031.66 },
  { min: 5763000.01, max: 7684000.00, total: 5535.42 },
  { min: 7684000.01, max: 9605000.00, total: 7039.17 },
  { min: 9605000.01, max: 11526000.00, total: 8542.93 },
  { min: 11526000.01, max: 13447000.00, total: 10046.69 },
  { min: 13447000.01, max: 15368000.00, total: 11550.45 },
  { min: 15368000.01, max: 17289000.00, total: 13054.21 },
  { min: 17289000.01, max: 19210000.00, total: 14557.97 },
  { min: 19210000.01, max: 23052000.00, total: 16813.61 },
  { min: 23052000.01, max: 26894000.00, total: 19821.12 },
  { min: 26894000.01, max: 30736000.00, total: 22828.64 },
  { min: 30736000.01, max: 34578000.00, total: 25836.16 },
  { min: 34578000.01, max: 38420000.00, total: 28843.68 },
  { min: 38420000.01, max: 42262000.00, total: 33354.95 },
  { min: 42262000.01, max: 46104000.00, total: 36362.51 },
  { min: 46104000.01, max: 49946000.00, total: 39370.03 },
  { min: 49946000.01, max: 53788000.00, total: 42377.55 },
  { min: 53788000.01, max: 57630000.00, total: 45385.07 },
  { min: 57630000.01, max: 65314000.00, total: 48392.54 },
  { min: 65314000.01, max: 72998000.00, total: 54407.57 },
  { min: 72998000.01, max: 80682000.00, total: 60422.60 },
  { min: 80682000.01, max: 88366000.00, total: 66437.64 },
  { min: 88366000.01, max: 96050000.00, total: 72452.68 },
  { min: 96050000.01, max: 103734000.00, total: 75460.20 },
  { min: 103734000.01, max: 111418000.00, total: 78467.72 },
  { min: 111418000.01, max: 119102000.00, total: 81475.24 },
  { min: 119102000.01, max: 126786000.00, total: 84482.75 },
  { min: 126786000.01, max: 134470000.00, total: 87490.26 },
  { min: 134470000.01, max: 142154000.00, total: 90497.78 }
];

const REGISTRO_TETO = 142154000.00;

function getEmolumento(valor, tabela) {
  for (const faixa of tabela) {
    if (valor >= faixa.min && valor <= faixa.max) {
      return faixa.total;
    }
  }
  return null; // acima do teto da tabela
}

function calcularRegistroImoveis(valorDeclarado, modalidade, valorFinanciado) {
  const acimaDoTeto = valorDeclarado > REGISTRO_TETO;
  const registroTotal = acimaDoTeto ? null : getEmolumento(valorDeclarado, TABELA_REGISTRO);

  let averbacaoTotal = null;
  const temFinanciamento = (modalidade === "sfh" || modalidade === "sfi") && valorFinanciado > 0;
  if (temFinanciamento) {
    averbacaoTotal = valorFinanciado > REGISTRO_TETO ? null : getEmolumento(valorFinanciado, TABELA_AVERBACAO);
  }

  return { acimaDoTeto, registroTotal, temFinanciamento, averbacaoTotal };
}

function showError(message) {
  resultado.innerHTML = `<div class="error"><strong>Não foi possível calcular.</strong><br>${message}</div>`;
}

function calculate() {
  const compra = parseMoney(valorCompra.value);
  const temReferencia = getTemReferencia();
  const referencia = temReferencia ? parseMoney(valorReferencia.value) : 0;
  const financiado = parseMoney(valorFinanciado.value);
  const primeiro = getPrimeiroImovel();
  const modalidade = sistema.value;

  if (compra <= 0) {
    showError("Informe o valor da negociação.");
    return;
  }

  if (temReferencia && referencia <= 0) {
    showError("Informe o valor de referência da Prefeitura, ou selecione \"Não\" caso não o tenha.");
    return;
  }

  const base = temReferencia ? Math.max(compra, referencia) : compra;

  if ((modalidade === "sfh" || modalidade === "sfi") && financiado <= 0) {
    showError("Informe o valor financiado.");
    return;
  }

  if ((modalidade === "sfh" || modalidade === "sfi") && financiado > base) {
    showError("O valor financiado não pode ser maior que a base de cálculo utilizada.");
    return;
  }

  let total = 0;
  let detalhe = "";
  let taxaResumo = "";

  // Regra municipal consultada:
  // - geral: 2%
  // - primeiro imóvel até R$ 147.000: 0,5%
  // - SFH: 0,5% na parte financiada + 2% na parte não financiada
  // - SFI: sem redução específica informada pela Prefeitura; usa-se 2% na base.
  if (modalidade === "sfh") {
    const parteFinanciada = financiado;
    const parteNaoFinanciada = base - financiado;
    const itbiFinanciado = parteFinanciada * 0.005;
    const itbiNaoFinanciado = parteNaoFinanciada * 0.02;
    total = itbiFinanciado + itbiNaoFinanciado;
    detalhe = `
      <div class="row"><span>Parte financiada</span><strong>${BRL.format(parteFinanciada)}</strong></div>
      <div class="row"><span>ITBI sobre financiado (0,5%)</span><strong class="highlight">${BRL.format(itbiFinanciado)}</strong></div>
      <div class="row"><span>Parte não financiada</span><strong>${BRL.format(parteNaoFinanciada)}</strong></div>
      <div class="row"><span>ITBI sobre não financiado (2%)</span><strong>${BRL.format(itbiNaoFinanciado)}</strong></div>
    `;
    taxaResumo = "SFH — 0,5% financiado + 2% não financiado";
  } else if (modalidade === "sfi") {
    total = base * 0.02;
    detalhe = `<div class="row"><span>ITBI sobre a base (2%)</span><strong class="highlight">${BRL.format(total)}</strong></div>`;
    taxaResumo = "SFI — 2% sobre a base";
  } else if (primeiro && base <= LIMITE_PRIMEIRO_IMOVEL) {
    total = base * 0.005;
    detalhe = `<div class="row"><span>ITBI sobre a base (0,5%)</span><strong class="highlight">${BRL.format(total)}</strong></div>`;
    taxaResumo = "Primeiro imóvel — 0,5%";
  } else {
    total = base * 0.02;
    detalhe = `<div class="row"><span>ITBI sobre a base (2%)</span><strong class="highlight">${BRL.format(total)}</strong></div>`;
    taxaResumo = primeiro ? "Primeiro imóvel acima do limite — 2%" : "Segundo ou mais — 2%";
  }

  const linhaReferencia = temReferencia
    ? `<div class="row"><span>Valor de referência</span><strong>${BRL.format(referencia)}</strong></div>`
    : "";

  const avisoSemReferencia = !temReferencia
    ? `
      <div class="notice-inline">
        <strong>Atenção:</strong> esta estimativa foi calculada apenas sobre o valor da negociação, pois o valor de referência da Prefeitura não foi informado. O ITBI oficial poderá ser maior caso a Prefeitura utilize uma base de cálculo superior.
      </div>
      <a class="btn-link" href="https://www.sjc.sp.gov.br/carta-de-servicos/cidadaos/gestao-administrativa-e-financas/receita/emissao-de-guia-de-itbi/" target="_blank" rel="noopener noreferrer">↗ Consultar na Prefeitura</a>
    `
    : "";

  const avisoSfhPrimeiroImovel = (modalidade === "sfh" || modalidade === "sfi") && primeiro && base <= LIMITE_PRIMEIRO_IMOVEL
    ? `
      <div class="notice-inline">
        <strong>Atenção:</strong> seu imóvel se enquadra em duas reduções previstas pela Prefeitura ao mesmo tempo — financiamento (${modalidade.toUpperCase()}) e primeiro imóvel com valor até R$ 147.000,00. A regra municipal não deixa explícito como essas duas reduções se combinam nesse caso; por isso, esta calculadora aplicou apenas a regra do financiamento (0,5% na parte financiada + 2% na parte não financiada). Consulte a Prefeitura para confirmar se a parte não financiada também tem direito à redução de primeiro imóvel no seu caso.
      </div>
    `
    : "";

  // --- Registro de Imóveis (Cartório) — Tabela estadual de emolumentos ---
  const registro = calcularRegistroImoveis(compra, modalidade, financiado);

  let registroBlocoHtml = "";
  let totalGeral = total;
  let temValorIndisponivel = registro.acimaDoTeto || (registro.temFinanciamento && registro.averbacaoTotal === null);

  if (registro.acimaDoTeto) {
    registroBlocoHtml = `
      <div class="notice-inline">
        <strong>Valor acima do teto da tabela.</strong> Para imóveis acima de ${BRL.format(REGISTRO_TETO)}, consulte diretamente o Cartório de Registro de Imóveis responsável pela matrícula.
      </div>
    `;
  } else {
    totalGeral += registro.registroTotal;

    let averbacaoHtml = "";
    if (registro.temFinanciamento) {
      if (registro.averbacaoTotal !== null) {
        totalGeral += registro.averbacaoTotal;
        averbacaoHtml = `<div class="row"><span>Averbação da garantia (alienação fiduciária)</span><strong class="highlight">${BRL.format(registro.averbacaoTotal)}</strong></div>`;
      } else {
        averbacaoHtml = `
          <div class="notice-inline">
            <strong>Valor financiado acima do teto da tabela.</strong> Consulte o Cartório para a averbação da garantia sobre ${BRL.format(financiado)}.
          </div>
        `;
      }
    }

    registroBlocoHtml = `
      <div class="breakdown">
        <div class="row"><span>Valor declarado do negócio</span><strong>${BRL.format(compra)}</strong></div>
        <div class="row"><span>Registro da aquisição</span><strong class="highlight">${BRL.format(registro.registroTotal)}</strong></div>
        ${averbacaoHtml}
      </div>
    `;
  }

  const grandTotalHtml = temValorIndisponivel
    ? ""
    : `
      <div class="grand-total-bar">
        <span>Total estimado (ITBI + Registro)</span>
        <strong>${BRL.format(totalGeral)}</strong>
      </div>
    `;

  resultado.innerHTML = `
    <div class="result-content">
      <div class="result-section">
        <span class="result-kicker">ITBI estimado (Prefeitura de SJC)</span>
        <div class="total">${BRL.format(total)}</div>

        <div class="breakdown">
          <div class="row"><span>Valor da negociação</span><strong>${BRL.format(compra)}</strong></div>
          ${linhaReferencia}
          <div class="row"><span>Base utilizada</span><strong>${BRL.format(base)}</strong></div>
          <div class="row"><span>Enquadramento</span><strong>${taxaResumo}</strong></div>
          ${detalhe}
        </div>

        ${avisoSemReferencia}
        ${avisoSfhPrimeiroImovel}
      </div>

      <div class="result-section">
        <span class="result-section-title">Registro de Imóveis (Cartório — tabela estadual)</span>
        ${registro.acimaDoTeto ? "" : `<div class="total">${BRL.format(registro.registroTotal + (registro.averbacaoTotal || 0))}</div>`}
        ${registroBlocoHtml}
      </div>

      ${grandTotalHtml}

      <div class="result-note">
        <strong>Atenção:</strong> resultado estimativo. A guia oficial da Prefeitura deve ser utilizada para o recolhimento do ITBI, e o valor final do Registro é definido pelo Cartório de Registro de Imóveis, com base na tabela estadual vigente na data do registro.
      </div>
    </div>
  `;
}

$("calcular").addEventListener("click", calculate);

$("limpar").addEventListener("click", () => {
  valorCompra.value = "";
  valorReferencia.value = "";
  valorFinanciado.value = "";
  sistema.value = "avista";
  financiamentoBox.classList.add("hidden");
  referenciaBox.classList.add("hidden");
  document.querySelector('input[name="primeiroImovel"][value="sim"]').checked = true;
  document.querySelector('input[name="temReferencia"][value="nao"]').checked = true;
  atualizarCampoPrimeiroImovel();

  resultado.innerHTML = `
    <div class="result-placeholder">
      <div class="result-icon">R$</div>
      <h2>Seu resultado aparecerá aqui</h2>
      <p>Preencha os dados ao lado e clique em <strong>Calcular ITBI</strong>.</p>
    </div>
  `;
});
