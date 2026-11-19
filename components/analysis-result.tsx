'use client'

import { CheckCircle2, Clock3, EyeOff, FileImage, Globe2, MessageSquareWarning, ShieldAlert, ShieldCheck } from 'lucide-react'
import type { AnalysisResponse } from '@/lib/analysis'

const riskLabels = { low: 'Baixo risco estimado', moderate: 'Risco moderado estimado', high: 'Alto risco estimado', critical: 'Risco crítico estimado' }
const riskStyles = { low: 'low', moderate: 'amber', high: 'high', critical: 'high' }
const typeLabels = { url: 'URL', message: 'Mensagem', image: 'Imagem' }

export function AnalysisResultPanel({ result, extractedText, filePreview }: { result: AnalysisResponse; extractedText?: string; filePreview?: string }) {
  const { analysis } = result
  const Icon = analysis.content_type === 'url' ? Globe2 : analysis.content_type === 'image' ? FileImage : MessageSquareWarning

  return (
    <section className="scan-result" aria-live="polite">
      <div className="result-head">
        <div>
          <span className="eyebrow">ANÁLISE CONCLUÍDA · {typeLabels[analysis.content_type]}</span>
          <h3>Resultado da análise</h3>
        </div>
        <span className={`classification ${riskStyles[analysis.risk_level]}`}>
          <span className="risk-dot" />{riskLabels[analysis.risk_level]}
        </span>
      </div>
      <div className="result-overview">
        <div className={`result-score ${analysis.risk_score >= 65 ? 'danger' : ''}`}>
          <div><strong>{analysis.risk_score}</strong><span>/100</span></div>
        </div>
        <div className="result-target">
          <span>Pontuação estimada pelo modelo</span>
          <strong>{analysis.processing_status === 'completed' ? 'Processamento concluído' : 'Processamento parcial'}</strong>
          <small><Clock3 size={14} /> {new Date(analysis.created_at).toLocaleString('pt-BR')} · {result.durationMs} ms</small>
        </div>
        <div className="result-confidence">
          <span>Método utilizado</span>
          <strong>{analysis.origin.toUpperCase()}</strong>
          <small>{result.method}</small>
        </div>
      </div>
      {analysis.content_type === 'image' && filePreview && <div className="ocr-demo">
        <span className="eyebrow">IMAGEM ENVIADA</span>
        <img src={filePreview} alt="Imagem processada nesta análise" className="image-preview" />
      </div>}
      {analysis.content_type === 'image' && <div className="ocr-demo">
        <span className="eyebrow">TEXTO EXTRAÍDO POR OCR</span>
        <p>{extractedText || 'Nenhum texto legível foi encontrado.'}</p>
        <small>O OCR foi processado localmente no navegador; a imagem não foi armazenada.</small>
      </div>}
      <div className="ocr-demo">
        <span className="eyebrow">EXPLICAÇÃO</span>
        <p>{analysis.explanation}</p>
        {analysis.content_type === 'url' && <small><EyeOff size={13} /> O endereço não foi aberto; reputação e redirecionamentos não foram consultados.</small>}
      </div>
      <div className="result-indicators">
        {analysis.indicators.length ? analysis.indicators.map((indicator, index) => <div className="indicator-card" key={`${indicator.category}-${index}`}>
          <span><ShieldAlert size={15} /></span>
          <div><strong>{indicator.category}</strong><p>{indicator.description}</p></div>
        </div>) : <div className="indicator-card"><span><CheckCircle2 size={15} /></span><div><strong>Nenhum indicador relevante identificado</strong><p>A ausência de sinais não garante que o conteúdo seja seguro.</p></div></div>}
      </div>
      <div className="result-advice"><ShieldCheck size={17} /><span><strong>Recomendações:</strong> {analysis.recommendations.join(' ') || 'Confirme qualquer solicitação por um canal oficial independente.'}</span></div>
      <div className="result-disclaimer">A pontuação é uma estimativa gerada por IA, não uma confirmação de fraude nem uma consulta a serviços externos de reputação.</div>
    </section>
  )
}
