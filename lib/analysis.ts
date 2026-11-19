export type AnalysisRecord = {
  id: string
  content_type: 'url' | 'message' | 'image'
  risk_score: number
  risk_level: 'low' | 'moderate' | 'high' | 'critical'
  indicators: { category: string; description: string }[]
  explanation: string
  recommendations: string[]
  processing_status: 'completed' | 'partial'
  origin: 'web' | 'mobile' | 'api'
  created_at: string
}

export type AnalysisResponse = {
  analysis: AnalysisRecord
  method: string
  durationMs: number
}
