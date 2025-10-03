import { BUSINESS_MODEL_CONFIG } from '../config/BusinessModelConfig';

class TokenService {
  constructor() {
    this.storageKey = "finsense_tokens";
    this.historyKey = "finsense_token_history";
    this.referralKey = "referral_count";
    this.referralCodeKey = "referral_code";
  }

  getBalance() {
    return Number(localStorage.getItem(this.storageKey) || 0);
  }

  addTokens(amount, reason = "") {
    const amt = Number(amount);
    const newBalance = this.getBalance() + amt;
    localStorage.setItem(this.storageKey, newBalance.toString());
    this.addToHistory(amt, reason);
    document.dispatchEvent(new CustomEvent("fincoins-notification"));
    return newBalance;
  }

  addToHistory(amount, reason) {
    const history = JSON.parse(localStorage.getItem(this.historyKey) || "[]");
    history.unshift({ amount, reason, timestamp: new Date().toISOString(), balance: this.getBalance() });
    localStorage.setItem(this.historyKey, JSON.stringify(history.slice(0, 50)));
  }

  getReferralCode() {
    let code = localStorage.getItem(this.referralCodeKey);
    if (!code) {
      code = "FINS" + Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem(this.referralCodeKey, code);
    }
    return code;
  }

  getReferralCount() {
    return Number(localStorage.getItem(this.referralKey) || 0);
  }

  awardReferral() {
    const maxReferrals = BUSINESS_MODEL_CONFIG.REFERRAL_CONFIG?.maxReferrals ?? 50;
    const current = this.getReferralCount();

    if (current >= maxReferrals) {
      throw new Error("Max referrals reached");
    }

    const newCount = current + 1;
    localStorage.setItem(this.referralKey, newCount.toString());

    // Add referral bonus tokens
    const bonus = BUSINESS_MODEL_CONFIG.TOKEN_REWARDS?.referralBonus ?? 200;
    return this.addTokens(bonus, "Referral Bonus");
  }

  redeemTokens(item) {
    if (this.getBalance() < item.cost) throw new Error("Insufficient tokens");
    const newBalance = this.getBalance() - item.cost;
    localStorage.setItem(this.storageKey, newBalance.toString());
    this.addToHistory(-item.cost, `Redeemed ${item.name}`);
    return newBalance;
  }

  resetAll() {
    localStorage.setItem(this.storageKey, "0");
    localStorage.setItem(this.historyKey, "[]");
    localStorage.setItem(this.referralKey, "0");
    localStorage.removeItem(this.referralCodeKey);
    document.dispatchEvent(new CustomEvent("fincoins-notification"));
  }
}

export const tokenService = new TokenService();
