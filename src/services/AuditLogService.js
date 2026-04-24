/**
 * Centralized Audit Log Service for RailParts ERP
 * This service handles event tracking and traceability across all modules.
 */

class AuditLogService {
  constructor() {
    // In a real app, this would be fetched from a database
    this.logs = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: 'Szabó Imre',
        action: 'Karbantartás befejezve',
        module: 'Maintenance',
        details: 'MC-101 Alumínium Profilvágó CNC - Megelőző karbantartás elvégezve.',
        severity: 'success'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        user: 'Kovács János',
        action: 'Hiba bejelentve',
        module: 'Quality',
        details: 'QC-2024-002 Poggyásztartó váz - Felületi karcolások.',
        severity: 'danger'
      }
    ];
    
    this.subscribers = [];
  }

  /**
   * Log a new event
   * @param {Object} logData - { user, action, module, details, severity }
   */
  log(logData) {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: logData.user || 'Rendszer',
      action: logData.action,
      module: logData.module,
      details: logData.details,
      severity: logData.severity || 'info'
    };

    this.logs.unshift(newLog); // Add to the beginning
    
    // Limit log size for the demo
    if (this.logs.length > 100) {
      this.logs.pop();
    }

    this.notifySubscribers();
    return newLog;
  }

  getLogs() {
    return [...this.logs];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.logs));
  }
}

const auditLogService = new AuditLogService();
export default auditLogService;
