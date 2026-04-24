/**
 * Centralized Currency Service for RailParts ERP
 * Simulates real-time exchange rates for global operations.
 */

class CurrencyService {
  constructor() {
    // Base currency is HUF
    this.rates = {
      HUF: 1,
      EUR: 0.0025, // 1 HUF = 0.0025 EUR (roughly 400 HUF/EUR)
      USD: 0.0027, // 1 HUF = 0.0027 USD
    };
    
    this.symbols = {
      HUF: 'Ft',
      EUR: '€',
      USD: '$',
    };
  }

  /**
   * Convert an amount from HUF to target currency
   * @param {number} amount - Amount in HUF
   * @param {string} targetCurrency - EUR, USD, or HUF
   */
  convert(amount, targetCurrency = 'HUF') {
    const rate = this.rates[targetCurrency] || 1;
    return amount * rate;
  }

  /**
   * Format currency value
   */
  format(amount, currency = 'HUF') {
    const converted = this.convert(amount, currency);
    const options = {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: currency === 'HUF' ? 0 : 2,
    };
    
    // Custom formatting for HUF to match Hungarian style
    if (currency === 'HUF') {
      return new Intl.NumberFormat('hu-HU', options).format(converted);
    }
    
    return new Intl.NumberFormat('en-US', options).format(converted);
  }

  getRates() {
    return { ...this.rates };
  }
}

const currencyService = new CurrencyService();
export default currencyService;
