/**
 * AI Predictive Engine (Simulated)
 * Analyzes historical patterns to forecast supply chain risks and maintenance needs.
 */

class AIService {
  constructor() {
    this.insights = [
      {
        id: 'INS-001',
        type: 'inventory',
        severity: 'high',
        title: 'Kritikus alkatrészhiány jósolható',
        description: 'Az Alumínium S-Profil fogyási sebessége 24%-kal nőtt. A jelenlegi készlet 12 napon belül elfogy, a beszállítás viszont 18 nap.',
        recommendation: 'Azonnali rendelés leadása 500 egységre a Knorr-Bremse felé.',
        impact: 'Gyártásleállás esélye: 85%',
        confidence: 0.94
      },
      {
        id: 'INS-002',
        type: 'maintenance',
        severity: 'warning',
        title: 'Prediktív Karbantartási Javaslat',
        description: 'A CNC-04 megmunkáló központ vibrációs mintái eltérnek a normálistól. Csapágyhiba valószínűsíthető a következő 150 üzemórán belül.',
        recommendation: 'Megelőző csere ütemezése a jövő hétvégi műszakváltásra.',
        impact: 'Váratlan leállás elkerülhető.',
        confidence: 0.88
      },
      {
        id: 'INS-003',
        type: 'logistics',
        severity: 'info',
        title: 'Szállítási útvonal optimalizálás',
        description: 'A Szuezi-csatorna forgalmi adatai alapján a SHP-2024-881 szállítmány 3 nap késésben lesz.',
        recommendation: 'Alternatív vasúti szállítás előkészítése a kritikus komponensekre.',
        impact: 'Logisztikai költségcsökkentés: 12%',
        confidence: 0.76
      },
      {
        id: 'INS-004',
        type: 'finance',
        severity: 'warning',
        title: 'Cash-flow figyelmeztetés',
        description: 'A kintlévőségek behajtási ideje (DSO) 5 nappal nőtt a Stadler Trains esetében.',
        recommendation: 'Automatikus fizetési emlékeztető kiküldése és faktorálás mérlegelése.',
        impact: 'Likviditási kockázat csökkentése.',
        confidence: 0.82
      }
    ];
  }

  getInsights() {
    return this.insights;
  }

  getInsightsByType(type) {
    return this.insights.filter(i => i.type === type);
  }

  getHighPriorityCount() {
    return this.insights.filter(i => i.severity === 'high').length;
  }
}

const aiService = new AIService();
export default aiService;
