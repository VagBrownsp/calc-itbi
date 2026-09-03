const $ = (id) => document.getElementById(id);

const valorCompra = $("valorCompra");
const valorReferencia = $("valorReferencia");
const valorFinanciado = $("valorFinanciado");
const sistema = $("sistema");
const financiamentoBox = $("financiamentoBox");
const referenciaBox = $("referenciaBox");
const resultado = $("resultado");

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

[valorCompra, valorReferencia, valorFinanciado].forEach(input => {
  input.addEventListener("input", () => formatMoneyInput(input));
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
  });
});

function getPrimeiroImovel() {
  return document.querySelector('input[name="primeiroImovel"]:checked').value === "sim";
}

function getTemReferencia() {
  return document.querySelector('input[name="temReferencia"]:checked').value === "sim";
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
  } else if (primeiro && base <= 147000) {
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

  resultado.innerHTML = `
    <div class="result-content">
      <span class="result-kicker">ITBI estimado</span>
      <div class="total">${BRL.format(total)}</div>

      <div class="breakdown">
        <div class="row"><span>Valor da negociação</span><strong>${BRL.format(compra)}</strong></div>
        ${linhaReferencia}
        <div class="row"><span>Base utilizada</span><strong>${BRL.format(base)}</strong></div>
        <div class="row"><span>Enquadramento</span><strong>${taxaResumo}</strong></div>
        ${detalhe}
      </div>

      ${avisoSemReferencia}

      <div class="result-note">
        <strong>Atenção:</strong> resultado estimativo. A guia oficial da Prefeitura deve ser utilizada para o recolhimento do ITBI.
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

  resultado.innerHTML = `
    <div class="result-placeholder">
      <div class="result-icon">R$</div>
      <h2>Seu resultado aparecerá aqui</h2>
      <p>Preencha os dados ao lado e clique em <strong>Calcular ITBI</strong>.</p>
    </div>
  `;
});
